import type { CreateRoleRequest } from "../interfaces/role/CreateRoleRequest";
import type { CreateRoleResponse } from "../interfaces/role/CreateRoleResponse";
import type { Role } from "../interfaces/role/Role";
import type { RoleResponse } from "../interfaces/role/RoleResponse";
import type { UpdateRoleRequest } from "../interfaces/role/UpdateRoleRequest";
import api from './kalumManagmentApi';

export const roleService =  {
    
    getRoles: async() : Promise<RoleResponse> => {
        const response = await api.get<RoleResponse>('/roles');
        return response.data;
    },

    getRolebyId: async(roleId: string) : Promise<Role> => {
        const response = await api.get<Role>(`/roles/${roleId}`)
        return response.data;
    },

    createRole: async ( role: CreateRoleRequest ) : Promise<CreateRoleResponse> => {
        const response = await api.post<CreateRoleResponse>('/roles', role);
        return response.data;
    },

    updateRole: async(roleId: string, role: UpdateRoleRequest) : Promise<void> => {
        await api.put<void>(`/roles/${roleId}`,role);
    },

    deleteRole: async(roleId: string) : Promise<void> => {
        await api.delete<void>(`/roles/${roleId}`);
    }

}
