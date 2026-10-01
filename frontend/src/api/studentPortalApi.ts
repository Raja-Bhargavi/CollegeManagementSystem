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

export const getMyStudentProfile =
    async (): Promise<StudentProfileData> => {

        const response =
            await api.get("/api/students/me");

        return response.data;
    };


export const getMyCourses = async () => {

    const response =
        await api.get("/api/course-registrations/me");

    return response.data;
};


export const getMyAttendance = async () => {

    const response =
        await api.get("/api/attendance/me");

    return response.data;
};


export const getMyMarks = async () => {

    const response =
        await api.get("/api/marks/me");

    return response.data;
};


export const getMyResults = async () => {

    const response =
        await api.get("/api/results/me");

    return response.data;
};


export const getMyFees = async () => {

    const response =
        await api.get("/api/fees/me");

    return response.data;
};


export const getMyPayments = async () => {

    const response =
        await api.get("/api/payments/me");

    return response.data;
};


export const getMyApplications = async () => {

    const response =
        await api.get("/api/applications/me");

    return response.data;
};


export const getMyNotices = async () => {

    const response =
        await api.get("/api/notices/me");

    return response.data;
};