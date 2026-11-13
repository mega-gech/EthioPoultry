import { Router } from "express";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import {
  createPayment,
  simulatePayment,
  getMyPayments,
  initializeChapaPayment,
  verifyChapaPayment,
  chapaWebhook
} from "../controllers/paymentController.js";

const router = Router();

router.post("/create", authMiddleWare, createPayment);
router.post("/simulate", authMiddleWare, simulatePayment);
router.get("/my-payments", authMiddleWare, getMyPayments);
router.post("/chapa/initialize",authMiddleWare,initializeChapaPayment);
router.post("/chapa/verify/:paymentId", authMiddleWare, verifyChapaPayment);
router.post("/chapa/webhook", chapaWebhook);

export default router;