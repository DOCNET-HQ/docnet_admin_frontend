import { PasswordResetRequestForm } from '@/components/auth/PasswordResetRequest'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Forgot Password | Admin Dashboard',
    description: 'Reset your password',
}

export default function ForgotPasswordPage() {
    return <PasswordResetRequestForm />
}
