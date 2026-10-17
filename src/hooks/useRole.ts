import { ApiException } from "../core/exceptions/ApiException";
import type { CreateRoleRequest } from "../interfaces/role/CreateRoleRequest";
import { roleService } from "../services/roleService";
import { clearRoleError, createRoleError, createRoleStart, createRoleSuccess, getRolesError, getRolesStart, getRolesSuccess } from "../store/slices/role/roleSlice";
import type { AppDispatch, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux"


export const useRole = () => {
    const { roles, loading, error, creating } = useSelector((state: RootState) => state.role);

    const dispatch = useDispatch<AppDispatch>();

    const getRoles = async () => {
        dispatch(getRolesStart());

        try {
            const response = await roleService.getRoles();
            if (response.success) {
                dispatch(getRolesSuccess(response.data));
            } else {
                const message = response.errors?.[0] ?? response.message ?? 'Error al obtener la información de los roles';
                dispatch(getRolesError(message));
            }
            return response;
        } catch (error: any) {
            const apiError = error.response?.data;
            const message = apiError ?? error?.[0] ?? apiError?.message ?? 'Error al comunicarse al servicio de roles';
            dispatch(getRolesError(message));
            throw error;
        }
    }

    const createRole = async (role: CreateRoleRequest) => {
        dispatch(createRoleStart());
        try {
            const response = await roleService.createRole(role);
            if(response.success && response.data) {
                dispatch(createRoleSuccess(response.data))
            } else {
                const message = response.errors?.[0] ?? response.message ?? 'Error al crear el role';
                dispatch(createRoleError(message));
            }
            return response;
        } catch(error: any) {
            const apiError = error.response?.data;
            const message = apiError?.message ?? apiError?.errors?.[0] ?? 'Error al comunciarse con el servicio de roles';
            dispatch(createRoleError(message));
            throw new ApiException(message, error.response?.status, apiError.errors);            
        }
    }

    

    return { roles, loading, error, getRoles, createRole, creating, clearRoleError }
}