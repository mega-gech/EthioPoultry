import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
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

    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer")){
        res.status(401).json({
            success: false,
            message: "access denied or no token provided"
        })
        return
    }

     const token = authHeader.split(" ")[1];

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

  req.user = {
  userId: payload.userId,
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