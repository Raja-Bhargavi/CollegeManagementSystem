import api from "./axios";

export interface Payment {
  paymentId: number;
  feeId: number;
  amount: number;
  paymentDate?: string | null;
  paymentMethod: string;
  transactionReference: string;
  paymentStatus: string;
}

export interface PaymentRequest {
  feeId: number;
  amount: number;
  paymentMethod: string;
  transactionReference: string;
  paymentStatus: string;
}

// GET /api/payments
export const getPayments = async (): Promise<Payment[]> => {
  const response = await api.get("/api/payments");
  return response.data;
};

// GET /api/payments/{paymentId}
export const getPaymentById = async (
  paymentId: number
): Promise<Payment> => {
  const response = await api.get(
    `/api/payments/${paymentId}`
  );
  return response.data;
};

// GET /api/payments/fee/{feeId}
export const getPaymentsByFee = async (
  feeId: number
): Promise<Payment[]> => {
  const response = await api.get(
    `/api/payments/fee/${feeId}`
  );
  return response.data;
};

// GET /api/payments/status/{status}
export const getPaymentsByStatus = async (
  status: string
): Promise<Payment[]> => {
  const response = await api.get(
    `/api/payments/status/${status}`
  );
  return response.data;
};

// POST /api/payments
export const createPayment = async (
  data: PaymentRequest
): Promise<Payment> => {
  const response = await api.post(
    "/api/payments",
    data
  );

  return response.data;
};

// PUT /api/payments/{paymentId}
export const updatePayment = async (
  paymentId: number,
  data: PaymentRequest
): Promise<Payment> => {
  const response = await api.put(
    `/api/payments/${paymentId}`,
    data
  );

  return response.data;
};

// DELETE /api/payments/{paymentId}
export const deletePayment = async (
  paymentId: number
): Promise<void> => {
  await api.delete(`/api/payments/${paymentId}`);
};