import api from "./axios";

export interface Attendance {
    attendanceId: number;
    registrationId: number;
    attendanceDate: string;
    status: string;
    markedBy: number;
    markedAt: string;
}

export interface AttendanceRequest {
    registrationId: number;
    attendanceDate: string;
    status: string;
    markedBy: number;
}

export const getAttendance = async (): Promise<Attendance[]> => {
    const response = await api.get<Attendance[]>("/api/attendance");
    return response.data;
};

export const getAttendanceById = async (
    attendanceId: number
): Promise<Attendance> => {
    const response = await api.get<Attendance>(
        `/api/attendance/${attendanceId}`
    );
    return response.data;
};

export const getAttendanceByRegistration = async (
    registrationId: number
): Promise<Attendance[]> => {
    const response = await api.get<Attendance[]>(
        `/api/attendance/registration/${registrationId}`
    );
    return response.data;
};

export const createAttendance = async (
    request: AttendanceRequest
): Promise<Attendance> => {
    const response = await api.post<Attendance>(
        "/api/attendance",
        request
    );
    return response.data;
};

export const updateAttendance = async (
    attendanceId: number,
    request: AttendanceRequest
): Promise<Attendance> => {
    const response = await api.put<Attendance>(
        `/api/attendance/${attendanceId}`,
        request
    );
    return response.data;
};

export const deleteAttendance = async (
    attendanceId: number
): Promise<void> => {
    await api.delete(`/api/attendance/${attendanceId}`);
};
