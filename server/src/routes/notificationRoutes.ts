import { Router } from "express";

import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";

import { authMiddleWare } from "../middleware/authMiddleware.js";

const router = Router();

// All notification routes require authentication
router.use(authMiddleWare);

// Get notifications
router.get("/", getMyNotifications);

// Get unread notification count
router.get("/unread-count", getUnreadCount);

// Mark all notifications as read
router.patch("/read-all", markAllAsRead);

// Mark one notification as read
router.patch("/:id/read", markAsRead);

export default router;