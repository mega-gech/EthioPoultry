import { API_URL, type SellerProduct } from "./sellerService";

type FavoritesResponse = {
  success: boolean;
  count?: number;
  data: SellerProduct[];
  message?: string;
};

type FavoriteMutationResponse = {
  success: boolean;
  message?: string;
};

export async function getMyFavorites(): Promise<SellerProduct[]> {
  const response = await fetch(`${API_URL}/favorites`, {
    credentials: "include",
  });
  const result: FavoritesResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch favorites");
  }

  return result.data;
}

async function updateFavorite(
  productId: string,
  method: "POST" | "DELETE",
): Promise<void> {
  const response = await fetch(
    `${API_URL}/favorites/${encodeURIComponent(productId)}`,
    {
      method,
      credentials: "include",
    },
  );
  const result: FavoriteMutationResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update favorites");
  }
}

export function addFavorite(productId: string): Promise<void> {
  return updateFavorite(productId, "POST");
}

export function removeFavorite(productId: string): Promise<void> {
  return updateFavorite(productId, "DELETE");
}
