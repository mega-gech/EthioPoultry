import { Router } from "express";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import {
  createPayment,
  simulatePayment,
} from "../controllers/paymentController.js";

const router = Router();

router.post("/create", authMiddleWare, createPayment);
router.post("/simulate", authMiddleWare, simulatePayment);

export default router;