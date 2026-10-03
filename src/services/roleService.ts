import type { CreateRoleRequest } from "../interfaces/role/CreateRoleRequest";
import type { CreateRoleResponse } from "../interfaces/role/CreateRoleResponse";
import type { RoleResponse } from "../interfaces/role/RoleResponse";
import api from './kalumManagmentApi';

export const roleService =  {
    
    getRoles: async() : Promise<RoleResponse> => {
        const response = await api.get<RoleResponse>('/roles');
        return response.data;
    },

    createRole: async ( role: CreateRoleRequest ) : Promise<CreateRoleResponse> => {
        const response = await api.post<CreateRoleResponse>('/roles', role);
        return response.data;
    }

}
