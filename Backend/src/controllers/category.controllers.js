import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        throw new ApiError(404, "Name is required");
    }

    const category = await Category.create({
        name,
        owner: req.user?._id,
    });

    if (!category) {
        throw new ApiError(
            501,
            "Something went wrong while creating category!"
        );
    }

    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category created successfully"));
});

const getAllCategories = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const categories = await Category.find({})
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    // Get total count of categories
    const totalCategories = await Category.countDocuments();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                data: categories,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalCategories / limitNumber),
                totalCategories,
            },
            "All categories fetched"
        )
    );
});

const updateCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    console.log(categoryId);

    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(
        categoryId,
        {
            $set: {
                name,
            },
        },
        { new: true }
    );
    if (!category) {
        throw new ApiError(404, "Category does not exist");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category updated successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
        throw new ApiError(404, "Category does not exist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { deletedCategory: category },
                "Category deleted successfully"
            )
        );
});

export { createCategory, getAllCategories, updateCategory, deleteCategory };
