import api from "./axios";

export interface Notice {
  noticeId: number;
  title: string;
  content: string;
  createdBy: number;
  publishedAt?: string | null;
  expiryDate?: string | null;
  visibility: string;
  status: string;
}

export interface NoticeRequest {
  title: string;
  content: string;
  createdBy: number;
  publishedAt?: string | null;
  expiryDate?: string | null;
  visibility: string;
  status: string;
}

export const getNotices = async (): Promise<Notice[]> => {
  try {
    console.log("GET /notices");

    const response = await api.get("/notices");

    console.log("GET /notices response:", response);

    return response.data;
  } catch (error: any) {
    console.error(
      "GET /notices failed:",
      error?.response?.status,
      error?.response?.data,
      error
    );

    throw error;
  }
};

export const getNoticeById = async (
  noticeId: number
): Promise<Notice> => {
  const response = await api.get(`/notices/${noticeId}`);
  return response.data;
};

export const createNotice = async (
  data: NoticeRequest
): Promise<Notice> => {
  try {
    console.log("POST /notices payload:", data);

    const response = await api.post("/notices", data);

    console.log("POST /notices response:", response);

    return response.data;
  } catch (error: any) {
    console.error(
      "POST /notices failed:",
      error?.response?.status,
      error?.response?.data,
      error
    );

    throw error;
  }
};

export const updateNotice = async (
  noticeId: number,
  data: NoticeRequest
): Promise<Notice> => {
  const response = await api.put(
    `/notices/${noticeId}`,
    data
  );

  return response.data;
};

export const deleteNotice = async (
  noticeId: number
): Promise<void> => {
  await api.delete(`/notices/${noticeId}`);
};