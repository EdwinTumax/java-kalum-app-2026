import type { CreateTechnicalCareerRequest } from "../interfaces/career/CreateTechnicalCareerRequest";
import type { CreateTechnicalCareerResponse } from "../interfaces/career/CreateTechnicalCareerResponse";
import type { TechnicalCareer } from "../interfaces/career/TechnicalCareer";
import type { TechnicalCareerResponse } from "../interfaces/career/TechnicalCareerResponse";
import type { UpdateTechnicalCareerRequest } from "../interfaces/career/UpdateTechnicalCareerRequest";

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

    createTechnicalCareer: async (technicalCareer: CreateTechnicalCareerRequest): Promise<CreateTechnicalCareerResponse> => {
        const response = await apiKalumAcademic.post<CreateTechnicalCareerResponse>('/technical-careers', technicalCareer);
        return response.data;
    },

    updateTechnicalCareer: async (technicalCareerId: string, technicalCareer: UpdateTechnicalCareerRequest): Promise<void> => {
        await apiKalumAcademic.put<void>(`/technical-careers/${technicalCareerId}`, technicalCareer);
    },

    deleteTechnicalCareer: async (technicalCareerId: string): Promise<void> => {
        await apiKalumAcademic.delete<void>(`/technical-careers/${technicalCareerId}`);
    }
}

