'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLoginMutation } from "@/lib/api/apiSlice"
import { useAppDispatch } from "@/hooks/redux"
import { setCredentials } from "@/lib/store/slices/authSlice"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { User } from '@/types/api'


export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})

    const [login, { isLoading }] = useLoginMutation()
    const dispatch = useAppDispatch()
    const router = useRouter()

    const searchParams = useSearchParams();
    const message = searchParams.get("message");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        // Basic validation
        const newErrors: typeof errors = {}
        if (!email) newErrors.email = 'Email is required'
        if (!password) newErrors.password = 'Password is required'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            const result = await login({ email, password }).unwrap()

            const user: User = {
                id: result.user.id,
                role: result.user.role,
                name: result.user.name,
                email: result.user.email,
                photo: result.user.photo,
                profileId: result.user.profileId,
                kycStatus: result.user.kycStatus,
            }

            // Store auth data in Redux
            dispatch(
                setCredentials(
                    {
                        user: user,
                        token: result.access,
                        refreshToken: result.refresh,
                    }
                )
            )

            router.push('/')
        } catch (error: unknown) {
            console.log(error);

            if (
                typeof error === "object" &&
                error !== null &&
                "data" in error
            ) {
                const err = error as {
                    data?: {
                        email?: string;
                        password?: string;
                        role?: string;
                        message?: string;
                    };
                };

                setErrors({
                    email: err.data?.email,
                    password: err.data?.password,
                    general:
                        !err.data?.email && !err.data?.password
                        ?
                            (
                                err.data?.role ||
                                err.data?.message ||
                                "Login failed. Please try again."
                            )
                        : undefined,
                });
            } else {
                setErrors({
                    email: undefined,
                    password: undefined,
                    general: "Login failed. Please try again.",
                });
            }
        }

    }

    return (
        <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold text-foreground">Login to your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    {
                        message
                        ||
                        "Enter your email below to login to your account"
                    }
                </p>
            </div>

            {errors.general && (
                <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md">
                    {errors.general}
                </div>
            )}

            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={cn(
                            "bg-background text-foreground border-input",
                            errors.email ? "border-red-500 dark:border-red-400" : ""
                        )}
                        disabled={isLoading}
                        required
                    />
                    {errors.email && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                </div>

                <div className="grid gap-3">
                    <div className="flex items-center">
                        <Label htmlFor="password" className="text-foreground">Password</Label>
                        <Link
                            href="/auth/forgot-password"
                            className="ml-auto text-xs underline-offset-4 hover:underline text-blue-600 transition-colors font-semibold"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={cn(
                                "bg-background text-foreground border-input pr-10",
                                errors.password ? "border-red-500 dark:border-red-400" : ""
                            )}
                            disabled={isLoading}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            disabled={isLoading}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
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
                            Signing in...
                        </>
                    ) : (
                        'Login'
                    )}
                </Button>

                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-background text-muted-foreground relative z-10 px-2">
                        Or continue with
                    </span>
                </div>

                <Button
                    variant="outline"
                    className="w-full border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                    type="button"
                    disabled={isLoading}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4 fill-current">
                        <path
                            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                        />
                    </svg>
                    Login with GitHub
                </Button>
            </div>
        </form>
    )
}
