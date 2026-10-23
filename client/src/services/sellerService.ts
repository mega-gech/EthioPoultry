

export const API_URL = "http://localhost:5000/api";
const DEV_SELLER_ID = "6ad64a630ce00a62094a96d9";

export interface Seller {
  _id: string;
  name: string;
  role: "seller";
  location?: string;
  phone?: string;
  createdAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  quantity: string;
  category: "Eggs" | "Chickens" | "Equipment" | "Feed";
  image: string;
  images: string[];
  location: string;
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

export async function createProduct(productData:CreateProductData) {
    const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...productData,
            sellerId: DEV_SELLER_ID,
        })
    });

    const result = await response.json();

    if(!response.ok){
        throw new Error(result.message || "Failed to create product");
    }
    return result
}


export async function deleteProductById(id: string) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to delete product"
    );
  }

  return result;
}

export async function updateProductById(
  id: string,
  productData: {
    name: string;
    description: string;
    price: number;
    quantity: string;
    category: "Eggs" | "Chickens" | "Equipment" | "Feed";
    image: string;
    images: string[];
    location: string;
    status: "Active" | "Out of Stock";
  }
) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update product");
  }

  return result;
}

