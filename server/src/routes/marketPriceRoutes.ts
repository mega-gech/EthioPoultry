import { Router } from "express";
import {
  getSellerPrices,
  getMarketPriceHistory,
} from "../controllers/marketPriceController.js";

const router = Router();

router.get("/seller", getSellerPrices);
router.get("/history", getMarketPriceHistory);

export default router;