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
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link"

// Define your data type
interface DoctorData extends BaseTableData {
    id: number
    photo: string
    name: string
    email: string
    gender: string
    specialty: string
    state: string
    country: string
    is_active: boolean
    is_visible: boolean
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

// Define your columns
const doctorColumns: ColumnDef<DoctorData>[] = [
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
        accessorKey: "specialty",
        header: "specialty",
        cell: ({ row }) => (
            <div>{row.original.specialty}</div>
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
                <div className="flex items-center gap-2">
                    <Switch
                        checked={isActive}
                        onCheckedChange={(checked) => {
                            toast.promise(
                                new Promise((resolve) => setTimeout(resolve, 1000)),
                                {
                                    loading: `Updating ${row.original.name}...`,
                                    success: `${row.original.name} is now ${checked ? 'active' : 'inactive'}`,
                                    error: "Failed to update status",
                                }
                            )
                        }}
                    />
                    <Label className="sr-only">Toggle active status</Label>
                </div>
            )
        },
    },
    {
        accessorKey: "is_visible",
        header: "Visible",
        cell: ({ row }) => {
            const isVisible = row.original.is_visible
            return (
                <div className="flex items-center gap-2">
                    <Switch
                        checked={isVisible}
                        onCheckedChange={(checked) => {
                            toast.promise(
                                new Promise((resolve) => setTimeout(resolve, 1000)),
                                {
                                    loading: `Updating ${row.original.name}...`,
                                    success: `${row.original.name} is now ${checked ? 'visible' : 'hidden'}`,
                                    error: "Failed to update visibility",
                                }
                            )
                        }}
                    />
                    <Label className="sr-only">Toggle visibility</Label>
                </div>
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
                        className="data-[state=open]:bg-muted text-muted-foreground flex size-8 cursor-pointer"
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
                    <DropdownMenuItem>Update Kyc status</DropdownMenuItem>
                    <DropdownMenuItem>Deactivate User</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]

// Usage in your component
export default function DoctorsPage() {
    const data: DoctorData[] = [
        {
            id: 1,
            photo: "https://i.pravatar.cc/150?img=12",
            name: "Dr. Sarah Johnson",
            email: "sarah.johnson@hospital.com",
            gender: "Female",
            specialty: "Cardiology",
            state: "California",
            country: "United States",
            is_active: true,
            is_visible: true,
        },
        {
            id: 2,
            photo: "https://i.pravatar.cc/150?img=13",
            name: "Dr. Michael Chen",
            email: "michael.chen@hospital.com",
            gender: "Male",
            specialty: "Neurology",
            state: "New York",
            country: "United States",
            is_active: true,
            is_visible: true,
        },
        {
            id: 3,
            photo: "https://i.pravatar.cc/150?img=47",
            name: "Dr. Emily Rodriguez",
            email: "emily.rodriguez@hospital.com",
            gender: "Female",
            specialty: "Pediatrics",
            state: "Texas",
            country: "United States",
            is_active: false,
            is_visible: true,
        },
        {
            id: 4,
            photo: "https://i.pravatar.cc/150?img=33",
            name: "Dr. James Wilson",
            email: "james.wilson@hospital.com",
            gender: "Male",
            specialty: "Orthopedics",
            state: "Florida",
            country: "United States",
            is_active: true,
            is_visible: false,
        },
        {
            id: 5,
            photo: "https://i.pravatar.cc/150?img=45",
            name: "Dr. Aisha Patel",
            email: "aisha.patel@hospital.com",
            gender: "Female",
            specialty: "Dermatology",
            state: "Illinois",
            country: "United States",
            is_active: true,
            is_visible: true,
        },
        {
            id: 6,
            photo: "https://i.pravatar.cc/150?img=52",
            name: "Dr. Robert Martinez",
            email: "robert.martinez@hospital.com",
            gender: "Male",
            specialty: "Oncology",
            state: "Washington",
            country: "United States",
            is_active: true,
            is_visible: true,
        },
        {
            id: 7,
            photo: "https://i.pravatar.cc/150?img=48",
            name: "Dr. Linda Thompson",
            email: "linda.thompson@hospital.com",
            gender: "Female",
            specialty: "Psychiatry",
            state: "Massachusetts",
            country: "United States",
            is_active: false,
            is_visible: false,
        },
        {
            id: 8,
            photo: "https://i.pravatar.cc/150?img=59",
            name: "Dr. David Kim",
            email: "david.kim@hospital.com",
            gender: "Male",
            specialty: "Surgery",
            state: "Georgia",
            country: "United States",
            is_active: true,
            is_visible: true,
        },
        {
            id: 9,
            photo: "https://i.pravatar.cc/150?img=32",
            name: "Dr. Maria Garcia",
            email: "maria.garcia@hospital.com",
            gender: "Female",
            specialty: "Obstetrics",
            state: "Arizona",
            country: "United States",
            is_active: true,
            is_visible: true,
        },
        {
            id: 10,
            photo: "https://i.pravatar.cc/150?img=60",
            name: "Dr. Thomas Anderson",
            email: "thomas.anderson@hospital.com",
            gender: "Male",
            specialty: "Radiology",
            state: "Colorado",
            country: "United States",
            is_active: true,
            is_visible: true,
        },
    ]

    const handleDataChange = (newData: DoctorData[]) => {
        console.log("Data changed:", newData)
        // You can save the new order to your backend here
    }

    const handleRowsSelected = (selectedRows: DoctorData[]) => {
        console.log("Selected rows:", selectedRows)
    }

    const handleAddClick = () => {
        console.log("Add button clicked")
        toast.success("Add Doctor clicked - implement your add logic here")
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
                    columns={doctorColumns}
                    enableDragDrop={true}
                    enableRowSelection={true}
                    enableColumnVisibility={true}
                    enablePagination={true}
                    onDataChange={handleDataChange}
                    onRowsSelected={handleRowsSelected}
                    showAddButton={true}
                    onAddClick={handleAddClick}
                    addButtonLabel="Add Doctor"
                    pageSize={10}
                />
            </div>
        </div>
    )
}
