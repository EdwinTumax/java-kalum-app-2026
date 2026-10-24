import { ApiException } from "../core/exceptions/ApiException";
import type { CreateRoleRequest } from "../interfaces/role/CreateRoleRequest";
import type { UpdateRoleRequest } from "../interfaces/role/UpdateRoleRequest";
import { roleService } from "../services/roleService";
import { clearRoleError, createRoleError, createRoleStart, createRoleSuccess, deleteRoleError, deleteRoleStart, deleteRoleSuccess, getRolesError, getRolesStart, getRolesSuccess, udpateRoleError, updateRoleStart, updateRoleSuccess } from "../store/slices/role/roleSlice";
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

    const updateRole = async(roleId: string, roleData: UpdateRoleRequest) => {
        dispatch(updateRoleStart());
        try {
            await roleService.updateRole(roleId, roleData);
            dispatch(updateRoleSuccess({roleId,role: roleData}));
        } catch(error: any) {
            const message = getErrorMessage(error,'Error al actualizar el role');
            dispatch(udpateRoleError(message));
            throw new ApiException(message, error.response?.status, error.response?.data?.errors);
        }
    }

    const deleteRole = async(roleId: string) => {
        dispatch(deleteRoleStart());
        try {   
            await roleService.deleteRole(roleId);
            dispatch(deleteRoleSuccess(roleId));
        }catch(error: any) {
            const message = getErrorMessage(error, 'Error al eliminar el role');
            dispatch(deleteRoleError(message));
            throw new ApiException(message, error.response?.status, error.response?.data?.errors);
        }
    }


    return { roles, loading, error, getRoles, createRole, updateRole, deleteRole, creating, clearRoleError }
}

const getErrorMessage = (error: any, fallback: string) : string => {
    const apiError = error?.response?.data;
    return apiError?.errors?.[0] ?? apiError?.message ?? error?.message ?? fallback;
}