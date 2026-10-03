import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Role } from "../../../interfaces/role/Role";

interface RoleState {
    roles: Role[];
    loading: boolean;
    creating: boolean;
    error: string | null;
}

const initialState : RoleState = {
    roles: [],
    loading: false,
    creating: false,
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
            state.roles.push(action.payload);
            state.error = null;
        },
        createRoleError(state, action: PayloadAction<string>) {
            state.creating = false;
            state.error = action.payload;
        },
        clearRoleError(state) {
            state.error = null;
        }

    }
});

export const {getRolesStart, getRolesSuccess, getRolesError, clearRoles, createRoleStart, createRoleSuccess, createRoleError, clearRoleError} = roleSlice.actions;

export default roleSlice.reducer;