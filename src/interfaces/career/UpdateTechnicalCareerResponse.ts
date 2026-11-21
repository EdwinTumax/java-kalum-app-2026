import type { TechnicalCareer } from "./TechnicalCareer";

export interface UpdateTechnicalCareerResponse {
    success: boolean;
    message: string;
    data: TechnicalCareer;
    errors: string[] | null
}