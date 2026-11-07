import axios from "axios";


const apiKalumAcademic = axios.create({
    baseURL: `http://${import.meta.env.VITE_KALUM_API_ACADEMIC_HOST}:${import.meta.env.VITE_KALUM_API_ACADEMIC_PORT}/${import.meta.env.VITE_KALUM_API_ACADEMIC_NAME}/${import.meta.env.VITE_KALUM_API_ACADEMIC_VERSION}`
});


apiKalumAcademic.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
});

apiKalumAcademic.interceptors.response.use(
    (response) => response, (error) => {
        if(error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if(window.location.pathname !== '/login') {
                window.location.replace('/login');
            }
        }
        return Promise.reject(error);
    }
);

export default apiKalumAcademic;