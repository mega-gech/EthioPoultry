import { Router } from "express";
import { getSellerProfile } from "../controllers/sellerController.js";

const router = Router()

router.get("/:id", getSellerProfile)

export default router