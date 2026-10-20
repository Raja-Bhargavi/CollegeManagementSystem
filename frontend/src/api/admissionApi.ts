
import api from "./axios";

export interface AdmissionProgram {
    programId: number;
    programCode: string;
    programName: string;
    degreeType: string;
    durationYears: number;
    departmentName: string;
}

export interface AdmissionSubmission {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    programId: number;
    admissionYear: number;
    previousQualification: string;
    previousPercentage: number | null;
}

export interface AdmissionSubmissionResult {
    applicationNumber: string;
    status: string;
    message: string;
}

export async function getAdmissionPrograms(): Promise<AdmissionProgram[]> {
    const response = await api.get<AdmissionProgram[]>(
        "/api/public/admissions/programs"
    );
    return response.data;
}

export async function submitAdmission(
    data: AdmissionSubmission
): Promise<AdmissionSubmissionResult> {
    const response = await api.post<AdmissionSubmissionResult>(
        "/api/public/admissions",
        data
    );
    return response.data;
}
