import type { RootState } from '../store'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ChatRoom {
    id: string;
    name: string;
    avatar?: string;
    description: string;
    room_type: 'direct' | 'group' | 'video_call_chat';
    participants: Participant[];
    participant_count: number;
    last_message?: Message;
    unread_count: number;
    user_role: string;
    is_admin: boolean;
    created_at: string;
    updated_at: string;
}

export interface ChatRoomsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    current_page: number;
    total_pages: number;
    results: ChatRoom[];
}

export interface Participant {
    user: User;
    role: string;
    joined_at: string;
    is_active: boolean;
}

export interface User {
    id: string;
    email: string;
    name: string;
    photo: string;
    online: boolean;
    last_seen: string;
}

export interface Message {
    id: string;
    room: string;
    sender: User;
    content: string;
    message_type: 'text' | 'system' | 'image' | 'file';
    file?: string;
    timestamp: string;
    is_own_message: boolean;
    reply_to?: Message;
}

export interface MessagesResponse {
    count: number;
    next: string | null;
    previous: string | null;
    current_page: number;
    total_pages: number;
    results: Message[];
}

export interface CreateDMPayload {
    user_id: string;
}

export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    tagTypes: ['ChatRooms', 'Messages'],
    endpoints: (builder) => ({
        // Get all chat rooms for the user
        getChatRooms: builder.query<ChatRoomsResponse, { page?: number }>({
            query: ({ page = 1 }) => `chat/rooms/?page=${page}`,
            providesTags: ['ChatRooms'],
            // Only have one cache entry
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            // Merge incoming data with existing data
            merge: (currentCache, newData) => {
                if (newData.current_page === 1) {
                    return newData;
                }

                return {
                    ...newData,
                    results: [...(currentCache?.results || []), ...newData.results],
                };
            },
            // Refetch when page changes
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.page !== previousArg?.page;
            },
        }),

        getChatRoom: builder.query<ChatRoom, string>({
            query: (roomId) => `chat/rooms/${roomId}/`,
            providesTags: (result, error, roomId) => [
                { type: 'ChatRooms', id: roomId }
            ],
        }),

        // Get or create DM room
        getOrCreateDM: builder.mutation<ChatRoom, CreateDMPayload>({
            query: (payload) => ({
                url: 'chat/rooms/get_or_create_dm/',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['ChatRooms'],
        }),

        // Get messages for a room
        getMessages: builder.query<MessagesResponse, { roomId: string; page?: number }>({
            query: ({ roomId, page = 1 }) => `chat/messages/?room_id=${roomId}&page=${page}`,
            providesTags: (result, error, { roomId }) => [
                { type: 'Messages', id: roomId }
            ],
            // Only have one cache entry per room
            serializeQueryArgs: ({ queryArgs }) => {
                return queryArgs.roomId;
            },
            // Merge incoming data with existing data
            merge: (currentCache, newData) => {
                if (newData.current_page === 1) {
                    return newData;
                }
                
                return {
                    ...newData,
                    results: [...(currentCache?.results || []), ...newData.results],
                };
            },
            // Refetch when page changes
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.page !== previousArg?.page;
            },
        }),

        // Send a message
        sendMessage: builder.mutation<Message, { room: string; content: string; reply_to_id?: string }>({
            query: (payload) => ({
                url: 'chat/messages/',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: (result, error, { room }) => [
                { type: 'Messages', id: room }
            ],
        }),

        // Search users
        searchUsers: builder.query<User[], { search?: string; online?: boolean }>({
            query: (params) => {
                const searchParams = new URLSearchParams();
                if (params.search) searchParams.append('search', params.search);
                if (params.online !== undefined) searchParams.append('online', params.online.toString());
                return `users/?${searchParams.toString()}`;
            },
        }),
    }),
});

export const {
    useGetChatRoomsQuery,
    useGetChatRoomQuery,
    useGetOrCreateDMMutation,
    useGetMessagesQuery,
    useSendMessageMutation,
    useSearchUsersQuery,
} = chatApi;
