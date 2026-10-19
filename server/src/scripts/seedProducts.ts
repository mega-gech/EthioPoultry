import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js"
import { error } from "node:console";

dotenv.config()

const sampleProducts = [
     {
    name: "Fresh Eggs (30 pcs)",
    description: "Fresh farm-produced eggs, carefully collected and packed.",
    price: 240,
    quantity: "30 pcs",
    category: "Eggs",
    image: "https://placehold.co/600x400?text=Fresh+Eggs",
    images: [],
    location: "Addis Ababa",
    sellerId: "68f000000000000000000001",
  },
  {
    name: "Brown Layer Chicken",
    description: "Healthy brown layer chicken suitable for egg production.",
    price: 850,
    quantity: "1 chicken",
    category: "Chickens",
    image: "https://placehold.co/600x400?text=Brown+Chicken",
    images: [],
    location: "Addis Ababa",
    sellerId: "68f000000000000000000001",
  },
  {
    name: "Poultry Feed (25 kg)",
    description: "Balanced poultry feed for healthy chicken growth.",
    price: 1200,
    quantity: "25 kg",
    category: "Feed",
    image: "https://placehold.co/600x400?text=Poultry+Feed",
    images: [],
    location: "Bahir Dar",
    sellerId: "68f000000000000000000001",
  },
  {
    name: "Poultry Waterer",
    description: "Practical water dispenser for small poultry farms.",
    price: 450,
    quantity: "1 piece",
    category: "Equipment",
    image: "https://placehold.co/600x400?text=Poultry+Waterer",
    images: [],
    location: "Addis Ababa",
    sellerId: "68f000000000000000000001",
  },
];

async function seedProducts() {
    try {
        const mongoURI =  process.env.MONGO_URI;
        if(!mongoURI){
             throw new Error("MONGO_URI misssing from env");
        }

        await mongoose.connect(mongoURI)
        console.log("mongo connected")

        await Product.deleteMany({
            name: {$in : sampleProducts.map((product)=>product.name) }
        })

        await Product.insertMany(sampleProducts)
        console.log("inserted seccessfully")

    } catch (error) {
        console.log("insertion error")
        process.exitCode=1
    } finally{
        mongoose.disconnect()
    }
}

seedProducts()
