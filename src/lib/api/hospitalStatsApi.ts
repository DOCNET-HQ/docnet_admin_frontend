import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from "../store";

export interface HospitalStats {
    total_hospitals: number;
    verified_hospitals: number;
    active_hospitals: number;
    pending_kyc: number;
}

export interface HospitalAdminStats extends HospitalStats {
    hospital_rating: number;
    total_reviews: number;
    doctors_this_month: number;
    appointments_this_month: number;
    top_specialties: Array<{ specialty: string; count: number }>;
}

export interface AdminHospitalStats extends HospitalStats {
    total_hospitals_with_doctors: number;
    total_cities: number;
    system_wide_kyc_completion: number;
    hospitals_growth_rate: number;
    total_specialties: number;
    top_cities: Array<{ city: string; state: string; count: number }>;
}


export const hospitalStatsApi = createApi({
    reducerPath: 'hospitalStatsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['HospitalStats'],
    endpoints: (builder) => ({
        getHospitalStats: builder.query<
            HospitalStats | HospitalAdminStats | AdminHospitalStats,
            void
        >({
            query: () => 'hospitals/dashboard-stats/',
            providesTags: ['HospitalStats'],
        }),
    }),
});

export const { useGetHospitalStatsQuery } = hospitalStatsApi;
