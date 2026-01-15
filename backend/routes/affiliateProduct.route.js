// routes/affiliateProduct.route.js
import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    trackClick,
    getProductStats,
} from "../controllers/affiliateProduct.controller.js";

const router = express.Router();

// Public routes
router.get("/", getProducts); // Get all active products
router.get("/:productId", getProductById); // Get single product
router.post("/click/:productId", trackClick); // Track click and get redirect link

// Admin routes (protected)
router.post("/create", verifyToken, createProduct);
router.put("/update/:productId", verifyToken, updateProduct);
router.delete("/delete/:productId", verifyToken, deleteProduct);
router.get("/admin/stats", verifyToken, getProductStats);

export default router;
