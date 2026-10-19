import type { Request, Response } from "express";
import mongoose from "mongoose";

import Product from "../models/Product.js";
import User from "../models/User.js"

export const getSellerProfile = async(
    req: Request,
    res: Response
): Promise<void>=>{
    try {
        const {id} = req.params;

        if(!mongoose.isValidObjectId(id)){
            res.status(400).json({
                success: true,
                message: "invalid seller id"
            })
            return
        }

        const seller = await User.findById(id).
        select("name role location phone createdAt").lean();

        if(!seller || seller.role !== "seller"){
            res.status(404).json({
                success: false,
                message: "seller not found"
            });
            return
        }

        const products = await Product.find({
            sellerId: seller._id
        }).select("-__").lean()

        res.status(200).json({
            success: true,
            data: {
                seller,
                products
            }
        })

    } catch (error) {
       console.log("seller not found") 
       res.status(200).json({
        success: false,
        message: "seller not found"
       })
    }
}