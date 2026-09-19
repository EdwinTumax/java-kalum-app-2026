import { authService } from "../services/authService";
import { loginError, loginStart, loginSuccess, logout } from "../store/slices/auth/authSlice";
import type { AppDispatch, RootState } from "../store/store"
import { useDispatch, useSelector } from "react-redux"

export const useAuth = () => {
    const {user, token, loading,error} = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const handlerLogin = async (username: string, password: string) => {
        dispatch(loginStart());
        try {
            const data = await authService.login(username,password);
            if(data.success) {
                dispatch(loginSuccess(data));
            } else {
                const message = data.errors?.[0] ?? data.message ?? 'Credenciales incorrectas';
                dispatch(loginError(message));
            }
            return data;
        }catch(error: any) {
            const apiError = error.response.data;
            const message = apiError?.errors?.[0] ?? apiError?.message ?? 'Error al comunicarse con el servicio'
            dispatch(loginError(message));
            throw error;
        }
    }

    const handlerLogout = () => {
        dispatch(logout());
    }

    return {user,token,loading,error, isAuthenticated: Boolean(token), login: handlerLogin, logout: handlerLogout}

}