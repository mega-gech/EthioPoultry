import { Router } from "express";
import { getBuyerOrderStats, createBuyerOrder } from "../controllers/buyerOrderStatsController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authMiddleWare, getBuyerOrderStats);
router.post("/", authMiddleWare, createBuyerOrder);

export default router;