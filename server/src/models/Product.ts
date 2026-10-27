import mongoose , {Document, Schema} from "mongoose";

// Allowed product categories
export type ProductCategory =
  | "Eggs"
  | "Chickens"
  | "Equipment"
  | "Feed";

  // Allowed product availability statuses
  export type ProductStatus = "Active" | "Out of Stock";

  // TypeScript definition for a product
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  quantity: string;
  category: ProductCategory;
  image: string;
  images: string[];
  location: string;
  sellerId: mongoose.Types.ObjectId;
  rating: number;
  reviews: number;
  status: ProductStatus;
}
//schema
const productSchema = new Schema<IProduct>(
  {
    name: {
  type: String,
  required: true,
  trim: true,
  minlength: [2, "Product name must be at least 2 characters"],
  validate: {
    validator: (value: string) => value.trim().length > 0,
    message: "Product name cannot be empty",
  },
 },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0.01,
    },

   quantity: {
    type: String,
    required: true,
    trim: true,
    validate: {
    validator: (value: string) => value.trim().length > 0,
    message: "Quantity cannot be empty",
   },
  },

    category: {
      type: String,
      enum: ["Eggs", "Chickens", "Equipment", "Feed"],
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Out of Stock"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>(
    "Product",
    productSchema
)

export default Product;