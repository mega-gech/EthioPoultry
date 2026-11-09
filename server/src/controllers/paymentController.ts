import { Request, Response } from "express";
import mongoose from "mongoose";
import { randomUUID } from "crypto";

import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

export const createPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    // We'll add our logic here step by step.
    const userId = req.user?.userId;

    if (!userId || req.user?.role !== "buyer") {
  res.status(403).json({
    success: false,
    message: "Only buyers can make payments",
  });
  return;
}

const { orderId } = req.body;

if (!mongoose.Types.ObjectId.isValid(orderId)) {
  res.status(400).json({
    success: false,
    message: "A valid order ID is required",
  });
  return;
}

  } catch (error) {
    console.error("create payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create payment",
    });
  }
};