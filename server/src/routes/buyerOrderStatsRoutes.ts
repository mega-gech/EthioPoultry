import { Router } from "express";
import { getBuyerOrderStats, createBuyerOrder, getBuyerOrders } from "../controllers/buyerOrderStatsController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authMiddleWare, getBuyerOrderStats);
router.post("/", authMiddleWare, createBuyerOrder);
router.get("/my-orders", authMiddleWare, getBuyerOrders);

export default router;