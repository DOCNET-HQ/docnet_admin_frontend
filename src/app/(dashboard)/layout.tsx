"use client";

import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { useSelector } from "react-redux"
import { Header } from "@/components/dashboard/header"
import { Loader } from "@/components/dashboard/loader"
import ProtectedPage from "@/components/auth/ProtectedPage"
import { useGetBasicProfileQuery } from "@/lib/api/apiSlice"
import ErrorDisplay from "@/components/utils/error-display";
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { selectIsAuthenticated } from "@/lib/store/slices/authSlice"


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const isAuthenticated = useSelector(selectIsAuthenticated)

    const { data: profileData, isLoading, isError, refetch } = useGetBasicProfileQuery(
        undefined, 
        {
            skip: !isAuthenticated
        }
    );

    const refetchProfile = () => {
        refetch();
    };

    // Show loader only when authenticated and loading
    if (isAuthenticated && isLoading) return <Loader />;

    // Show error only when authenticated and there's an error
    if (isAuthenticated && isError) {
        return (
            <ErrorDisplay
                title="Failed to Load Profile"
                onRetry={refetchProfile}
                type="server"
            />
        );
    }

    return (
        <ProtectedPage>
            <SidebarProvider>
                <DashboardSidebar profileData={profileData} />
                <SidebarInset>
                    <div className="sticky top-0 z-50 bg-background border-b mb-6">
                        <Header profileData={profileData} />
                    </div>

                    {children}
                </SidebarInset>
            </SidebarProvider>
        </ProtectedPage>
    )
}
