import api from "./axios";

export interface StudentProfileData {
    studentId: number;
    rollNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string | null;
    gender?: string | null;
    phone?: string | null;
    programId: number;
    admissionYear: number;
    currentSemester: number;
    studentStatus: string;
}

export const getMyStudentProfile = async (): Promise<StudentProfileData> => {
    const response = await api.get("/api/students/me");
    return response.data;
};