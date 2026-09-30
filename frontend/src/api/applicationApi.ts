import api from "./axios";

export interface Application {
  applicationId: number;
  applicantUserId: number;
  applicationType: string;
  subject: string;
  description: string;
  submittedAt?: string | null;
  status: string;
}

export interface ApplicationRequest {
  applicantUserId: number;
  applicationType: string;
  subject: string;
  description: string;
}

export interface ApplicationStatusRequest {
  status: string;
}

// GET /api/applications
export const getApplications = async (): Promise<Application[]> => {
  const response = await api.get("/api/applications");
  return response.data;
};

// GET /api/applications/{applicationId}
export const getApplicationById = async (
  applicationId: number
): Promise<Application> => {
  const response = await api.get(
    `/api/applications/${applicationId}`
  );
  return response.data;
};

// GET /api/applications/user/{userId}
export const getApplicationsByUser = async (
  userId: number
): Promise<Application[]> => {
  const response = await api.get(
    `/api/applications/user/${userId}`
  );
  return response.data;
};

// GET /api/applications/status/{status}
export const getApplicationsByStatus = async (
  status: string
): Promise<Application[]> => {
  const response = await api.get(
    `/api/applications/status/${status}`
  );
  return response.data;
};

// POST /api/applications
export const createApplication = async (
  data: ApplicationRequest
): Promise<Application> => {
  const response = await api.post(
    "/api/applications",
    data
  );

  return response.data;
};

// PUT /api/applications/{applicationId}
export const updateApplication = async (
  applicationId: number,
  data: ApplicationRequest
): Promise<Application> => {
  const response = await api.put(
    `/api/applications/${applicationId}`,
    data
  );

  return response.data;
};

// PUT /api/applications/{applicationId}/status
export const updateApplicationStatus = async (
  applicationId: number,
  data: ApplicationStatusRequest
): Promise<Application> => {
  const response = await api.put(
    `/api/applications/${applicationId}/status`,
    data
  );

  return response.data;
};

// DELETE /api/applications/{applicationId}
export const deleteApplication = async (
  applicationId: number
): Promise<void> => {
  await api.delete(`/api/applications/${applicationId}`);
};