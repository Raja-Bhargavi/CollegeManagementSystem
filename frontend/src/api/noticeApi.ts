
import api from "./axios";

export type ProgramLevel = "ALL" | "BTECH" | "MTECH";
export type DepartmentScope = "ALL" | "SELECTED";

export interface Notice {
  noticeId: number;
  title: string;
  content: string;
  createdBy: number;
  publishedAt?: string | null;
  expiryDate?: string | null;
  visibility: string;
  status: string;
  category?: string;
  programLevel?: ProgramLevel;
  departmentScope?: DepartmentScope;
  targetDepartmentIds?: number[];
  departmentId?: number | null;
}

export interface NoticeRequest {
  title: string;
  content: string;
  createdBy: number;
  publishedAt?: string | null;
  expiryDate?: string | null;
  visibility: string;
  status: string;
  category: string;
  programLevel: ProgramLevel;
  departmentScope: DepartmentScope;
  targetDepartmentIds: number[];
}

export interface DepartmentOption {
  departmentId: number;
  departmentCode: string;
  departmentName: string;
}

export const getNotices = async (): Promise<Notice[]> => {
  const response = await api.get("/api/notices");
  return response.data;
};

export const getNoticeById = async (
  noticeId: number
): Promise<Notice> => {
  const response = await api.get(`/api/notices/${noticeId}`);
  return response.data;
};

export const createNotice = async (
  data: NoticeRequest
): Promise<Notice> => {
  const response = await api.post("/api/notices", data);
  return response.data;
};

export const updateNotice = async (
  noticeId: number,
  data: NoticeRequest
): Promise<Notice> => {
  const response = await api.put(`/api/notices/${noticeId}`, data);
  return response.data;
};

export const deleteNotice = async (noticeId: number): Promise<void> => {
  await api.delete(`/api/notices/${noticeId}`);
};

export const getNoticesByVisibility = async (
  visibility: string
): Promise<Notice[]> => {
  const response = await api.get(
    `/api/notices/visibility/${visibility}`
  );
  return response.data;
};

export const getNoticesByStatus = async (
  status: string
): Promise<Notice[]> => {
  const response = await api.get(`/api/notices/status/${status}`);
  return response.data;
};

export const getPublicDepartments = async (): Promise<DepartmentOption[]> => {
  const response = await api.get("/api/public/departments");
  return response.data;
};
