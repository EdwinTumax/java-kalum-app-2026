import type { CreateUserRequest } from "../interfaces/user/CreateUserRequest";
import type { CreateUserResponse } from "../interfaces/user/CreateUserResponse";
import type { UpdateUserRequest } from "../interfaces/user/UpdateUserRequest";
import type { UpdateUserResponse } from "../interfaces/user/UpdateUserResponse";
import type { User } from "../interfaces/user/User";
import type { UserResponse } from "../interfaces/user/UserResponse";
import api from "./kalumManagmentApi";

export interface DeleteUserResponse {
    success: boolean;
    message: string;
    data: null;
    errors: string[] | null;
}


export const userService = {

    getUsers: async () : Promise<UserResponse> => {
        const response = await api.get<UserResponse>('/users');
        return response.data;
    },

    getUserById: async (userId: string): Promise<User> => {
        const response = await api.get<User>(`/users/${userId}`);
        return response.data;
    },

    createUser: async (user: CreateUserRequest): Promise<CreateUserResponse> => {
        const response = await api.post<CreateUserResponse>("/users", user);
        return response.data;
    },

    updateUser: async (userId: string, user: UpdateUserRequest): Promise<UpdateUserResponse> => {
        const response = await api.put(`/user/${userId}`, user);
        return response.data;
    },

    deleteUser: async (userId: string) : Promise<DeleteUserResponse> => {
        const response = await api.delete(`/user/${userId}`);
        return response.data;
    }
    
}