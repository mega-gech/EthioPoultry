import type { Request, Response } from "express";
import mongoose from "mongoose";
import MarketPrice from "../models/MarketPrice.js";

const statuses = ["Pending", "Approved", "Rejected"] as const;
const categories = ["Eggs", "Chickens", "Equipment", "Feed"] as const;

const pagination = (req: Request, res: Response) => {
  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const limit = req.query.limit === undefined ? 20 : Number(req.query.limit);
  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    !Number.isSafeInteger(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    res.status(400).json({
      success: false,
      message: "Page must be positive and limit must be between 1 and 100.",
    });
    return null;
  }
  return { page, limit, skip: (page - 1) * limit };
};

export const getAdminMarketPrices = async (
  req: Request,
  res: Response
): Promise<void> => {
  const page = pagination(req, res);
  if (!page) return;
  const filter: Record<string, unknown> = {};
  if (typeof req.query.status === "string" && req.query.status !== "All") {
    if (!statuses.includes(req.query.status as (typeof statuses)[number])) {
      res.status(400).json({ success: false, message: "Invalid market price status." });
      return;
    }
    if (req.query.status === "Approved") {
      filter.$or = [
        { status: "Approved" },
        { status: { $exists: false } },
      ];
    } else {
      filter.status = req.query.status;
    }
  }
  if (typeof req.query.category === "string" && req.query.category !== "All") {
    if (!categories.includes(req.query.category as (typeof categories)[number])) {
      res.status(400).json({ success: false, message: "Invalid category." });
      return;
    }
    filter.category = req.query.category;
  }
  if (typeof req.query.location === "string" && req.query.location.trim()) {
    filter.location = {
      $regex: req.query.location.trim().slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      $options: "i",
    };
  }
  try {
    if (typeof req.query.q === "string" && req.query.q.trim()) {
      const regex = req.query.q
        .trim()
        .slice(0, 100)
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const matcher = new RegExp(regex, "i");
      const search = [
        { productName: matcher },
        { source: matcher },
        { location: matcher },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: search }];
        delete filter.$or;
      } else {
        filter.$or = search;
      }
    }
    const [prices, total] = await Promise.all([
      MarketPrice.find(filter)
        .populate("submittedBy", "name email")
        .populate("reviewedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(page.skip)
        .limit(page.limit)
        .lean(),
      MarketPrice.countDocuments(filter),
    ]);
    res.status(200).json({
      success: true,
      data: prices,
      count: prices.length,
      total,
      page: page.page,
      pages: Math.ceil(total / page.limit),
    });
  } catch (error) {
    console.error("Failed to fetch admin market prices:", error);
    res.status(500).json({ success: false, message: "Failed to fetch market prices." });
  }
};

export const updateAdminMarketPrice = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    res.status(400).json({ success: false, message: "Invalid market price update data." });
    return;
  }
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ success: false, message: "Invalid market price ID." });
    return;
  }
  const allowedFields = [
    "productName",
    "category",
    "price",
    "unit",
    "location",
    "recordedAt",
    "source",
    "status",
  ];
  const entries = Object.entries(req.body as Record<string, unknown>);
  if (
    entries.length === 0 ||
    entries.some(([key]) => !allowedFields.includes(key))
  ) {
    res.status(400).json({ success: false, message: "Invalid market price update fields." });
    return;
  }
  if (
    req.body.category !== undefined &&
    !categories.includes(req.body.category as (typeof categories)[number])
  ) {
    res.status(400).json({ success: false, message: "Invalid category." });
    return;
  }
  if (
    req.body.status !== undefined &&
    !statuses.includes(req.body.status as (typeof statuses)[number])
  ) {
    res.status(400).json({ success: false, message: "Invalid review status." });
    return;
  }
  if (
    req.body.price !== undefined &&
    (typeof req.body.price !== "number" ||
      !Number.isFinite(req.body.price) ||
      req.body.price <= 0)
  ) {
    res.status(400).json({ success: false, message: "Price must be a positive number." });
    return;
  }
  if (
    ["productName", "unit", "location", "source"].some(
      (field) =>
        req.body[field] !== undefined &&
        (typeof req.body[field] !== "string" ||
          (field !== "source" && !req.body[field].trim()))
    )
  ) {
    res.status(400).json({ success: false, message: "Invalid market price text field." });
    return;
  }
  if (
    req.body.recordedAt !== undefined &&
    (typeof req.body.recordedAt !== "string" ||
      Number.isNaN(Date.parse(req.body.recordedAt)))
  ) {
    res.status(400).json({ success: false, message: "Invalid recorded date." });
    return;
  }

  try {
    const price = await MarketPrice.findById(req.params.id);
    if (!price) {
      res.status(404).json({ success: false, message: "Market price not found." });
      return;
    }
    for (const [field, value] of entries) {
      price.set(field, field === "recordedAt" ? new Date(value as string) : value);
    }
    if (req.body.status === "Approved" || req.body.status === "Rejected") {
      price.reviewedBy = new mongoose.Types.ObjectId(req.user!.userId);
      price.reviewedAt = new Date();
    } else if (req.body.status === "Pending") {
      price.reviewedBy = undefined;
      price.reviewedAt = undefined;
    }
    await price.save();
    res.status(200).json({ success: true, data: price });
  } catch (error) {
    console.error("Failed to update market price:", error);
    if (
      error instanceof mongoose.Error.ValidationError ||
      error instanceof mongoose.Error.CastError
    ) {
      res.status(400).json({ success: false, message: "Invalid market price data." });
      return;
    }
    res.status(500).json({ success: false, message: "Failed to update market price." });
  }
};
