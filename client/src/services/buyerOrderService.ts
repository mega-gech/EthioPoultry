
const API_URL = "http://localhost:5000/api";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Seller {
  _id: string;
  name: string;
  location?: string;
  phone?: string;
}

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export interface BuyerOrder {
  _id: string;
  buyerId: string;
  sellerId: Seller | string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

interface BuyerOrdersResponse {
  success: boolean;
  count: number;
  data: BuyerOrder[];
  message?: string;
}

export const getBuyerOrders = async (): Promise<BuyerOrder[]> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to view your orders.");
  }

  const response = await fetch(`${API_URL}/orders/my-orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result: BuyerOrdersResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch buyer orders.");
  }

  return result.data;
};
