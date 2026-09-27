import api from "./axios";

export interface CourseOffering {
    offeringId: number;
    courseId: number;
    sectionId: number;
    facultyId: number;
    offeringStatus: string;
}

export interface CourseOfferingRequest {
    courseId: number;
    sectionId: number;
    facultyId: number;
    offeringStatus: string;
}

export const getCourseOfferings = async (): Promise<CourseOffering[]> => {
    const response = await api.get<CourseOffering[]>(
        "/api/course-offerings"
    );

    return response.data;
};

export const getCourseOfferingById = async (
    offeringId: number
): Promise<CourseOffering> => {
    const response = await api.get<CourseOffering>(
        `/api/course-offerings/${offeringId}`
    );

    return response.data;
};

export const createCourseOffering = async (
    request: CourseOfferingRequest
): Promise<CourseOffering> => {
    const response = await api.post<CourseOffering>(
        "/api/course-offerings",
        request
    );

    return response.data;
};

export const updateCourseOffering = async (
    offeringId: number,
    request: CourseOfferingRequest
): Promise<CourseOffering> => {
    const response = await api.put<CourseOffering>(
        `/api/course-offerings/${offeringId}`,
        request
    );

    return response.data;
};

export const deleteCourseOffering = async (
    offeringId: number
): Promise<void> => {
    await api.delete(
        `/api/course-offerings/${offeringId}`
    );
};
