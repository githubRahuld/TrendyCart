import { Router } from "express";
import { verifyAdminSeller } from "../middlewares/auth.middleware.js";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductsByCategory,
    updateProduct,
} from "../controllers/product.controllers.js";

const router = Router();

router.route("/create").post(verifyAdminSeller, createProduct);
router.route("/get-all").get(getAllProducts);
router.route("/category/:categoryId").get(getProductsByCategory);
router.route("/delete/:productId").delete(verifyAdminSeller, deleteProduct);
router.route("/update/:productId").patch(verifyAdminSeller, updateProduct);

export default router;
