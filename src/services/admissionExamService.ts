import type { CreateAdmissionExamResponse } from "../interfaces/exam/CreateAdmissionExamResponse"
import type { AdmissionExam } from "../interfaces/exam/AdmissionExam";
import type { CreateAdmissionExamRequest } from "../interfaces/exam/CreateAdmissionExamRequest";
import type { UpdateAdmissionExamRequest } from "../interfaces/exam/UpdateAdmissionExamRequest";
import type { UpdateAdmissionExamResponse } from '../interfaces/exam/UpdateAdmissionExamResponse';
import apiKalumAcademic from './kalumAcademicManagmentApi';
import type { AdmissionExamResponse } from "../interfaces/exam/AdmissionExamResponse";

export const admissionExamService = {

    getAdmissionExams: async (): Promise<AdmissionExamResponse> => {
        const response = await apiKalumAcademic.get<AdmissionExamResponse>('/admission-exams');
        return response.data;
    },

    getAdmissionExambyId: async (admissionExamId: string): Promise<AdmissionExam> => {
        const response = await apiKalumAcademic.get<AdmissionExam>(`/admission-exams/${admissionExamId}`)
        return response.data;
    },

    createAdmissionExam: async (admissionExam: CreateAdmissionExamRequest): Promise<CreateAdmissionExamResponse> => {
        const response = await apiKalumAcademic.post<CreateAdmissionExamResponse>('/admission-exams', admissionExam);
        return response.data;
    },

    updateAdmissionExam: async (admissionExamId: string, admisionExam: UpdateAdmissionExamRequest): Promise<UpdateAdmissionExamResponse> => {
        const response = await apiKalumAcademic.put<UpdateAdmissionExamResponse>(`/admission-exams/${admissionExamId}`, admisionExam);
        return response.data;
    },

    deleteAdmissionExam: async (admissionExamId: string): Promise<void> => {
        await apiKalumAcademic.delete<void>(`/admission-exams/${admissionExamId}`);
    }
}
