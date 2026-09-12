import { authService } from "../services/authService";
import { loginStart, loginSuccess, logout } from "../store/slices/auth/authSlice";
import type { AppDispatch, RootState } from "../store/store"
import { useDispatch, useSelector } from "react-redux"

export const useAuth = () => {
    const {user, token, loading,error} = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const handlerLogin = async (username: string, password: string) => {
        dispatch(loginStart());
        try {
            const data = await authService.login(username,password);
            dispatch(loginSuccess(data));
            return data;
        }catch(error: any) {
            console.log(error);
        }
    }

    const handlerLogout = () => {
        dispatch(logout());
    }

    return {user,token,loading,error, isAuthenticated: Boolean(token), login: handlerLogin, logout: handlerLogout}

}