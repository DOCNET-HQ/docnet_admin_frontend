import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { logout } from '../store/slices/authSlice'
import type { RootState } from '../store'
import type {
    User,
    AuthResponse,
    LoginRequest,
    PaginatedResponse,
} from '@/types/api'

// Base query with authentication
const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers
    },
})

// Base query with automatic token refresh
const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
        // Try to refresh token
        const refreshToken = (api.getState() as RootState).auth.refreshToken
        if (refreshToken) {
            const refreshResult = await baseQuery(
                {
                    url: '/users/token/refresh',
                    method: 'POST',
                    body: { refresh: refreshToken },
                },
                api,
                extraOptions
            )

            if (refreshResult.data) {
                // Retry original query with new token
                result = await baseQuery(args, api, extraOptions)
            } else {
                // Refresh failed, logout user
                api.dispatch(logout())
            }
        } else {
            api.dispatch(logout())
        }
    }

    return result
}

// Retry with backoff
const baseQueryWithRetry = retry(baseQueryWithReauth, {
    maxRetries: 3,
})

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithRetry,
    tagTypes: ['User', 'Post', 'Auth'],
    endpoints: (builder) => ({
        // Authentication endpoints
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/users/token/',
                method: 'POST',
                body: {
                    email: credentials.email,
                    password: credentials.password,
                    role: 'admin'
                },
            }),
            invalidatesTags: ['Auth'],
            transformResponse: (response: any): AuthResponse => {
                return {
                    ...response,
                    user: {
                        ...response.user,
                        id: response.user.user_id,
                        profileId: response.user.profile_id,
                        kycStatus: response.user.kyc_status,
                    },
                };
            },
        }),

        refreshToken: builder.mutation<AuthResponse, { refreshToken: string }>({
            query: ({ refreshToken }) => ({
                url: '/users/token/refresh',
                method: 'POST',
                body: { refresh: refreshToken },
            }),
        }),

        requestPasswordReset: builder.mutation({
            query: (credentials) => ({
                url: '/users/password-reset/',
                method: 'POST',
                body: {
                    email: credentials.email,
                },
            }),
            invalidatesTags: ['User']
        }),

        resetPassword: builder.mutation({
            query: (credentials) => ({
                url: `/users/password-reset-confirm/${credentials.uidb64}/${credentials.token}/`,
                method: 'POST',
                body: {
                    new_password1: credentials.new_password1,
                    new_password2: credentials.new_password2,
                },
            }),
            invalidatesTags: ['User']
        }),

        getBasicProfile: builder.query<any, void>({
            query: () => '/admins/my-basic-profile/',
            providesTags: ['Auth'],
        }),

        getProfile: builder.query<any, void>({
            query: () => '/admins/my-profile/',
            providesTags: ['Auth'],
        }),

        updateProfile: builder.mutation<any, Partial<any>>({
            query: (profileData) => ({
                url: '/admins/my-profile/',
                method: 'PATCH',
                body: profileData,
            }),
            invalidatesTags: ['Auth'],
        }),

        // User endpoints
        getUsers: builder.query<
            PaginatedResponse<User>,
            {
                page?: number
                limit?: number
                search?: string
            }
        >({
            query: ({ page = 1, limit = 10, search }) => ({
                url: '/users',
                params: { page, limit, search },
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'User' as const, id })),
                        { type: 'User', id: 'LIST' },
                    ]
                    : [{ type: 'User', id: 'LIST' }],
        }),

        getUser: builder.query<User, string>({
            query: (id) => `/users/${id}`,
            providesTags: (result, error, id) => [{ type: 'User', id }],
        }),

        createUser: builder.mutation<User, Partial<User>>({
            query: (userData) => ({
                url: '/users/',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }],
        }),

        updateUser: builder.mutation<User, { id: string; data: Partial<User> }>({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
            // Optimistic update
            onQueryStarted: async ({ id, data }, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getUser', id, (draft) => {
                        Object.assign(draft, data)
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },
        }),

        deleteUser: builder.mutation<void, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'User', id },
                { type: 'User', id: 'LIST' },
            ],
        }),

        // File upload
        uploadFile: builder.mutation<{ url: string; filename: string }, File>({
            query: (file) => {
                const formData = new FormData()
                formData.append('file', file)

                return {
                    url: '/upload',
                    method: 'POST',
                    body: formData,
                }
            },
        }),
    }),
})

// Export hooks
export const {
    useLoginMutation,
    useResetPasswordMutation,
    useRequestPasswordResetMutation,
    useRefreshTokenMutation,
    useGetUsersQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useUploadFileMutation,
    useGetBasicProfileQuery,
    useGetProfileQuery,
    useUpdateProfileMutation,
    // Lazy queries for programmatic usage
    useLazyGetUsersQuery,
    useLazyGetUserQuery,
} = apiSlice

// Export utilities
export const { updateQueryData, invalidateTags, resetApiState } = apiSlice.util
