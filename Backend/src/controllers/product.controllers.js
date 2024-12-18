import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    deleteImageFromCloudinary,
    uploadOnCloudinary,
} from "../utils/cloudinary.js";

const getAllProducts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const products = await Product.find({})
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    const allProducts = await Product.countDocuments();

    return res.status(200).json(
        new ApiResponse(200, {
            currentPage: pageNumber,
            totalPages: Math.ceil(allProducts / limitNumber),
            totalProducts: allProducts,
            products,
        })
    );
});

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, category, price, stock } = req.body;

    if (
        [name, description, category, price].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(404, "All fields are required");
    }

    // Find the category by name
    const categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
        throw new ApiError(404, `Category '${category}' does not exist`);
    }

    const mainImageFile = req.files.mainImage;
    if (!mainImageFile) {
        throw new ApiError(400, "Product Main Image is required");
    }

    // Upload main image to Cloudinary (using Promise for async/await)
    const mainImage = await uploadOnCloudinary(
        req.files.mainImage.data,
        "products/main_images"
    );

    if (!mainImage) {
        throw new ApiError(
            501,
            "Something went wrong while uploading mainImage"
        );
    }

    // Upload sub-images (if any)
    let subImages = [];
    if (req.files.subImages) {
        const subImageFiles = Array.isArray(req.files.subImages)
            ? req.files.subImages
            : [req.files.subImages];

        // Upload each sub-image to Cloudinary using uploadOnCloudinary function
        for (const file of subImageFiles) {
            const uploadedImage = await uploadOnCloudinary(
                file.data,
                "products/sub_images"
            );
            subImages.push(uploadedImage.secure_url);
        }
    }

    // Create the product in the database
    const product = await Product.create({
        name,
        description,
        price,
        category: categoryDoc._id,
        stock,
        mainImage: mainImage.secure_url,
        subImages,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, product, "Product created successfully"));
});

const getProductsByCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (!categoryId) {
        throw new ApiError(404, "CategoryId is requried");
    }

    const allProducts = await Product.find({ category: categoryId })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    if (!allProducts.length) {
        return res
            .status(200)
            .json(
                new ApiResponse(200, {}, "No product found for this category")
            );
    }

    const productCount = await Product.countDocuments({ category: categoryId });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                currentPage: pageNumber,
                totalPages: Math.ceil(productCount / limitNumber),
                totalProducts: productCount,
                allProducts,
            },
            "All product fetched"
        )
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!productId) throw new ApiError(404, "Product Id is required");

    const productExists = await Product.findById(productId);

    if (!productExists)
        throw new ApiError(404, "No product founded from this productId");

    const deleteProduct = await Product.findByIdAndDelete(productId);

    const productImages = [productExists.mainImage, ...productExists.subImages];

    productImages.map(async (image) => {
        await deleteImageFromCloudinary(image);
    });
    //note:  if image not delete remove async

    return res
        .status(200)
        .json(
            new ApiResponse(200, deleteProduct, "Product deleted sucessfully")
        );
});

const updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { name, description, category, price, stock } = req.body;

    const product = await Product.findById(productId);

    // Check the product existence
    if (!product) {
        throw new ApiError(404, "Product does not exist");
    }

    let mainImage = "";
    if (req.files?.mainImage && req.files?.mainImage.length) {
        //delete old main image
        await deleteImageFromCloudinary(product.mainImage);

        //upload new mainImage
        mainImage = await uploadOnCloudinary(
            req.files.mainImage.data,
            "products/main_images"
        );
    }

    let subImages = [];
    if (req.files?.subImages && req.files?.subImages.length) {
        // delete old subImages

        const oldSubImages = [...product.subImages];

        oldSubImages.map(async (image) => {
            await deleteImageFromCloudinary(image);
        });

        //upload new subImages
        const subImageFiles = Array.isArray(req.files.subImages)
            ? req.files.subImages
            : [req.files.subImages];

        for (const file of subImageFiles) {
            const uploadedImage = await uploadOnCloudinary(
                file.data,
                "products/sub_images"
            );
            subImages.push(uploadedImage.secure_url);
        }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                name: name || product.name,
                description: description || product.description,
                price: price || product.price,
                category,
                stock: stock || product.stock,
                mainImage: mainImage?.secure_url,
                subImages,
            },
        },
        {
            new: true,
        }
    );

    if (!updatedProduct) {
        throw new ApiError(501, "Something went wrong while updating product");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedProduct, "Product updated successfully")
        );
});

export {
    getAllProducts,
    createProduct,
    getProductsByCategory,
    deleteProduct,
    updateProduct,
};
