import { Router } from "express";
import { getBuyerOrderStats } from "../controllers/buyerOrderStatsController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authMiddleWare, getBuyerOrderStats);

export default router;