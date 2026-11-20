import type { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Report from "../models/Report.js";
import User from "../models/User.js";

const reportStatuses = ["Open", "Resolved", "Dismissed"] as const;

export const createReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    res.status(400).json({ success: false, message: "Invalid report data." });
    return;
  }
  const reporterId = req.user?.userId;
  const { targetType, targetId, reason, details } = req.body as {
    targetType?: unknown;
    targetId?: unknown;
    reason?: unknown;
    details?: unknown;
  };
  if (!reporterId) {
    res.status(401).json({ success: false, message: "Authentication required." });
    return;
  }
  if (
    (targetType !== "product" && targetType !== "user") ||
    typeof targetId !== "string" ||
    !mongoose.isValidObjectId(targetId) ||
    typeof reason !== "string" ||
    reason.trim().length < 3 ||
    reason.trim().length > 120 ||
    (details !== undefined &&
      (typeof details !== "string" || details.trim().length > 2000))
  ) {
    res.status(400).json({ success: false, message: "Valid report target and reason are required." });
    return;
  }
  if (targetType === "user" && targetId === reporterId) {
    res.status(400).json({ success: false, message: "You cannot report your own account." });
    return;
  }

  try {
    const targetExists =
      targetType === "product"
        ? await Product.exists({ _id: targetId })
        : await User.exists({ _id: targetId });
    if (!targetExists) {
      res.status(404).json({ success: false, message: "Reported item was not found." });
      return;
    }
    const report = await Report.create({
      reporterId,
      targetType,
      targetId,
      reason: reason.trim(),
      details: typeof details === "string" ? details.trim() : undefined,
    });
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    console.error("Failed to create report:", error);
    res.status(500).json({ success: false, message: "Failed to submit report." });
  }
};

export const getAdminReports = async (
  req: Request,
  res: Response
): Promise<void> => {
  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const limit = req.query.limit === undefined ? 20 : Number(req.query.limit);
  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    !Number.isSafeInteger(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    res.status(400).json({ success: false, message: "Invalid pagination values." });
    return;
  }
  const filter: Record<string, unknown> = {};
  if (typeof req.query.status === "string" && req.query.status !== "All") {
    if (!reportStatuses.includes(req.query.status as (typeof reportStatuses)[number])) {
      res.status(400).json({ success: false, message: "Invalid report status." });
      return;
    }
    filter.status = req.query.status;
  }
  if (
    typeof req.query.targetType === "string" &&
    req.query.targetType !== "All"
  ) {
    if (req.query.targetType !== "product" && req.query.targetType !== "user") {
      res.status(400).json({ success: false, message: "Invalid report target type." });
      return;
    }
    filter.targetType = req.query.targetType;
  }
  try {
    if (typeof req.query.q === "string" && req.query.q.trim()) {
      const query = req.query.q.trim().slice(0, 100);
      const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      const reporters = await User.find({
        $or: [{ name: regex }, { email: regex }],
      }).select("_id");
      filter.$or = [
        { reason: regex },
        { details: regex },
        ...(mongoose.isValidObjectId(query)
          ? [{ targetId: query }]
          : []),
        ...(reporters.length
          ? [{ reporterId: { $in: reporters.map((reporter) => reporter._id) } }]
          : []),
      ];
    }
    const [reports, total] = await Promise.all([
      Report.find(filter)
        .populate("reporterId", "name email role")
        .populate("reviewedBy", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Report.countDocuments(filter),
    ]);
    const targets = await Promise.all(
      reports.map((report) =>
        report.targetType === "product"
          ? Product.findById(report.targetId).select("name category status").lean()
          : User.findById(report.targetId).select("name email role isActive").lean()
      )
    );
    res.status(200).json({
      success: true,
      data: reports.map((report, index) => ({
        ...report,
        target: targets[index],
      })),
      count: reports.length,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reports." });
  }
};

export const updateAdminReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    res.status(400).json({ success: false, message: "Invalid report resolution." });
    return;
  }
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ success: false, message: "Invalid report ID." });
    return;
  }
  const { status, resolutionNote } = req.body as {
    status?: unknown;
    resolutionNote?: unknown;
  };
  if (
    !reportStatuses.includes(status as (typeof reportStatuses)[number]) ||
    (resolutionNote !== undefined &&
      (typeof resolutionNote !== "string" || resolutionNote.trim().length > 1000))
  ) {
    res.status(400).json({ success: false, message: "Invalid report resolution." });
    return;
  }
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      res.status(404).json({ success: false, message: "Report not found." });
      return;
    }
    report.status = status as (typeof reportStatuses)[number];
    report.resolutionNote =
      typeof resolutionNote === "string" && resolutionNote.trim()
        ? resolutionNote.trim()
        : undefined;
    report.reviewedBy = new mongoose.Types.ObjectId(req.user!.userId);
    report.reviewedAt = new Date();
    await report.save();
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error("Failed to update report:", error);
    res.status(500).json({ success: false, message: "Failed to update report." });
  }
};
