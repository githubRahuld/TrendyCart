import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createAddress,
    getAllAddresses,
    getAddressById,
    updateAddress,
    deleteAddress,
} from "../controllers/address.controllers.js";

const router = Router();

router.route("/create").post(verifyJWT, createAddress);
router.route("/get").get(verifyJWT, getAllAddresses);
router.route("/get/:addressId").get(verifyJWT, getAddressById);
router.route("/update/:addressId").patch(verifyJWT, updateAddress);
router.route("/delete/:addressId").delete(verifyJWT, deleteAddress);

export default router;
