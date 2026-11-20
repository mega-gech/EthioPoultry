import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import PlatformSettings from "../models/PlatformSettings.js";
import User from "../models/User.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getAdminSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [admin, settings] = await Promise.all([
      User.findById(req.user?.userId).select("name email phone location role"),
      PlatformSettings.findOne({ key: "platform" }).lean(),
    ]);
    if (!admin || admin.role !== "admin") {
      res.status(404).json({ success: false, message: "Admin account not found." });
      return;
    }
    res.status(200).json({
      success: true,
      data: {
        account: {
          name: admin.name,
          email: admin.email,
          phone: admin.phone ?? "",
          location: admin.location ?? "",
        },
        platform: {
          platformName: settings?.platformName ?? "EthioPoultry",
          supportEmail: settings?.supportEmail ?? "",
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch admin settings:", error);
    res.status(500).json({ success: false, message: "Failed to fetch admin settings." });
  }
};

export const updateAdminSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    res.status(400).json({ success: false, message: "Invalid admin settings data." });
    return;
  }
  const {
    account,
    platform,
    currentPassword,
    newPassword,
  } = req.body as {
    account?: {
      name?: unknown;
      email?: unknown;
      phone?: unknown;
      location?: unknown;
    };
    platform?: { platformName?: unknown; supportEmail?: unknown };
    currentPassword?: unknown;
    newPassword?: unknown;
  };

  if (
    account !== undefined &&
    (typeof account !== "object" ||
      account === null ||
      Array.isArray(account) ||
      (account.name !== undefined &&
        (typeof account.name !== "string" || !account.name.trim())) ||
      (account.email !== undefined &&
        (typeof account.email !== "string" ||
          !emailPattern.test(account.email.trim()))) ||
      (account.phone !== undefined && typeof account.phone !== "string") ||
      (account.location !== undefined && typeof account.location !== "string"))
  ) {
    res.status(400).json({ success: false, message: "Invalid admin account details." });
    return;
  }
  if (
    platform !== undefined &&
    (typeof platform !== "object" ||
      platform === null ||
      Array.isArray(platform) ||
      (platform.platformName !== undefined &&
        (typeof platform.platformName !== "string" ||
          platform.platformName.trim().length < 2 ||
          platform.platformName.trim().length > 80)) ||
      (platform.supportEmail !== undefined &&
        (typeof platform.supportEmail !== "string" ||
          platform.supportEmail.trim().length > 254 ||
          (platform.supportEmail.trim() !== "" &&
            !emailPattern.test(platform.supportEmail.trim())))))
  ) {
    res.status(400).json({ success: false, message: "Invalid platform settings." });
    return;
  }
  const changingPassword = currentPassword !== undefined || newPassword !== undefined;
  if (
    (changingPassword &&
      (typeof newPassword !== "string" || newPassword.length < 8)) ||
    ((currentPassword !== undefined || newPassword !== undefined) &&
      currentPassword !== undefined &&
      typeof currentPassword !== "string")
  ) {
    res.status(400).json({ success: false, message: "New password must be at least 8 characters." });
    return;
  }
  if (
    account === undefined &&
    platform === undefined &&
    !changingPassword
  ) {
    res.status(400).json({ success: false, message: "No settings were provided." });
    return;
  }

  try {
    const admin = await User.findById(req.user?.userId).select("+password");
    if (!admin || admin.role !== "admin") {
      res.status(404).json({ success: false, message: "Admin account not found." });
      return;
    }
    if (account) {
      if (typeof account.name === "string") admin.name = account.name.trim();
      if (typeof account.email === "string") admin.email = account.email.trim().toLowerCase();
      if (typeof account.phone === "string") admin.phone = account.phone.trim();
      if (typeof account.location === "string") admin.location = account.location.trim();
    }
    if (changingPassword) {
      if (
        admin.password &&
        (typeof currentPassword !== "string" ||
          !(await bcrypt.compare(currentPassword, admin.password)))
      ) {
        res.status(400).json({ success: false, message: "Current password is incorrect." });
        return;
      }
      admin.password = await bcrypt.hash(newPassword as string, 12);
    }
    await admin.save();

    let updatedPlatform = await PlatformSettings.findOne({ key: "platform" });
    if (platform) {
      updatedPlatform ??= new PlatformSettings({ key: "platform" });
      if (typeof platform.platformName === "string") {
        updatedPlatform.platformName = platform.platformName.trim();
      }
      if (typeof platform.supportEmail === "string") {
        updatedPlatform.supportEmail = platform.supportEmail.trim().toLowerCase();
      }
      updatedPlatform.updatedBy = new mongoose.Types.ObjectId(admin._id.toString());
      await updatedPlatform.save();
    }

    res.status(200).json({
      success: true,
      message: "Admin settings updated.",
      data: {
        account: {
          name: admin.name,
          email: admin.email,
          phone: admin.phone ?? "",
          location: admin.location ?? "",
        },
        platform: {
          platformName: updatedPlatform?.platformName ?? "EthioPoultry",
          supportEmail: updatedPlatform?.supportEmail ?? "",
        },
      },
    });
  } catch (error) {
    console.error("Failed to update admin settings:", error);
    if (
      error instanceof mongoose.Error.ValidationError ||
      (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000)
    ) {
      res.status(409).json({
        success: false,
        message:
          "The email is already in use or the provided settings are invalid.",
      });
      return;
    }
    res.status(500).json({ success: false, message: "Failed to update admin settings." });
  }
};
