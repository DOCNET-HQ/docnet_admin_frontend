// AdminDashboard component
'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Users,
    Stethoscope,
    Building2,
    ArrowUp,
    ArrowDown,
    Eye
} from "lucide-react";
import {
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { useRouter } from 'next/navigation';
import { useGetDashboardDataQuery } from '@/lib/api/dashboardApi';

// Helper function to calculate growth percentage (you might want to move this to backend)
const calculateGrowth = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number(((current - previous) / previous * 100).toFixed(1));
};

const StatCard = ({
    title,
    value,
    growth,
    icon: Icon,
    trend = 'up'
}: {
    title: string;
    value: number;
    growth: number;
    icon: React.ElementType;
    trend?: 'up' | 'down';
}) => (
    <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            <div className={`flex items-center text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {growth}% from last month
            </div>
        </CardContent>
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`} />
    </Card>
);

const GrowthChart = ({ data }: { data: any[] }) => (
    <Card className="col-span-2">
        <CardHeader>
            <CardTitle>Monthly Growth Analytics</CardTitle>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="patients" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Patients" />
                    <Area type="monotone" dataKey="doctors" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Doctors" />
                    <Area type="monotone" dataKey="hospitals" stackId="3" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="Hospitals" />
                </AreaChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
);

const AppointmentTypesChart = ({ data }: { data: any[] }) => (
    <Card>
        <CardHeader>
            <CardTitle>Appointment Distribution</CardTitle>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                        dataKey="type"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval={0}
                        fontSize={12}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
                {data.map((item) => (
                    <div key={item.type} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-muted-foreground">{item.type}</span>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
        completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
        scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Scheduled' },
        cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
        pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
        <Badge variant="secondary" className={config.color}>
            {config.label}
        </Badge>
    );
};

export default function AdminDashboard() {
    const router = useRouter();
    const { data: dashboardData, isLoading, error } = useGetDashboardDataQuery();

    if (isLoading) {
        return (
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error || !dashboardData) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center p-6">
                <div className="text-red-600">Error loading dashboard data</div>
            </div>
        );
    }

    // Calculate growth percentages (you might want to move this to backend)
    const monthlyData = dashboardData.monthly_growth;
    const currentMonth = monthlyData[monthlyData.length - 1];
    const previousMonth = monthlyData[monthlyData.length - 2];

    const patientGrowth = calculateGrowth(currentMonth?.patients || 0, previousMonth?.patients || 0);
    const doctorGrowth = calculateGrowth(currentMonth?.doctors || 0, previousMonth?.doctors || 0);
    const hospitalGrowth = calculateGrowth(currentMonth?.hospitals || 0, previousMonth?.hospitals || 0);

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                    title="Total Patients"
                    value={dashboardData.total_patients}
                    growth={patientGrowth}
                    icon={Users}
                    trend={patientGrowth >= 0 ? 'up' : 'down'}
                />
                <StatCard
                    title="Total Doctors"
                    value={dashboardData.total_doctors}
                    growth={doctorGrowth}
                    icon={Stethoscope}
                    trend={doctorGrowth >= 0 ? 'up' : 'down'}
                />
                <StatCard
                    title="Total Hospitals"
                    value={dashboardData.total_hospitals}
                    growth={hospitalGrowth}
                    icon={Building2}
                    trend={hospitalGrowth >= 0 ? 'up' : 'down'}
                />
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-3">
                <GrowthChart data={dashboardData.monthly_growth} />
                <AppointmentTypesChart data={dashboardData.appointment_distribution} />
            </div>

            {/* Tables Section */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Appointments Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Appointments</CardTitle>
                        <Button 
                            variant="ghost"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => router.push('/appointments')}
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            View All
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {dashboardData.recent_appointments.map((appointment) => (
                                <div key={appointment.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium">{appointment.patient_name}</p>
                                            <StatusBadge status={appointment.status} />
                                        </div>
                                        <p className="text-xs text-muted-foreground">{appointment.doctor_name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {appointment.start_time} • {appointment.appointment_type}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="cursor-pointer"
                                        onClick={() => router.push(`/appointments/${appointment.id}`)}
                                    >
                                        <Eye className="h-4 w-4 cursor-pointer" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Approvals Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Pending Approvals</CardTitle>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            {dashboardData.pending_approvals.length} Pending
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {dashboardData.pending_approvals.map((item) => (
                                <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium">{item.name}</p>
                                            <Badge variant="outline" className="text-xs">
                                                {item.role}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Submitted {item.submitted_at}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 cursor-pointer"
                                            onClick={() => router.push(`/${item.role}s/${item.id}`)}
                                        >
                                            Review
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
