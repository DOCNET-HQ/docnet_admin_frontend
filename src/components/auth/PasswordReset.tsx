'use client'

import Link from 'next/link'
import { useState } from 'react'
import { cn } from "@/lib/utils"
import { useDispatch } from 'react-redux'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { logout } from '@/lib/store/slices/authSlice'
import { useRouter, useParams } from 'next/navigation'
import { useResetPasswordMutation } from "@/lib/api/apiSlice"


export function PasswordResetForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [new_password1, setNewPassword1] = useState('')
    const [new_password2, setNewPassword2] = useState('')
    const [errors, setErrors] = useState<{ new_password1?: string; new_password2?: string; general?: string }>({})

    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)

    const [resetPassword, { isLoading }] = useResetPasswordMutation()
    const router = useRouter()
    const params = useParams()
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        // Basic validation
        const newErrors: typeof errors = {}
        if (!new_password1) newErrors.new_password1 = 'Password is required'
        if (!new_password2) newErrors.new_password2 = 'Confirm password is required'
        if (new_password1 !== new_password2) newErrors.new_password2 = 'Passwords do not match'
        if (new_password1 && new_password1.length < 8) newErrors.new_password1 = 'Password must be at least 8 characters'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        // Extract uidb64 and token from URL params
        const uidb64 = params.uidb64 as string
        const token = params.token as string

        if (!uidb64 || !token) {
            setErrors({
                general: 'Invalid reset link. Please request a new password reset.'
            })
            return
        }

        try {
            const result = await resetPassword({
                new_password1,
                new_password2,
                uidb64,
                token
            }).unwrap()

            console.log(result)

            // Clear any existing auth state
            handleLogout()

            // Success - redirect to login
            router.push('/auth/login?message=Password reset successful. Please login with your new password.')

        } catch (error: unknown) {
            console.log(error)

            if (
                typeof error === "object" &&
                error !== null &&
                "data" in error
            ) {
                const err = error as {
                    data?: {
                        new_password1?: string[]
                        new_password2?: string[]
                        non_field_errors?: string[]
                        message?: string
                    }
                }

                setErrors({
                    new_password1: err.data?.new_password1?.[0],
                    new_password2: err.data?.new_password2?.[0],
                    general: err.data?.non_field_errors?.[0] ||
                        err.data?.message ||
                        "Password reset failed. Please try again."
                })
            } else {
                setErrors({
                    general: "Password reset failed. Please try again."
                })
            }
        }
    }

    return (
        <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold text-foreground">Reset Your Password</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your new password below.
                </p>
            </div>

            {errors.general && (
                <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md">
                    {errors.general}
                </div>
            )}

            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="new_password1" className="text-foreground">New Password</Label>
                    <div className="relative">
                        <Input
                            id="new_password1"
                            type={showPassword1 ? "text" : "password"}
                            placeholder="Enter your new password"
                            value={new_password1}
                            onChange={(e) => setNewPassword1(e.target.value)}
                            className={cn(
                                "bg-background text-foreground border-input pr-12",
                                errors.new_password1 ? "border-red-500 dark:border-red-400" : ""
                            )}
                            disabled={isLoading}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword1(!showPassword1)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            disabled={isLoading}
                        >
                            {showPassword1 ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {errors.new_password1 && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.new_password1}</p>
                    )}
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="new_password2" className="text-foreground">Confirm New Password</Label>
                    <div className="relative">
                        <Input
                            id="new_password2"
                            type={showPassword2 ? "text" : "password"}
                            placeholder="Confirm your new password"
                            value={new_password2}
                            onChange={(e) => setNewPassword2(e.target.value)}
                            className={cn(
                                "bg-background text-foreground border-input pr-12",
                                errors.new_password2 ? "border-red-500 dark:border-red-400" : ""
                            )}
                            disabled={isLoading}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword2(!showPassword2)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            disabled={isLoading}
                        >
                            {showPassword2 ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {errors.new_password2 && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.new_password2}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white transition-colors bg-blue-600 cursor-pointer"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Resetting Password...
                        </>
                    ) : (
                        'Reset Password'
                    )}
                </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link
                    href="/auth/login"
                    className="text-xs underline underline-offset-4 text-blue-600 transition-colors"
                >
                    Back to Login
                </Link>
            </div>
        </form>
    )
}
