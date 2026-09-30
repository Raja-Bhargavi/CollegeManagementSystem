import api from "./axios";

export interface Result {
  resultId: number;
  studentId: number;
  semesterId: number;
  sgpa: number;
  cgpa: number;
  resultStatus: string;
  publishedAt?: string | null;
}

export interface ResultRequest {
  studentId: number;
  semesterId: number;
  sgpa: number;
  cgpa: number;
}

// GET /api/results
export const getResults = async (): Promise<Result[]> => {
  const response = await api.get("/api/results");
  return response.data;
};

// GET /api/results/{resultId}
export const getResultById = async (
  resultId: number
): Promise<Result> => {
  const response = await api.get(`/api/results/${resultId}`);
  return response.data;
};

// GET /api/results/student/{studentId}
export const getResultsByStudent = async (
  studentId: number
): Promise<Result[]> => {
  const response = await api.get(
    `/api/results/student/${studentId}`
  );
  return response.data;
};

// GET /api/results/semester/{semesterId}
export const getResultsBySemester = async (
  semesterId: number
): Promise<Result[]> => {
  const response = await api.get(
    `/api/results/semester/${semesterId}`
  );
  return response.data;
};

// POST /api/results/publish
export const publishResult = async (
  data: ResultRequest
): Promise<string> => {
  const response = await api.post(
    "/api/results/publish",
    data
  );

  return response.data;
};

// PUT /api/results/{resultId}
export const updateResult = async (
  resultId: number,
  data: ResultRequest
): Promise<Result> => {
  const response = await api.put(
    `/api/results/${resultId}`,
    data
  );

  return response.data;
};

// DELETE /api/results/{resultId}
export const deleteResult = async (
  resultId: number
): Promise<void> => {
  await api.delete(`/api/results/${resultId}`);
};