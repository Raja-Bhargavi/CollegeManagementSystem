import api from "./axios";

export interface Staff {
    staffId: number;
    userId: number;
    employeeNumber: string;
    firstName: string;
    lastName: string;
    phone: string;
    designation: string;
    departmentId: number | null;
    joiningDate: string;
    staffStatus: string;
}

export interface StaffRequest {
    userId: number;
    employeeNumber: string;
    firstName: string;
    lastName: string;
    phone: string;
    designation: string;
    departmentId: number | null;
    joiningDate: string;
    staffStatus: string;
}

export interface StaffAccountOption {
    userId: number;
    username: string;
    email: string;
}

export const getStaff = async (): Promise<Staff[]> => {
    const response = await api.get<Staff[]>("/api/staff");
    return response.data;
};

export const getStaffById = async (
    staffId: number
): Promise<Staff> => {
    const response = await api.get<Staff>(
        `/api/staff/${staffId}`
    );

    return response.data;
};

export const getStaffByUserId = async (
    userId: number
): Promise<Staff> => {
    const response = await api.get<Staff>(
        `/api/staff/user/${userId}`
    );

    return response.data;
};

export const getMyStaffProfile = async (): Promise<Staff> => {
    const response = await api.get<Staff>("/api/staff/me");

    return response.data;
};

export const createStaff = async (
    request: StaffRequest
): Promise<Staff> => {
    const response = await api.post<Staff>(
        "/api/staff",
        request
    );

    return response.data;
};

export const updateStaff = async (
    staffId: number,
    request: StaffRequest
): Promise<Staff> => {
    const response = await api.put<Staff>(
        `/api/staff/${staffId}`,
        request
    );

    return response.data;
};

export const deleteStaff = async (
    staffId: number
): Promise<void> => {
    await api.delete(`/api/staff/${staffId}`);
};

export const getAvailableStaffAccounts = async (
    includeUserId?: number
): Promise<StaffAccountOption[]> => {

    const response = await api.get<StaffAccountOption[]>(
        "/api/users/staff-accounts",
        {
            params:
                includeUserId !== undefined
                    ? { includeUserId }
                    : {},
        }
    );

    return response.data;
};
