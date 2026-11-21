import type { AdmissionExam } from "./AdmissionExam";

export interface AdmissionExamResponse {
        success: boolean;
        message: string;
        data: AdmissionExam[];
        errors: string[] | null
}