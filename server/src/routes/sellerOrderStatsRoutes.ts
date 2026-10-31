import { Router } from "express";
import { getSellerOrderStats } from "../controllers/sellerOrderStatsController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authMiddleWare, getSellerOrderStats);

export default router;