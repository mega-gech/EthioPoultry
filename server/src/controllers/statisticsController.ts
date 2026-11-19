import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Product from "../models/Product.js";
import type { IProduct } from "../models/Product.js";
import Order from "../models/Order.js";

export const getStatistics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const activeSellerIds = await User.find({
      role: "seller",
      isActive: { $ne: false },
    }).distinct("_id");
    const approvedProductFilter: mongoose.QueryFilter<IProduct> = {
      status: "Active",
      sellerId: { $in: activeSellerIds },
      approvalStatus: { $in: ["Approved", null] },
    };
    const [
      registeredFarmers,
      availableProducts,
      locations,
      successfulConnections,
    ] = await Promise.all([
      User.countDocuments({ role: "seller" }),

      Product.countDocuments(approvedProductFilter),

      Product.distinct("location", {
        ...approvedProductFilter,
        location: { $nin: ["", null] },
      }),

      Order.countDocuments({ status: "Completed" }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        registeredFarmers,
        availableProducts,
        successfulConnections,
        coveredLocations: locations.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
    });
  }
};