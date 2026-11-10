
import mongoose, { Document, Schema } from "mongoose";

export type PaymentStatus =
  | "Pending"
  | "Successful"
  | "Failed"
  | "Refunded";

export type PaymentMethod =
  | "Simulated"
  | "Chapa"
  | "Telebirr";

export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  method: PaymentMethod;
  transactionReference: string;
  status: PaymentStatus;
  checkoutUrl?: string;
  providerReference?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    currency: {
      type: String,
      default: "ETB",
      required: true,
    },

    method: {
      type: String,
      enum: ["Simulated", "Chapa", "Telebirr"],
      required: true,
    },

    transactionReference: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Successful", "Failed", "Refunded"],
      default: "Pending",
    },
    checkoutUrl: {
  type: String,
},

providerReference: {
  type: String,
},

    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ orderId: 1, createdAt: -1 });

const Payment = mongoose.model<IPayment>(
  "Payment",
  paymentSchema
);

export default Payment;
