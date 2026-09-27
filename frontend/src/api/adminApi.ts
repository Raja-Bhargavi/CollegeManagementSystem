import api from "./axios";

export const getStudents = async () => {
    const response = await api.get("/api/students");
    return response.data;
};

export const getFaculty = async () => {
    const response = await api.get("/api/faculty");
    return response.data;
};

export const getStaff = async () => {
    const response = await api.get("/api/staff");
    return response.data;
};

export const getApplications = async () => {
    const response = await api.get("/api/applications");
    return response.data;
};

export const getCourses = async () => {
    const response = await api.get("/api/courses");
    return response.data;
};

export const getDepartments = async () => {
    const response = await api.get("/api/departments");
    return response.data;
};

export const getEvents = async () => {
    const response = await api.get("/api/events");
    return response.data;
};

export const getExaminations = async () => {
    const response = await api.get("/api/examinations");
    return response.data;
};

export const getNotices = async () => {
    const response = await api.get("/api/notices");
    return response.data;
};

export const getPayments = async () => {
    const response = await api.get("/api/payments");
    return response.data;
};

export const getResults = async () => {
    const response = await api.get("/api/results");
    return response.data;
};

export const getAttendance = async () => {
    const response = await api.get("/api/attendance");
    return response.data;
};