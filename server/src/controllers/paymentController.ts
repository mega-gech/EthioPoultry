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

const order = await Order.findOne({
  _id: orderId,
  buyerId: userId,
});

if (!order) {
  res.status(404).json({
    success: false,
    message: "Order not found",
  });
  return;
}

if (order.status !== "Pending") {
  res.status(400).json({
    success: false,
    message: "This order is not available for payment",
  });
  return;
}

const successfulPayment = await Payment.findOne({
  orderId: order._id,
  status: "Successful",
});

if (successfulPayment) {
  res.status(400).json({
    success: false,
    message: "This order has already been paid",
  });
  return;
}

const pendingPayment = await Payment.findOne({
  orderId: order._id,
  status: "Pending",
});

if (pendingPayment) {
  res.status(409).json({
    success: false,
    message: "A payment attempt is already pending",
  });
  return;
}

const payment = await Payment.create({
  orderId: order._id,
  buyerId: userId,
  amount: order.totalAmount,
  currency: "ETB",
  method: "Simulated",
  transactionReference: randomUUID(),
  status: "Pending",
});

res.status(201).json({
  success: true,
  message: "Payment created successfully",
  data: payment,
});


  } catch (error) {
    console.error("create payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create payment",
    });
  }
};