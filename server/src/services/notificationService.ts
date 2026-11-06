
import mongoose from "mongoose";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

type ProductNotificationType = "new_product" | "product_update";

interface ProductNotificationData {
  sellerId: string;
  productId: mongoose.Types.ObjectId;
  productName: string;
  type: ProductNotificationType;
}

export const notifyBuyersAboutProduct = async ({
  sellerId,
  productId,
  productName,
  type,
}: ProductNotificationData): Promise<void> => {

  // 1. Find all registered buyers
  const buyers = await User.find({
    role: "buyer",
  }).select("_id");

  // 2. Stop if there are no buyers
  if (buyers.length === 0) {
    return;
  }

  // 3. Find the seller's name
  const seller = await User.findById(sellerId).select("name");

  const sellerName = seller?.name || "A seller";

  // 4. Prepare notification information
  const title =
    type === "new_product"
      ? "New Product Available"
      : "Product Updated";

  const message =
    type === "new_product"
      ? `${sellerName} added a new product: ${productName}.`
      : `${sellerName} updated the product: ${productName}.`;

  // 5. Create an individual notification for every buyer
  await Notification.insertMany(
    buyers.map((buyer) => ({
      recipient: buyer._id,
      sender: sellerId,
      title,
      message,
      type,
      relatedId: productId,
      isRead: false,
    }))
  );
};
