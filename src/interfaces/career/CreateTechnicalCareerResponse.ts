import type { TechnicalCareer } from "./TechnicalCareer";

export interface CreateTechnicalCareerResponse {
    success: boolean;
    message: string;
    data: TechnicalCareer;
    errors: string[] | null
}