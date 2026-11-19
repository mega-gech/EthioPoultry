
import mongoose, { Document, Schema } from "mongoose";
import type { ProductCategory } from "./Product.js";

export interface IMarketPrice extends Document {
  productName: string;
  category: ProductCategory;
  price: number;
  unit: string;
  location: string;
  recordedAt: Date;
  source?: string;
  status?: "Pending" | "Approved" | "Rejected";
  submittedBy?: mongoose.Types.ObjectId;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}



const marketPriceSchema = new Schema<IMarketPrice>(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["Eggs", "Chickens", "Equipment", "Feed"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0.01,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    recordedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    source: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);


const MarketPrice = mongoose.model<IMarketPrice>(
  "MarketPrice",
  marketPriceSchema
);

export default MarketPrice;
