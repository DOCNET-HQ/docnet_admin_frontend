export interface User {
  id: string
  role: string
  name: string
  email: string
  photo?: string
  profileId?: string
  kycStatus?: string
}

export interface AuthResponse {
  user: User
  access: string
  refresh: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}
