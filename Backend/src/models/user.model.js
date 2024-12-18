import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
        },
        googleId: {
            type: String,
            default: null,
        },
        phoneNumber: {
            type: String,
            required: function () {
                return !this.googleId; // Required if the user is not using Google login
            },
        },
        password: {
            type: String,
            required: function () {
                // Only require password if the loginType is EMAIL_PASSWORD
                return this.loginType === "EMAIL_PASSWORD";
            },
            minlength: [5, "Password must be at least 6 characters long"],
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String,
            default: `https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y&s=200`,
        },
        role: {
            type: String,
            enum: ["Admin", "User", "Seller", "Delivery Personnel"],
            default: "User",
        },
        loginType: {
            type: String,
            enum: ["EMAIL_PASSWORD", "GOOGLE"],
            default: "EMAIL_PASSWORD",
        },
        otp: {
            type: String,
            default: null,
        },
        otpExpiration: {
            type: Date,
            default: null,
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

// incrypt password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// password check
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// refresh token has less information
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
