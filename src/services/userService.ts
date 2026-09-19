import type { UserResponse } from "../interfaces/user/UserResponse";
import api from "./kalumManagmentApi";

export const userService = {
    getUsers: async () : Promise<UserResponse> => {
        const response = await api.get<UserResponse>('/users');
        return response.data;
    }
}