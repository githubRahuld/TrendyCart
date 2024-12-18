import { Router } from "express";
import {
    addItemOrUpdateItemQuantity,
    clearCart,
    getUserCart,
    removeItemFromCart,
} from "../controllers/cart.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getUserCart);

router.route("/clear").delete(clearCart);

router
    .route("/item/:productId")
    .post(addItemOrUpdateItemQuantity)
    .delete(removeItemFromCart);

export default router;
