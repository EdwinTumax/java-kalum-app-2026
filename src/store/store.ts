import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/auth/authSlice';
import userReducer from './slices/user/userSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;