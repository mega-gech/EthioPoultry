

const API_URL = "http://localhost:5000/api";

export interface Seller {
  _id: string;
  name: string;
  role: "seller";
  location?: string;
  phone?: string;
  createdAt: string;
}

export interface ProductSeller {
  _id: string;
  name: string;
  phone?: string;
}

export interface SellerProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: string;
  category: "Eggs" | "Chickens" | "Equipment" | "Feed";
  image: string;
  images: string[];
  location: string;
  sellerId: string | ProductSeller | null;
  rating: number;
  reviews: number;
  status: "Active" | "Out of Stock";
}

interface SellerProfileResponse {
    success: boolean;
    data:{
        seller: Seller;
        products: SellerProduct[];
    };
    message?: string;
}

export async function getSellerProfile(
    sellerId:string):Promise<SellerProfileResponse["data"]>{
        const response = await fetch(`${API_URL}/sellers/${sellerId}`);

        const result: SellerProfileResponse = await response.json();

        if(!response.ok || !result.success){
            throw new Error("failed to fatch seller profile");
        };
        return result.data;
}

export async function getProductById(id: string):Promise<SellerProduct> {
    const response = await fetch(`${API_URL}/products/${id}`);
    const result:{
        success: boolean,
        data: SellerProduct,
        message?: string
    } = await response.json()
    if(!response.ok || !result.success){
            throw new Error("failed to fatch a product");
        };
        return result.data;
}

export async function getProducts():Promise<SellerProduct[]> {
    const response = await fetch(`${API_URL}/products`);
    const result:{
        success: boolean,
         count?: number,
        data: SellerProduct[],
        message?: string
    } = await response.json()

    if(!response.ok || !result.success){
            throw new Error(result.message || "Failed to fetch products");
        };
        return result.data;
}
