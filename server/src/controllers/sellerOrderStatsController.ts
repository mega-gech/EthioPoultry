import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";

export const getSellerOrderStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId || req.user?.role !== "seller") {
      res.status(403).json({
        success: false,
        message: "Only sellers can access these statistics",
      });
      return;
    }

    const sellerId = new mongoose.Types.ObjectId(userId);

    const [orderCount, completedSales] = await Promise.all([
      Order.countDocuments({
        sellerId,
        status: { $ne: "Cancelled" },
      }),

      Order.aggregate([
        {
          $match: {
            sellerId,
            status: "Completed",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        orderCount,
        totalSales: completedSales[0]?.total ?? 0,
      },
    });
  } catch (error) {
    console.error("get seller order stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch seller order statistics",
    });
  }
};