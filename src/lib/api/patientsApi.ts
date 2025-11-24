import type { RootState } from "../store";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Patient {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    gender?: string;
    city: string;
    state: string;
    country: string;
    kyc_status: string;
    is_active: boolean;
    is_visible: boolean;
    website?: string;
    address?: string;
    created_at: string;
    updated_at: string;
    photo?: string;
    dob?: string;
    bio?: string;
    id_document?: string;

}

export interface PatientsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Patient[];
}

export interface PatientsQueryParams {
    page?: number;
    search?: string;
    page_size?: number;
}

export const patientsApi = createApi({
    reducerPath: 'patientsApi',
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
    tagTypes: ['Patients'],
    endpoints: (builder) => ({
        getPatients: builder.query<PatientsResponse, PatientsQueryParams>({
            query: (params) => {
                const searchParams = new URLSearchParams();

                if (params.page) {
                    searchParams.append('page', params.page.toString());
                }
                if (params.search) {
                    searchParams.append('search', params.search);
                }
                if (params.page_size) {
                    searchParams.append('page_size', params.page_size.toString());
                }

                return `patients/?${searchParams.toString()}`;
            },
            providesTags: ['Patients'],
        }),

        getPatient: builder.query<Patient, string>({
            query: (id) => `patients/${id}/`,
            providesTags: ['Patients'],
        }),
    }),
});

export const { 
    useGetPatientsQuery,
    useGetPatientQuery 
} = patientsApi;
