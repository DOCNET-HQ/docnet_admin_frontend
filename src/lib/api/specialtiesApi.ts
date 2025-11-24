import type { RootState } from '../store'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Specialty {
    id: number;
    name: string;
    image: string;
    description: string | null;
}

export const specialtiesApi = createApi({
    reducerPath: 'specialtiesApi',
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
    tagTypes: ['Specialties'],
    endpoints: (builder) => ({
        getSpecialties: builder.query<Specialty[], void>({
            query: () => 'profiles/specialties/',
            providesTags: ['Specialties'],
        }),
    }),
});

export const { useGetSpecialtiesQuery } = specialtiesApi;
