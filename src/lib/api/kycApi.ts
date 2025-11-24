import type { RootState } from "../store";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CreateKycRecordRequest {
    status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
    reason?: string;
}

export interface DoctorCreateKycRecordRequest extends CreateKycRecordRequest {
    doctor: string;
}

export interface HospitalCreateKycRecordRequest extends CreateKycRecordRequest {
    hospital: string;
}

export interface KycRecord {
    id: string;
    status: string;
    reason?: string;
    created_at: string;
    updated_at: string;
}

export interface DoctorKycRecord extends KycRecord {
    doctor?: string;
}

export interface HospitalKycRecord extends KycRecord {
    hospital?: string;
}

export const kycApi = createApi({
    reducerPath: 'kycApi',
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
    tagTypes: ['Kyc'],
    endpoints: (builder) => ({
        createDoctorKycRecord: builder.mutation<DoctorKycRecord, DoctorCreateKycRecordRequest>({
            query: (body) => ({
                url: '/doctors/kyc-records/create/',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Kyc'],
        }),
        getDoctorKycRecords: builder.query<{ results: DoctorKycRecord[] }, string>({
            query: (doctorId) => `/kyc-records/?doctor=${doctorId}/`,
            providesTags: ['Kyc'],
        }),
        createHospitalKycRecord: builder.mutation<HospitalKycRecord, HospitalCreateKycRecordRequest>({
            query: (body) => ({
                url: '/hospitals/kyc-records/create/',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Kyc'],
        }),
        getHospitalKycRecords: builder.query<{ results: HospitalKycRecord[] }, string>({
            query: (doctorId) => `/kyc-records/?hospital=${doctorId}/`,
            providesTags: ['Kyc'],
        }),
    }),
});

export const {
    useCreateDoctorKycRecordMutation,
    useGetDoctorKycRecordsQuery,
    useCreateHospitalKycRecordMutation,
    useGetHospitalKycRecordsQuery,
} = kycApi;
