import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../../interfaces/user/User";

interface UserState {
    users: User[];
    loading: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    error: string | null;
}


const initialState: UserState = {
    users: [],
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        
        getUsersStart(state) {
            state.loading = true;
            state.error = null;
        },

        getUsersSuccess(state, action: PayloadAction<User[]>) {
            state.loading = false,
            state.users = action.payload;
            state.error = null;
        },

        getUsersError(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        clearUsers(state) {
            state.users = [];
            state.error = null;
        },

        createUserStart(state) {
            state.creating = true;
            state.error = null;
        },

        createUserSuccess(state, action: PayloadAction<User>) {
            state.creating = false;
            const exists = state.users.some(user => user.userId === action.payload.userId);
            if(!exists) {
                state.users.push(action.payload);
            }        
            state.error = null;
        },

        createUserError(state, action: PayloadAction<string>) {
            state.creating = false;
            state.error = action.payload;
        },

        clearUserError (state) {
            state.error = null;
        },

        updateUserStart(state) {
            state.updating = true;
            state.error = null;
        },

        updateUserSuccess(state, action: PayloadAction<User>) {
            state.updating = false;
            const index = state.users.findIndex(user => user.userId === action.payload.userId);
            if(index !== -1) {
                state.users[index] = action.payload;
            }
            state.error = null;
        },

        updateUserError( state, action: PayloadAction<string>) {
            state.updating = false;
            state.error = action.payload;
        },

        deleteUserStart(state) {
            state.deleting = true;
            state.error = null;            
        },

        deleteUserSuccess(state, action: PayloadAction<string>) {
            state.deleting = false;
            state.users = state.users.filter(user => user.userId !== action.payload);
            state.error = null;
        },

        deleteUserError(state, action: PayloadAction<string>) {
            state.deleting = false;
            state.error = action.payload;
        }

    }
});

export const { 
    getUsersStart, 
    getUsersSuccess, 
    getUsersError, 
    clearUsers, 
    createUserStart, 
    createUserSuccess, 
    createUserError, 
    clearUserError,
    updateUserStart,
    updateUserSuccess,
    updateUserError,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserError,    
 } = userSlice.actions;

export default userSlice.reducer;
