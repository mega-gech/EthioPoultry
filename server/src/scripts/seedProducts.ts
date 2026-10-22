import mongoose from "mongoose";
import dotenv from "dotenv";
import  bcrypt from "bcryptjs"

import Product from "../models/Product.js";
import User  from  "../models/User.js";

dotenv.config()
6
const sampleProducts = [
     {
    name: "Fresh Eggs (30 pcs)",
    description: "Fresh farm-produced eggs, carefully collected and packed.",
    price: 240,
    quantity: "30 pcs",
    category: "Eggs" as const,
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80",
    images: [],
    location: "Addis Ababa",
    rating: 4.8,
    reviews: 24,
    status: "Active" as const,
  },
  {
    name: "Brown Layer Chicken",
    description: "Healthy brown layer chicken suitable for egg production.",
    price: 850,
    quantity: "1 chicken",
    category: "Chickens",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80",
    images: [],
    location: "Addis Ababa",
    rating: 4.8,
    reviews: 24,
    status: "Active" as const,
  },
  {
    name: "Poultry Feed (25 kg)",
    description: "Balanced poultry feed for healthy chicken growth.",
    price: 1200,
    quantity: "25 kg",
    category: "Feed",
    image: "https://images.unsplash.com/photo-1569466593977-94ee7ed02ec9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    images: [],
    location: "Bahir Dar",
    rating: 4.8,
    reviews: 24,
    status: "Active" as const,
  },
  {
    name: "Poultry Waterer",
    description: "Practical water dispenser for small poultry farms.",
    price: 450,
    quantity: "1 piece",
    category: "Equipment",
    image: "https://images.unsplash.com/photo-1778715684164-53d224e872b5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    images: [],
    location: "Addis Ababa",
    rating: 4.8,
    reviews: 24,
    status: "Active" as const,
  },
];

async function seedProducts(): Promise<void> {
    try {
        const mongoURI =  process.env.MONGO_URI;
        const sellerEmail = process.env.SAMPLE_SELLER_EMAIL?.trim().toLowerCase();
        const sellerPassword = process.env.SAMPLE_SELLER_PASSWORD;

        if(!mongoURI){
             throw new Error("MONGO_URI misssing from env");
        }

        if(!sellerEmail || !sellerPassword){
            throw new Error(
                 "Set SAMPLE_SELLER_EMAIL and SAMPLE_SELLER_PASSWORD in .env"
                )
        }

        if (sellerPassword.length < 4) {
            throw new Error(
              "Use a sample seller password with at least 4 characters"
            );
        }

        await mongoose.connect(mongoURI)
        console.log("mongo connected")

        let seller = await User.findOne({email: sellerEmail});

        if (seller) {
          if (seller.role !== "seller") {
          throw new Error(
          "That email already belongs to a non-seller account. " +
          "Choose a different SAMPLE_SELLER_EMAIL."
         );
        }
         console.log("Existing sample seller found; reusing the account.");
    }else{
        const hashedPassword = await bcrypt.hash(sellerPassword, 4);

        seller = await User.create({
        name: "Abebe Poultry Farm",
        email: sellerEmail,
        password: hashedPassword,
        role: "seller",
        location: "Addis Ababa",
        phone: "0912345678",
      });
      console.log("Sample seller created successfully.");
    }
    
    console.log("Seller MongoDB ID:", seller._id.toString());

    for (const product of sampleProducts){
        await Product.updateOne(
            {name: product.name},
            {
                $set:{
                    ...product,
                    sellerId: seller._id,
                },
            },
            {upsert: true}
        );
        console.log(`Product seeded: ${product.name}`);
    }

    const linkedProducts = await Product.find({
        sellerId: seller._id,
    }).select("name sellerId").lean()

     console.log("\nSeller verification:");
     console.log("Seller:", seller.name);
     console.log("Seller ID:", seller._id.toString());
     console.log("Linked products:", linkedProducts.length);

     for (const product of linkedProducts){
         console.log(
        `- ${product.name} | sellerId: ${product.sellerId.toString()}`
      );
     }
     console.log("\nDatabase seeding completed.");
     
    } catch (error) {
        console.log("insertion error")
        process.exitCode=1
    } finally{
        mongoose.disconnect()
    }
}

seedProducts()
