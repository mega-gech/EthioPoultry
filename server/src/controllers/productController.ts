import type {Request, Response} from "express"
import mongoose from "mongoose"
import Product from "../models/Product.js"

export const getProducts = async (
    req: Request,
    res: Response
):Promise<void>=>{
    try {
        const products = await Product.find().populate("sellerId", "name phone").sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        })
    } catch (error) {
        console.log("get products error", error);

        res.status(500).json({
            success: true,
            message: "product retrive failed"
        })  
    }
};

export const getProductById = async(
    res:Response,
    req:Request
):Promise<void>=>{
    try {
        const {id} = req.params;

        if(!mongoose.isValidObjectId(id)){
            res.status(400).json({
                success: false,
                message: "invalid product id",
            });
            return;
        }

        const product = Product.findById(id).populate("sellerId", "name phone");

        if(!product){
            res.status(404).json({
                success: false,
                message: "product not found",
            });
            return
        }

        res.status(200).json({
            success: true,
            data: product,
        })
    } catch (error) {
        console.log("get product error", error);
        res.status(500).json({
            success: false,
            message: "failed to retrieve product"
        })
    }
};

export const createProduct = async(
    res:Response,
    req:Request,
):Promise<void>=>{
    try {
         const {
         name,
         description,
         price,
         quantity,
         category,
         image,
         images,
         location,
         sellerId,
         rating,
         reviews,
         status,
      } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      price === null ||
      !quantity ||
      !category ||
      !image ||
      !location ||
      !sellerId
    ){
        res.status(400).json({
            success: false,
            message: "please provide all required product fields"
        });
        return;
    }

    if(!mongoose.isValidObjectId(sellerId)){
        res.status(400).json({
            success: false,
            message: "invalid seller id"
        })
        return;
    }

    const product = await Product.create({
        name,
        description,
        price,
        quantity,
        category,
        image,
        images,
        location,
        sellerId,
        rating,
        reviews,
        status,
    })

    res.status(201).json({
        success: true,
        data: product
    })
    } catch (error) {
        console.log(" create product error", error)

        if(
            error instanceof mongoose.Error.ValidationError ||
            error instanceof mongoose.Error.CastError
        ){
            res.status(400).json({
                success: false,
                message: "invalid product data"
            })
            return
        }

        res.status(500).json({
            success: false,
            message:"create product error"
        })
    }
}

export const updateProduct = async(
    res:Response,
    req: Request
):Promise<void>=>{
    try {
        const {id} = req.params;

        if(!mongoose.isValidObjectId(id)){
            res.status(400).json({
                success: false,
                message: "invalid product id"
            })
            return
        }

        const product = await Product.findByIdAndUpdate(
            id,
            req.body,
            {
           new: true,
           runValidators: true
          }
        )

        if(!product){
            res.status(404).json({
                success: false,
                message: "product not found"
            })
            return
        }

        res.status(200).json({
            success:true,
            message: "product updated successfully",
            data: product
        })
    } catch (error) {
        console.log("update product error", error);
        res.status(500).json({
            success: false,
            message: "failed to update"
        })
    }
}

export const deleteProduct = async(
    res:Response,
    req:Request
):Promise<void>=>{
    try {
        const {id} = req.params;

        if(!mongoose.isValidObjectId(id)){
            res.status(400).json({
                success: false,
                message: "invalid product id"
            })
            return
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if(!deletedProduct){
            res.status(404).json({
                success: false,
                message: "product not found"
            })
            return
        }

        res.status(200).json({
            success: true,
            message: "product deleted successfully",
            data: deletedProduct
        })
    } catch (error) {
        console.log("delete product error", error)
        res.status(500).json({
            success: false,
            message: "failed to delete a product"
        })
    }
}