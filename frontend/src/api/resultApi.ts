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

export const getResults = async (): Promise<Result[]> => {
  const response = await api.get("/results");
  return response.data;
};

export const getResultById = async (resultId: number): Promise<Result> => {
  const response = await api.get(`/results/${resultId}`);
  return response.data;
};

export const getResultsByStudent = async (
  studentId: number
): Promise<Result[]> => {
  const response = await api.get(`/results/student/${studentId}`);
  return response.data;
};

export const getResultsBySemester = async (
  semesterId: number
): Promise<Result[]> => {
  const response = await api.get(`/results/semester/${semesterId}`);
  return response.data;
};

export const publishResult = async (
  data: ResultRequest
): Promise<string> => {
  const response = await api.post("/results/publish", data);
  return response.data;
};

export const updateResult = async (
  resultId: number,
  data: ResultRequest
): Promise<Result> => {
  const response = await api.put(`/results/${resultId}`, data);
  return response.data;
};

export const deleteResult = async (resultId: number): Promise<void> => {
  await api.delete(`/results/${resultId}`);
};