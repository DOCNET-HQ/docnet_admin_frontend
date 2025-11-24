import type { RootState } from "../store";
import { Rating } from "@/types/api";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Doctor {
    id: string;
    user_id?: string;
    name: string;
    photo: string;
    email: string;
    phone_number: string;
    specialty: string;
    city: string;
    state: string;
    country: string;
    kyc_status: string;
    created_at: string;
    updated_at: string;
    bio?: string;
    website?: string;
    rating?: Rating;
    gender?: string;
    license_document?: string;
    id_document?: string;
    is_active?: boolean;
    is_visible?: boolean;
    address?: string;
    license_number?: string;
    license_expiry_date?: string;
    num_of_patients?: number;
    years_of_experience?: number;
    num_of_appointments?: number;
    hospital?: {
        id: string;
        name: string;
    };
}

export interface DoctorsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Doctor[];
}

export interface DoctorsQueryParams {
    page?: number;
    search?: string;
    hospital_id?: string;
    specialty?: string;
    page_size?: number;
}

export const doctorsApi = createApi({
    reducerPath: 'doctorsApi',
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
    tagTypes: ['Doctors'],
    endpoints: (builder) => ({
        getDoctors: builder.query<DoctorsResponse, DoctorsQueryParams>({
            query: (params) => {
                const searchParams = new URLSearchParams();

                if (params.page) {
                    searchParams.append('page', params.page.toString());
                }
                if (params.search) {
                    searchParams.append('search', params.search);
                }
                if (params.hospital_id) {
                    searchParams.append('hospital_id', params.hospital_id);
                }
                if (params.specialty) {
                    searchParams.append('specialty', params.specialty);
                }
                if (params.page_size) {
                    searchParams.append('page_size', params.page_size.toString());
                }

                return `doctors/?${searchParams.toString()}`;
            },
            providesTags: ['Doctors'],
        }),

        getDoctor: builder.query<Doctor, string>({
            query: (id) => `doctors/${id}/`,
            providesTags: ['Doctors'],
        }),
    }),
});

export const { useGetDoctorsQuery, useGetDoctorQuery } = doctorsApi;
