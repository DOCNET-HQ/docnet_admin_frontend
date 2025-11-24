import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export interface MonthlyGrowthData {
    month: string;
    patients: number;
    doctors: number;
    hospitals: number;
}

export interface AppointmentDistributionData {
    type: string;
    count: number;
    color: string;
}

export interface RecentAppointment {
    id: string;
    patient_name: string;
    doctor_name: string;
    start_time: string;
    status: string;
    appointment_type: string;
}

export interface PendingApproval {
    id: string;
    role: string;
    name: string;
    submitted_at: string;
}

export interface DashboardData {
    total_patients: number;
    total_doctors: number;
    total_hospitals: number;
    recent_appointments: RecentAppointment[];
    pending_approvals: PendingApproval[];
    monthly_growth: MonthlyGrowthData[];
    appointment_distribution: AppointmentDistributionData[];
}

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
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
    tagTypes: ['Dashboard'],
    endpoints: (builder) => ({
        getDashboardData: builder.query<DashboardData, void>({
            query: () => 'dashboards/admin-stats/',
            providesTags: ['Dashboard'],
        }),
    }),
});

export const {
    useGetDashboardDataQuery,
} = dashboardApi;
