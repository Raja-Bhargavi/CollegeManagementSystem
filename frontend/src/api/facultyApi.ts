import api from "./axios";

export interface Faculty {
    facultyId: number;
    userId: number;
    employeeNumber: string;
    firstName: string;
    lastName: string;
    phone: string;
    designation: string;
    departmentId: number;
    joiningDate: string;
    facultyStatus: string;
}

export interface FacultyRequest {
    userId: number;
    employeeNumber: string;
    firstName: string;
    lastName: string;
    phone: string;
    designation: string;
    departmentId: number;
    joiningDate: string;
    facultyStatus: string;
}

export interface FacultyAccountOption {
    userId: number;
    username: string;
    email: string;
}

export const getFaculty = async (): Promise<Faculty[]> => {
    const response = await api.get<Faculty[]>("/api/faculty");
    return response.data;
};

export const getFacultyById = async (
    facultyId: number
): Promise<Faculty> => {
    const response = await api.get<Faculty>(
        `/api/faculty/${facultyId}`
    );

    return response.data;
};

export const getFacultyByUserId = async (
    userId: number
): Promise<Faculty> => {
    const response = await api.get<Faculty>(
        `/api/faculty/user/${userId}`
    );

    return response.data;
};

export const getMyFacultyProfile = async (): Promise<Faculty> => {
    const response = await api.get<Faculty>("/api/faculty/me");
    return response.data;
};

export const createFaculty = async (
    request: FacultyRequest
): Promise<Faculty> => {
    const response = await api.post<Faculty>(
        "/api/faculty",
        request
    );

    return response.data;
};

export const updateFaculty = async (
    facultyId: number,
    request: FacultyRequest
): Promise<Faculty> => {
    const response = await api.put<Faculty>(
        `/api/faculty/${facultyId}`,
        request
    );

    return response.data;
};

export const deleteFaculty = async (
    facultyId: number
): Promise<void> => {
    await api.delete(`/api/faculty/${facultyId}`);
};

export const getAvailableFacultyAccounts = async (
    includeUserId?: number
): Promise<FacultyAccountOption[]> => {

    const response = await api.get<FacultyAccountOption[]>(
        "/api/users/faculty-accounts",
        {
            params:
                includeUserId !== undefined
                    ? { includeUserId }
                    : {},
        }
    );

    return response.data;
};
