import type { User } from "./User";

export interface UserResponse {
    success: boolean;
    message: string;
    data: User[];
    errors: string[] | null;
}