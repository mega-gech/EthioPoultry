import type { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import MarketPrice from "../models/MarketPrice.js";
import Report from "../models/Report.js";
import { notifyBuyersAboutProduct } from "../services/notificationService.js";

const roles = ["buyer", "seller", "admin"] as const;
const categories = ["Eggs", "Chickens", "Equipment", "Feed"] as const;
const approvalStatuses = ["Pending", "Approved", "Rejected"] as const;
const orderStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"] as const;
const pageSizeMax = 100;

const searchRegex = (value: string) =>
  new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

const getPagination = (
  req: Request,
  res: Response
): { page: number; limit: number; skip: number } | null => {
  const rawPage = req.query.page;
  const rawLimit = req.query.limit;
  const page = rawPage === undefined ? 1 : Number(rawPage);
  const limit = rawLimit === undefined ? 20 : Number(rawLimit);

  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    !Number.isSafeInteger(limit) ||
    limit < 1 ||
    limit > pageSizeMax
  ) {
    res.status(400).json({
      success: false,
      message: `Page must be positive and limit must be between 1 and ${pageSizeMax}.`,
    });
    return null;
  }

  return { page, limit, skip: (page - 1) * limit };
};

const sendFailure = (res: Response, error: unknown, message: string) => {
  console.error(`${message}:`, error);
  if (
    error instanceof mongoose.Error.ValidationError ||
    error instanceof mongoose.Error.CastError
  ) {
    res.status(400).json({ success: false, message: "Invalid request data." });
    return;
  }
  res.status(500).json({ success: false, message });
};

const sendPage = (
  res: Response,
  data: unknown[],
  total: number,
  page: number,
  limit: number
) =>
  res.status(200).json({
    success: true,
    data,
    count: data.length,
    total,
    page,
    pages: Math.ceil(total / limit),
  });

export const getAdminOverview = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const now = new Date();
    const currentMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const sixMonthsAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));
    const approvedProductQuery = {
      $or: [
        { approvalStatus: "Approved" },
        { approvalStatus: { $exists: false } },
      ],
    };

    const [
      totalUsers,
      totalBuyers,
      totalSellers,
      totalProducts,
      activeProducts,
      pendingProductApprovals,
      totalOrders,
      completedOrders,
      recentUsers,
      recentOrders,
      recentProducts,
      recentPrices,
      recentReports,
      monthlyUsersRaw,
      monthlyOrdersRaw,
      statusCounts,
      pendingMarketPrices,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "buyer" }),
      User.countDocuments({ role: "seller" }),
      Product.countDocuments(),
      Product.countDocuments({
        status: "Active",
        approvalStatus: { $in: ["Approved", null] },
      }),
      Product.countDocuments({ approvalStatus: "Pending" }),
      Order.countDocuments(),
      Order.countDocuments({ status: "Completed" }),
      User.find().select("name email role createdAt").sort({ createdAt: -1 }).limit(6).lean(),
      Order.find()
        .populate("buyerId", "name email")
        .populate("sellerId", "name email")
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
      Product.find().select("name createdAt").sort({ createdAt: -1 }).limit(6).lean(),
      MarketPrice.find().select("productName status createdAt").sort({ createdAt: -1 }).limit(6).lean(),
      Report.find().select("targetType status createdAt").sort({ createdAt: -1 }).limit(6).lean(),
      User.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
      ]),
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      MarketPrice.countDocuments({ status: "Pending" }),
    ]);

    const monthlyUsers = new Map(
      monthlyUsersRaw.map((entry: { _id: string; count: number }) => [
        entry._id,
        entry.count,
      ])
    );
    const monthlyOrders = new Map(
      monthlyOrdersRaw.map((entry: { _id: string; count: number }) => [
        entry._id,
        entry.count,
      ])
    );
    const months = Array.from({ length: 6 }, (_value, index) => {
      const month = new Date(Date.UTC(
        currentMonth.getUTCFullYear(),
        currentMonth.getUTCMonth() - (5 - index),
        1
      ));
      const key = month.toISOString().slice(0, 7);
      return {
        month: key,
        users: monthlyUsers.get(key) ?? 0,
        orders: monthlyOrders.get(key) ?? 0,
      };
    });

    const activities = [
      ...recentUsers.map((user) => ({
        type: "registration",
        description: `${user.name} registered as a ${user.role}.`,
        createdAt: user.createdAt,
      })),
      ...recentOrders.map((order) => ({
        type: "order",
        description: `Order ${order._id.toString().slice(-8)} was placed.`,
        createdAt: order.createdAt,
      })),
      ...recentProducts.map((product) => ({
        type: "product",
        description: `${product.name} was listed.`,
        createdAt: product.createdAt,
      })),
      ...recentPrices.map((price) => ({
        type: "market-price",
        description: `${price.productName} price submission is ${price.status ?? "legacy"}.`,
        createdAt: price.createdAt,
      })),
      ...recentReports.map((report) => ({
        type: "report",
        description: `A ${report.targetType} report is ${report.status.toLowerCase()}.`,
        createdAt: report.createdAt,
      })),
    ]
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      )
      .slice(0, 10);

    res.status(200).json({
      success: true,
      data: {
        totals: {
          totalUsers,
          totalBuyers,
          totalSellers,
          totalProducts,
          activeProducts,
          pendingProductApprovals,
          totalOrders,
          completedOrders,
          pendingMarketPrices,
        },
        recentUsers,
        recentOrders,
        activities,
        charts: {
          monthly: months,
          ordersByStatus: orderStatuses.map((status) => ({
            status,
            count:
              statusCounts.find(
                (entry: { _id: string; count: number }) => entry._id === status
              )?.count ?? 0,
          })),
        },
      },
    });
  } catch (error) {
    sendFailure(res, error, "Failed to fetch admin overview");
  }
};

