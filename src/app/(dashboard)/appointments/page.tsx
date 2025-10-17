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

// Define your data type
interface AppointmentData extends BaseTableData {
    id: number
    doctor_photo: string
    doctor_name: string
    patient_photo: string
    patient_name: string
    date: string
    time: string
    reason: string
    status: string
}

// Helper function to get initials from name
const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

// Helper function to get status badge color
const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
        case "CONFIRMED":
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

// Define your columns
const appointmentColumns: ColumnDef<AppointmentData>[] = [
    {
        id: "doctor",
        header: "Doctor",
        accessorKey: "doctor_name",
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
                <div className="font-medium">{row.original.doctor_name}</div>
            </div>
        ),
        enableHiding: false,
    },
    {
        id: "patient",
        header: "Patient",
        accessorKey: "patient_name",
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
                <span>{formatDate(row.original.date)}</span>
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
                {row.original.reason}
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
                    className={`${getStatusColor(status)} px-2`}
                >
                    {status.charAt(0) + status.slice(1).toLowerCase()}
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
                    <DropdownMenuItem>View Details ${row.id}</DropdownMenuItem>
                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                    <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Cancel</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]

// Usage in your component
export default function AppointmentsPage() {
    const data: AppointmentData[] = [
        {
            id: 1,
            doctor_photo: "https://i.pravatar.cc/150?img=12",
            doctor_name: "Dr. Sarah Johnson",
            patient_photo: "https://i.pravatar.cc/150?img=1",
            patient_name: "John Smith",
            date: "2025-10-15",
            time: "9:00 AM - 9:30 AM",
            reason: "Annual checkup and blood pressure monitoring",
            status: "CONFIRMED",
        },
        {
            id: 2,
            doctor_photo: "https://i.pravatar.cc/150?img=13",
            doctor_name: "Dr. Michael Chen",
            patient_photo: "https://i.pravatar.cc/150?img=5",
            patient_name: "Emma Johnson",
            date: "2025-10-15",
            time: "10:30 AM - 11:00 AM",
            reason: "Follow-up consultation for migraine treatment",
            status: "CONFIRMED",
        },
        {
            id: 3,
            doctor_photo: "https://i.pravatar.cc/150?img=47",
            doctor_name: "Dr. Emily Rodriguez",
            patient_photo: "https://i.pravatar.cc/150?img=8",
            patient_name: "Michael Brown",
            date: "2025-10-16",
            time: "2:00 PM - 2:30 PM",
            reason: "Pediatric consultation for child vaccination",
            status: "PENDING",
        },
        {
            id: 4,
            doctor_photo: "https://i.pravatar.cc/150?img=33",
            doctor_name: "Dr. James Wilson",
            patient_photo: "https://i.pravatar.cc/150?img=9",
            patient_name: "Sophia Davis",
            date: "2025-10-16",
            time: "3:30 PM - 4:00 PM",
            reason: "Orthopedic assessment for knee pain",
            status: "CONFIRMED",
        },
        {
            id: 5,
            doctor_photo: "https://i.pravatar.cc/150?img=45",
            doctor_name: "Dr. Aisha Patel",
            patient_photo: "https://i.pravatar.cc/150?img=11",
            patient_name: "William Wilson",
            date: "2025-10-17",
            time: "11:00 AM - 11:30 AM",
            reason: "Dermatology consultation for skin condition",
            status: "RESCHEDULED",
        },
        {
            id: 6,
            doctor_photo: "https://i.pravatar.cc/150?img=52",
            doctor_name: "Dr. Robert Martinez",
            patient_photo: "https://i.pravatar.cc/150?img=16",
            patient_name: "Olivia Martinez",
            date: "2025-10-17",
            time: "1:30 PM - 2:00 PM",
            reason: "Oncology follow-up and test results review",
            status: "COMPLETED",
        },
        {
            id: 7,
            doctor_photo: "https://i.pravatar.cc/150?img=48",
            doctor_name: "Dr. Linda Thompson",
            patient_photo: "https://i.pravatar.cc/150?img=17",
            patient_name: "James Anderson",
            date: "2025-10-18",
            time: "10:00 AM - 10:30 AM",
            reason: "Mental health counseling session",
            status: "CANCELLED",
        },
        {
            id: 8,
            doctor_photo: "https://i.pravatar.cc/150?img=59",
            doctor_name: "Dr. David Kim",
            patient_photo: "https://i.pravatar.cc/150?img=20",
            patient_name: "Isabella Taylor",
            date: "2025-10-18",
            time: "4:00 PM - 4:30 PM",
            reason: "Pre-surgical consultation and evaluation",
            status: "CONFIRMED",
        },
        {
            id: 9,
            doctor_photo: "https://i.pravatar.cc/150?img=32",
            doctor_name: "Dr. Maria Garcia",
            patient_photo: "https://i.pravatar.cc/150?img=27",
            patient_name: "Benjamin Thomas",
            date: "2025-10-19",
            time: "9:30 AM - 10:00 AM",
            reason: "Prenatal checkup and ultrasound",
            status: "PENDING",
        },
        {
            id: 10,
            doctor_photo: "https://i.pravatar.cc/150?img=60",
            doctor_name: "Dr. Thomas Anderson",
            patient_photo: "https://i.pravatar.cc/150?img=29",
            patient_name: "Mia Garcia",
            date: "2025-10-19",
            time: "2:30 PM - 3:00 PM",
            reason: "Radiology scan interpretation and consultation",
            status: "COMPLETED",
        },
    ]

    const handleDataChange = (newData: AppointmentData[]) => {
        console.log("Data changed:", newData)
        // You can save the new order to your backend here
    }

    const handleRowsSelected = (selectedRows: AppointmentData[]) => {
        console.log("Selected rows:", selectedRows)
    }

    const handleAddClick = () => {
        console.log("Add button clicked")
        toast.success("Add Appointment clicked - implement your add logic here")
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-5 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3 mb-7">
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
            </div>

            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min px-7 py-10">
                <DataTable
                    data={data}
                    columns={appointmentColumns}
                    enableDragDrop={false}
                    enableRowSelection={true}
                    enableColumnVisibility={true}
                    enablePagination={true}
                    onDataChange={handleDataChange}
                    onRowsSelected={handleRowsSelected}
                    showAddButton={true}
                    onAddClick={handleAddClick}
                    addButtonLabel="Add Appointment"
                    pageSize={10}
                />
            </div>
        </div>
    )
}
