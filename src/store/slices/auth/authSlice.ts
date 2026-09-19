import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface JWTPayload { 
    sub: string; 
    user: string; 
    email: string; 
    identityUser: string; 
    role: string; 
    iat: number; 
    exp: number; 
}

interface AuthState {
    user: { user: string, email: string } | null;
    token: string | null;
    loading: boolean;
    error: string | null
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state, action: PayloadAction<{ success: boolean, message: string, data: { token: string, expiration: string }, errors: string[] }>) {
            state.loading = false;
            state.token = action.payload.data.token;
            const jwtPayload = decodeJWT(state.token);
            if (jwtPayload) { 
                state.user = { 
                    user: jwtPayload.user, 
                    email: jwtPayload.email 
                }; 
            }
            localStorage.setItem('token', action.payload.data.token);
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        loginError(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
});

const decodeJWT = (token: string): JWTPayload | null => { 
    try { 
        const payload = token.split('.')[1]; 
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/'); 
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(char => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2)).join('')); 
        return JSON.parse(jsonPayload); 
    } catch (error) { 
        console.error('Error decoding JWT:', error); 
        return null; 
    } 
};

export const { loginStart, loginSuccess, logout, loginError } = authSlice.actions;

export default authSlice.reducer;