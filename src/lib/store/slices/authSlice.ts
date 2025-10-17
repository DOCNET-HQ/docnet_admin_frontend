import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types/api'

interface AuthState {
    user: User | null
    token: string | null
    refreshToken: string | null
    isAuthenticated: boolean
}

const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{
                user: User
                token: string
                refreshToken: string
            }>
        ) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.refreshToken = action.payload.refreshToken
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.user = null
            state.token = null
            state.refreshToken = null
            state.isAuthenticated = false
        },
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload }
            }
        },
        updateUserPhoto: (state, action: PayloadAction<string>) => {
            if (state.user) {
                state.user.photo = action.payload;
            }
        },
    },
})

export const { setCredentials, logout, updateUser, updateUserPhoto } = authSlice.actions

export default authSlice.reducer

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user
export const selectToken = (state: { auth: AuthState }) => state.auth.token
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
