import api from "./axios";

// =========================================================
// FACULTY COURSES
// =========================================================

export interface FacultyCourse {

    offeringId: number;

    courseId: number;
    courseCode: string;
    courseName: string;

    sectionId: number;
    sectionName: string;

    facultyId: number;
    facultyName: string;

    offeringStatus: string;
}

export const getMyFacultyCourses =
    async (): Promise<FacultyCourse[]> => {

        const response =
            await api.get(
                "/api/course-offerings/me"
            );

        return response.data;
    };


// =========================================================
// FACULTY ATTENDANCE
// =========================================================

export interface FacultyAttendance {

    attendanceId: number;

    courseCode: string;
    courseName: string;

    sectionName: string;

    studentName: string;
    rollNumber: string;

    attendanceDate: string;

    status: string;

    markedAt: string;
}

export const getMyFacultyAttendance =
    async (): Promise<FacultyAttendance[]> => {

        const response =
            await api.get(
                "/api/attendance/faculty/me"
            );

        return response.data;
    };