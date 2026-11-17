import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import statisticsRoutes from "./routes/statisticsRoutes.js";
import marketPriceRoutes from "./routes/marketPriceRoutes.js";
import sellerOrderStatsRoutes from "./routes/sellerOrderStatsRoutes.js";
import buyerOrderStatusRoutes from "./routes/buyerOrderStatsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import Payment from "./models/Payment.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { configurePassport } from "./config/passport.js";

import cookieParser from "cookie-parser";
import mongoose from "mongoose";

dotenv.config();

const app = express();
if (process.env.NODE_ENV === "production" && !process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL is required in production");
}

const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
const allowedOrigins = new Set([frontendUrl]);
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.add("http://localhost:5173");
  allowedOrigins.add("http://127.0.0.1:5173");
}
const sessionSecret = process.env.SESSION_SECRET;
const mongoUri = process.env.MONGO_URI;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET is required");
}

if (!mongoUri) {
  throw new Error("MONGO_URI is required");
}

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

configurePassport();

app.use(
  session({
    secret: sessionSecret,
    store: MongoStore.create({
      mongoUrl: mongoUri,
      collectionName: "sessions",
      ttl: 24 * 60 * 60,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  "/api/payments/chapa/webhook",
  express.raw({ type: "application/json" })
);

app.use(express.json({ limit: "10mb" }));
app.use("/api/products", productRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/market-prices", marketPriceRoutes);
app.use("/api/seller-order-stats", sellerOrderStatsRoutes);
app.use("/api/orders", buyerOrderStatusRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/favorites", favoriteRoutes);

const port = process.env.PORT?.trim() ? Number(process.env.PORT) : 5000;

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    name: "enqulalie",
    time: new Date().toISOString(),
  });
});

await connectDB();
await Payment.createIndexes();

const server = app.listen(port, () => {
  console.log(`server started;${port}`);
});

server.on("error", (error) => {
  console.error(`Failed to start server on port ${port}:`, error);
  void mongoose
    .disconnect()
    .catch((disconnectError) => {
      console.error(
        "Failed to close MongoDB after server startup error:",
        disconnectError,
      );
    })
    .finally(() => process.exit(1));
});