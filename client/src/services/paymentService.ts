
const API_URL = "/api";

export type PaymentStatus =
  | "Pending"
  | "Successful"
  | "Failed"
  | "Refunded";

export type PaymentMethod =
  | "Simulated"
  | "Chapa"
  | "Telebirr";

  export interface ChapaInitializationResponse {
  payment: Payment;
  checkoutUrl: string;
}

export interface Payment {
  _id: string;
  orderId: string;
  buyerId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  transactionReference: string;
  status: PaymentStatus;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  data: Payment;
}

interface ChapaPaymentResponse {
  success: boolean;
  message: string;
  data: ChapaInitializationResponse;
}

interface PaymentsHistoryResponse {
  success: boolean;
  count: number;
  data: Payment[];
  message?: string;
}

export interface SimulatePaymentResponse {
  success: boolean;
  message: string;
  data: {
    payment: Payment;
    orderStatus: string;
  };
}

export interface ChapaVerificationResponse {
  success: boolean;
  message: string;
  data?: {
    payment: Payment;
    orderStatus: string;
  };
  payment?: Payment;
}

export const verifyChapaPayment = async (
  paymentId: string
): Promise<ChapaVerificationResponse> => {
  const response = await fetch(
    `${API_URL}/payments/chapa/verify/${paymentId}`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  const result: ChapaVerificationResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to verify Chapa payment");
  }

  return result;
};

// Create a payment for an existing order
export const createPayment = async (
  orderId: string
): Promise<Payment> => {
  const response = await fetch(`${API_URL}/payments/create`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderId }),
  });

  const result: PaymentResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to create payment");
  }

  return result.data;
};

// Simulate payment success or failure (development only)
export const simulatePayment = async (
  paymentId: string,
  result: "Successful" | "Failed"
): Promise<SimulatePaymentResponse["data"]> => {
  const response = await fetch(`${API_URL}/payments/simulate`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentId, result }),
  });

  const data: SimulatePaymentResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Payment processing failed");
  }

  return data.data;
};

// Get the authenticated buyer's payment history
export const getMyPayments = async (): Promise<Payment[]> => {
  const response = await fetch(`${API_URL}/payments/my-payments`, {
    method: "GET",
    credentials: "include",
  });

  const result: PaymentsHistoryResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch payment history");
  }

  return result.data;
};

export const initializeChapaPayment = async (
  orderId: string
): Promise<ChapaInitializationResponse> => {
  const response = await fetch(
    `${API_URL}/payments/chapa/initialize`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    }
  );

  const result : ChapaPaymentResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Failed to initialize Chapa payment"
    );
  }

  return result.data;
};
