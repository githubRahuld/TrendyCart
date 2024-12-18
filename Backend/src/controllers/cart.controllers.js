import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { Coupon } from "../models/coupon.model.js";

export const getCart = async (userId) => {
    const cartAggregation = await Cart.aggregate([
        {
            $match: {
                owner: req.user?._id,
            },
        },
        {
            $unwind: "$items",
        },
        {
            $lookup: {
                from: "products",
                foreignField: "_id",
                localfeild: "items.productId",
                as: "product",
            },
        },
        {
            $project: {
                product: { $first: "$product" },
                quantity: "$items.quantity",
                coupon: 1, // also project coupon field
            },
        },
        {
            $group: {
                _id: "$_id",
                items: {
                    $push: "$$ROOT", //all documents
                },
                coupon: { $first: "$coupon" },
                cartTotal: {
                    $sum: {
                        $multiply: ["$product.price", "$quantity"],
                    },
                },
            },
        },
        {
            $lookup: {
                // lookup for the coupon
                from: "coupons",
                foreignField: "_id",
                localField: "coupon",
                as: "coupon",
            },
        },
        {
            $addFields: {
                // As lookup returns an array we access the first item in the lookup array
                coupon: { $first: "$coupon" },
            },
        },
        {
            $addFields: {
                discountedTotal: {
                    // Final total is the total we get once user applies any coupon
                    // final total is total cart value - coupon's discount value
                    $ifNull: [
                        {
                            $subtract: ["$cartTotal", "$coupon.discountValue"],
                        },
                        "$cartTotal", // if there is no coupon applied we will set cart total as out final total
                        ,
                    ],
                },
            },
        },
    ]);

    // If cartAggregation[0] exists (i.e., the query returned a non-empty array), it’s returned directly. If not, the code provides a default cart object.
    return (
        cartAggregation[0] ?? {
            _id: null,
            items: [],
            cartTotal: 0,
            discountedTotal: 0,
        }
    );
};

const getUserCart = asyncHandler(async (req, res) => {
    let cart = await getCart(req.user._id);

    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

const addItemOrUpdateItemQuantity = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { quantity = 1 } = req.body;

    // fetch user cart
    const cart = await Cart.findOne({
        owner: req.user._id,
    });

    // See if product that user is adding exist in the db
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product does not exist");
    }

    // If product is there check if the quantity that user is adding is less than or equal to the product's stock
    if (quantity > product.stock) {
        // if quantity is greater throw an error
        throw new ApiError(
            400,
            product.stock > 0
                ? "Only " +
                  product.stock +
                  " products are remaining. But you are adding " +
                  quantity
                : "Product is out of stock"
        );
    }

    // See if the product that user is adding already exists in the cart

    const addProduct = cart.items?.find(
        (item) => item.productId.toString() === productId
    );

    if (addProduct) {
        // If product already exist assign a new quantity to it which was given by the frotent
        addProduct.quantity = quantity;

        // if user updates the cart, remove the coupon associated with the cart to avoid misuse
        // Do this only if quantity changes because if user adds a new product the cart total will increase anyways
        if (cart.coupon) {
            cart.coupon = null;
        }
    } else {
        // if its a new product being added in the cart push it to the cart items
        cart.items.push({
            productId,
            quantity,
        });
    }

    await cart.save({ validateBeforeSave: true });

    const newCart = await getCart(req.user._id);

    return res
        .status(200)
        .json(new ApiResponse(200, newCart, "Item added successfully"));
});

const removeItemFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    // check for product existence
    if (!product) {
        throw new ApiError(404, "Product does not exist");
    }

    const updatedCart = await Cart.findOneAndUpdate(
        {
            owner: req.user._id,
        },
        {
            // Pull the product inside the cart items
            // ! We are not handling decrement logic here that's we are doing in addItemOrUpdateItemQuantity method
            // ! this controller is responsible to remove the cart item entirely
            $pull: {
                items: {
                    productId: productId,
                },
            },
        },
        { new: true }
    );

    let cart = await getCart(req.user._id);

    // check if the cart's new total is greater than the minimum cart total requirement of the coupon
    if (cart.coupon && cart.cartTotal < cart.coupon.minimumCartValue) {
        // if it is less than minimum cart value remove the coupon code which is applied
        updatedCart.coupon = null;
        await updatedCart.save({ validateBeforeSave: false });
        // fetch the latest updated cart
        cart = await getCart(req.user._id);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart item removed successfully"));
});

const clearCart = asyncHandler(async (req, res) => {
    await Cart.findByIdAndUpdate(
        { owner: req.user._id },
        {
            $set: {
                items: [],
                coupon: null,
            },
        },
        { new: true }
    );

    const cart = await getCart(req.user._id);

    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart has been cleared"));
});

export {
    getUserCart,
    addItemOrUpdateItemQuantity,
    removeItemFromCart,
    clearCart,
};
