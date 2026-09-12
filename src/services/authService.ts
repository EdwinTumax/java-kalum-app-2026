import api from "./kalumManagmentApi";

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        expiration: string
    },
    errors: string[]
}

export const authService = {
    login: async (username: string, password: string) : Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/account/login', {username, password});
        return response.data;
    }
}