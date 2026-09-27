import api from "./axios";

export interface Student {
    studentId: number;
    userId: number;
    rollNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    programId: number;
    admissionYear: number;
    currentSemester: number;
    studentStatus: string;
}

export interface StudentRequest {
    userId: number;
    rollNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    programId: number;
    admissionYear: number;
    currentSemester: number;
    studentStatus: string;
}

export interface UserAccountOption {
    userId: number;
    username: string;
    email: string;
}

export const getStudents = async (): Promise<Student[]> => {
    const response = await api.get<Student[]>("/api/students");
    return response.data;
};

export const getStudentById = async (
    studentId: number
): Promise<Student> => {
    const response = await api.get<Student>(
        `/api/students/${studentId}`
    );

    return response.data;
};

export const createStudent = async (
    request: StudentRequest
): Promise<Student> => {
    const response = await api.post<Student>(
        "/api/students",
        request
    );

    return response.data;
};

export const updateStudent = async (
    studentId: number,
    request: StudentRequest
): Promise<Student> => {
    const response = await api.put<Student>(
        `/api/students/${studentId}`,
        request
    );

    return response.data;
};

export const deleteStudent = async (
    studentId: number
): Promise<void> => {
    await api.delete(`/api/students/${studentId}`);
};

export const getAvailableStudentAccounts = async (
    includeUserId?: number
): Promise<UserAccountOption[]> => {

    const response = await api.get<UserAccountOption[]>(
        "/api/users/student-accounts",
        {
            params:
                includeUserId !== undefined
                    ? { includeUserId }
                    : {},
        }
    );

    return response.data;
};
