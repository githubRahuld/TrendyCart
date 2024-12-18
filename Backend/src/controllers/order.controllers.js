import { EcomOrder } from "../models/order.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Address } from "../models/address.model.js";
import { Cart } from "../models/cart.model.js";
import { Coupon } from "../models/coupon.model.js";
import { sendEmail } from "./notificationService.js";
import mongoose from "mongoose";

const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await EcomOrder.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(orderId),
            },
        },
        {
            //customer details
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "customer",
                as: "customer",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            email: 1,
                        },
                    },
                ],
            },
        },
        {
            //coupon applied while placing the order
            $lookup: {
                from: "coupons",
                foreignField: "_id",
                localField: "coupon",
                as: "coupon",
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            couponCode: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                customer: { $first: "$customer" },
                coupon: { $ifNull: [{ $first: "$coupon" }, null] },
            },
        },
        {
            // it gives us documents with `items` being an object with key {_id, productId, quantity}
            $unwind: "$items", // sepeat
        },
        {
            $lookup: {
                from: "products",
                foreignField: "_id",
                localField: "items.productId",
                as: "items.product",
            },
        },
        {
            $addFields: { "items.product": { $first: "$items.product" } },
        },
        {
            $group: {
                _id: "$_id", //orderId
                order: { $first: "$$ROOT" }, //root object

                //new field
                orderItems: {
                    $push: {
                        _id: "items._id",
                        quantity: "$items.quantity",
                        product: "$item.product",
                    },
                },
            },
        },
        {
            $addFields: {
                "order.items": "$orderItems",
            },
        },
        {
            $project: {
                // ignore the orderItems key as we don't need it
                orderItems: 0,
            },
        },
    ]);
    if (!order[0]) {
        throw new ApiError(404, "Order does not exist");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, order[0], "Order fetched successfully"));
});

const getAllOrders = asyncHandler(async (req, res) => {
    try {
        // Fetch all orders from the database, populate relevant fields (customer, items, etc.)
        const orders = await EcomOrder.find()
            .populate("customer", "fullName email") // Populate customer data (you can choose fields like 'fullName', 'email' etc.)
            .populate("items.id", "title price category images") // Populate item product data (adjust fields as needed)
            .exec();

        // If no orders are found
        if (!orders) {
            return res.status(404).json({
                success: false,
                message: "No orders found.",
            });
        }

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders. Please try again.",
        });
    }
});

const createOrder = asyncHandler(async (req, res) => {
    const { addressId } = req.body;

    // Check if address is valid and is of logged in user's
    const address = await Address.findOne({
        _id: addressId,
        owner: req.user._id,
    });

    if (!address) {
        throw new ApiError(404, "Address does not exists");
    }

    const { addressLine1, addressLine2, city, country, pincode, state } =
        address;

    const cart = await Cart.findOne({
        owner: req.user._id,
    }).populate("items.productId"); // Populate productId to get product details

    if (!cart || !cart.items?.length) {
        throw new ApiError(400, "User cart is empty");
    }

    const orderItems = cart.items;
    const userCart = await getCart(req.user._id);

    const totalPrice = userCart.cartTotal;
    const totalDiscountedPrice = userCart.discountedTotal;

    // Create the order
    const unpaidOrder = await EcomOrder.create({
        address: {
            addressLine1,
            addressLine2,
            city,
            country,
            pincode,
            state,
        },
        customer: req.user._id,
        items: orderItems,
        orderPrice: totalPrice ?? 0,
        discountedOrderPrice: totalDiscountedPrice ?? 0,
        paymentProvider: "Cash on Delivery",
        paymentId: null,
        coupon: userCart.coupon?._id,
        isPaymentDone: false,
    });

    // Clear the cart after order creation
    cart.items = [];
    await cart.save();

    // Format the email message with order and delivery details
    const orderDetails = orderItems
        .map(
            (item) =>
                `Product: ${item.productId.name}, Quantity: ${item.quantity}`
        )
        .join("\n");

    const message = `
            Hello ${req.user.name},
            
            Thank you for your order!
    
            Here are your order details:
            
            Order ID: ${unpaidOrder._id}
            Order Price: ${unpaidOrder.orderPrice}
            Discounted Price: ${unpaidOrder.discountedOrderPrice}
            
            Delivery Address:
            ${addressLine1}, ${
        addressLine2 ? addressLine2 + "," : ""
    } ${city}, ${state}, ${country} - ${pincode}
    
            Order Items:
            ${orderDetails}
            
            We will notify you once your order is out for delivery. 
    
            Thank you for shopping with us!
    
            Best regards,
            Your Shop Team
        `;

    // Send the email
    await sendEmail(req.user.email, message, "Your Order Confirmation");

    return res
        .status(201)
        .json(new ApiResponse(201, unpaidOrder, "Order created successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    let order = await EcomOrder.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order does not exist");
    }

    if (order.status === OrderStatusEnum.DELIVERED) {
        throw new ApiError(400, "Order is already delivered");
    }

    order = await EcomOrder.findByIdAndUpdate(
        orderId,
        {
            $set: {
                status,
            },
        },
        { new: true }
    );
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                status,
            },
            "Order status changed successfully"
        )
    );
});

const deleteOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await EcomOrder.findByIdAndDelete(orderId);

        if (!order) {
            return res
                .status(404)
                .json(new ApiResponse(404, {}, "Order not found"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Order deleted successfully"));
    } catch (error) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    {},
                    "Failed to delete order",
                    error.message
                )
            );
    }
});

const getOrderListAdmin = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    // Apply status filter if provided
    if (status) {
        query.status = status;
    }

    // Calculate pagination parameters
    const skip = (page - 1) * limit;

    // Fetch the orders with pagination and populate customer and product details
    const orders = await EcomOrder.find(query)
        .populate("customer", "name email") // Populate customer details
        .populate("items.productId", "name price") // Populate product details in items
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }); // Sort by newest orders first

    // Count total orders for pagination metadata
    const totalOrders = await EcomOrder.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);

    // Return paginated order list
    res.status(200).json(
        new ApiResponse(
            200,
            {
                orders,
                currentPage: parseInt(page),
                totalPages,
                totalOrders,
            },
            "Order list retrieved successfully"
        )
    );
});

const applyCoupon = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { couponId } = req.body;

    try {
        const order = await EcomOrder.findById(orderId);

        if (!order) {
            return res
                .status(404)
                .json(new ApiResponse(404, {}, "Order not found"));
        }

        // Update order with the new coupon and recalculate discounted price
        const coupon = await Coupon.findById(couponId);
        if (coupon) {
            order.coupon = couponId;
            order.discountedOrderPrice =
                order.orderPrice - coupon.discountValue;
            await order.save();
            return res
                .status(200)
                .json(
                    new ApiResponse(200, order, "Coupon applied successfully")
                );
        } else {
            return res
                .status(404)
                .json(new ApiResponse(404, {}, "Coupon not found"));
        }
    } catch (error) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    {},
                    "Failed to apply coupon",
                    error.message
                )
            );
    }
});

const saveOrderAfterPayment = asyncHandler(async (req, res) => {
    const billingDetails = req.body.billingDetails.billingDetails;
    const cart = req.body.billingDetails.cart;
    const totalPrice = req.body.billingDetails.totalPrice;
    const paymentId = req.body.billingDetails.paymentId;

    console.log(billingDetails, cart, totalPrice, paymentId);

    if (!billingDetails || !cart || !totalPrice) {
        return res.status(400).json({
            success: false,
            message: "Incomplete data provided.",
        });
    }

    const user = req.user;

    try {
        // Create a new order
        const order = new EcomOrder({
            orderPrice: totalPrice,
            discountedOrderPrice: totalPrice,
            customer: user._id,
            items: cart.map((item) => ({
                productId: new mongoose.Types.ObjectId(item.id),
                quantity: item.quantity,
                id: item.id,
            })),
            address: {
                addressLine1: billingDetails.addressLine1,
                addressLine2: billingDetails.addressLine2,
                city: billingDetails.city,
                pincode: billingDetails.pincode,
                state: billingDetails.state,
            },
            status: "PENDING",
            paymentProvider: "Razorpay",
            paymentId: paymentId,
            isPaymentDone: true,
        });

        // Save the order to the database
        const savedOrder = await order.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            order: savedOrder,
        });
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save order. Please try again.",
        });
    }
});

export {
    getOrderById,
    createOrder,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    getOrderListAdmin,
    applyCoupon,
    saveOrderAfterPayment,
};
