import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const productSchema = new Schema(
    {
        category: {
            ref: "Category",
            required: true,
            type: Schema.Types.ObjectId,
        },
        description: {
            required: true,
            type: String,
        },
        mainImage: {
            required: true,
            type: String,
        },
        name: {
            required: true,
            type: String,
        },
        owner: {
            ref: "User",
            type: Schema.Types.ObjectId,
        },
        price: {
            default: 0,
            type: Number,
        },
        stock: {
            default: 0,
            type: Number,
        },
        subImages: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

productSchema.plugin(mongooseAggregatePaginate);

export const Product = mongoose.model("Product", productSchema);
