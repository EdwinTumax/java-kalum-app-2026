import type { User } from "./User";

export interface CreateUserResponse {
    success: boolean;
    message: string;
    data: User | null,
    errors: string[] | null;
}