export const getAdminUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const pagination = getPagination(req, res);
  if (!pagination) return;

  const filter: Record<string, unknown> = {};
  if (typeof req.query.role === "string" && req.query.role !== "All") {
    if (!roles.includes(req.query.role as (typeof roles)[number])) {
      res.status(400).json({ success: false, message: "Invalid user role filter." });
      return;
    }
    filter.role = req.query.role;
  }
  if (typeof req.query.active === "string" && req.query.active !== "All") {
    if (req.query.active !== "true" && req.query.active !== "false") {
      res.status(400).json({ success: false, message: "Invalid account status filter." });
      return;
    }
    if (req.query.active === "true") {
      filter.$or = [
        { isActive: true },
        { isActive: { $exists: false } },
      ];
    } else {
      filter.isActive = false;
    }
  }
  if (typeof req.query.q === "string" && req.query.q.trim()) {
    const regex = searchRegex(req.query.q.trim().slice(0, 100));
    const search = [{ name: regex }, { email: regex }];
    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, { $or: search }];
      delete filter.$or;
    } else {
      filter.$or = search;
    }
  }

  try {
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("name email role isActive phone location createdAt")
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      User.countDocuments(filter),
    ]);
    sendPage(
      res,
      users.map((user) => ({ ...user, isActive: user.isActive !== false })),
      total,
      pagination.page,
      pagination.limit
    );
  } catch (error) {
    sendFailure(res, error, "Failed to fetch users");
  }
};

export const getAdminUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ success: false, message: "Invalid user ID." });
    return;
  }
  try {
    const user = await User.findById(req.params.id)
      .select("name email role isActive phone location createdAt updatedAt")
      .lean();
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }
    res.status(200).json({
      success: true,
      data: { ...user, isActive: user.isActive !== false },
    });
  } catch (error) {
    sendFailure(res, error, "Failed to fetch user");
  }
};

export const updateAdminUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    res.status(400).json({ success: false, message: "Invalid user update data." });
    return;
  }
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ success: false, message: "Invalid user ID." });
    return;
  }

  const { role, isActive } = req.body as {
    role?: unknown;
    isActive?: unknown;
  };
  if (
    (role === undefined && isActive === undefined) ||
    (role !== undefined &&
      (typeof role !== "string" ||
        !roles.includes(role as (typeof roles)[number]))) ||
    (isActive !== undefined && typeof isActive !== "boolean")
  ) {
    res.status(400).json({ success: false, message: "Invalid role or account status." });
    return;
  }
  if (
    req.params.id === req.user?.userId &&
    (role !== undefined || isActive === false)
  ) {
    res.status(400).json({
      success: false,
      message: "You cannot change your own role or deactivate your account.",
    });
    return;
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    const nextRole = role === undefined ? user.role : role;
    const nextActive = isActive === undefined ? user.isActive : isActive;
    const removesActiveAdmin =
      user.role === "admin" &&
      user.isActive &&
      (nextRole !== "admin" || !nextActive);
    if (removesActiveAdmin) {
      const activeAdmins = await User.countDocuments({
        role: "admin",
        isActive: { $ne: false },
      });
      if (activeAdmins <= 1) {
        res.status(409).json({
          success: false,
          message: "The last active administrator cannot be demoted or deactivated.",
        });
        return;
      }
    }

    if (role !== undefined) user.role = role as (typeof roles)[number];
    if (isActive !== undefined) user.isActive = isActive;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        phone: user.phone,
        location: user.location,
      },
    });
  } catch (error) {
    sendFailure(res, error, "Failed to update user");
  }
};

