import type { RootState } from "../store"
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface MeetDetails {
    id: string;
    channel_name: string;
    created_at: string;
}

export interface MeetTokenApiBody {
    channel_name: string;
}

export interface MeetTokenResponse {
    token: string;
    expires_in: number;
}

export const meetApi = createApi({
    reducerPath: 'meetApi',
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
    tagTypes: ["MeetDetails", "MeetToken"],
    endpoints: (builder) => ({
        getMeetDetails: builder.query<MeetDetails, string>({
            query: (meet_id) => `meet/${meet_id}/`,
            providesTags: ["MeetDetails"]
        }),
        createMeetToken: builder.mutation<MeetTokenResponse, MeetTokenApiBody>({
            query: (data) => ({
                url: '/meet/token/',
                method: 'POST',
                body: data,
            }),
            transformErrorResponse: (response: any) => {
                return response;
            },
        })
    })
})

export const {
    useGetMeetDetailsQuery,
    useCreateMeetTokenMutation,
} = meetApi;
