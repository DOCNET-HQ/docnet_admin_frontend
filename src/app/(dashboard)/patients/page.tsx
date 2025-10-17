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
import { IconDotsVertical } from "@tabler/icons-react"
import Link from "next/link"

// Define your data type
interface PatientData extends BaseTableData {
    id: number
    photo: string
    name: string
    email: string
    gender: string
    state: string
    country: string
    is_active: boolean
    kyc_status: string
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

// Helper function to get KYC status badge color
const getKycStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
        case "VERIFIED":
            return "bg-green-600 text-white"
        case "PENDING":
            return "bg-yellow-500 text-white"
        case "REJECTED":
            return "bg-red-600 text-white"
        case "SUSPENDED":
            return "bg-blue-600 text-white"
        default:
            return "bg-gray-500 text-white"
    }
}

// Define your columns
const patientColumns: ColumnDef<PatientData>[] = [
    {
        id: "avatar",
        header: "",
        cell: ({ row }) => (
            <Avatar className="h-9 w-9">
                <AvatarImage
                    src={row.original.photo}
                    alt={row.original.name}
                    className="object-cover"
                />
                <AvatarFallback className="text-sm">
                    {getInitials(row.original.name)}
                </AvatarFallback>
            </Avatar>
        ),
        enableHiding: false,
        enableSorting: false,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="font-medium">{row.original.name}</div>
        ),
        enableHiding: false,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <div className="text-muted-foreground">{row.original.email}</div>
        ),
    },
    {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ row }) => (
            <Badge variant="outline" className="text-muted-foreground px-1.5">
                {row.original.gender}
            </Badge>
        ),
    },
    {
        id: "location",
        header: "Location",
        cell: ({ row }) => (
            <div className="text-sm">
                <div>{row.original.state}</div>
                <div className="text-muted-foreground text-xs">{row.original.country}</div>
            </div>
        ),
    },
    {
        accessorKey: "is_active",
        header: "Active",
        cell: ({ row }) => {
            const isActive = row.original.is_active
            return (
                <Badge 
                    variant="outline" 
                    className={`${isActive ? 'border-green-500 text-green-600 dark:text-green-400' : 'border-gray-400 text-gray-600 dark:text-gray-400'} px-2`}
                >
                    {isActive ? 'Active' : 'Inactive'}
                </Badge>
            )
        },
    },
    {
        accessorKey: "kyc_status",
        header: "KYC Status",
        cell: ({ row }) => {
            const status = row.original.kyc_status
            return (
                <Badge 
                    variant="secondary" 
                    className={`${getKycStatusColor(status)} px-2`}
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
                    <DropdownMenuItem>
                        <Link href={`/doctors/${row.id}`} className="w-full">
                        View Profile ${row.id}
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    <DropdownMenuItem>View Records</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]

// Usage in your component
export default function PatientsPage() {
    const data: PatientData[] = [
        {
            id: 1,
            photo: "https://i.pravatar.cc/150?img=1",
            name: "John Smith",
            email: "john.smith@email.com",
            gender: "Male",
            state: "California",
            country: "United States",
            is_active: true,
            kyc_status: "VERIFIED",
        },
        {
            id: 2,
            photo: "https://i.pravatar.cc/150?img=5",
            name: "Emma Johnson",
            email: "emma.johnson@email.com",
            gender: "Female",
            state: "New York",
            country: "United States",
            is_active: true,
            kyc_status: "VERIFIED",
        },
        {
            id: 3,
            photo: "https://i.pravatar.cc/150?img=8",
            name: "Michael Brown",
            email: "michael.brown@email.com",
            gender: "Male",
            state: "Texas",
            country: "United States",
            is_active: false,
            kyc_status: "PENDING",
        },
        {
            id: 4,
            photo: "https://i.pravatar.cc/150?img=9",
            name: "Sophia Davis",
            email: "sophia.davis@email.com",
            gender: "Female",
            state: "Florida",
            country: "United States",
            is_active: true,
            kyc_status: "REJECTED",
        },
        {
            id: 5,
            photo: "https://i.pravatar.cc/150?img=11",
            name: "William Wilson",
            email: "william.wilson@email.com",
            gender: "Male",
            state: "Illinois",
            country: "United States",
            is_active: true,
            kyc_status: "VERIFIED",
        },
        {
            id: 6,
            photo: "https://i.pravatar.cc/150?img=16",
            name: "Olivia Martinez",
            email: "olivia.martinez@email.com",
            gender: "Female",
            state: "Washington",
            country: "United States",
            is_active: true,
            kyc_status: "SUSPENDED",
        },
        {
            id: 7,
            photo: "https://i.pravatar.cc/150?img=17",
            name: "James Anderson",
            email: "james.anderson@email.com",
            gender: "Male",
            state: "Massachusetts",
            country: "United States",
            is_active: false,
            kyc_status: "PENDING",
        },
        {
            id: 8,
            photo: "https://i.pravatar.cc/150?img=20",
            name: "Isabella Taylor",
            email: "isabella.taylor@email.com",
            gender: "Female",
            state: "Georgia",
            country: "United States",
            is_active: true,
            kyc_status: "VERIFIED",
        },
        {
            id: 9,
            photo: "https://i.pravatar.cc/150?img=27",
            name: "Benjamin Thomas",
            email: "benjamin.thomas@email.com",
            gender: "Male",
            state: "Arizona",
            country: "United States",
            is_active: true,
            kyc_status: "VERIFIED",
        },
        {
            id: 10,
            photo: "https://i.pravatar.cc/150?img=29",
            name: "Mia Garcia",
            email: "mia.garcia@email.com",
            gender: "Female",
            state: "Colorado",
            country: "United States",
            is_active: true,
            kyc_status: "PENDING",
        },
    ]

    const handleDataChange = (newData: PatientData[]) => {
        console.log("Data changed:", newData)
        // You can save the new order to your backend here
    }

    const handleRowsSelected = (selectedRows: PatientData[]) => {
        console.log("Selected rows:", selectedRows)
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
                    columns={patientColumns}
                    enableDragDrop={true}
                    enableRowSelection={true}
                    enableColumnVisibility={true}
                    enablePagination={true}
                    onDataChange={handleDataChange}
                    onRowsSelected={handleRowsSelected}
                    showAddButton={false}
                    pageSize={10}
                />
            </div>
        </div>
    )
}
