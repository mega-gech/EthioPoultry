import mongoose, { Document, Schema } from "mongoose";

export type ReportTargetType = "product" | "user";
export type ReportStatus = "Open" | "Resolved" | "Dismissed";

export interface IReport extends Document {
  reporterId: mongoose.Types.ObjectId;
  targetType: ReportTargetType;
  targetId: mongoose.Types.ObjectId;
  reason: string;
  details?: string;
  status: ReportStatus;
  resolutionNote?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetType: {
      type: String,
      enum: ["product", "user"],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    details: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["Open", "Resolved", "Dismissed"],
      default: "Open",
      required: true,
    },
    resolutionNote: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ targetType: 1, targetId: 1 });

const Report = mongoose.model<IReport>("Report", reportSchema);

export default Report;
