import type { RootState } from '../store'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CalendarMember {
    name: string;
    photo: string;
    role: string;
}

export interface CalendarEvent {
    meet_id: string;
    is_appointment: boolean;
    appointment_id: string;
    reason: string;
    notes: string;
    start_datetime: string;
    end_datetime: string;
    members: CalendarMember[];
}

export interface CalendarQueryParams {
    start_datetime: string;
    end_datetime: string;
}

export const calendarApi = createApi({
    reducerPath: 'calendarApi',
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
    tagTypes: ['CalendarEvents'],
    endpoints: (builder) => ({
        getCalendarEvents: builder.query<CalendarEvent[], CalendarQueryParams>({
            query: (params) => {
                const searchParams = new URLSearchParams();
                searchParams.append('start_datetime', params.start_datetime);
                searchParams.append('end_datetime', params.end_datetime);
                
                return `meet/calendar/?${searchParams.toString()}`;
            },
            providesTags: ['CalendarEvents'],
        }),
    }),
});

export const {
    useGetCalendarEventsQuery,
} = calendarApi;
