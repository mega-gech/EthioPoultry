import { Router } from "express";
import {
  deleteAdminProduct,
  getAdminOrder,
  getAdminOrders,
  getAdminOverview,
  getAdminProduct,
  getAdminProducts,
  getAdminSeller,
  getAdminSellers,
  getAdminUser,
  getAdminUsers,
  updateAdminProduct,
  updateAdminUser,
} from "../controllers/adminController.js";
import {
  getAdminMarketPrices,
  updateAdminMarketPrice,
} from "../controllers/adminMarketPriceController.js";
import {
  getAdminReports,
  updateAdminReport,
} from "../controllers/reportController.js";
import {
  getAdminSettings,
  updateAdminSettings,
} from "../controllers/adminSettingsController.js";
import { authMiddleWare, requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleWare, requireAdmin);

router.get("/overview", getAdminOverview);

router.get("/users", getAdminUsers);
router.get("/users/:id", getAdminUser);
router.patch("/users/:id", updateAdminUser);

router.get("/products", getAdminProducts);
router.get("/products/:id", getAdminProduct);
router.patch("/products/:id", updateAdminProduct);
router.delete("/products/:id", deleteAdminProduct);

router.get("/sellers", getAdminSellers);
router.get("/sellers/:id", getAdminSeller);

router.get("/orders", getAdminOrders);
router.get("/orders/:id", getAdminOrder);

router.get("/market-prices", getAdminMarketPrices);
router.patch("/market-prices/:id", updateAdminMarketPrice);

router.get("/reports", getAdminReports);
router.patch("/reports/:id", updateAdminReport);

router.get("/settings", getAdminSettings);
router.patch("/settings", updateAdminSettings);

export default router;
