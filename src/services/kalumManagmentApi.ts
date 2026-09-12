import axios from "axios";


const api = axios.create({
    baseURL: `http://${import.meta.env.VITE_KALUM_API_AUTH_HOST}:${import.meta.env.VITE_KALUM_API_AUTH_PORT}/${import.meta.env.VITE_KALUM_API_AUTH_NAME}/${import.meta.env.VITE_KALUM_API_AUTH_VERSION}`
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
});

export default api;