import { Router } from "express";
import {
    createOrder,
    sendSucessMail,
    verifyPayment,
} from "../controllers/payment.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-order").post(verifyJWT, createOrder);
router.route("/verify-payment").post(verifyJWT, verifyPayment);
router.route("/sendSucessMail").post(verifyJWT, sendSucessMail);

export default router;
