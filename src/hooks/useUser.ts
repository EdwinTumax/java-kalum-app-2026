import { ApiException } from "../core/exceptions/ApiException";
import type { CreateUserRequest } from "../interfaces/user/CreateUserRequest";
import type { UpdateUserRequest } from "../interfaces/user/UpdateUserRequest";
import { userService } from "../services/userService";
import { clearUserError, createUserError, createUserStart, createUserSuccess, deleteUserError, deleteUserStart, deleteUserSuccess, getUsersError, getUsersStart, getUsersSuccess, updateUserError, updateUserStart, updateUserSuccess } from "../store/slices/user/userSlice";
import type { AppDispatch, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux"

const getErrorMessage = (error: any, fallback: string) : string => {
    const apiError = error?.response?.data;
    return apiError?.errors?.[0] ?? apiError?.message ?? error?.message ?? fallback;
}


export const useUser = () => {
    const { users, loading, creating, updating, deleting, error } = useSelector((state: RootState) => state.user);

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
            const message = getErrorMessage(error, "Error al comunicarse con el servicio");
            dispatch(getUsersError(message));
            throw new ApiException(message, error.response?.status, error.response?.data?.errors);
        }
    }

    const createUser = async (user: CreateUserRequest) => {
        dispatch(createUserStart());
        try {
            const response = await userService.createUser(user);
            if(response.success && response.data) {
                dispatch(createUserSuccess(response.data));                
            } else {
                const message = response.errors?.[0] ?? response.message ?? 'Error al crear el usuario';
                dispatch(createUserError(message));
            }
            return response;
        } catch(error: any) {
            const message = getErrorMessage(error, 'Error al comunicarse con el servidor');
            dispatch(createUserError(message));
            throw new ApiException(message, error.response?.status, error.response?.data?.errors);
        }        
    }

    const updateUser = async(userId: string, user: UpdateUserRequest) => {
        dispatch(updateUserStart());
        try {
            const response = await userService.updateUser(userId, user);
            if(response.success && response.data) {
                dispatch(updateUserSuccess(response.data));
            } else {
                const message = response.errors?.[0] ?? response.message ?? 'Error al actualizar el usuario';
                dispatch(updateUserError(message));
            }
            return response;
        } catch(error: any) {
            const message = getErrorMessage(error, 'Error al actualizar el usuario');
            dispatch(updateUserError(message));
            throw new ApiException(message, error.response?.status, error.response?.data?.errors)
        }
    }

    const deleteUser = async (userId: string) => {
        dispatch(deleteUserStart());
        try {
            const response = await userService.deleteUser(userId);
            if(response.success) {
                dispatch(deleteUserSuccess(userId));
            } else {
                const message = response.errors?.[0] ?? response.message ?? 'Error al eliminar usuario';
                dispatch(deleteUserError(message));
            }
            return response;
        } catch(error: any) {
            const message = getErrorMessage(error,'Error al eliminar el usuario');
            dispatch(deleteUserError(message));
            throw new ApiException(message, error.response?.status, error.response?.data?.errors);           
        }
    }

    const clearUSerErrorHandler = () => {
        dispatch(clearUserError());
    }

    return {
        users, 
        loading, 
        creating,
        updating,
        deleting,      
        error, 
        getUsers,
        createUser,
        updateUser,
        deleteUser,
        clearUserError: clearUSerErrorHandler
    };
}