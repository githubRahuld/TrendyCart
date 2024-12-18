import { Router } from "express";

import {
    verifyAdminSeller,
    verifyJWT,
} from "../middlewares/auth.middleware.js";
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    updateCategory,
} from "../controllers/category.controllers.js";

const router = Router();

router.route("/create").post(verifyAdminSeller, createCategory);
router.route("/get-all").get(getAllCategories);
router.route("/update/:categoryId").patch(verifyAdminSeller, updateCategory);
router.route("/delete/:categoryId").post(verifyAdminSeller, deleteCategory);

export default router;
