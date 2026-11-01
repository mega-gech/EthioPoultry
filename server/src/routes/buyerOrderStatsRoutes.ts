import { Router } from "express";
import { getBuyerOrderStats,
     createBuyerOrder, 
    getBuyerOrders,
    cancelBuyerOrder

 } from "../controllers/buyerOrderStatsController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authMiddleWare, getBuyerOrderStats);
router.post("/", authMiddleWare, createBuyerOrder);
router.get("/my-orders", authMiddleWare, getBuyerOrders);
router.patch("/:orderId/cancel", authMiddleWare, cancelBuyerOrder);

export default router;