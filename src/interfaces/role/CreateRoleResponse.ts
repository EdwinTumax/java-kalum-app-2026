import type { Role } from "./Role";

export interface CreateRoleResponse {
    success: boolean;
    message: string;
    data: Role;
    errors: string[] | null
}