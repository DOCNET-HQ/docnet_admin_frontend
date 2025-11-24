import type { RootState } from "../store";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface PatientStats {
  total_patients: number;
  active_patients: number;
  pending_kyc: number;
  verified_patients: number;
}

export interface DoctorPatientStats extends PatientStats {
  patients_this_month: number;
  new_patients_today: number;
  appointment_conversion_rate: number;
}

export interface HospitalPatientStats extends PatientStats {
  patients_this_month: number;
  patients_this_week: number;
  kyc_completion_rate: number;
}

export interface AdminPatientStats extends PatientStats {
  total_hospitals_with_patients: number;
  system_wide_kyc_completion: number;
  patients_growth_rate: number;
}

export const patientStatsApi = createApi({
  reducerPath: 'patientStatsApi',
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
  tagTypes: ['PatientStats'],
  endpoints: (builder) => ({
    getPatientStats: builder.query<
      PatientStats | DoctorPatientStats | HospitalPatientStats | AdminPatientStats,
      void
    >({
      query: () => 'patients/dashboard-stats/',
      providesTags: ['PatientStats'],
    }),
  }),
});

export const { useGetPatientStatsQuery } = patientStatsApi;
