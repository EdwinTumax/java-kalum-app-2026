import type { AdmissionExam } from "./AdmissionExam";

export interface CreateAdmissionExamResponse{
        success: boolean;
        message: string;
        data: AdmissionExam | null,
        errors: string[] | null;
}