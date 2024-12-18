import { Router } from "express";
import {
    getUser,
    loginUser,
    logoutUser,
    registerUser,
    updateUserAvatar,
    updateUserDetails,
    verifyOTP,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Route for email,pass login
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verifyOtp").post(verifyOTP);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/update").patch(verifyJWT, updateUserDetails);
router.route("/update-avatar").patch(verifyJWT, updateUserAvatar);

router.route("/getUser").get(verifyJWT, getUser);

export default router;
