import type { RootState } from '../store'
import { Rating } from "@/types/api";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Hospital {
    id: string;
    name: string;
    photo: string;
    cover_image: string;
    specialties: string[];
    phone_number: string;
    website: string;
    address: string;
    city: string;
    state: string;
    country: string;
    is_active?: boolean;
    is_visible?: boolean;
    bio: string;
    kyc_status: "PENDING" | "VERIFIED" | "REJECTED" | "SUSPENDED";
    email: string;
    rating?: Rating;
    total_appointments?: number;
    total_doctors?: number;
    total_patients?: number;
    license_document?: string;
    id_document?: string;
    created_at: string;
}

export interface HospitalsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Hospital[];
}

export interface HospitalsQueryParams {
    page?: number;
    search?: string;
    specialties?: string;
    page_size?: number;
}

export const hospitalsApi = createApi({
    reducerPath: 'hospitalsApi',
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
    tagTypes: ['Hospitals'],
    endpoints: (builder) => ({
        getHospitals: builder.query<HospitalsResponse, HospitalsQueryParams>({
            query: (params) => {
                const searchParams = new URLSearchParams();
                
                if (params.page) {
                    searchParams.append('page', params.page.toString());
                }
                if (params.search) {
                    searchParams.append('search', params.search);
                }
                if (params.specialties) {
                    searchParams.append('specialties', params.specialties);
                }
                if (params.page_size) {
                    searchParams.append('page_size', params.page_size.toString());
                }
                
                return `hospitals/?${searchParams.toString()}`;
            },
            providesTags: ['Hospitals'],
        }),
        getHospitalProfile: builder.query<Hospital, string>({
            query: (hospitalId) => `hospitals/${hospitalId}/`,
            providesTags: ['Hospitals'],
        }),
        getHospital: builder.query<Hospital, string>({
            query: (id) => `hospitals/${id}/`,
            providesTags: ['Hospitals'],
        }),
    }),
});

export const {
    useGetHospitalQuery,
    useGetHospitalsQuery,
    useGetHospitalProfileQuery
} = hospitalsApi;
