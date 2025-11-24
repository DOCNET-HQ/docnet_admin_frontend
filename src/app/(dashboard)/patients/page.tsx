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
import { useState } from "react"
import { useGetPatientsQuery } from "@/lib/api/patientsApi"
import { useGetPatientStatsQuery } from "@/lib/api/patientStatsApi"
import { Loader } from "@/components/dashboard/loader"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { 
    Users, 
    UserCheck, 
    Building, 
    TrendingUp,
    Activity,
    ShieldCheck
} from "lucide-react"

// Define your data type
interface PatientData extends BaseTableData {
    id: string
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
                {row.original.gender || "Not specified"}
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
                        <Link href={`/patients/${row.original.id}`} className="w-full">
                            View Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>View Records</DropdownMenuItem>
                    <DropdownMenuSeparator />
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
export default function AdminPatientsPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [searchQuery, setSearchQuery] = useState("")

    const {
        data: patientsResponse,
        isLoading: patientsLoading,
        error: fetchError,
    } = useGetPatientsQuery({
        page: currentPage,
        page_size: pageSize,
        search: searchQuery || undefined,
    })

    const {
        data: statsData,
        isLoading: statsLoading,
        error: statsError
    } = useGetPatientStatsQuery()

    // Handle fetch errors
    if (fetchError) {
        toast.error("Failed to load patients list")
        console.error("Fetch error:", fetchError)
    }

    if (statsError) {
        console.error("Stats fetch error:", statsError)
    }

    const handleDataChange = (newData: PatientData[]) => {
        console.log("Data changed:", newData)
    }

    const handleRowsSelected = (selectedRows: PatientData[]) => {
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
    const tableData: PatientData[] = patientsResponse?.results?.map(patient => ({
        ...patient,
        // Ensure all required fields are present with fallbacks
        photo: patient.photo || "",
        gender: patient.gender || "Not specified",
        state: patient.state || "Not specified",
        country: patient.country || "Not specified",
    })) || []

    const isLoading = patientsLoading || statsLoading

    return (
        <div className="flex flex-1 flex-col gap-4 p-5 pt-0">
            {/* Admin Patient Stats Cards - 4 Most Important System-wide Metrics */}
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
                    // Admin Dashboard Patient Stats - 4 Most Important System-wide Cards
                    <>
                        {/* Total Patients - System-wide overview */}
                        <StatsCard
                            title="Total Patients"
                            value={statsData.total_patients || 0}
                            icon={Users}
                            description="System-wide patients"
                            className="border-l-4 border-l-blue-500"
                        />
                        
                        {/* Active Patients - Engagement metric */}
                        <StatsCard
                            title="Active Patients"
                            value={statsData.active_patients || 0}
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
                            value={'total_hospitals_with_patients' in statsData ? (statsData as any).total_hospitals_with_patients : 0}
                            icon={Building}
                            description="Hospitals with patients"
                            className="border-l-4 border-l-purple-500"
                        />
                    </>
                ) : (
                    // Fallback when no stats data
                    <>
                        <StatsCard
                            title="Total Patients"
                            value={patientsResponse?.count || 0}
                            icon={Users}
                            description="System-wide patients"
                            className="border-l-4 border-l-blue-500"
                        />
                        <StatsCard
                            title="Active Patients"
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
                            title="Growth Rate"
                            value="0%"
                            icon={TrendingUp}
                            description="Monthly growth"
                            className="border-l-4 border-l-purple-500"
                        />
                    </>
                )}
            </div>

            {/* Additional Admin Insights Row */}
            {statsData && 'patients_growth_rate' in statsData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
                    <StatsCard
                        title="Monthly Growth"
                        value={`${(statsData as any).patients_growth_rate || 0}%`}
                        icon={TrendingUp}
                        description="Patient growth rate"
                        className="border-l-4 border-l-green-500"
                    />
                    <StatsCard
                        title="Verified Patients"
                        value={statsData.verified_patients || 0}
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
                        columns={patientColumns}
                        enableDragDrop={true}
                        enableRowSelection={true}
                        enableColumnVisibility={true}
                        enablePagination={true}
                        onDataChange={handleDataChange}
                        onRowsSelected={handleRowsSelected}
                        showAddButton={false}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        // totalItems={patientsResponse?.count || 0}
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
