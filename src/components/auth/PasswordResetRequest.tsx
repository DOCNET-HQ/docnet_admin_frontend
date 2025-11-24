'use client'

import { useState } from 'react'
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useSearchParams } from 'next/navigation'
import { useRequestPasswordResetMutation } from "@/lib/api/apiSlice"


export function PasswordResetRequestForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const searchParams = useSearchParams();
    const param_email = searchParams.get("email");

    const [email, setEmail] = useState(param_email || '')
    const [errors, setErrors] = useState<{ email?: string; general?: string }>({})
    const [responseMessage, setResponseMessage] = useState<string | null>(null)

    const [requestPasswordReset, { isLoading }] = useRequestPasswordResetMutation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        // Basic validation
        const newErrors: typeof errors = {}
        if (!email) newErrors.email = 'Email is required'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            const result = await requestPasswordReset({ email }).unwrap()

            console.log(result?.detail);
            setResponseMessage(result?.detail);

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
                        message?: string;
                    };
                };

                setErrors({
                    email: err.data?.email,
                    general:
                        !err.data?.email
                        ?
                            (
                                err.data?.message ||
                                "Password Reset failed. Please try again."
                            )
                        : undefined,
                });
            } else {
                setErrors({
                    email: undefined,
                    general: "Password Reset failed. Please try again.",
                });
            }
        }

    }

    return (
        <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold text-foreground">Password Reset</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your email address to reset your password.
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

                {
                    responseMessage && (
                        <p className="text-xs text-green-600 text-center">
                            {responseMessage}
                        </p>
                    )
                }


                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white transition-colors bg-blue-600 cursor-pointer"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        'Request Reset'
                    )}
                </Button>
            </div>
        </form>
    )
}
