import { Router } from "express";
import {
    verifyAdminSeller,
    verifyJWT,
} from "../middlewares/auth.middleware.js";
import {
    applyCoupon,
    createOrder,
    deleteOrder,
    getAllOrders,
    getOrderById,
    getOrderListAdmin,
    saveOrderAfterPayment,
    updateOrderStatus,
} from "../controllers/order.controllers.js";

const router = Router();

router.route("/get-order/:orderId").get(verifyJWT, getOrderById);
router.route("/all-orders").get(verifyJWT, getAllOrders);
router.route("/list-orders").get(verifyAdminSeller, getOrderListAdmin);
router.route("/create").post(verifyJWT, createOrder);
router
    .route("/update-status/:orderId")
    .patch(verifyAdminSeller, updateOrderStatus);
router.route("/apply-coupon").patch(verifyJWT, applyCoupon);
router.route("/delete/:orderId").delete(verifyJWT, deleteOrder);

router.route("/save-order").post(verifyJWT, saveOrderAfterPayment);

export default router;
