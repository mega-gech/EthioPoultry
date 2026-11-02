
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


export const cancelBuyerOrder = async (
  orderId: string
): Promise<BuyerOrder> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to cancel your order.");
  }

  const response = await fetch(
    `${API_URL}/orders/${orderId}/cancel`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result: {
    success: boolean;
    data: BuyerOrder;
    message?: string;
  } = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to cancel order.");
  }

  return result.data;
};


export interface CreateBuyerOrderResponse {
  success: boolean;
  message: string;
  data: BuyerOrder;
}

export const createBuyerOrder = async (
  productId: string,
  quantity: number
): Promise<BuyerOrder> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in before placing an order.");
  }

  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, quantity }),
  });

  const result: CreateBuyerOrderResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to place order.");
  }

  return result.data;
};

