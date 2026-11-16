import type { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import User from "../models/User.js";

const requireBuyer = (req: Request, res: Response): string | null => {
  const userId = req.user?.userId;

  if (!userId || req.user?.role !== "buyer") {
    res.status(403).json({
      success: false,
      message: "Only buyers can manage favorites",
    });
    return null;
  }

  return userId;
};

export const getFavorites = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = requireBuyer(req, res);
    if (!userId) return;

    const user = await User.findById(userId)
      .select("favorites")
      .populate({
        path: "favorites",
        populate: { path: "sellerId", select: "name phone" },
      });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const favorites = user.favorites.filter(Boolean);

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites,
    });
  } catch (error) {
    console.error("get buyer favorites error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve favorites",
    });
  }
};

export const addFavorite = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = requireBuyer(req, res);
    if (!userId) return;

    const { productId } = req.params;
    if (
      typeof productId !== "string" ||
      !mongoose.isValidObjectId(productId)
    ) {
      res.status(400).json({
        success: false,
        message: "A valid product ID is required",
      });
      return;
    }

    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    const result = await User.updateOne(
      { _id: userId, role: "buyer" },
      { $addToSet: { favorites: productId } },
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Product added to favorites",
      data: { productId },
    });
  } catch (error) {
    console.error("add buyer favorite error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product to favorites",
    });
  }
};

export const removeFavorite = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = requireBuyer(req, res);
    if (!userId) return;

    const { productId } = req.params;
    if (
      typeof productId !== "string" ||
      !mongoose.isValidObjectId(productId)
    ) {
      res.status(400).json({
        success: false,
        message: "A valid product ID is required",
      });
      return;
    }

    const result = await User.updateOne(
      { _id: userId, role: "buyer" },
      { $pull: { favorites: productId } },
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Product removed from favorites",
      data: { productId },
    });
  } catch (error) {
    console.error("remove buyer favorite error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove product from favorites",
    });
  }
};
