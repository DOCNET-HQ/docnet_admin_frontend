import type { RootState } from "../store";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface DoctorStats {
    total_doctors: number;
    active_doctors: number;
    verified_doctors: number;
    pending_kyc: number;
}

export interface HospitalDoctorStats extends DoctorStats {
    doctors_this_month: number;
    average_patients_per_doctor: number;
    top_specialties: Array<{ specialty: string; count: number }>;
}

export interface AdminDoctorStats extends DoctorStats {
    total_hospitals_with_doctors: number;
    system_wide_kyc_completion: number;
    doctors_growth_rate: number;
    specialties_distribution: Array<{ specialty: string; count: number }>;
}

export const doctorStatsApi = createApi({
    reducerPath: 'doctorStatsApi',
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
    tagTypes: ['DoctorStats'],
    endpoints: (builder) => ({
        getDoctorStats: builder.query<
            DoctorStats | HospitalDoctorStats | AdminDoctorStats,
            void
        >({
            query: () => 'doctors/dashboard-stats/',
            providesTags: ['DoctorStats'],
        }),
    }),
});

export const { useGetDoctorStatsQuery } = doctorStatsApi;
