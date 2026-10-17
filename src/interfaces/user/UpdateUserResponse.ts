import type { User } from "./User";

export interface UpdateUserResponse {
    success: boolean;
    message: string;
    data: User | null;
    errors: string[] | null;
}