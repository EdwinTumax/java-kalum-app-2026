import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Role } from "../../../interfaces/role/Role";
import type { UpdateRoleRequest } from "../../../interfaces/role/UpdateRoleRequest";

interface RoleState {
    roles: Role[];
    loading: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    error: string | null;
}

const initialState : RoleState = {
    roles: [],
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null
}

const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        
        getRolesStart(state) {
            state.loading = true;
            state.error = null;
        },
        getRolesSuccess(state, action: PayloadAction<Role[]>) {
            state.loading = false;
            state.roles = action.payload;
            state.error = null;
        },
        getRolesError(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        clearRoles(state) {
            state.roles = [];
            state.error = null;
        },
        createRoleStart(state) {
            state.creating = true;
            state.error = null;
        },
        createRoleSuccess(state, action: PayloadAction<Role>) {
            state.creating = false;
            const exists = state.roles.some(role => role.roleId === action.payload.roleId);
            if(!exists) {
                state.roles.push(action.payload);
            }
            state.error = null;
        },
        createRoleError(state, action: PayloadAction<string>) {
            state.creating = false;
            state.error = action.payload;
        },
        clearRoleError(state) {
            state.error = null;
        },
        updateRoleStart(state) {
            state.updating = true;
            state.error = null;
        },
        updateRoleSuccess(state, action: PayloadAction<{roleId: string; role: UpdateRoleRequest}>) {
            const index = state.roles.findIndex(role => role.roleId === action.payload.roleId);
            if(index !== -1) {
                state.roles[index] = {
                    ...state.roles[index],
                    ...action.payload.role
                };
            }
            state.updating = false;
            state.error = null;
        },
        udpateRoleError(state, action: PayloadAction<string>) {
            state.updating = false;
            state.error = action.payload;
        },
        deleteRoleStart(state) {
            state.deleting = true;
            state.error = null;
        },
        deleteRoleSuccess(state, action: PayloadAction<string>) {
            state.roles = state.roles.filter(role => role.roleId !== action.payload);
            state.deleting = false;
            state.error = null;
        },
        deleteRoleError(state, action: PayloadAction<string>) {
            state.deleting = false;
            state.error = action.payload;
        }
    }
});

export const {
    getRolesStart, 
    getRolesSuccess, 
    getRolesError, 
    clearRoles, 
    createRoleStart, 
    createRoleSuccess, 
    createRoleError, 
    clearRoleError,
    updateRoleStart,
    updateRoleSuccess,
    udpateRoleError,
    deleteRoleStart,
    deleteRoleSuccess,
    deleteRoleError    
} = roleSlice.actions;

export default roleSlice.reducer;