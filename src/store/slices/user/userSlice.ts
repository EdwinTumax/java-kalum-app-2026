import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../../interfaces/user/User";

interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    loading: false,
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
        }

    }
});

export const { getUsersStart, getUsersSuccess, getUsersError, clearUsers } = userSlice.actions;

export default userSlice.reducer;
