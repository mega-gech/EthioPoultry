import { Router } from "express";
import { createReport } from "../controllers/reportController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleWare, createReport);

export default router;
