import api from "./axios";

export interface Course {
    courseId: number;
    courseCode: string;
    courseName: string;
    credits: number;
    description: string | null;
}

export interface CourseRequest {
    courseCode: string;
    courseName: string;
    credits: number;
    description: string;
}

export const getCourses = async (): Promise<Course[]> => {
    const response = await api.get<Course[]>("/api/courses");
    return response.data;
};

export const getCourseById = async (
    courseId: number
): Promise<Course> => {
    const response = await api.get<Course>(
        `/api/courses/${courseId}`
    );

    return response.data;
};

export const createCourse = async (
    request: CourseRequest
): Promise<Course> => {
    const response = await api.post<Course>(
        "/api/courses",
        request
    );

    return response.data;
};

export const updateCourse = async (
    courseId: number,
    request: CourseRequest
): Promise<Course> => {
    const response = await api.put<Course>(
        `/api/courses/${courseId}`,
        request
    );

    return response.data;
};

export const deleteCourse = async (
    courseId: number
): Promise<void> => {
    await api.delete(`/api/courses/${courseId}`);
};
