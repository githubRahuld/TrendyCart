import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const orderSchema = new Schema(
    {
        orderPrice: {
            type: Number,
            required: true,
        },
        discountedOrderPrice: {
            type: Number,
            required: true,
        },
        coupon: {
            type: Schema.Types.ObjectId,
            ref: "Coupon",
            default: null,
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        items: {
            type: [
                {
                    productId: {
                        type: Schema.Types.ObjectId,
                        ref: "Product",
                    },
                    quantity: {
                        type: Number,
                        required: true,
                        min: [1, "Quantity can not be less then 1."],
                        default: 1,
                    },
                    id: {
                        type: String,
                        required: true,
                    },
                },
            ],
            default: [],
        },
        address: {
            addressLine1: {
                required: true,
                type: String,
            },
            addressLine2: {
                type: String,
            },
            city: {
                required: true,
                type: String,
            },
            country: {
                type: String,
            },
            pincode: {
                required: true,
                type: String,
            },
            state: {
                required: true,
                type: String,
            },
        },
        status: {
            type: String,
            enum: ["PENDING", "Cancelled", "Failed", "DELIVERED", "IN-Transit"],
            default: "PENDING",
        },
        paymentProvider: {
            type: String,
            enum: [
                "PayPal",
                "Stripe",
                "Credit Card",
                "Bank Transfer",
                "UPI",
                "Cash on Delivery",
                "Razorpay",
            ],
            default: "Cash on Delivery",
        },
        paymentId: {
            type: String,
        },
        isPaymentDone: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

orderSchema.plugin(mongooseAggregatePaginate);

export const EcomOrder = mongoose.model("EcomOrder", orderSchema);
