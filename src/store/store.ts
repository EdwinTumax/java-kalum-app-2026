import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/auth/authSlice';
import userReducer from './slices/user/userSlice';
import roleReducer from './slices/role/roleSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        role: roleReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;