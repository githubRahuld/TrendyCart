import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary, {
    deleteImageFromCloudinary,
} from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import crypto from "crypto";
import { sendSMS, sendEmail } from "./notificationService.js"; // Your SMS/Email service

const generateAndSendOTP = async (user) => {
    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Set OTP and its expiration time (e.g., 5 minutes)
    user.otp = otp;
    user.otpExpiration = Date.now() + 5 * 60 * 1000; // 5 minutes from now

    await user.save();

    // Log user information for debugging
    console.log("User Info: ", user);

    if (user.email.trim() !== "") {
        console.log("Sending OTP via Email: ", user.email);
        await sendEmail(
            user.email,
            `Your OTP is: ${otp}. Only valid for 5 minutes.`
        );
    } else {
        console.log("No valid contact method found for user.");
    }
};

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "something went wrong while generting access and refresh tokens"
        );
    }
};

const loginSuccess = asyncHandler(async (req, res) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "Sucessfully logged in",
            user: req.user,
        });
    } else {
        res.status(403).json({ error: true, message: "Not Authorized" });
    }
});

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, phoneNumber, role } = req.body;

    // Check for missing fields
    if (
        [fullName, email, password, phoneNumber].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    try {
        // Check if the user already exists
        const checkUserExist = await User.findOne({ email });
        if (checkUserExist) {
            return res
                .status(409)
                .json({ message: "User with this email already exists" });
        }

        let avatar;
        if (req.files && req.files.avatar) {
            const avatarFile = req.files.avatar;
            avatar = await uploadOnCloudinary(avatarFile.data, "avatars");
        }

        if (!avatar) {
            return res
                .status(500)
                .json({ message: "Error uploading avatar. Please try again." });
        }

        // Create the new user
        const user = await User.create({
            fullName,
            email,
            password,
            phoneNumber,
            googleId: null,
            avatar: avatar?.secure_url || undefined,
            role: role || undefined,
        });

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );
        if (!createdUser) {
            return res
                .status(500)
                .json({ message: "Error registering user. Please try again." });
        }

        return res.status(201).json({
            success: true,
            user: createdUser,
            message: "User registered successfully",
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "An unexpected error occurred" });
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    // required either email or username
    if (!email) {
        return res.status(409).json({ message: "Email is required" });
    }

    const userExists = await User.findOne({ email });

    if (!userExists) {
        // throw new ApiError(404, "User not exists,please SignUp first!");
        return res
            .status(409)
            .json({ message: "User not exists,please SignUp first!" });
    }

    const passwordCheck = await userExists.isPasswordCorrect(password);

    if (!passwordCheck) {
        // throw new ApiError(400, "Invalid Password");
        return res.status(409).json({ message: "Invalid Password" });
    }

    await generateAndSendOTP(userExists);
    return res.status(200).json({ message: "OTP sent to your email." });
});

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    console.log(email);
    console.log(otp);

    const user = await User.findOne({ email });

    if (!user) {
        return res
            .status(409)
            .json({ message: "User not found with this email" });
    }

    if (user.otp !== otp) {
        return res.status(409).json({ message: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (Date.now() > user.otpExpiration) {
        return res
            .status(409)
            .json({ message: "OTP expired. Please request a new one." });
    }

    // OTP is valid, proceed with login
    // Clear OTP and expiration
    user.otp = null;
    user.otpExpiration = null;
    await user.save();

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                201,
                { user: loggedInUser, accessToken, refreshToken },
                "User loggedIn successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .clearCookie("connect.sid", options)
        .json(new ApiResponse(200, {}, "User Logged Out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    if (!decodedToken) {
        throw new ApiError(401, "Invalid Refresh Token");
    }

    const user = await User.findById(decodedToken._id);

    if (!user) {
        throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh Token was expired please login");
    }

    const { accessToken, newRefreshToken } = generateAccessAndRefreshTokens(
        user._id
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                201,
                { accessToken, refreshToken: newRefreshToken },
                "Access Token refreshed"
            )
        );
});

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(401, "Fields are required");
    }
    if (oldPassword === newPassword) {
        throw new ApiError(401, "Donot use previously used passwords");
    }

    const user = await User.findById(req.user?._id);
    const passwordCheck = await user.isPasswordCorrect(oldPassword);

    if (!passwordCheck) {
        throw new ApiError(401, "Invalid password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: true });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Passsword changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const currentUser = await User.findById(req.user?._id);

    if (!currentUser) {
        throw new ApiError(401, "Unauthorized request");
    }

    //TODO: directly return req.user without fetching from db
    return res
        .status(200)
        .json(new ApiResponse(200, currentUser, "Fetched current user"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
    const { fullName, phoneNumber } = req.body;
    console.log(fullName, phoneNumber);

    if (!fullName || !phoneNumber) {
        throw new ApiError(401, "Fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                phoneNumber,
            },
        },
        {
            new: true,
        }
    ).select("-password");

    console.log("updated details: ", user);

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User details updated"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    if (!req.files || !req.files.avatar) {
        return res.status(400).json({ message: "Avatar is required" });
    }

    const avatarFile = req.files.avatar; // File from the frontend
    // console.log("Received file:", avatarFile);

    const avatarLocalPath = avatarFile.data; //buffer data

    if (!avatarLocalPath) {
        throw new ApiError(401, "Avatar is requried");
    }

    const avatarImage = await uploadOnCloudinary(avatarLocalPath);

    if (!avatarImage.url) {
        throw new ApiError(500, "Error while uploading avatar");
    }

    //delete old avatar from cloudinary
    const currUser = await User.findById(req.user?._id);
    deleteImageFromCloudinary(currUser.avatar);

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: avatarImage?.url,
            },
        },
        {
            new: true,
        }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, user, "Avatar updated"));
});

const getUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        return res.status(401).json(new ApiResponse(401, {}, "Please Login"));
    }

    const user = await User.findById(req.user._id).select("-password"); // Ensure no password is returned

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }

    return res.status(200).json(new ApiResponse(200, { user }, "User Fetched"));
});

export {
    loginSuccess,
    registerUser,
    loginUser,
    verifyOTP,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getCurrentUser,
    updateUserDetails,
    updateUserAvatar,
    getUser,
};
