import api from "./axios";

export interface CourseRegistration {
    registrationId: number;
    studentId: number;
    offeringId: number;
    registrationDate: string;
    status: string;
}

export interface CourseRegistrationRequest {
    studentId: number;
    offeringId: number;
}

export const getCourseRegistrations = async (): Promise<CourseRegistration[]> => {
    const response = await api.get<CourseRegistration[]>(
        "/api/course-registrations"
    );

    return response.data;
};

export const getCourseRegistrationById = async (
    registrationId: number
): Promise<CourseRegistration> => {
    const response = await api.get<CourseRegistration>(
        `/api/course-registrations/${registrationId}`
    );

    return response.data;
};

export const createCourseRegistration = async (
    request: CourseRegistrationRequest
): Promise<CourseRegistration> => {
    const response = await api.post<CourseRegistration>(
        "/api/course-registrations",
        request
    );

    return response.data;
};

export const updateCourseRegistration = async (
    registrationId: number,
    request: CourseRegistrationRequest
): Promise<CourseRegistration> => {
    const response = await api.put<CourseRegistration>(
        `/api/course-registrations/${registrationId}`,
        request
    );

    return response.data;
};

export const deleteCourseRegistration = async (
    registrationId: number
): Promise<void> => {
    await api.delete(
        `/api/course-registrations/${registrationId}`
    );
};
