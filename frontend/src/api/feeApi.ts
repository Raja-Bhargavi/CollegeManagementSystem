import api from "./axios";

export interface Fee {
  feeId: number;
  studentId: number;
  semesterId: number;
  feeType: string;
  amount: number;
  dueDate: string;
  status: string;
}

export interface FeeRequest {
  studentId: number;
  semesterId: number;
  feeType: string;
  amount: number;
  dueDate: string;
  status: string;
}

// GET /api/fees
export const getFees = async (): Promise<Fee[]> => {
  const response = await api.get("/api/fees");
  return response.data;
};

// GET /api/fees/{feeId}
export const getFeeById = async (
  feeId: number
): Promise<Fee> => {
  const response = await api.get(`/api/fees/${feeId}`);
  return response.data;
};

// GET /api/fees/student/{studentId}
export const getFeesByStudent = async (
  studentId: number
): Promise<Fee[]> => {
  const response = await api.get(
    `/api/fees/student/${studentId}`
  );
  return response.data;
};

// GET /api/fees/semester/{semesterId}
export const getFeesBySemester = async (
  semesterId: number
): Promise<Fee[]> => {
  const response = await api.get(
    `/api/fees/semester/${semesterId}`
  );
  return response.data;
};

// GET /api/fees/status/{status}
export const getFeesByStatus = async (
  status: string
): Promise<Fee[]> => {
  const response = await api.get(
    `/api/fees/status/${status}`
  );
  return response.data;
};

// POST /api/fees
export const createFee = async (
  data: FeeRequest
): Promise<Fee> => {
  const response = await api.post(
    "/api/fees",
    data
  );
  return response.data;
};

// PUT /api/fees/{feeId}
export const updateFee = async (
  feeId: number,
  data: FeeRequest
): Promise<Fee> => {
  const response = await api.put(
    `/api/fees/${feeId}`,
    data
  );
  return response.data;
};

// DELETE /api/fees/{feeId}
export const deleteFee = async (
  feeId: number
): Promise<void> => {
  await api.delete(`/api/fees/${feeId}`);
};