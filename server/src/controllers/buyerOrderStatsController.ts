import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createBuyerOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // Only authenticated buyers can place orders
    if (!userId || req.user?.role !== "buyer") {
      res.status(403).json({
        success: false,
        message: "Only buyers can place orders",
      });
      return;
    }

    const { productId, quantity } = req.body;

    // Validate the product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({
        success: false,
        message: "A valid product ID is required",
      });
      return;
    }

    // Quantity means number of packages, not the product's pack description
    if (!Number.isInteger(quantity) || quantity < 1) {
      res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number",
      });
      return;
    }

    // Read the product from the database
    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    if (product.status !== "Active") {
      res.status(400).json({
        success: false,
        message: "This product is not currently available",
      });
      return;
    }

    // Calculate the total using the database price, not a frontend price
    const totalAmount = product.price * quantity;

    const order = await Order.create({
      buyerId: userId,
      sellerId: product.sellerId,
      items: [
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity,
        },
      ],
      totalAmount,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order, 
    });
  } catch (error) {
    console.error("create buyer order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to place order",
    });
  }
};


export const getBuyerOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // Only authenticated buyers can view their orders
    if (!userId || req.user?.role !== "buyer") {
      res.status(403).json({
        success: false,
        message: "Only buyers can access their orders",
      });
      return;
    }

    // Find orders belonging to this buyer
    const orders = await Order.find({
      buyerId: userId,
    })
      .populate("sellerId", "name phone location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("get buyer orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch buyer orders",
    });
  }
};


export const cancelBuyerOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const orderId = req.params.orderId;

if (typeof orderId !== "string") {
  res.status(400).json({
    success: false,
    message: "Invalid order ID",
  });
  return;
}

    // Only buyers can cancel orders
    if (!userId || req.user?.role !== "buyer") {
      res.status(403).json({
        success: false,
        message: "Only buyers can cancel orders",
      });
      return;
    }

    // Validate order ID
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
      return;
    }

    // Find an order belonging to this buyer
    const order = await Order.findOne({
      _id: orderId,
      buyerId: userId,
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    // Only Pending orders can be cancelled
    if (order.status !== "Pending") {
      res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled",
      });
      return;
    }

    // Update order status
    order.status = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("cancel buyer order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};


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