export const getAdminProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const pagination = getPagination(req, res);
  if (!pagination) return;

  const filter: Record<string, unknown> = {};
  if (typeof req.query.category === "string" && req.query.category !== "All") {
    if (!categories.includes(req.query.category as (typeof categories)[number])) {
      res.status(400).json({ success: false, message: "Invalid category filter." });
      return;
    }
    filter.category = req.query.category;
  }
  if (
    typeof req.query.approvalStatus === "string" &&
    req.query.approvalStatus !== "All"
  ) {
    if (!approvalStatuses.includes(req.query.approvalStatus as (typeof approvalStatuses)[number])) {
      res.status(400).json({ success: false, message: "Invalid approval status filter." });
      return;
    }
    if (req.query.approvalStatus === "Approved") {
      filter.$or = [
        { approvalStatus: "Approved" },
        { approvalStatus: { $exists: false } },
      ];
    } else {
      filter.approvalStatus = req.query.approvalStatus;
    }
  }
  if (typeof req.query.status === "string" && req.query.status !== "All") {
    if (req.query.status !== "Active" && req.query.status !== "Out of Stock") {
      res.status(400).json({ success: false, message: "Invalid availability filter." });
      return;
    }
    filter.status = req.query.status;
  }
  if (typeof req.query.q === "string" && req.query.q.trim()) {
    const regex = searchRegex(req.query.q.trim().slice(0, 100));
    const search = [{ name: regex }, { location: regex }, { description: regex }];
    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, { $or: search }];
      delete filter.$or;
    } else {
      filter.$or = search;
    }
  }

  try {
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("sellerId", "name email phone location")
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      Product.countDocuments(filter),
    ]);
    sendPage(res, products, total, pagination.page, pagination.limit);
  } catch (error) {
    sendFailure(res, error, "Failed to fetch products");
  }
};

export const getAdminProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ success: false, message: "Invalid product ID." });
    return;
  }
  try {
    const product = await Product.findById(req.params.id)
      .populate("sellerId", "name email phone location")
      .lean();
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
      return;
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    sendFailure(res, error, "Failed to fetch product");
  }
};

export const updateAdminProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    res.status(400).json({ success: false, message: "Invalid product update data." });
    return;
  }
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ success: false, message: "Invalid product ID." });
    return;
  }
  const allowedFields = [
    "name",
    "description",
    "price",
    "quantity",
    "category",
    "stock",
    "image",
    "images",
    "location",
    "status",
    "approvalStatus",
  ] as const;
  const entries = Object.entries(req.body as Record<string, unknown>);
  if (
    entries.length === 0 ||
    entries.some(([key]) => !allowedFields.includes(key as (typeof allowedFields)[number]))
  ) {
    res.status(400).json({ success: false, message: "Invalid product update fields." });
    return;
  }
  if (
    req.body.category !== undefined &&
    !categories.includes(req.body.category as (typeof categories)[number])
  ) {
    res.status(400).json({ success: false, message: "Invalid product category." });
    return;
  }
  if (
    req.body.approvalStatus !== undefined &&
    !approvalStatuses.includes(
      req.body.approvalStatus as (typeof approvalStatuses)[number]
    )
  ) {
    res.status(400).json({ success: false, message: "Invalid product approval status." });
    return;
  }
  if (
    req.body.status !== undefined &&
    req.body.status !== "Active" &&
    req.body.status !== "Out of Stock"
  ) {
    res.status(400).json({ success: false, message: "Invalid product availability." });
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
    req.body.stock !== undefined &&
    (!Number.isSafeInteger(req.body.stock) || req.body.stock < 0)
  ) {
    res.status(400).json({ success: false, message: "Stock must be a non-negative whole number." });
    return;
  }
  if (
    ["name", "description", "quantity", "image", "location"].some(
      (field) =>
        req.body[field] !== undefined &&
        (typeof req.body[field] !== "string" || !req.body[field].trim())
    )
  ) {
    res.status(400).json({ success: false, message: "Product text fields must be non-empty strings." });
    return;
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
      return;
    }
    const wasApproved =
      product.approvalStatus === "Approved" ||
      product.approvalStatus === undefined;
    for (const [field, value] of entries) {
      product.set(field, value);
    }
    if (req.body.stock !== undefined) {
      product.status = req.body.stock === 0 ? "Out of Stock" : "Active";
    }
    await product.save();
    if (!wasApproved && product.approvalStatus === "Approved") {
      try {
        await notifyBuyersAboutProduct({
          sellerId: product.sellerId.toString(),
          productId: product._id,
          productName: product.name,
          type: "new_product",
          eventId: product._id.toString(),
        });
      } catch (notificationError) {
        console.error(
          "Product approved, but notification delivery failed:",
          notificationError
        );
      }
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    sendFailure(res, error, "Failed to update product");
  }
};

