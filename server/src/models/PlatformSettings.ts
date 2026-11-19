import mongoose, { Document, Schema, model } from "mongoose";

export interface IPlatformSettings extends Document {
  key: string;
  platformName: string;
  supportEmail: string;
  updatedBy?: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const platformSettingsSchema = new Schema<IPlatformSettings>(
  {
    key: { type: String, unique: true, default: "platform", required: true },
    platformName: {
      type: String,
      default: "EthioPoultry",
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    supportEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const PlatformSettings = model<IPlatformSettings>(
  "PlatformSettings",
  platformSettingsSchema
);

export default PlatformSettings;
