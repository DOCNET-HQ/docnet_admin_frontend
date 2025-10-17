'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { ThemeToggle } from "@/components/theme/theme-toggle"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { theme, systemTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Ensure component is mounted before accessing theme
    useEffect(() => {
        setMounted(true)
    }, [])

    const currentTheme = mounted ? (theme === 'system' ? systemTheme : theme) : 'light'

    const backgroundImage = currentTheme === 'dark'
        ? "url(https://indianapolisrecorder.com/wp-content/uploads/2023/04/PHOTO-1-Black-doctor.jpg)"
        : "url(https://images.pexels.com/photos/4031905/pexels-photo-4031905.jpeg)"

    return (
        <div className="min-h-screen flex">
            {/* Left side - Fixed Branding/Image */}
            <div
                className="hidden lg:block lg:w-1/2 fixed left-0 top-0 h-screen overflow-hidden transition-all duration-500 ease-in-out"
                style={{
                    backgroundImage: mounted ? backgroundImage : "url(https://indianapolisrecorder.com/wp-content/uploads/2023/04/PHOTO-1-Black-doctor.jpg)",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Dark transparent overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 transition-opacity duration-500"></div>


                {/* Content overlay */}
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-white p-12">
                    <div className="absolute bottom-2 w-full max-w-2xl px-4">
                        {/* Glassmorphism container with blur and gradient */}
                        <div className="relative backdrop-blur-md bg-gradient-to-br from-white/20 via-white/10 to-transparent border border-white/20 rounded-xl p-3 shadow-2xl">
                            {/* Subtle inner glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/5 to-transparent rounded-xl"></div>

                            {/* Content */}
                            <div className="relative z-10 text-center overflow-hidden h-16">
                                {/* Carousel container */}
                                <div className="relative w-full h-full">
                                    <div className="absolute inset-0 flex transition-transform duration-[1500ms] ease-in-out animate-[slide_12s_infinite]">
                                        <div className="w-full flex-shrink-0 flex items-center justify-center px-4">
                                            <p className="text-base text-white/95 leading-relaxed font-medium">
                                                Join thousands of healthcare professionals managing patient records
                                            </p>
                                        </div>

                                        <div className="w-full flex-shrink-0 flex items-center justify-center px-4">
                                            <p className="text-base text-white/95 leading-relaxed font-medium">
                                                Streamline your workflow with advanced medical analytics and insights
                                            </p>
                                        </div>

                                        <div className="w-full flex-shrink-0 flex items-center justify-center px-4">
                                            <p className="text-base text-white/95 leading-relaxed font-medium">
                                                Experience real-time collaboration with your healthcare team
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-3 z-20 bottom-2">
                                <div className="w-8 h-2 bg-white/20 border border-white/40 rounded-full animate-[indicator1_12s_infinite]"></div>
                                <div className="w-8 h-2 bg-white/20 border border-white/40 rounded-full animate-[indicator2_12s_infinite]"></div>
                                <div className="w-8 h-2 bg-white/20 border border-white/40 rounded-full animate-[indicator3_12s_infinite]"></div>
                            </div>

                            {/* Animated floating particles */}
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white/20 rounded-full blur-sm animate-pulse"></div>
                            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400/30 rounded-full blur-sm animate-pulse delay-700"></div>
                        </div>
                    </div>
                </div>

                <style jsx>
                    {
                        `
                            @keyframes slide {
                                0%, 30% { transform: translateX(0%); }
                                33.33%, 63.33% { transform: translateX(-100%); }
                                66.66%, 96.66% { transform: translateX(-200%); }
                                100% { transform: translateX(0%); }
                            }

                            @keyframes indicator1 {
                                0%, 30% {
                                    background-color: rgba(255, 255, 255, 0.9);
                                    border-color: rgba(255, 255, 255, 0.9);
                                    transform: scale(1.2);
                                }
                                33.33%, 100% {
                                    background-color: rgba(255, 255, 255, 0.2);
                                    border-color: rgba(255, 255, 255, 0.4);
                                    transform: scale(1);
                                }
                            }

                            @keyframes indicator2 {
                                0%, 32% {
                                    background-color: rgba(255, 255, 255, 0.2);
                                    border-color: rgba(255, 255, 255, 0.4);
                                    transform: scale(1);
                                }
                                33.33%, 63.33% {
                                    background-color: rgba(255, 255, 255, 0.9);
                                    border-color: rgba(255, 255, 255, 0.9);
                                    transform: scale(1.2);
                                }
                                66.66%, 100% {
                                    background-color: rgba(255, 255, 255, 0.2);
                                    border-color: rgba(255, 255, 255, 0.4);
                                    transform: scale(1);
                                }
                            }

                            @keyframes indicator3 {
                                0%, 65% {
                                    background-color: rgba(255, 255, 255, 0.2);
                                    border-color: rgba(255, 255, 255, 0.4);
                                    transform: scale(1);
                                }
                                66.66%, 96.66% {
                                    background-color: rgba(255, 255, 255, 0.9);
                                    border-color: rgba(255, 255, 255, 0.9);
                                    transform: scale(1.2);
                                }
                                100% {
                                    background-color: rgba(255, 255, 255, 0.2);
                                    border-color: rgba(255, 255, 255, 0.4);
                                    transform: scale(1);
                                }
                            }
                        `
                    }
                </style>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 lg:ml-[50vw] flex flex-col justify-center min-h-screen">
                <div className="absolute right-5 top-5 z-20">
                    <ThemeToggle />
                </div>

                <div className="w-full max-w-md mx-auto px-6 py-12">
                    <div className="mb-8">
                        <div className="flex items-center justify-center mb-8">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">A</span>
                            </div>
                        </div>
                    </div>

                    {children}

                    <div className="mt-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            By continuing, you agree to our{" "}
                            <a href="#" className="underline underline-offset-4 hover:text-primary transition-colors text-blue-600">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="underline underline-offset-4 hover:text-primary transition-colors text-blue-600">
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
