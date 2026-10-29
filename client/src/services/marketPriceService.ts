
import { API_URL } from "./sellerService";
import type { SellerProduct } from "./sellerService";


export interface MarketPriceRecord {
  _id: string;
  productName: string;
  category: "Eggs" | "Chickens" | "Equipment" | "Feed";
  price: number;
  unit: string;
  location: string;
  recordedAt: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

interface SellerPricesResponse {
  success: boolean;
  count: number;
  data: SellerProduct[];
  message?: string;
}

interface MarketPriceHistoryResponse {
  success: boolean;
  count: number;
  data: MarketPriceRecord[];
  message?: string;
}

export const getSellerPrices = async (): Promise<SellerProduct[]> => {
  const response = await fetch(`${API_URL}/market-prices/seller`);

  const result: SellerPricesResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch seller prices");
  }

  return result.data;
};

export const getMarketPriceHistory = async (
  category?: string,
  location?: string
): Promise<MarketPriceRecord[]> => {
  const params = new URLSearchParams();

  if (category && category !== "All") {
    params.append("category", category);
  }

  if (location && location !== "All") {
    params.append("location", location);
  }

  const query = params.toString();

  const url = query
    ? `${API_URL}/market-prices/history?${query}`
    : `${API_URL}/market-prices/history`;

  const response = await fetch(url);

  const result: MarketPriceHistoryResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Failed to fetch market price history"
    );
  }

  return result.data;
};