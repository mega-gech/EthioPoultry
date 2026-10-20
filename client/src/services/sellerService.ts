

const API_URL = "http://localhost:5000/api";

export interface Seller {
  _id: string;
  name: string;
  role: "seller";
  location?: string;
  phone?: string;
  createdAt: string;
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
  sellerId: string;
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

