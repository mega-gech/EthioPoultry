import type {Request, Response} from "express"
import mongoose from "mongoose"
import Product from "../models/Product.js"
import { notifyBuyersAboutProduct } from "../services/notificationService.js";

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
            success: false,
            message: "product retrive failed"
        })  
    }
};

export const getMyProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;


    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (req.user?.role !== "seller") {
      res.status(403).json({
      success: false,
      message: "Only sellers can access their products",
     });
     return;
    }

    const products = await Product.find({
      sellerId: userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("get my products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve your products",
    });
  }
};


export const getProductById = async(
    req:Request,
    res:Response
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

        const product = await Product.findById(id).populate("sellerId", "name phone");

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
    req:Request,
    res:Response
):Promise<void>=>{
    try {

        const userId = req.user?.userId;

      if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
     }

     if (req.user?.role !== "seller") {
        res.status(403).json({
        success: false,
        message: "Only sellers can create products",
    });
    return;
   }

         const {
         name,
         description,
         price,
         quantity,
         category,
         stock,
         image,
         images,
         location,
         rating,
      } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      price === null ||
      !quantity ||
      !Number.isSafeInteger(stock) || stock < 1 ||
      !category ||
      !image ||
      !location
    ){
        res.status(400).json({
            success: false,
            message: "please provide all required product fields"
        });
        return;
    }

    const product = await Product.create({
        name,
        description,
        price,
        quantity,
        category,
        stock,
        image,
        images,
        location,
        sellerId: userId,
        rating,
    })

    // Notify all buyers about the new product
try {
    await notifyBuyersAboutProduct({
        sellerId: userId,
        productId: product._id,
        productName: product.name,
        type: "new_product",
        eventId: product._id.toString(),
    });
} catch (notificationError) {
    console.error(
        "Product created, but notification delivery failed:",
        notificationError
    );
}

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
    req:Request,
    res:Response
):Promise<void>=>{
    try {
        const {id} = req.params;

        const userId = req.user?.userId;

        if (!userId) {
          res.status(401).json({
            success: false,
            message: "Authentication required",
            });
            return;
           }

        if(!mongoose.isValidObjectId(id)){
            res.status(400).json({
                success: false,
                message: "invalid product id"
            })
            return
        }

        const product = await Product.findById(id);

        if(!product){
            res.status(404).json({
                success: false,
                message: "product not found"
            })
            return
        }

        if (product.sellerId.toString() !== userId) {
           res.status(403).json({
           success: false,
           message: "You are not allowed to update this product",
         });
         return;
         }

         if (req.user?.role !== "seller") {
           res.status(403).json({
           success: false,
           message: "Only sellers can update products",
         });
           return;
        }
        
         const {
            name,
            description,
            price,
           quantity,
           category,
           stock,
           image,
           images,
           location,
           status,
       } = req.body;

       const importantFieldsChanged =
    (name !== undefined && product.name !== name) ||
    (price !== undefined && product.price !== price) ||
    (quantity !== undefined && product.quantity !== quantity) ||
    (stock !== undefined && product.stock !== stock);

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;
   

if (stock !== undefined) {
  if (!Number.isSafeInteger(stock) || stock < 0) {
    res.status(400).json({
      success: false,
      message: "Stock must be a non-negative whole number",
    });
    return;
  }

  product.stock = stock;
  product.status = stock === 0 ? "Out of Stock" : "Active";
}

if (category !== undefined) product.category = category;
if (image !== undefined) product.image = image;
if (images !== undefined) product.images = images;
if (location !== undefined) product.location = location;

// Stock determines availability when both are supplied.
if (status !== undefined && stock === undefined) {
  product.status = status;
}

    await product.save();

    // Notify all buyers about the product update

    if (importantFieldsChanged) {
    try {
        await notifyBuyersAboutProduct({
            sellerId: userId,
            productId: product._id,
            productName: product.name,
            type: "product_update",
            eventId: product.updatedAt.toISOString(),
        });
    } catch (notificationError) {
        console.error(
            "Product updated, but notification delivery failed:",
            notificationError
        );
    }
}


        res.status(200).json({
            success:true,
            message: "product updated successfully",
            data: product
        })
    } catch (error) {
        console.log("update product error", error);

        if (
           error instanceof mongoose.Error.ValidationError ||
           error instanceof mongoose.Error.CastError
          ) {
         res.status(400).json({
         success: false,
         message: "Invalid product data",
         });
        return;
        }

        res.status(500).json({
         success: false,
          message:
        error instanceof Error
            ? error.message
            : "Failed to update product"
    });
    }
}

export const deleteProduct = async(
    req:Request,
    res:Response
):Promise<void>=>{
    try {
        const {id} = req.params;
        const userId = req.user?.userId;
        
         if (!userId) {
           res.status(401).json({
          success: false,
          message: "Authentication required",
         });
         return;
        }

        if (req.user?.role !== "seller") {
           res.status(403).json({
           success: false,
          message: "Only sellers can delete products",
      });
       return;
     }

        if(!mongoose.isValidObjectId(id)){
            res.status(400).json({
                success: false,
                message: "invalid product id"
            })
            return
        }

        const deletedProduct = await Product.findById(id);

        if(!deletedProduct){
            res.status(404).json({
                success: false,
                message: "product not found"
            })
            return
        }

        if (deletedProduct.sellerId.toString() !== userId) {
         res.status(403).json({
         success: false,
         message: "You are not allowed to delete this product",
        });
        return;
        }

        await deletedProduct.deleteOne();

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