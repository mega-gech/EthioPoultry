import express from "express";
import cors from "cors"
import connectDB from "./config/db.js";
import dotenv from "dotenv"
import productRoutes from "./routes/productRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import statisticsRoutes from "./routes/statisticsRoutes.js";
import marketPriceRoutes from "./routes/marketPriceRoutes.js";
import sellerOrderStatsRoutes from "./routes/sellerOrderStatsRoutes.js";
import buyerOrderStatusRoutes from "./routes/buyerOrderStatsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js";

import session from "express-session";
import passport from "passport";
import { configurePassport } from "./config/passport.js";

import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

configurePassport();

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  "/api/payments/chapa/webhook",
  express.raw({ type: "application/json" })
);

app.use(express.json({limit:"10mb"}))
app.use("/api/products", productRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/auth", authRoutes)
app.use("/api/statistics", statisticsRoutes);
app.use("/api/market-prices", marketPriceRoutes);
app.use("/api/seller-order-stats", sellerOrderStatsRoutes);
app.use("/api/orders", buyerOrderStatusRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);


const port = process.env.PORT

app.get("/api/health",(req, res)=>{
    res.status(200).json({
        
        succes:true,
        name:"enqulalie",
        time : new Date().toDateString()
    })
})

connectDB()

app.listen(port, ()=>{
    console.log(`server started;${port}`)
})