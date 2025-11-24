"use client"

import { DataTable, BaseTableData } from "@/components/dashboard/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconDotsVertical, IconCalendar, IconClock } from "@tabler/icons-react"
import { toast } from "sonner"
import { useState } from "react"
import { useGetAppointmentsQuery } from "@/lib/api/appointmentsApi"
import { useGetAppointmentStatsQuery } from "@/lib/api/appointmentStatsApi"
import { Loader } from "@/components/dashboard/loader"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { 
    Calendar, 
    Users, 
    CheckCircle, 
    Clock,
    Building,
    TrendingUp,
    AlertCircle
} from "lucide-react"

// Define your data type based on API response
interface AppointmentData extends BaseTableData {
    id: string
    doctor_photo: string
    doctor_name: string
    patient_photo: string
    patient_name: string
    date: string
    time: string
    reason: string
    status: string
    appointment_type: string
}

// Helper function to get initials from name
const getInitials = (name: string) => {
    return name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'NA'
}

// Helper function to get status badge color
const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
        case "CONFIRMED":
        case "SCHEDULED":
            return "bg-green-600 text-white"
        case "PENDING":
            return "bg-yellow-500 text-white"
        case "CANCELLED":
            return "bg-red-600 text-white"
        case "COMPLETED":
            return "bg-blue-600 text-white"
        case "RESCHEDULED":
            return "bg-purple-600 text-white"
        default:
            return "bg-gray-500 text-white"
    }
}

// Helper function to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

// Helper function to format time
const formatTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    
    return `${start.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    })} - ${end.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    })}`
}

// Helper function to get appointment type display name
// const getAppointmentType = (type: string) => {
//     const typeMap: Record<string, string> = {
//         consultation: 'Consultation',
//         follow_up: 'Follow-up',
//         checkup: 'Checkup',
//         emergency: 'Emergency',
//         other: 'Other'
//     };
//     return typeMap[type] || type;
// }

