import api from "./axios";


// =========================================================
// STAFF
// =========================================================

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


// =========================================================
// STAFF ADMIN REQUEST
// =========================================================

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


// =========================================================
// STAFF SELF PROFILE REQUEST
// =========================================================

export interface StaffProfileUpdateRequest {

    firstName: string;

    lastName: string;

    phone: string;

    designation: string;
}


// =========================================================
// STAFF ACCOUNT OPTION
// =========================================================

export interface StaffAccountOption {

    userId: number;

    username: string;

    email: string;
}


// =========================================================
// GET ALL STAFF
// =========================================================

export const getStaff =
    async (): Promise<Staff[]> => {

        const response =
            await api.get<Staff[]>(
                "/api/staff"
            );

        return response.data;
    };


// =========================================================
// GET STAFF BY ID
// =========================================================

export const getStaffById =
    async (
        staffId: number
    ): Promise<Staff> => {

        const response =
            await api.get<Staff>(
                `/api/staff/${staffId}`
            );

        return response.data;
    };


// =========================================================
// GET STAFF BY USER ID
// =========================================================

export const getStaffByUserId =
    async (
        userId: number
    ): Promise<Staff> => {

        const response =
            await api.get<Staff>(
                `/api/staff/user/${userId}`
            );

        return response.data;
    };


// =========================================================
// GET MY STAFF PROFILE
// =========================================================

export const getMyStaffProfile =
    async (): Promise<Staff> => {

        const response =
            await api.get<Staff>(
                "/api/staff/me"
            );

        return response.data;
    };


// =========================================================
// UPDATE MY STAFF PROFILE
// =========================================================

export const updateMyStaffProfile =
    async (
        request: StaffProfileUpdateRequest
    ): Promise<Staff> => {

        const response =
            await api.put<Staff>(
                "/api/staff/me",
                request
            );

        return response.data;
    };


// =========================================================
// ADMIN - CREATE STAFF
// =========================================================

export const createStaff =
    async (
        request: StaffRequest
    ): Promise<Staff> => {

        const response =
            await api.post<Staff>(
                "/api/staff",
                request
            );

        return response.data;
    };


// =========================================================
// ADMIN - UPDATE STAFF
// =========================================================

export const updateStaff =
    async (
        staffId: number,
        request: StaffRequest
    ): Promise<Staff> => {

        const response =
            await api.put<Staff>(
                `/api/staff/${staffId}`,
                request
            );

        return response.data;
    };


// =========================================================
// ADMIN - DELETE STAFF
// =========================================================

export const deleteStaff =
    async (
        staffId: number
    ): Promise<void> => {

        await api.delete(
            `/api/staff/${staffId}`
        );
    };


// =========================================================
// AVAILABLE STAFF ACCOUNTS
// =========================================================

export const getAvailableStaffAccounts =
    async (
        includeUserId?: number
    ): Promise<StaffAccountOption[]> => {

        const response =
            await api.get<StaffAccountOption[]>(
                "/api/users/staff-accounts",
                {
                    params:
                        includeUserId !== undefined
                            ? {
                                includeUserId,
                            }
                            : {},
                }
            );

        return response.data;
    };