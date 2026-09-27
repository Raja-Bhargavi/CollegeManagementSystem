import api from "./axios";

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    username: string;
    role: string;
    message: string;
}

export const login = async (
    request: LoginRequest
): Promise<LoginResponse> => {

    const response = await api.post<LoginResponse>(
        "/api/auth/login",
        request
    );

    return response.data;
};