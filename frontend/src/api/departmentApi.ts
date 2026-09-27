import api from "./axios";

export interface Department {
    departmentId: number;
    departmentCode: string;
    departmentName: string;
    description: string;
}

export interface DepartmentRequest {
    departmentCode: string;
    departmentName: string;
    description: string;
}

export const getDepartments = async (): Promise<Department[]> => {
    const response = await api.get<Department[]>("/api/departments");
    return response.data;
};

export const getDepartmentById = async (
    departmentId: number
): Promise<Department> => {
    const response = await api.get<Department>(
        `/api/departments/${departmentId}`
    );

    return response.data;
};

export const createDepartment = async (
    request: DepartmentRequest
): Promise<Department> => {
    const response = await api.post<Department>(
        "/api/departments",
        request
    );

    return response.data;
};

export const updateDepartment = async (
    departmentId: number,
    request: DepartmentRequest
): Promise<Department> => {
    const response = await api.put<Department>(
        `/api/departments/${departmentId}`,
        request
    );

    return response.data;
};

export const deleteDepartment = async (
    departmentId: number
): Promise<void> => {
    await api.delete(`/api/departments/${departmentId}`);
};