// Define your columns
const appointmentColumns: ColumnDef<AppointmentData>[] = [
    {
        id: "doctor",
        header: "Doctor",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                    <AvatarImage
                        src={row.original.doctor_photo}
                        alt={row.original.doctor_name}
                        className="object-cover"
                    />
                    <AvatarFallback className="text-sm">
                        {getInitials(row.original.doctor_name)}
                    </AvatarFallback>
                </Avatar>
                <div className="font-medium">Dr. {row.original.doctor_name}</div>
            </div>
        ),
        enableHiding: false,
    },
    {
        id: "patient",
        header: "Patient",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                    <AvatarImage
                        src={row.original.patient_photo}
                        alt={row.original.patient_name}
                        className="object-cover"
                    />
                    <AvatarFallback className="text-sm">
                        {getInitials(row.original.patient_name)}
                    </AvatarFallback>
                </Avatar>
                <div className="font-medium">{row.original.patient_name}</div>
            </div>
        ),
        enableHiding: false,
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm">
                <IconCalendar className="size-4 text-muted-foreground" />
                <span>{row.original.date}</span>
            </div>
        ),
    },
    {
        accessorKey: "time",
        header: "Time",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm">
                <IconClock className="size-4 text-muted-foreground" />
                <span>{row.original.time}</span>
            </div>
        ),
    },
    {
        accessorKey: "reason",
        header: "Reason",
        cell: ({ row }) => (
            <div className="max-w-xs truncate" title={row.original.reason}>
                {row.original.reason || "No reason provided"}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status
            return (
                <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(status)} px-2 capitalize`}
                >
                    {status?.toLowerCase()}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                        size="icon"
                    >
                        <IconDotsVertical />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem>
                        <Link href={`/appointments/${row.original.id}`} className="w-full">
                            View Details
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>Reschedule</DropdownMenuItem>
                    <DropdownMenuItem disabled>Send Reminder</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" disabled>
                        Cancel
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]

// Stats Card Component
const StatsCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description,
    trend,
    className = "" 
}: { 
    title: string
    value: string | number
    icon: React.ElementType
    description?: string
    trend?: string
    className?: string
}) => (
    <Card className={className}>
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                        {title}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold">{value}</p>
                        {trend && (
                            <Badge variant="secondary" className="text-xs">
                                {trend}
                            </Badge>
                        )}
                    </div>
                    {description && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {description}
                        </p>
                    )}
                </div>
                <div className="flex-shrink-0">
                    <div className="p-3 rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
)

// Usage in your component
export default function AppointmentsPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [searchQuery, setSearchQuery] = useState("")

    const {
        data: appointmentsResponse,
        isLoading: appointmentsLoading,
        error: fetchError,
    } = useGetAppointmentsQuery({
        page: currentPage,
        page_size: pageSize,
        search: searchQuery || undefined,
    })

    const {
        data: statsData,
        isLoading: statsLoading,
        error: statsError
    } = useGetAppointmentStatsQuery()

    // Handle fetch errors
    if (fetchError) {
        toast.error("Failed to load appointments")
        console.error("Fetch error:", fetchError)
    }

    if (statsError) {
        console.error("Stats fetch error:", statsError)
    }

    const handleDataChange = (newData: AppointmentData[]) => {
        console.log("Data changed:", newData)
    }

    const handleRowsSelected = (selectedRows: AppointmentData[]) => {
        console.log("Selected rows:", selectedRows)
    }

    const handleAddClick = () => {
        console.log("Add button clicked")
        toast.success("Add Appointment clicked - implement your add logic here")
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    // const handlePageSizeChange = (size: number) => {
    //     setPageSize(size)
    //     setCurrentPage(1)
    // }

    // Transform API data to table format
    const tableData: AppointmentData[] = appointmentsResponse?.results?.map(appointment => ({
        id: appointment.id,
        doctor_photo: appointment.doctor?.photo || "",
        doctor_name: appointment.doctor?.name || "Unknown Doctor",
        patient_photo: appointment.patient?.photo || "",
        patient_name: appointment.patient?.name || "Unknown Patient",
        date: formatDate(appointment.scheduled_start_time),
        time: formatTime(appointment.scheduled_start_time, appointment.scheduled_end_time),
        reason: appointment.reason,
        status: appointment.status,
        appointment_type: appointment.appointment_type,
    })) || []

    const isLoading = appointmentsLoading || statsLoading

    return (
        <div className="flex flex-1 flex-col gap-4 p-5 pt-0">
            {/* Stats Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
                {statsLoading ? (
                    // Loading state for stats cards
                    Array.from({ length: 4 }).map((_, index) => (
                        <Card key={index} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-muted rounded w-3/4"></div>
                                        <div className="h-6 bg-muted rounded w-1/2"></div>
                                    </div>
                                    <div className="w-12 h-12 bg-muted rounded-full"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : statsData ? (
                    // Admin Dashboard Stats Cards
                    <>
                        <StatsCard
                            title="Total Appointments"
                            value={statsData.total_appointments || 0}
                            icon={Calendar}
                            description="All time appointments"
                            className="border-l-4 border-l-blue-500"
                        />
                        <StatsCard
                            title="Today's Appointments"
                            value={statsData.today_appointments || 0}
                            icon={Clock}
                            description="Scheduled for today"
                            className="border-l-4 border-l-green-500"
                        />
                        <StatsCard
                            title="Upcoming Appointments"
                            value={statsData.upcoming_appointments || 0}
                            icon={TrendingUp}
                            description="Next 7 days"
                            className="border-l-4 border-l-orange-500"
                        />
                        {'total_hospitals_with_appointments' in statsData ? (
                            <StatsCard
                                title="Active Hospitals"
                                value={(statsData as any).total_hospitals_with_appointments || 0}
                                icon={Building}
                                description="Hospitals with appointments"
                                className="border-l-4 border-l-purple-500"
                            />
                        ) : (
                            <StatsCard
                                title="Pending Confirmation"
                                value={statsData.pending_confirmation || 0}
                                icon={AlertCircle}
                                description="Awaiting confirmation"
                                className="border-l-4 border-l-yellow-500"
                            />
                        )}
                    </>
                ) : (
                    // Fallback when no stats data
                    <>
                        <StatsCard
                            title="Total Appointments"
                            value={appointmentsResponse?.count || 0}
                            icon={Calendar}
                            description="All appointments"
                            className="border-l-4 border-l-blue-500"
                        />
                        <StatsCard
                            title="Today's Appointments"
                            value={0}
                            icon={Clock}
                            description="Scheduled for today"
                            className="border-l-4 border-l-green-500"
                        />
                        <StatsCard
                            title="Active Doctors"
                            value={0}
                            icon={Users}
                            description="Doctors with appointments"
                            className="border-l-4 border-l-orange-500"
                        />
                        <StatsCard
                            title="Completion Rate"
                            value="0%"
                            icon={CheckCircle}
                            description="Successful appointments"
                            className="border-l-4 border-l-purple-500"
                        />
                    </>
                )}
            </div>

            {/* Additional Admin-specific Stats Row */}
            {statsData && 'system_wide_completed' in statsData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
                    <StatsCard
                        title="Completed This Month"
                        value={(statsData as any).system_wide_completed || 0}
                        icon={CheckCircle}
                        description="System-wide completions"
                        className="border-l-4 border-l-green-500"
                    />
                    <StatsCard
                        title="Cancellation Rate"
                        value={`${(statsData as any).system_wide_cancellation_rate || 0}%`}
                        icon={AlertCircle}
                        description="System-wide rate"
                        className="border-l-4 border-l-red-500"
                    />
                    <StatsCard
                        title="Pending Confirmation"
                        value={statsData.pending_confirmation || 0}
                        icon={Clock}
                        description="Awaiting doctor confirmation"
                        className="border-l-4 border-l-yellow-500"
                    />
                </div>
            )}

            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min px-7 py-10">
                {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader />
                    </div>
                ) : (
                    <DataTable
                        data={tableData}
                        columns={appointmentColumns}
                        enableDragDrop={false}
                        enableRowSelection={true}
                        enableColumnVisibility={true}
                        enablePagination={true}
                        onDataChange={handleDataChange}
                        onRowsSelected={handleRowsSelected}
                        showAddButton={false}
                        onAddClick={handleAddClick}
                        onSearchChange={setSearchQuery}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        // totalItems={appointmentsResponse?.count || 0}
                        onPageChange={handlePageChange}
                        // onPageSizeChange={handlePageSizeChange}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    )
}
