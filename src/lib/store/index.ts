import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage
import { apiSlice } from '../api/apiSlice'
import authSlice from './slices/authSlice'

// Persist configuration for auth slice only
const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: [
        'user', 'token', 'refreshToken', 'isAuthenticated'
    ] // Only persist these fields
}

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice)

export const store = configureStore({
    reducer: {
        api: apiSlice.reducer,
        auth: persistedAuthReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
                ],
            },
        }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
})

setupListeners(store.dispatch)

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
