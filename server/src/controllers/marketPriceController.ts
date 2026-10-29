
import { Request, Response } from "express";
import Product from "../models/Product.js";
import MarketPrice from "../models/MarketPrice.js";


export const getSellerPrices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.find({
      status: "Active",
    })
      .populate("sellerId", "name location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching seller prices:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch seller prices",
    });
  }
};



export const getMarketPriceHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category, location } = req.query;

   const filter: Record<string, unknown> = {};

    if (typeof category === "string" && category !== "All") {
      filter.category = category;
    }

    if (typeof location === "string" && location !== "All") {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    const prices = await MarketPrice.find(filter)
      .sort({ recordedAt: -1 });

    res.status(200).json({
      success: true,
      count: prices.length,
      data: prices,
    });
  } catch (error) {
    console.error("Error fetching market price history:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch market price history",
    });
  }
};
