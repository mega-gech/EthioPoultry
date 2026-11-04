
import { Router } from "express";
import {
    register,
    login
} from "../controllers/authController.js";
import passport from "passport";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: false,
  }),
  (req, res) => {
    // Handle successful Google authentication here
  }
);

export default router;
