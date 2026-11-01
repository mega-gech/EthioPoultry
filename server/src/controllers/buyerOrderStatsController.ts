import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";

export const getBuyerOrderStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // Only buyers can access these statistics
    if (!userId || req.user?.role !== "buyer") {
      res.status(403).json({
        success: false,
        message: "Only buyers can access these statistics",
      });
      return;
    }

    const buyerId = new mongoose.Types.ObjectId(userId);

    // Count all orders placed by this buyer
    const [totalOrders, pendingOrders, completedOrders] =
      await Promise.all([
        Order.countDocuments({ buyerId }),

        Order.countDocuments({
          buyerId,
          status: "Pending",
        }),

        Order.countDocuments({
          buyerId,
          status: "Completed",
        }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
      },
    });
  } catch (error) {
    console.error("get buyer order stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch buyer order statistics",
    });
  }
};