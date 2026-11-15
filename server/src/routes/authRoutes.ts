
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
  (req, res, next) => {
    const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

    passport.authenticate("google", { session: false }, (error, user) => {
      if (error) {
        next(error);
        return;
      }

      if (
        !user ||
        typeof user !== "object" ||
        !("userId" in user) ||
        typeof user.userId !== "string"
      ) {
        res.redirect(`${frontendUrl}/login`);
        return;
      }

      const token = createToken(user.userId);
      setAuthCookie(res, token);
      res.redirect(`${frontendUrl}/auth/google/callback`);
    })(req, res, next);
  }
);

export default router;
