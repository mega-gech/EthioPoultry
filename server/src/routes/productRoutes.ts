
import { Router } from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
    getMyProducts
} from "../controllers/productController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes: anyone can browse products
router.get("/", getProducts);
router.get("/mine", authMiddleWare, getMyProducts);
router.get("/:id", getProductById);

// Protected routes: a valid JWT is required
router.post("/", authMiddleWare, createProduct);
router.put("/:id", authMiddleWare, updateProduct);
router.delete("/:id", authMiddleWare, deleteProduct);

export default router;
