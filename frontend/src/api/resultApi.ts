import api from "./axios";

export interface Result {
    resultId: number;
    studentId: number;
    studentName?: string;
    semesterId: number;
    sgpa: number;
    cgpa: number;
    resultStatus: string;
    publishedAt?: string | null;
    remarks?: string | null;
}

export interface ResultRequest {
    studentId: number;
    semesterId: number;
    sgpa: number;
    cgpa: number;
}

export const getResults = async (): Promise<Result[]> => {
    const response = await api.get<Result[]>(
        "/api/results"
    );

    return response.data;
};

export const getResultById = async (
    resultId: number
): Promise<Result> => {
    const response = await api.get<Result>(
        `/api/results/${resultId}`
    );

    return response.data;
};

export const getResultsByStudent = async (
    studentId: number
): Promise<Result[]> => {
    const response = await api.get<Result[]>(
        `/api/results/student/${studentId}`
    );

    return response.data;
};

export const getResultsBySemester = async (
    semesterId: number
): Promise<Result[]> => {
    const response = await api.get<Result[]>(
        `/api/results/semester/${semesterId}`
    );

    return response.data;
};

export const publishResult = async (
    data: ResultRequest
): Promise<string> => {
    const response = await api.post<string>(
        "/api/results/publish",
        data
    );

    return response.data;
};

export const updateResult = async (
    resultId: number,
    data: ResultRequest
): Promise<Result> => {
    const response = await api.put<Result>(
        `/api/results/${resultId}`,
        data
    );

    return response.data;
};

export const deleteResult = async (
    resultId: number
): Promise<void> => {
    await api.delete(`/api/results/${resultId}`);
};