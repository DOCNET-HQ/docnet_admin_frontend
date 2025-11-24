
import type { RootState } from "../store";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface AppointmentStats {
    total_appointments: number;
    today_appointments: number;
    upcoming_appointments: number;
    pending_confirmation: number;
}

export interface DoctorAppointmentStats extends AppointmentStats {
    completed_this_week: number;
    cancellation_rate: number;
    average_daily_appointments: number;
}

export interface HospitalAppointmentStats extends AppointmentStats {
    total_doctors_with_appointments: number;
    completed_this_month: number;
    revenue_this_month?: number;
}

export interface AdminAppointmentStats extends AppointmentStats {
    total_hospitals_with_appointments: number;
    system_wide_completed: number;
    system_wide_cancellation_rate: number;
}

export const appointmentStatsApi = createApi({
    reducerPath: 'appointmentStatsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    tagTypes: ['AppointmentStats'],
    endpoints: (builder) => ({
        getAppointmentStats: builder.query<
            AppointmentStats |
            DoctorAppointmentStats |
            HospitalAppointmentStats |
            AdminAppointmentStats,
            void
        >({
            query: () => 'appointment-stats/dashboard-stats/',
            providesTags: ['AppointmentStats'],
        }),
    }),
});

export const { useGetAppointmentStatsQuery } = appointmentStatsApi;
