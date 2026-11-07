import type { CarreraTecnica } from "../interfaces/career/CarreraTecnica";

import apiKalumAcademic from './kalumAcademicManagmentApi';

export const getTechnicalCareerService  = {

     getCareers: async() : Promise<CarreraTecnica[]> => {
        const response = await apiKalumAcademic.get<CarreraTecnica[]>('/carreras-tecnicas');
        return response.data;
    }

}