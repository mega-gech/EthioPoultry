import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string,
         role: "buyer" | "seller" | "admin";
      };
    }
  }
}

interface TokenPayload {
  userId: string;
}

export const authMiddleWare = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {

     const token = req.cookies.token;

if (!token) {
  res.status(401).json({
    success: false,
    message: "Access denied. No authentication cookie provided.",
  });
  return;
}

     const secret = process.env.JWT_SECRET;

      if (!secret) {
     res.status(500).json({
      success: false,
      message: "Server configuration error.",
      });
    return;
     }

     try {
        const decoded = jwt.verify(token, secret)

    if (typeof decoded === "string" || !("userId" in decoded)) {
      res.status(401).json({
        success: false,
        message: "Invalid token payload.",
     });
     return;
     }

  const payload = decoded as TokenPayload;

  const user = await User.findById(payload.userId).select("_id role");

   if (!user) {
      res.status(401).json({
      success: false,
      message: "User account not found",
     });
     return;
   }

   req.user = {
     userId: user._id.toString(),
     role: user.role,
   };

  next();

    } catch (error) {
        res.status(401).json({
            success: false,
            message: "invalid tokken or expired"
        })
        return
    }
}