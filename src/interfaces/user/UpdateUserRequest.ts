export interface UpdateUserRequest {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    roles: string;
    password?: string;
}