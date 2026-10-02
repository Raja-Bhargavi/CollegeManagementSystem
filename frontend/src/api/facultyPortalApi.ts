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


    export interface FacultyExamination {
    examId: number;
    offeringId: number;
    examType: string;
    examDate: string;
    maximumMarks: number;
    status: string;
    }

    export const getMyFacultyExaminations =
    async (): Promise<FacultyExamination[]> => {
        const response = await api.get("/api/examinations/faculty/me");
        return response.data;
    };

    export interface FacultyMark {
        markId: number;
        examId: number;
        examType: string;
        studentId: number;
        studentName: string;
        marksObtained: number;
        remarks: string;
    }

    export const getMyFacultyMarks = async (): Promise<FacultyMark[]> => {
    const response = await api.get("/api/marks/faculty/me");
    return response.data;
    };

    // =========================================================
// FACULTY RESULTS
// =========================================================

export interface FacultyResult {

    resultId: number;

    studentId: number;
    studentName: string;

    semesterId: number;

    sgpa: number;
    cgpa: number;

    resultStatus: string;

    publishedAt: string;
}

export const getMyFacultyResults =
    async (): Promise<FacultyResult[]> => {

        const response =
            await api.get(
                "/api/results/faculty/me"
            );

        return response.data;
    };

    // =========================================================
// FACULTY NOTICES
// =========================================================

export interface FacultyNotice {

    noticeId: number;

    title: string;

    content: string;

    createdBy: number;

    publishedAt: string;

    expiryDate: string | null;

    visibility: string;

    status: string;
}

    export const getMyFacultyNotices =
        async (): Promise<FacultyNotice[]> => {

            const response =
                await api.get(
                    "/api/notices/faculty/me"
                );

            return response.data;
    };