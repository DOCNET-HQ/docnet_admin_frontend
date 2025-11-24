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
import { useState } from "react"
import { useGetDoctorsQuery } from "@/lib/api/doctorsApi"
import { useGetDoctorStatsQuery } from "@/lib/api/doctorStatsApi"
import { Loader } from "@/components/dashboard/loader"
import { Card, CardContent } from "@/components/ui/card"
import {
    Users,
    UserCheck,
    Building,
    TrendingUp,
    Activity,
    ShieldCheck
} from "lucide-react"

// Define your data type based on API response
interface DoctorData extends BaseTableData {
    id: string
    name: string
    email: string
    phone_number: string
    gender?: string
    specialty?: string
    state: string
    country: string
    city: string
    is_active?: boolean
    is_visible?: boolean
    kyc_status: string
    website: string
    address: string
    license_number?: string
    license_expiry_date?: string
    created_at: string
    updated_at: string
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
    switch (status?.toLowerCase()) {
        case 'verified':
            return 'bg-green-100 text-green-800 border-green-200'
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        case 'rejected':
            return 'bg-red-100 text-red-800 border-red-200'
        case 'suspended':
            return 'bg-orange-100 text-orange-800 border-orange-200'
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200'
    }
}


const ActiveStatusCell = ({ row }: { row: any }) => {
    const [isActive, setIsActive] = useState(row.original.is_active)

    return (
        <div className="flex items-center gap-2">
            <Switch
                checked={isActive}
                onCheckedChange={(checked) => {
                    setIsActive(checked)
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
}

const VisibilityStatusCell = ({ row }: { row: any }) => {
    const [isVisible, setIsVisible] = useState(row.original.is_visible)

    return (
        <div className="flex items-center gap-2">
            <Switch
                checked={isVisible}
                onCheckedChange={(checked) => {
                    setIsVisible(checked)
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
}


// Define your columns
const doctorColumns: ColumnDef<DoctorData>[] = [
    {
        id: "avatar",
        header: "",
        cell: ({ row }) => (
            <Avatar
                className="h-9 w-9"
            >
                <AvatarImage
                    src={row.original.photo || ""}
                    alt={row.original.name}
                    className="object-cover"
                />
                <AvatarFallback className="text-sm bg-blue-100 text-blue-600">
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
        accessorKey: "phone_number",
        header: "Phone",
        cell: ({ row }) => (
            <div className="text-muted-foreground">{row.original.phone_number}</div>
        ),
    },
    {
        accessorKey: "specialty",
        header: "Specialty",
        cell: ({ row }) => (
            <div>{row.original.specialty || "Not specified"}</div>
        ),
    },
    {
        id: "location",
        header: "Location",
        cell: ({ row }) => (
            <div className="text-sm">
                <div>{row.original.city}</div>
                <div className="text-muted-foreground text-xs">{row.original.state}, {row.original.country}</div>
            </div>
        ),
    },
    {
        accessorKey: "kyc_status",
        header: "KYC Status",
        cell: ({ row }) => (
            <Badge
                variant="outline"
                className={`${getStatusColor(row.original.kyc_status)} capitalize`}
            >
                {row.original.kyc_status?.toLowerCase()}
            </Badge>
        ),
    },
    {
        accessorKey: "is_active",
        header: "Active",
        cell: ({ row }) => <ActiveStatusCell row={row} />,
    },
    {
        accessorKey: "is_visible",
        header: "Visible",
        cell: ({ row }) => <VisibilityStatusCell row={row} />,
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
                        <Link href={`/doctors/${row.original.id}`} className="w-full">
                            View Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>Edit Details</DropdownMenuItem>
                    <DropdownMenuItem disabled>Send Message</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" disabled>
                        Delete
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
export default function AdminDoctorsPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [searchQuery, setSearchQuery] = useState("")

    const {
        data: doctorsResponse,
        isLoading: doctorsLoading,
        error: fetchError,
    } = useGetDoctorsQuery({
        page: currentPage,
        page_size: pageSize,
        search: searchQuery || undefined,
    })

    const {
        data: statsData,
        isLoading: statsLoading,
        error: statsError
    } = useGetDoctorStatsQuery()

    // Handle fetch errors
    if (fetchError) {
        toast.error("Failed to load doctors list")
        console.error("Fetch error:", fetchError)
    }

    if (statsError) {
        console.error("Stats fetch error:", statsError)
    }

    const handleDataChange = (newData: DoctorData[]) => {
        console.log("Data changed:", newData)
    }

    const handleRowsSelected = (selectedRows: DoctorData[]) => {
        console.log("Selected rows:", selectedRows)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    // const handlePageSizeChange = (size: number) => {
    //     setPageSize(size)
    //     setCurrentPage(1)
    // }

    // Transform API data to table format
    const tableData: DoctorData[] = doctorsResponse?.results?.map(doctor => ({
        ...doctor,
        id: doctor.id || "",
        name: doctor.name || "Unknown Doctor",
        email: doctor.email || "No email",
        phone_number: doctor.phone_number || "No phone",
        specialty: doctor.specialty || "Not specified",
        gender: doctor.gender || "Not specified",
        state: doctor.state || "Not specified",
        country: doctor.country || "Not specified",
        city: doctor.city || "Not specified",
        is_active: doctor.is_active || false,
        is_visible: doctor.is_visible || false,
        kyc_status: doctor.kyc_status || "PENDING",
        website: doctor.website || "",
        address: doctor.address || "",
        license_number: doctor.license_number || "",
        license_expiry_date: doctor.license_expiry_date || "",
        created_at: doctor.created_at || new Date().toISOString(),
        updated_at: doctor.updated_at || new Date().toISOString(),
    })) || []

    const isLoading = doctorsLoading || statsLoading

    return (
        <div className="flex flex-1 flex-col gap-4 p-5 pt-0">
            {/* Admin Doctor Stats Cards - 4 Most Important System-wide Metrics */}
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
                    // Admin Dashboard Doctor Stats - 4 Most Important System-wide Cards
                    <>
                        {/* Total Doctors - System-wide overview */}
                        <StatsCard
                            title="Total Doctors"
                            value={statsData.total_doctors || 0}
                            icon={Users}
                            description="System-wide doctors"
                            className="border-l-4 border-l-blue-500"
                        />

                        {/* Active Doctors - Engagement metric */}
                        <StatsCard
                            title="Active Doctors"
                            value={statsData.active_doctors || 0}
                            icon={Activity}
                            description="Currently active"
                            className="border-l-4 border-l-green-500"
                        />

                        {/* System KYC Completion - Compliance metric */}
                        <StatsCard
                            title="System KYC Rate"
                            value={`${'system_wide_kyc_completion' in statsData ? (statsData as any).system_wide_kyc_completion : 0}%`}
                            icon={ShieldCheck}
                            description="Verification compliance"
                            className="border-l-4 border-l-orange-500"
                        />

                        {/* Active Hospitals - Network metric */}
                        <StatsCard
                            title="Active Hospitals"
                            value={'total_hospitals_with_doctors' in statsData ? (statsData as any).total_hospitals_with_doctors : 0}
                            icon={Building}
                            description="Hospitals with doctors"
                            className="border-l-4 border-l-purple-500"
                        />
                    </>
                ) : (
                    // Fallback when no stats data
                    <>
                        <StatsCard
                            title="Total Doctors"
                            value={doctorsResponse?.count || 0}
                            icon={Users}
                            description="System-wide doctors"
                            className="border-l-4 border-l-blue-500"
                        />
                        <StatsCard
                            title="Active Doctors"
                            value={0}
                            icon={Activity}
                            description="Currently active"
                            className="border-l-4 border-l-green-500"
                        />
                        <StatsCard
                            title="KYC Completion"
                            value="0%"
                            icon={ShieldCheck}
                            description="System verification rate"
                            className="border-l-4 border-l-orange-500"
                        />
                        <StatsCard
                            title="Verified Doctors"
                            value={0}
                            icon={UserCheck}
                            description="KYC verified"
                            className="border-l-4 border-l-purple-500"
                        />
                    </>
                )}
            </div>

            {/* Additional Admin Insights Row */}
            {statsData && 'doctors_growth_rate' in statsData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
                    <StatsCard
                        title="Monthly Growth"
                        value={`${(statsData as any).doctors_growth_rate || 0}%`}
                        icon={TrendingUp}
                        description="Doctor growth rate"
                        className="border-l-4 border-l-green-500"
                    />
                    <StatsCard
                        title="Verified Doctors"
                        value={statsData.verified_doctors || 0}
                        icon={UserCheck}
                        description="KYC verified"
                        className="border-l-4 border-l-blue-500"
                    />
                    <StatsCard
                        title="Pending KYC"
                        value={statsData.pending_kyc || 0}
                        icon={ShieldCheck}
                        description="Awaiting verification"
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
                        columns={doctorColumns}
                        enableDragDrop={true}
                        enableRowSelection={true}
                        enableColumnVisibility={true}
                        enablePagination={true}
                        onDataChange={handleDataChange}
                        onRowsSelected={handleRowsSelected}
                        showAddButton={false}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        // totalItems={doctorsResponse?.count || 0}
                        onPageChange={handlePageChange}
                        // onPageSizeChange={handlePageSizeChange}
                        isLoading={isLoading}
                        searchValue={searchQuery}
                        onSearchChange={setSearchQuery}
                    />
                )}
            </div>
        </div>
    )
}
