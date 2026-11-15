
import { Router } from "express";
import {
    register,
    login,
    createToken,
    setAuthCookie,
    getMe,
    logout
} from "../controllers/authController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import passport from "passport";

const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleWare, getMe);
router.post("/logout", logout);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${frontendUrl}/login`,
    session: false,
  }),
  (req, res) => {
    if (!req.user) {
      res.redirect(`${frontendUrl}/login`);
      return;
    }

    const token = createToken(req.user.userId);

    setAuthCookie(res, token);

    res.redirect(`${frontendUrl}/auth/google/callback`);
  }
);

export default router;
