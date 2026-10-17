import express from "express";
import cors from "cors"
import connectDB from "./config/db.js";
import dotenv from "dotenv"

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json())

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