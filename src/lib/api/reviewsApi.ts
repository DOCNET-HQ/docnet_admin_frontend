import type { RootState } from '../store'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ReviewUser {
    id: string;
    name: string;
    email: string;
    photo: string | null;
}

export interface ReviewBase {
    id: string;
    user: ReviewUser;
    rating: number;
    text: string;
    created_at: string;
    updated_at: string;
    is_auth_user: boolean;
    is_updated: boolean;
}

export interface DoctorReview extends ReviewBase {
    doctor: string;
    doctor_name: string;
}

export interface HospitalReview extends ReviewBase {
    hospital: string;
    hospital_name: string;
}

export interface ReviewsResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
    page_size?: number;
    current_page?: number;
    total_pages?: number;
}

export interface HasReviewedResponse {
    has_reviewed: boolean;
}

export interface ReviewsQueryParams {
    page?: number;
    page_size?: number;
}

export const reviewsApi = createApi({
    reducerPath: 'reviewsApi',
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
    tagTypes: ['DoctorReviews', 'HospitalReviews'],
    endpoints: (builder) => ({
        // Check if user has reviewed
        hasReviewedDoctor: builder.query<HasReviewedResponse, string>({
            query: (doctorId) => `reviews/doctors/${doctorId}/has-reviewed/`,
        }),
        hasReviewedHospital: builder.query<HasReviewedResponse, string>({
            query: (hospitalId) => `reviews/hospitals/${hospitalId}/has-reviewed/`,
        }),

        // Doctor Reviews
        getDoctorReviews: builder.query<ReviewsResponse<DoctorReview>, { doctorId: string; params?: ReviewsQueryParams }>({
            query: ({ doctorId, params }) => {
                const searchParams = new URLSearchParams();
                if (params?.page) searchParams.append('page', params.page.toString());
                if (params?.page_size) searchParams.append('page_size', params.page_size.toString());
                
                return `reviews/doctors/${doctorId}/?${searchParams.toString()}`;
            },
            providesTags: ['DoctorReviews'],
        }),
        createDoctorReview: builder.mutation<DoctorReview, { doctorId: string; rating: number; text?: string }>({
            query: ({ doctorId, ...data }) => ({
                url: `reviews/doctors/${doctorId}/`,
                method: 'POST',
                body: data,
            }),
            transformErrorResponse: (response: any) => {
                return response;
            },
            invalidatesTags: ['DoctorReviews'],
        }),
        updateDoctorReview: builder.mutation<DoctorReview, { reviewId: string; rating?: number; text?: string }>({
            query: ({ reviewId, ...data }) => ({
                url: `reviews/doctor-reviews/${reviewId}/`,
                method: 'PATCH',
                body: data,
            }),
            transformErrorResponse: (response: any) => {
                return response;
            },
            invalidatesTags: ['DoctorReviews'],
        }),
        deleteDoctorReview: builder.mutation<void, string>({
            query: (reviewId) => ({
                url: `reviews/doctor-reviews/${reviewId}/`,
                method: 'DELETE',
            }),
            transformErrorResponse: (response: any) => {
                return response;
            },
            invalidatesTags: ['DoctorReviews'],
        }),

        // Hospital Reviews
        getHospitalReviews: builder.query<ReviewsResponse<HospitalReview>, { hospitalId: string; params?: ReviewsQueryParams }>({
            query: ({ hospitalId, params }) => {
                const searchParams = new URLSearchParams();
                if (params?.page) searchParams.append('page', params.page.toString());
                if (params?.page_size) searchParams.append('page_size', params.page_size.toString());
                
                return `reviews/hospitals/${hospitalId}/?${searchParams.toString()}`;
            },
            providesTags: ['HospitalReviews'],
        }),
        createHospitalReview: builder.mutation<HospitalReview, { hospitalId: string; rating: number; text?: string }>({
            query: ({ hospitalId, ...data }) => ({
                url: `reviews/hospitals/${hospitalId}/`,
                method: 'POST',
                body: data,
            }),
            transformErrorResponse: (response: any) => {
                return response;
            },
            invalidatesTags: ['HospitalReviews'],
        }),
        updateHospitalReview: builder.mutation<HospitalReview, { reviewId: string; rating?: number; text?: string }>({
            query: ({ reviewId, ...data }) => ({
                url: `reviews/hospital-reviews/${reviewId}/`,
                method: 'PATCH',
                body: data,
            }),
            transformErrorResponse: (response: any) => {
                return response;
            },
            invalidatesTags: ['HospitalReviews'],
        }),
        deleteHospitalReview: builder.mutation<void, string>({
            query: (reviewId) => ({
                url: `reviews/hospital-reviews/${reviewId}/`,
                method: 'DELETE',
            }),
            transformErrorResponse: (response: any) => {
                return response;
            },
            invalidatesTags: ['HospitalReviews'],
        }),
    }),
});


export const {
    useHasReviewedDoctorQuery,
    useHasReviewedHospitalQuery,
    useGetDoctorReviewsQuery,
    useCreateDoctorReviewMutation,
    useUpdateDoctorReviewMutation,
    useDeleteDoctorReviewMutation,
    useGetHospitalReviewsQuery,
    useCreateHospitalReviewMutation,
    useUpdateHospitalReviewMutation,
    useDeleteHospitalReviewMutation,
} = reviewsApi;
