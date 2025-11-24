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
import { useGetHospitalsQuery } from "@/lib/api/hospitalsApi"
import { useGetHospitalStatsQuery } from "@/lib/api/hospitalStatsApi"
import { Loader } from "@/components/dashboard/loader"
import { Card, CardContent } from "@/components/ui/card"
import {
    Building,
    TrendingUp,
    Activity,
    ShieldCheck,
} from "lucide-react"
import { Rating } from "@/types/api";


interface HospitalData extends BaseTableData {
    id: string
    name: string
    email: string
    phone_number: string
    specialties: string[]
    state: string
    country: string
    city: string
    address: string
    website: string
    bio: string
    kyc_status: "PENDING" | "VERIFIED" | "REJECTED" | "SUSPENDED"
    is_active?: boolean
    is_visible?: boolean
    rating: Rating
    photo: string
    cover_image: string
    created_at: string
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

// Helper function to format specialties
const formatSpecialties = (specialties: string[]) => {
    if (!specialties || specialties.length === 0) return "Not specified"
    if (specialties.length <= 2) return specialties.join(", ")
    return `${specialties.slice(0, 2).join(", ")} +${specialties.length - 2} more`
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


const hospitalColumns: ColumnDef<HospitalData>[] = [
    {
        id: "avatar",
        header: "",
        cell: ({ row }) => (
            <Avatar className="h-9 w-9">
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
        header: "Hospital Name",
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
        accessorKey: "specialties",
        header: "Specialties",
        cell: ({ row }) => (
            <div className="max-w-[200px]">
                {formatSpecialties(row.original.specialties)}
            </div>
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
                        <Link href={`/hospitals/${row.original.id}`} className="w-full">
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

export default function AdminHospitalsPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [searchQuery, setSearchQuery] = useState("")

    const {
        data: hospitalsResponse,
        isLoading: hospitalsLoading,
        error: fetchError,
    } = useGetHospitalsQuery({
        page: currentPage,
        page_size: pageSize,
        search: searchQuery || undefined,
    })

    const {
        data: statsData,
        isLoading: statsLoading,
        error: statsError
    } = useGetHospitalStatsQuery()

    // Handle fetch errors
    if (fetchError) {
        toast.error("Failed to load hospitals list")
        console.error("Fetch error:", fetchError)
    }

    if (statsError) {
        console.error("Stats fetch error:", statsError)
    }

    const handleDataChange = (newData: HospitalData[]) => {
        console.log("Data changed:", newData)
    }

    const handleRowsSelected = (selectedRows: HospitalData[]) => {
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
    const tableData: HospitalData[] = hospitalsResponse?.results?.map(hospital => ({
        ...hospital,
        id: hospital.id || "",
        name: hospital.name || "Unknown Hospital",
        email: hospital.email || "No email",
        phone_number: hospital.phone_number || "No phone",
        specialties: hospital.specialties || [],
        state: hospital.state || "Not specified",
        country: hospital.country || "Not specified",
        city: hospital.city || "Not specified",
        address: hospital.address || "",
        website: hospital.website || "",
        bio: hospital.bio || "",
        kyc_status: hospital.kyc_status || "PENDING",
        is_active: hospital.is_active ?? true,
        is_visible: hospital.is_visible ?? true,
        rating: hospital.rating || { average_rating: 0, total_reviews: 0 },
        photo: hospital.photo || "",
        cover_image: hospital.cover_image || "",
        created_at: hospital.created_at || new Date().toISOString(),
    })) || []

    const isLoading = hospitalsLoading || statsLoading

    return (
        <div className="flex flex-1 flex-col gap-4 p-5 pt-0">
            {/* Admin Hospital Stats Cards - 4 Most Important System-wide Metrics */}
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
                    <>
                        {/* Total Hospitals - System-wide overview */}
                        <StatsCard
                            title="Total Hospitals"
                            value={statsData.total_hospitals || 0}
                            icon={Building}
                            description="System-wide hospitals"
                            className="border-l-4 border-l-blue-500"
                        />

                        {/* Verified Hospitals - Compliance metric */}
                        <StatsCard
                            title="Verified Hospitals"
                            value={statsData.verified_hospitals || 0}
                            icon={ShieldCheck}
                            description="KYC verified"
                            className="border-l-4 border-l-green-500"
                        />

                        {/* Active Hospitals - Engagement metric */}
                        <StatsCard
                            title="Active Hospitals"
                            value={statsData.active_hospitals || 0}
                            icon={Activity}
                            description="Currently active"
                            className="border-l-4 border-l-orange-500"
                        />

                        <StatsCard
                            title="Monthly Growth"
                            value={`${(statsData as any).hospitals_growth_rate || 0}%`}
                            icon={TrendingUp}
                            description="Hospital growth rate"
                            className="border-l-4 border-l-green-500"
                        />
                    </>
                ) : (
                    // Fallback when no stats data
                    <>
                        <StatsCard
                            title="Total Hospitals"
                            value={hospitalsResponse?.count || 0}
                            icon={Building}
                            description="System-wide hospitals"
                            className="border-l-4 border-l-blue-500"
                        />
                        <StatsCard
                            title="Verified Hospitals"
                            value={0}
                            icon={ShieldCheck}
                            description="KYC verified"
                            className="border-l-4 border-l-green-500"
                        />
                        <StatsCard
                            title="Active Hospitals"
                            value={0}
                            icon={Activity}
                            description="Currently active"
                            className="border-l-4 border-l-orange-500"
                        />
                    </>
                )}
            </div>

            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min px-7 py-10">
                {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader />
                    </div>
                ) : (
                    <DataTable
                        data={tableData}
                        columns={hospitalColumns}
                        enableDragDrop={true}
                        enableRowSelection={true}
                        enableColumnVisibility={true}
                        enablePagination={true}
                        onDataChange={handleDataChange}
                        onRowsSelected={handleRowsSelected}
                        showAddButton={false}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        isLoading={isLoading}
                        searchValue={searchQuery}
                        onSearchChange={setSearchQuery}
                    />
                )}
            </div>
        </div>
    )
}
