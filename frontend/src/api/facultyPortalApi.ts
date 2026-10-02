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

    registrationId: number;
    studentId: number;

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


// =========================================================
// FACULTY COURSE REGISTRATIONS
// =========================================================

export interface FacultyCourseRegistration {
    registrationId: number;

    studentId: number;

    offeringId: number;

    courseCode: string;
    courseName: string;

    sectionName: string;

    facultyName: string;

    registrationDate: string;

    status: string;
}

export const getMyFacultyRegistrations =
    async (): Promise<FacultyCourseRegistration[]> => {

        const response =
            await api.get(
                "/api/course-registrations/faculty/me"
            );

        return response.data;
    };


// =========================================================
// FACULTY ATTENDANCE REQUEST
// =========================================================

export interface FacultyAttendanceRequest {
    registrationId: number;

    attendanceDate: string;

    status: string;

    markedBy?: number;
}


// =========================================================
// FACULTY - MARK ATTENDANCE
// =========================================================

export const markFacultyAttendance =
    async (
        request: FacultyAttendanceRequest
    ) => {

        const response =
            await api.post(
                "/api/attendance/faculty",
                request
            );

        return response.data;
    };


// =========================================================
// FACULTY - UPDATE ATTENDANCE
// =========================================================

export const updateFacultyAttendance =
    async (
        attendanceId: number,
        request: FacultyAttendanceRequest
    ) => {

        const response =
            await api.put(
                `/api/attendance/faculty/${attendanceId}`,
                request
            );

        return response.data;
    };


// =========================================================
// FACULTY EXAMINATIONS
// =========================================================

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

        const response =
            await api.get(
                "/api/examinations/faculty/me"
            );

        return response.data;
    };


// =========================================================
// FACULTY MARKS
// =========================================================

export interface FacultyMark {
    markId: number;

    examId: number;

    examType: string;

    studentId: number;

    studentName: string;

    marksObtained: number;

    remarks: string;
}

export const getMyFacultyMarks =
    async (): Promise<FacultyMark[]> => {

        const response =
            await api.get(
                "/api/marks/faculty/me"
            );

        return response.data;
    };


// =========================================================
// FACULTY MARK UPDATE REQUEST
// =========================================================

export interface FacultyMarkUpdateRequest {
    marksObtained: number;

    remarks: string;
}


// =========================================================
// FACULTY - UPDATE MARK
// =========================================================

export const updateFacultyMark =
    async (
        markId: number,
        request: FacultyMarkUpdateRequest
    ): Promise<FacultyMark> => {

        const response =
            await api.put(
                `/api/marks/faculty/${markId}`,
                request
            );

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

    remarks: string | null;
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
// FACULTY RESULT UPDATE REQUEST
// =========================================================

export interface FacultyResultUpdateRequest {
    sgpa: number;

    remarks: string;

    resultStatus: string;
}


// =========================================================
// FACULTY - UPDATE RESULT
// =========================================================

export const updateFacultyResult =
    async (
        resultId: number,
        request: FacultyResultUpdateRequest
    ): Promise<FacultyResult> => {

        const response =
            await api.put(
                `/api/results/faculty/${resultId}`,
                request
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