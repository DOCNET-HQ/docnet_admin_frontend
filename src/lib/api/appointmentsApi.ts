import type { RootState } from "../store";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface User {
    id: string;
    email: string;
    name: string;
    photo: string;
}

export interface Appointment {
    id: string;patient
    : User;
    doctor: User;
    reason: string;
    notes?: string;
    appointment_type: string;
    status: string;
    scheduled_start_time: string;
    scheduled_end_time: string;
    duration: string;
    is_upcoming: boolean;
    is_past: boolean;
    cancelled_by?: string;
    technical_issues_reported?: string;
    cancellation_reason?: string;
    timezone: string;
    created_at: string;
}

export interface AppointmentsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Appointment[];
}

export interface AppointmentsQueryParams {
    doctor_id?: string;
    hospital_id?: string;
    patient_id?: string;
    page?: number;
    search?: string;
    status?: string;
    page_size?: number;
}

export interface CancelAppointmentRequest {
    id: string;
    cancellation_reason: string;
}

export const appointmentsApi = createApi({
    reducerPath: 'appointmentsApi',
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
    tagTypes: ['Appointments'],
    endpoints: (builder) => ({
        getAppointments: builder.query<AppointmentsResponse, AppointmentsQueryParams>({
            query: (params) => {
                const searchParams = new URLSearchParams();

                if (params.page) {
                    searchParams.append('page', params.page.toString());
                }
                if (params.search) {
                    searchParams.append('search', params.search);
                }
                if (params.status) {
                    searchParams.append('status', params.status);
                }
                if (params.page_size) {
                    searchParams.append('page_size', params.page_size.toString());
                }
                if (params.doctor_id) {
                    searchParams.append('doctor_id', params.doctor_id);
                }
                if (params.patient_id) {
                    searchParams.append('patient_id', params.patient_id);
                }

                return `appointments/?${searchParams.toString()}`;
            },
            providesTags: ['Appointments'],
        }),

        getAppointment: builder.query<Appointment, string>({
            query: (id) => `appointments/${id}/`,
            providesTags: ['Appointments'],
        }),

        bookAppointment: builder.mutation<Appointment, {
            doctor: string;
            appointment_type: string;
            scheduled_start_time: string;
            scheduled_end_time: string;
            reason: string;
            notes?: string;
        }>({
            query: (appointmentData) => ({
                url: 'appointments/',
                method: 'POST',
                body: appointmentData,
            }),
            transformErrorResponse: (response: any) => {
                return response;
            },
            invalidatesTags: ['Appointments'],
        }),

        cancelAppointment: builder.mutation<void, CancelAppointmentRequest>({
            query: (data) => ({
                url: `appointments/${data.id}/cancel/`,
                method: 'POST',
                body: {
                    cancellation_reason: data.cancellation_reason
                },
            }),
            transformErrorResponse: (response: any) => {
                return response;
            },
            invalidatesTags: ['Appointments'],
        }),

        rescheduleAppointment: builder.mutation<Appointment, { id: string; new_start_time: string; new_end_time: string }>({
            query: ({ id, new_start_time, new_end_time }) => ({
                url: `appointments/${id}/reschedule/`,
                method: 'POST',
                body: { new_start_time, new_end_time },
            }),
            transformErrorResponse: (response: any) => {
                return response;
            },
            invalidatesTags: ['Appointments'],
        }),
    }),
});

export const {
    useGetAppointmentsQuery,
    useGetAppointmentQuery,
    useBookAppointmentMutation,
    useCancelAppointmentMutation,
    useRescheduleAppointmentMutation
} = appointmentsApi;
