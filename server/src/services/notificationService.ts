
import mongoose from "mongoose";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { randomUUID } from "crypto";

type ProductNotificationType = "new_product" | "product_update";

interface ProductNotificationData {
  sellerId: string;
  productId: mongoose.Types.ObjectId;
  productName: string;
  type: ProductNotificationType;
  eventId: string;
}

export const notifyBuyersAboutProduct = async ({
  sellerId,
  productId,
  productName,
  type,
  eventId,
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
  await Notification.bulkWrite(
  buyers.map((buyer) => ({
    updateOne: {
      filter: {
        recipient: buyer._id,
        eventKey: `${type}:${productId}:${eventId}`,
      },
      update: {
        $setOnInsert: {
          recipient: buyer._id,
          sender: sellerId,
          title,
          message,
          type,
          relatedId: productId,
          eventKey: `${type}:${productId}:${eventId}`,
          isRead: false,
        },
      },
      upsert: true,
    },
  }))
);
};
