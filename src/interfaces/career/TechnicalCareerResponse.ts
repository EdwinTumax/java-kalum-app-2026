import type { TechnicalCareer } from "./TechnicalCareer";

export interface TechnicalCareerResponse {
    success: boolean;
    message: string;
    data: TechnicalCareer[];
    errors: string[] | null
}