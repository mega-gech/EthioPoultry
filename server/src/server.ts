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

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({limit:"10mb"}))
app.use("/api/products", productRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/auth", authRoutes)
app.use("/api/statistics", statisticsRoutes);
app.use("/api/market-prices", marketPriceRoutes);
app.use("/api/seller-order-stats", sellerOrderStatsRoutes);


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