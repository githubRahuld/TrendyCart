import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Address } from "../models/address.model.js";

const createAddress = asyncHandler(async (req, res) => {
    const { addressLine1, addressLine2, pincode, city, state, country } =
        req.body;

    if (
        [addressLine1, pincode, city, state, country].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(404, "All fields are required");
    }

    const owner = req.user?._id;

    const createAddress = await Address.create({
        addressLine1,
        addressLine2: addressLine2 || "",
        pincode,
        city,
        state,
        country,
        owner,
    });

    if (!createAddress)
        throw new ApiError(501, "Something went wrong while saving address");

    return res
        .status(200)
        .json(
            new ApiResponse(200, createAddress, "Address created sucessfully")
        );
});

const getAllAddresses = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const allAddress = await Address.find({ owner: req.user?._id })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    if (!allAddress)
        throw new ApiError(501, "something went wrong while fetching address");

    if (!allAddress.length)
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "No address corresping to this profile."
                )
            );

    const addressCount = await Address.countDocuments({ owner: req.user?._id });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                currentPage: pageNumber,
                totalPages: Math.ceil(addressCount / limitNumber),
                addressCount: addressCount,
                allAddress,
            },
            "Address fetched sucessfully"
        )
    );
});

const getAddressById = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const address = await Address.findOne({
        _id: addressId,
        owner: req.user._id,
    });

    if (!address) {
        throw new ApiError(404, "Address does not exist");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, address, "Address fetched successfully"));
});

const updateAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const { addressLine1, addressLine2, pincode, city, state, country } =
        req.body;
    const address = await Address.findOneAndUpdate(
        {
            _id: addressId,
            owner: req.user?._id,
        },
        {
            $set: {
                addressLine1,
                addressLine2,
                city,
                country,
                pincode,
                state,
            },
        },
        { new: true }
    );

    if (!address) {
        throw new ApiError(404, "Address does not exist");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, address, "Address updated successfully"));
});

const deleteAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const address = await Address.findOneAndDelete({
        _id: addressId,
        owner: req.user?._id,
    });

    if (!address) {
        throw new ApiError(404, "Address does not exist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { deletedAddress: address },
                "Address deleted successfully"
            )
        );
});

export {
    createAddress,
    getAllAddresses,
    getAddressById,
    updateAddress,
    deleteAddress,
};
