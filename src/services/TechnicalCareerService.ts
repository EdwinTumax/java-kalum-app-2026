import type { CreateTechnicalCareerResponse } from "../interfaces/career/CreateTechnicalCareerResponse";
import type { TechnicalCareer } from "../interfaces/career/TechnicalCareer";
import type { TechnicalCareerResponse } from "../interfaces/career/TechnicalCareerResponse";
import type { UpdateTechnicalCareerResponse } from "../interfaces/career/UpdateTechnicalCareerResponse";

import apiKalumAcademic from './kalumAcademicManagmentApi';

export const technicalCareerService = {

    getTechnicalCareers: async (): Promise<TechnicalCareerResponse> => {
        const response = await apiKalumAcademic.get<TechnicalCareerResponse>('/technical-careers');
        return response.data;
    },

    getTechnicalCareerbyId: async (technicalCareerId: string): Promise<TechnicalCareer> => {
        const response = await apiKalumAcademic.get<TechnicalCareer>(`/technical-careers/${technicalCareerId}`)
        return response.data;
    },

    createTechnicalCareer: async (formData: FormData): Promise<CreateTechnicalCareerResponse> => {
        const response = await apiKalumAcademic.post<CreateTechnicalCareerResponse>('/technical-careers', formData);
        return response.data;
    },

    updateTechnicalCareer: async (technicalCareerId: string, formData: FormData): Promise<UpdateTechnicalCareerResponse> => {
        const response = await apiKalumAcademic.put<UpdateTechnicalCareerResponse>(`/technical-careers/${technicalCareerId}`, formData);
        return response.data;
    },

    deleteTechnicalCareer: async (technicalCareerId: string): Promise<void> => {
        await apiKalumAcademic.delete<void>(`/technical-careers/${technicalCareerId}`);
    }
}

