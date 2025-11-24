"use client"

import * as React from "react"
import {
    Bot,
    UserRoundPlus,
    ClipboardMinus,
    ClipboardClock,
    CircleUserRound,
    LayoutDashboard,
    GalleryVerticalEnd,

} from "lucide-react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavUser } from "@/components/dashboard/nav-users"
import { TeamSwitcher } from "@/components/dashboard/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { useSelector } from 'react-redux'
import type { RootState } from '@/lib/store'
import { usePathname } from 'next/navigation'


type ProfileData = {
    id: string;
    name: string;
    email: string;
    photo: string;
};

type DashboardSidebarProps = React.ComponentProps<typeof Sidebar> & {
    profileData: ProfileData;
};

export function DashboardSidebar({ profileData, ...props }: DashboardSidebarProps) {
    const AUTH_USER_DATA = useSelector((state: RootState) => state.auth?.user)

    const user = {
        name: profileData?.name || AUTH_USER_DATA?.name || "Admin",
        email: profileData?.email || AUTH_USER_DATA?.email || "",
        avatar: profileData?.photo || AUTH_USER_DATA?.photo || "https://ui.shadcn.com/avatars/shadcn.jpg",
    }

    const pathname = usePathname();
    const IsPathActive = (path: string) => {
        return pathname === path;
    };

    const data = {
        platform: [
            {
                name: "DOCNET",
                logo: GalleryVerticalEnd,
                plan: "Admin",
            }
        ],
        navMain: [
            {
                title: "Dashboard",
                url: "/",
                icon: LayoutDashboard,
                isActive: IsPathActive("/")
            },
            {
                title: "Hospitals",
                url: "/hospitals",
                icon: UserRoundPlus,
                isActive: IsPathActive("/hospitals")
            },
            {
                title: "Doctors",
                url: "/doctors",
                icon: UserRoundPlus,
                isActive: IsPathActive("/doctors")
            },
            {
                title: "Patients",
                url: "/patients",
                icon: CircleUserRound,
                isActive: IsPathActive("/patients")
            },
            {
                title: "Appointments",
                url: "/appointments",
                icon: ClipboardClock,
                isActive: IsPathActive("/appointments")
            },
            // {
            //     title: "Messages",
            //     url: "/messages",
            //     icon: MessageCircleDashed,
            //     isActive: IsPathActive("/messages")
            // },
            {
                title: "Reports",
                url: "/reports",
                icon: ClipboardMinus,
                isActive: IsPathActive("/reports")
            },
            {
                title: "AI Assistant",
                url: "/ai-assistant",
                icon: Bot,
                isActive: IsPathActive("/ai-assistant")
            },
        ]
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.platform} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
