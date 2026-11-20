
import { Request, Response } from "express";
import Product from "../models/Product.js";
import MarketPrice from "../models/MarketPrice.js";
import User from "../models/User.js";
import type { ProductCategory } from "../models/Product.js";


export const getSellerPrices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const activeSellerIds = await User.find({
      role: "seller",
      isActive: { $ne: false },
    }).distinct("_id");
    const products = await Product.find({
      sellerId: { $in: activeSellerIds },
      status: "Active",
      $or: [
        { approvalStatus: "Approved" },
        { approvalStatus: { $exists: false } },
      ],
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

    filter.$or = [
      { status: "Approved" },
      { status: { $exists: false } },
    ];

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

export const submitMarketPrice = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    res.status(400).json({ success: false, message: "Invalid market price submission." });
    return;
  }
  try {
    const userId = req.user?.userId;
    if (!userId || req.user?.role !== "seller") {
      res.status(403).json({
        success: false,
        message: "Only sellers can submit market prices.",
      });
      return;
    }

    const { productName, category, price, unit, location, recordedAt, source } =
      req.body;

    if (
      typeof productName !== "string" ||
      !productName.trim() ||
      productName.trim().length > 120 ||
      typeof category !== "string" ||
      !["Eggs", "Chickens", "Equipment", "Feed"].includes(category) ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price <= 0 ||
      typeof unit !== "string" ||
      !unit.trim() ||
      unit.trim().length > 60 ||
      typeof location !== "string" ||
      !location.trim() ||
      location.trim().length > 120 ||
      (recordedAt !== undefined &&
        (typeof recordedAt !== "string" ||
          Number.isNaN(Date.parse(recordedAt)))) ||
      (source !== undefined &&
        (typeof source !== "string" || source.trim().length > 120))
    ) {
      res.status(400).json({
        success: false,
        message: "Valid product name, category, price, unit, and location are required.",
      });
      return;
    }

    const seller = await User.findById(userId).select("name");
    if (!seller) {
      res.status(401).json({ success: false, message: "Seller account not found." });
      return;
    }

    const submission = await MarketPrice.create({
      productName: productName.trim(),
      category: category as ProductCategory,
      price,
      unit: unit.trim(),
      location: location.trim(),
      recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
      source: typeof source === "string" && source.trim() ? source.trim() : seller.name,
      status: "Pending",
      submittedBy: userId,
    });

    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    console.error("Market price submission failed:", error);
    res.status(400).json({
      success: false,
      message: "Invalid market price submission.",
    });
  }
};
