"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[]
}) {
    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem
                        key={item.title}
                        className={`my-1.5 cursor-pointer py-1.5 rounded-md pr-2 ${item.isActive ? "bg-blue-600" : "hover:bg-blue-600 hover:[&_svg]:!text-white hover:[&_span]:!text-white"}`}
                        onClick={() => window.location.href = item.url}
                    >
                        <SidebarMenuButton className="cursor-pointer h-full hover:bg-transparent active:bg-transparent data-[active]:bg-transparent" tooltip={item.title}>
                            {
                                item.icon &&
                                <item.icon
                                    className={`text-lg ml-2 font-semibold ${item.isActive ? "text-white" : "text-black dark:text-white"}`}
                                />
                            }
                            <span
                                className={`text-md font-semibold ${item.isActive ? "text-white" : "text-black dark:text-white"}`}
                            >
                                {item.title}
                            </span>
                            <ChevronRight
                                className={`ml-auto transition-transform duration-200 ${item.isActive ? "text-white" : "text-black dark:text-white"}`}
                            />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
