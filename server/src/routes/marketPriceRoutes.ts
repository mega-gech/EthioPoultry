import { Router } from "express";
import {
  getSellerPrices,
  getMarketPriceHistory,
  submitMarketPrice,
} from "../controllers/marketPriceController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/seller", getSellerPrices);
router.get("/history", getMarketPriceHistory);
router.post("/submissions", authMiddleWare, submitMarketPrice);

export default router;