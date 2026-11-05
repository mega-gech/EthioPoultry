
import { Router } from "express";
import {
    register,
    login,
    createToken,
    setAuthCookie,
    getMe
} from "../controllers/authController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import passport from "passport";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleWare, getMe);

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
   if (!req.user) {
    res.redirect("http://localhost:5173/login");
    return;
  }

  const token = createToken(req.user.userId);

  setAuthCookie(res, token);

  res.redirect("http://localhost:5173/auth/google/callback");
}
);

export default router;