export const deleteAdminProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ success: false, message: "Invalid product ID." });
    return;
  }
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
      return;
    }
    res.status(200).json({ success: true, message: "Product removed." });
  } catch (error) {
    sendFailure(res, error, "Failed to delete product");
  }
};

export const getAdminSellers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const pagination = getPagination(req, res);
  if (!pagination) return;
  const filter: Record<string, unknown> = { role: "seller" };
  if (typeof req.query.active === "string" && req.query.active !== "All") {
    if (req.query.active !== "true" && req.query.active !== "false") {
      res.status(400).json({ success: false, message: "Invalid account status filter." });
      return;
    }
    if (req.query.active === "true") {
      filter.$or = [
        { isActive: true },
        { isActive: { $exists: false } },
      ];
    } else {
      filter.isActive = false;
    }
  }
  if (typeof req.query.q === "string" && req.query.q.trim()) {
    const regex = searchRegex(req.query.q.trim().slice(0, 100));
    const search = [{ name: regex }, { email: regex }, { location: regex }];
    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, { $or: search }];
      delete filter.$or;
    } else {
      filter.$or = search;
    }
  }
  try {
    const [sellers, total] = await Promise.all([
      User.find(filter)
        .select("name email role isActive phone location createdAt")
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      User.countDocuments(filter),
    ]);
    const sellerIds = sellers.map((seller) => seller._id);
    const productCounts = await Product.aggregate([
      { $match: { sellerId: { $in: sellerIds } } },
      { $group: { _id: "$sellerId", count: { $sum: 1 } } },
    ]);
    const countBySeller = new Map(
      productCounts.map((entry: { _id: mongoose.Types.ObjectId; count: number }) => [
        entry._id.toString(),
        entry.count,
      ])
    );
    sendPage(
      res,
      sellers.map((seller) => ({
        ...seller,
        isActive: seller.isActive !== false,
        productCount: countBySeller.get(seller._id.toString()) ?? 0,
      })),
      total,
      pagination.page,
      pagination.limit
    );
  } catch (error) {
    sendFailure(res, error, "Failed to fetch sellers");
  }
};

export const getAdminSeller = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ success: false, message: "Invalid seller ID." });
    return;
  }
  try {
    const seller = await User.findOne({ _id: req.params.id, role: "seller" })
      .select("name email role isActive phone location createdAt")
      .lean();
    if (!seller) {
      res.status(404).json({ success: false, message: "Seller not found." });
      return;
    }
    seller.isActive = seller.isActive !== false;
    const products = await Product.find({ sellerId: seller._id })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({
      success: true,
      data: { seller, products },
    });
  } catch (error) {
    sendFailure(res, error, "Failed to fetch seller details");
  }
};

export const getAdminOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  const pagination = getPagination(req, res);
  if (!pagination) return;
  const filter: Record<string, unknown> = {};
  if (typeof req.query.status === "string" && req.query.status !== "All") {
    if (!orderStatuses.includes(req.query.status as (typeof orderStatuses)[number])) {
      res.status(400).json({ success: false, message: "Invalid order status filter." });
      return;
    }
    filter.status = req.query.status;
  }
  try {
    if (typeof req.query.q === "string" && req.query.q.trim()) {
      const query = req.query.q.trim().slice(0, 100);
      const regex = searchRegex(query);
      const matchingUsers = await User.find({
        $or: [{ name: regex }, { email: regex }],
      }).select("_id");
      const or: Record<string, unknown>[] = [{ "items.name": regex }];
      if (matchingUsers.length > 0) {
        or.push(
          { buyerId: { $in: matchingUsers.map((user) => user._id) } },
          { sellerId: { $in: matchingUsers.map((user) => user._id) } }
        );
      }
      if (mongoose.isValidObjectId(query)) {
        or.push({ _id: query }, { "items.productId": query });
      }
      filter.$or = or;
    }
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("buyerId", "name email phone location")
        .populate("sellerId", "name email phone location")
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      Order.countDocuments(filter),
    ]);
    sendPage(res, orders, total, pagination.page, pagination.limit);
  } catch (error) {
    sendFailure(res, error, "Failed to fetch orders");
  }
};

export const getAdminOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ success: false, message: "Invalid order ID." });
    return;
  }
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyerId", "name email phone location")
      .populate("sellerId", "name email phone location")
      .lean();
    if (!order) {
      res.status(404).json({ success: false, message: "Order not found." });
      return;
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    sendFailure(res, error, "Failed to fetch order");
  }
};
