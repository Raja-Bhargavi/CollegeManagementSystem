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
    console.log("GET /api/notices");

    const response = await api.get("/api/notices");

    console.log("GET /api/notices response:", response);

    return response.data;
  } catch (error: any) {
    console.error(
      "GET /api/notices failed:",
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
  const response = await api.get(
    `/api/notices/${noticeId}`
  );

  return response.data;
};

export const createNotice = async (
  data: NoticeRequest
): Promise<Notice> => {
  try {
    console.log("POST /api/notices payload:", data);

    const response = await api.post(
      "/api/notices",
      data
    );

    console.log(
      "POST /api/notices response:",
      response
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "POST /api/notices failed:",
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
    `/api/notices/${noticeId}`,
    data
  );

  return response.data;
};

export const deleteNotice = async (
  noticeId: number
): Promise<void> => {
  await api.delete(
    `/api/notices/${noticeId}`
  );
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
  const response = await api.get(
    `/api/notices/status/${status}`
  );

  return response.data;
};