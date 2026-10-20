
import api from "./axios";

export interface AdmissionApplication {
    admissionRequestId: number;
    applicationNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    programName: string;
    degreeType: string;
    departmentName: string;
    dateOfBirth: string;
    admissionYear: number;
    previousQualification: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED";
    adminRemarks: string | null;
    createdAt: string | null;
}

export interface AdmissionDecision {
    decision: "APPROVE" | "REJECT";
    remarks: string;
}

export interface AdmissionDecisionResult {
    applicationNumber: string;
    status: string;
    message: string;
}

export async function getAdmissionApplications(
    status: AdmissionApplication["status"] = "PENDING"
): Promise<AdmissionApplication[]> {
    const response = await api.get<AdmissionApplication[]>(
        "/api/admin/admissions",
        { params: { status } }
    );

    return response.data;
}

export async function getAdmissionApplication(
    id: number
): Promise<AdmissionApplication> {
    const response = await api.get<AdmissionApplication>(
        `/api/admin/admissions/${id}`
    );

    return response.data;
}

export async function decideAdmission(
    id: number,
    decision: AdmissionDecision
): Promise<AdmissionDecisionResult> {
    const response = await api.put<AdmissionDecisionResult>(
        `/api/admin/admissions/${id}/decision`,
        decision
    );

    return response.data;
}
