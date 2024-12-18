import crypto from "crypto";
import { Payment } from "../models/payment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Razorpay from "razorpay";
import { sendEmail } from "./notificationService.js";

// Set Razorpay API keys
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Verify and Save Payment
const verifyPayment = asyncHandler(async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            req.body;

        // Verify the signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        // Save payment details to DB
        const payment = new Payment({
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            status: "success",
            amount: req.body.amount, // in paise
            user: req.user.id,
        });
        await payment.save();

        res.status(200).json({ message: "Payment verified and saved" });
    } catch (error) {
        console.error("Payment verification failed:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const createOrder = asyncHandler(async (req, res) => {
    const { amount } = req.body; // Amount is in paise, i.e., 1 INR = 100 paise

    try {
        const options = {
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_${Math.random() * 1000}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});
const sendSucessMail = asyncHandler(async (req, res) => {
    const { cart, billingDetails, totalPrice } = req.body;

    if (!cart || !billingDetails || !totalPrice) {
        return res.status(400).json({
            success: false,
            message: "Incomplete data provided.",
        });
    }

    const { addressLine1, addressLine2, city, state, country, pincode } =
        billingDetails;

    // Loop through the cart and generate order details string for all items
    const orderDetails = cart
        .map(
            (item, index) => `
                <div class="product-card">
                    <img src="${item.thumbnail}" alt="${
                item.title
            }" class="product-image" />
                    <div class="product-info">
                        <h3 class="product-title">${item.title}</h3>
                        <p class="product-description">${item.description}</p>
                        <p class="product-price">₹${(
                            item.price * 84.87
                        ).toFixed(2)} each</p>
                        <p class="product-quantity">Quantity: ${
                            item.quantity
                        }</p>
                        <p class="product-total">Total: ₹${(
                            item.price *
                            84.87 *
                            item.quantity
                        ).toFixed(2)}</p>
                    </div>
                </div>
            `
        )
        .join("\n");

    const message = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              color: #333;
              margin: 0;
              padding: 20px;
            }
            .container {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333;
              font-size: 24px;
              text-align: center;
              margin-bottom: 20px;
            }
            .order-summary {
              margin-top: 20px;
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 8px;
            }
            .order-summary p {
              margin: 5px 0;
            }
            .total-price {
              font-size: 18px;
              font-weight: bold;
              color: #2d8bff;
            }
            .address {
              margin-top: 15px;
              font-size: 16px;
            }
            .product-card {
              display: flex;
              margin-bottom: 15px;
              padding: 10px;
              background-color: #fafafa;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .product-image {
              width: 100px;
              height: 100px;
              object-fit: cover;
              border-radius: 8px;
            }
            .product-info {
              margin-left: 15px;
            }
            .product-title {
              font-size: 18px;
              margin: 5px 0;
            }
            .product-description {
              font-size: 14px;
              color: #555;
            }
            .product-price, .product-quantity, .product-total {
              font-size: 16px;
              margin: 5px 0;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 14px;
              color: #777;
            }
            .footer a {
              color: #2d8bff;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Order Confirmation</h1>
            
            <p>Hello <strong>${req?.user?.fullName}</strong>,</p>
            
            <p>Thank you for your order! We're excited to get your items to you. Here are the details of your order:</p>
            
            <div class="order-summary">
              <p class="total-price">Total Price: ₹${totalPrice}</p>
        
              <div class="address">
                <p><strong>Delivery Address:</strong></p>
                <p>${addressLine1}, ${
        addressLine2 ? addressLine2 + "," : ""
    } ${city}, ${state}, ${country} - ${pincode}</p>
              </div>
        
              <p><strong>Order Items:</strong></p>
              ${orderDetails}
            </div>
        
            <p>We will notify you once your order is out for delivery.</p>
            <p>Thank you for shopping with us!</p>
        
            <div class="footer">
              <p>Best regards,<br>TrendyCart :)</p>
              <p><a href="https://www.trendycart.com">Visit Our Website</a></p>
            </div>
          </div>
        </body>
        </html>
    `;

    // Send the email
    await sendEmail(req?.user?.email, message, "Your Order Confirmation");

    console.log("Email sent successfully.");
    res.status(200).json({
        success: true,
        message: "Order confirmation email sent successfully.",
    });
});

export { verifyPayment, createOrder, sendSucessMail };
