import type { Role } from "./Role";

export interface RoleResponse {
    success: boolean;
    message: string;
    data: Role[];
    errors: string[] | null
}