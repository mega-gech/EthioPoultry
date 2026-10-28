import { Request, Response } from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getStatistics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      registeredFarmers,
      availableProducts,
      locations,
      successfulConnections,
    ] = await Promise.all([
      User.countDocuments({ role: "seller" }),

      Product.countDocuments({ status: "Active" }),

      Product.distinct("location", {
        status: "Active",
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