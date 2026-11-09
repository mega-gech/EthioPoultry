import { Router } from "express";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import {
  createPayment,
  simulatePayment,
  getMyPayments
} from "../controllers/paymentController.js";

const router = Router();

router.post("/create", authMiddleWare, createPayment);
router.post("/simulate", authMiddleWare, simulatePayment);
router.get("/my-payments", authMiddleWare, getMyPayments);

export default router;