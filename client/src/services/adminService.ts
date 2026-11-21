import { apiUrl } from "../config";

const API_URL = apiUrl("/api/admin");

export type AdminRole = "buyer" | "seller" | "admin";
export type AdminApprovalStatus = "Pending" | "Approved" | "Rejected";
export type AdminOrderStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";
export type AdminReportStatus = "Open" | "Resolved" | "Dismissed";
export type AdminCategory = "Eggs" | "Chickens" | "Equipment" | "Feed";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  phone?: string;
  location?: string;
  createdAt: string;
}

export interface AdminProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: string;
  stock: number;
  category: AdminCategory;
  image: string;
  images: string[];
  location: string;
  sellerId: AdminUser | string | null;
  status: "Active" | "Out of Stock";
  approvalStatus?: AdminApprovalStatus;
  createdAt: string;
}

export interface AdminSeller extends AdminUser {
  productCount: number;
}

export interface AdminSellerDetails {
  seller: AdminUser;
  products: AdminProduct[];
}

export interface AdminOrder {
  _id: string;
  buyerId: AdminUser | string;
  sellerId: AdminUser | string;
  items: { productId: string; name: string; price: number; quantity: number }[];
  totalAmount: number;
  status: AdminOrderStatus;
  createdAt: string;
}

export interface AdminMarketPrice {
  _id: string;
  productName: string;
  category: AdminCategory;
  price: number;
  unit: string;
  location: string;
  recordedAt: string;
  source?: string;
  status?: AdminApprovalStatus;
  submittedBy?: Pick<AdminUser, "_id" | "name" | "email">;
}

export interface AdminReport {
  _id: string;
  reporterId: Pick<AdminUser, "_id" | "name" | "email" | "role">;
  targetType: "product" | "user";
  targetId: string;
  target?: Record<string, unknown> | null;
  reason: string;
  details?: string;
  status: AdminReportStatus;
  resolutionNote?: string;
  createdAt: string;
}

export interface AdminPage<T> {
  data: T[];
  count: number;
  total: number;
  page: number;
  pages: number;
}

export interface AdminOverview {
  totals: {
    totalUsers: number;
    totalBuyers: number;
    totalSellers: number;
    totalProducts: number;
    activeProducts: number;
    pendingProductApprovals: number;
    totalOrders: number;
    completedOrders: number;
    pendingMarketPrices: number;
  };
  recentUsers: AdminUser[];
  recentOrders: AdminOrder[];
  activities: { type: string; description: string; createdAt: string }[];
  charts: {
    monthly: { month: string; users: number; orders: number }[];
    ordersByStatus: { status: AdminOrderStatus; count: number }[];
  };
}

async function request<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const result = (await response.json()) as {
    success: boolean;
    data: T;
    message?: string;
  };
  if (!response.ok || !result.success) {
    throw new Error(result.message || "The admin request failed.");
  }
  return result.data;
}

async function requestPage<T>(
  path: string
): Promise<AdminPage<T>> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
  });
  const result = (await response.json()) as {
    success: boolean;
    data: T[];
    count: number;
    total: number;
    page: number;
    pages: number;
    message?: string;
  };
  if (!response.ok || !result.success) {
    throw new Error(result.message || "The admin request failed.");
  }
  return {
    data: result.data,
    count: result.count,
    total: result.total,
    page: result.page,
    pages: result.pages,
  };
}

function queryString(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== "All") {
      query.set(key, String(value));
    }
  });
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

export const getAdminOverview = () =>
  request<AdminOverview>("/overview");

export const getAdminUsers = (params: Record<string, string | number>) =>
  requestPage<AdminUser>(`/users${queryString(params)}`);

export const getAdminUser = (id: string) =>
  request<AdminUser>(`/users/${id}`);

export const updateAdminUser = (
  id: string,
  data: { role?: AdminRole; isActive?: boolean }
) =>
  request<AdminUser>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const getAdminProducts = (params: Record<string, string | number>) =>
  requestPage<AdminProduct>(`/products${queryString(params)}`);

export const getAdminProduct = (id: string) =>
  request<AdminProduct>(`/products/${id}`);

export const updateAdminProduct = (
  id: string,
  data: Partial<AdminProduct>
) =>
  request<AdminProduct>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteAdminProduct = (id: string) =>
  request<{ message: string }>(`/products/${id}`, { method: "DELETE" });

export const getAdminSellers = (params: Record<string, string | number>) =>
  requestPage<AdminSeller>(`/sellers${queryString(params)}`);

export const getAdminSeller = (id: string) =>
  request<AdminSellerDetails>(`/sellers/${id}`);

export const getAdminOrders = (params: Record<string, string | number>) =>
  requestPage<AdminOrder>(`/orders${queryString(params)}`);

export const getAdminOrder = (id: string) =>
  request<AdminOrder>(`/orders/${id}`);

export const getAdminMarketPrices = (
  params: Record<string, string | number>
) =>
  requestPage<AdminMarketPrice>(
    `/market-prices${queryString(params)}`
  );

export const updateAdminMarketPrice = (
  id: string,
  data: Partial<AdminMarketPrice>
) =>
  request<AdminMarketPrice>(`/market-prices/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const getAdminReports = (params: Record<string, string | number>) =>
  requestPage<AdminReport>(`/reports${queryString(params)}`);

export const updateAdminReport = (
  id: string,
  data: { status: AdminReportStatus; resolutionNote?: string }
) =>
  request<AdminReport>(`/reports/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export interface AdminSettings {
  account: { name: string; email: string; phone: string; location: string };
  platform: { platformName: string; supportEmail: string };
}

export const getAdminSettings = () =>
  request<AdminSettings>("/settings");

export const updateAdminSettings = (data: {
  account?: Partial<AdminSettings["account"]>;
  platform?: Partial<AdminSettings["platform"]>;
  currentPassword?: string;
  newPassword?: string;
}) =>
  request<AdminSettings>("/settings", {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const createReport = (data: {
  targetType: "product" | "user";
  targetId: string;
  reason: string;
  details?: string;
}) =>
  fetch(apiUrl("/api/reports"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(async (response) => {
    const result = (await response.json()) as {
      success: boolean;
      message?: string;
    };
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to submit report.");
    }
  });
