export const API_URL = "http://localhost:5000/api";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to continue");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

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
  createdAt?: string;
}

interface SellerProfileResponse {
    success: boolean;
    data:{
        seller: Seller;
        products: SellerProduct[];
    };
    message?: string;
}

export interface MarketplaceStatistics {
  registeredFarmers: number;
  availableProducts: number;
  successfulConnections: number;
  coveredLocations: number;
}

export interface SellerOrderStats {
  orderCount: number;
  totalSales: number;
}

export async function getSellerOrderStats(): Promise<SellerOrderStats> {
  const response = await fetch(`${API_URL}/seller-order-stats`, {
    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Failed to fetch seller order statistics"
    );
  }

  return result.data;
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

export async function getStatistics(): Promise<MarketplaceStatistics> {
  const response = await fetch(`${API_URL}/statistics`);

  const result: {
    success: boolean;
    data: MarketplaceStatistics;
    message?: string;
  } = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch statistics");
  }

  return result.data;
}

export async function getMyProducts(): Promise<SellerProduct[]> {
  const response = await fetch(`${API_URL}/products/mine`, {
    headers:getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch your products");
  }

  return result.data;
}

export async function createProduct(productData:CreateProductData) {
    const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
     ...getAuthHeaders(),
  "Content-Type": "application/json",
},
        body: JSON.stringify(productData)
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
    headers: getAuthHeaders(),  
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
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    }, 
    body: JSON.stringify(productData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update product");
  }

  return result;
}

