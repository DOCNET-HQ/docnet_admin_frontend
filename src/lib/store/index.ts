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
import storage from 'redux-persist/lib/storage'
import { apiSlice } from '../api/apiSlice'
import authSlice from './slices/authSlice'
import { specialtiesApi } from '@/lib/api/specialtiesApi'
import { hospitalsApi } from '@/lib/api/hospitalsApi'
import { doctorsApi } from '@/lib/api/doctorsApi'
import { appointmentsApi } from '@/lib/api/appointmentsApi'
import { reviewsApi } from '@/lib/api/reviewsApi'
import { calendarApi } from '../api/calendarApi'
import { meetApi } from '../api/meetApi'
import { chatApi } from '../api/chatApi'
import { patientsApi } from '../api/patientsApi'
import { kycApi } from '../api/kycApi'
import { appointmentStatsApi } from '../api/appointmentStatsApi'
import { patientStatsApi } from '../api/patientStatsApi'
import { doctorStatsApi } from '../api/doctorStatsApi'
import { dashboardApi } from '../api/dashboardApi'
import { hospitalStatsApi } from '../api/hospitalStatsApi'

// Persist configuration for auth slice only
const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: [
        'user', 'token', 'refreshToken', 'isAuthenticated'
    ]
}

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice)

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        // Add all API reducers here
        [apiSlice.reducerPath]: apiSlice.reducer,
        [specialtiesApi.reducerPath]: specialtiesApi.reducer,
        [hospitalsApi.reducerPath]: hospitalsApi.reducer,
        [doctorsApi.reducerPath]: doctorsApi.reducer,
        [appointmentsApi.reducerPath]: appointmentsApi.reducer,
        [reviewsApi.reducerPath]: reviewsApi.reducer,
        [calendarApi.reducerPath]: calendarApi.reducer,
        [meetApi.reducerPath]: meetApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        [patientsApi.reducerPath]: patientsApi.reducer,
        [kycApi.reducerPath]: kycApi.reducer,
        [appointmentStatsApi.reducerPath]: appointmentStatsApi.reducer,
        [patientStatsApi.reducerPath]: patientStatsApi.reducer,
        [doctorStatsApi.reducerPath]: doctorStatsApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [hospitalStatsApi.reducerPath]: hospitalStatsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
                ],
            },
        }).concat(
            apiSlice.middleware,
            specialtiesApi.middleware,
            hospitalsApi.middleware,
            doctorsApi.middleware,
            appointmentsApi.middleware,
            reviewsApi.middleware,
            calendarApi.middleware,
            meetApi.middleware,
            chatApi.middleware,
            patientsApi.middleware,
            kycApi.middleware,
            appointmentStatsApi.middleware,
            patientStatsApi.middleware,
            doctorStatsApi.middleware,
            dashboardApi.middleware,
            hospitalStatsApi.middleware,
        ),
    devTools: process.env.NODE_ENV !== 'production',
})

setupListeners(store.dispatch)

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
