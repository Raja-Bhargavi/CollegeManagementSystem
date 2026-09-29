import api from "./axios";

export interface Mark {
    markId: number;
    examId: number;
    studentId: number;
    marksObtained: number;
    remarks: string | null;
}

export interface MarkRequest {
    examId: number;
    studentId: number;
    marksObtained: number;
    remarks?: string;
}

export const getMarks = async (): Promise<Mark[]> => {
    const response = await api.get<Mark[]>("/api/marks");
    return response.data;
};

export const getMarkById = async (
    markId: number
): Promise<Mark> => {
    const response = await api.get<Mark>(
        `/api/marks/${markId}`
    );
    return response.data;
};

export const getMarksByExam = async (
    examId: number
): Promise<Mark[]> => {
    const response = await api.get<Mark[]>(
        `/api/marks/exam/${examId}`
    );
    return response.data;
};

export const getMarksByStudent = async (
    studentId: number
): Promise<Mark[]> => {
    const response = await api.get<Mark[]>(
        `/api/marks/student/${studentId}`
    );
    return response.data;
};

export const createMark = async (
    request: MarkRequest
): Promise<Mark> => {
    const response = await api.post<Mark>(
        "/api/marks",
        request
    );
    return response.data;
};

export const updateMark = async (
    markId: number,
    request: MarkRequest
): Promise<Mark> => {
    const response = await api.put<Mark>(
        `/api/marks/${markId}`,
        request
    );
    return response.data;
};

export const deleteMark = async (
    markId: number
): Promise<void> => {
    await api.delete(`/api/marks/${markId}`);
};
