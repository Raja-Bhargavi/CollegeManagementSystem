import api from "./axios";

export interface Examination {
    examId: number;
    offeringId: number;
    examType: string;
    examDate: string;
    maximumMarks: number;
    status: string;
}

export interface ExaminationRequest {
    offeringId: number;
    examType: string;
    examDate: string;
    maximumMarks: number;
    status: string;
}

export const getExaminations = async (): Promise<Examination[]> => {
    const response = await api.get<Examination[]>("/api/examinations");
    return response.data;
};

export const getExaminationById = async (
    examId: number
): Promise<Examination> => {
    const response = await api.get<Examination>(
        `/api/examinations/${examId}`
    );
    return response.data;
};

export const getExaminationsByOffering = async (
    offeringId: number
): Promise<Examination[]> => {
    const response = await api.get<Examination[]>(
        `/api/examinations/offering/${offeringId}`
    );
    return response.data;
};

export const createExamination = async (
    request: ExaminationRequest
): Promise<Examination> => {
    const response = await api.post<Examination>(
        "/api/examinations",
        request
    );
    return response.data;
};

export const updateExamination = async (
    examId: number,
    request: ExaminationRequest
): Promise<Examination> => {
    const response = await api.put<Examination>(
        `/api/examinations/${examId}`,
        request
    );
    return response.data;
};

export const deleteExamination = async (
    examId: number
): Promise<void> => {
    await api.delete(`/api/examinations/${examId}`);
};
