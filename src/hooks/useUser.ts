import { userService } from "../services/userService";
import { getUsersError, getUsersStart, getUsersSuccess } from "../store/slices/user/userSlice";
import type { AppDispatch, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux"

export const useUser = () => {
    const { users, loading, error } = useSelector((state: RootState) => state.user);

    const dispatch = useDispatch<AppDispatch>();

    const getUsers = async() => {
        dispatch(getUsersStart());
        try {
            const response = await userService.getUsers();
            if(response.success) {
                dispatch(getUsersSuccess(response.data));
            } else {
                const message = response.errors?.[0] ?? response.message ?? 'Error al obetener usuarios';
                dispatch(getUsersError(message));
            }
            return response;
        }catch(error: any) {
            const apiError = error.response?.data;
            const message = apiError?.errors?.[0] ?? apiError?.message ?? 'Error al comunicarse con el servicio';
            dispatch(getUsersError(message));
            throw error;
        }
    }

    return {users, loading, error, getUsers};
}