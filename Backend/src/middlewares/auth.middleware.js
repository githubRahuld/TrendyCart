import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "") ||
            req.headers["authorization"];

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        console.log("decodedToken : ", decodedToken);

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        return res
            .status(411)
            .json({ message: error?.message || "Invalid Access Token" });
    }
});

export const verifyAdminSeller = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "") ||
            req.headers["authorization"];

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
        if (user.role !== "Admin" && user.role !== "Seller") {
            throw new ApiError(401, "You are not Unauthorized");
        }

        req.user = user;
        next();
    } catch (error) {
        return res
            .status(411)
            .json({ message: error?.message || "Invalid Access Token" });
    }
});
