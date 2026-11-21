import type { AdmissionExam } from "./AdmissionExam";

export interface UpdateAdmissionExamResponse {
    success: boolean;
    message: string;
    data: AdmissionExam;
    errors: string[] | null
}