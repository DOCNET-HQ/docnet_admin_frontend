'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetAppointmentsQuery } from '@/lib/api/appointmentsApi';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PatientAppointmentsProps {
    patientId: string;
    showDoctorColumn?: boolean;
    ableToBookAppointment?: boolean;
    onBookAppointment?: () => void;
}

export default function PatientAppointments({
    patientId,
    showDoctorColumn = true,
    ableToBookAppointment = false,
    onBookAppointment
}: PatientAppointmentsProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Get appointments for this patient
    const { data: appointmentsData, isLoading, error } = useGetAppointmentsQuery({
        page: currentPage,
        page_size: itemsPerPage,
        patient_id: patientId
    });

    const appointments = appointmentsData?.results || [];
    const totalCount = appointmentsData?.count || 0;

    // Calculate pagination
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    // Pagination handlers
    const goToPage = (page: number) => setCurrentPage(page);
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase()

        switch (s) {
            case "scheduled":
                return "bg-amber-400 text-white"
            case "confirmed":
                return "bg-cyan-600 text-white"
            case "in_progress":
                return "bg-blue-600 text-white"
            case "completed":
                return "bg-green-600 text-white"
            case "cancelled":
            case "canceled":
                return "bg-red-600 text-white"
            case "no_show":
                return "bg-gray-600 text-white"
            case "rescheduled":
                return "bg-orange-500 text-white"
            default:
                return "bg-gray-500 text-white"
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (startTime: string, endTime: string) => {
        const start = new Date(startTime);
        const end = new Date(endTime);

        return `${start.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })} - ${end.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })}`;
    };

    const getAppointmentType = (type: string) => {
        const typeMap: Record<string, string> = {
            consultation: 'Consultation',
            follow_up: 'Follow-up',
            checkup: 'Checkup',
            emergency: 'Emergency',
            other: 'Other'
        };
        return typeMap[type] || type;
    };

    if (error) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center text-red-600">
                        Error loading appointments
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4 px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg">Appointment History</CardTitle>
                {ableToBookAppointment && onBookAppointment && (
                    <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-xs sm:text-sm"
                        onClick={onBookAppointment}
                    >
                        Book Appointment
                    </Button>
                )}
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
                {isLoading ? (
                    <div className="text-center py-8">Loading appointments...</div>
                ) : (
                    <div className="overflow-x-auto -mx-3 sm:mx-0">
                        <div className="inline-block min-w-full align-middle">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b">
                                        {showDoctorColumn && (
                                            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs font-medium text-muted-foreground">
                                                Doctor
                                            </th>
                                        )}
                                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs font-medium text-muted-foreground">Reason</th>
                                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs font-medium text-muted-foreground hidden sm:table-cell">Type</th>
                                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs font-medium text-muted-foreground">Date & Time</th>
                                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id} className="border-b last:border-0">
                                            {showDoctorColumn && (
                                                <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs">
                                                    {appointment.doctor ? (
                                                        <Link
                                                            href={`/doctors/${appointment.doctor.id}`}
                                                            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                                                        >
                                                            <Avatar className="w-6 h-6">
                                                                <AvatarImage src={appointment.doctor.photo} />
                                                                <AvatarFallback>
                                                                    {appointment.doctor.name.split(' ').map(n => n[0]).join('')}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="font-medium">Dr. {appointment.doctor.name}</span>
                                                        </Link>
                                                    ) : (
                                                        <span className="text-muted-foreground">N/A</span>
                                                    )}
                                                </td>
                                            )}
                                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs text-muted-foreground">
                                                <div className="flex flex-col">
                                                    <span className="font-medium sm:font-normal">
                                                        {appointment.reason || 'No reason provided'}
                                                    </span>
                                                    <span className="sm:hidden text-xs text-gray-500 mt-1">
                                                        {getAppointmentType(appointment.appointment_type)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs text-muted-foreground hidden sm:table-cell">
                                                {getAppointmentType(appointment.appointment_type)}
                                            </td>
                                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs text-muted-foreground">
                                                <div className="flex flex-col">
                                                    <span>{formatDate(appointment.scheduled_start_time)}</span>
                                                    <span className="text-gray-500">
                                                        {formatTime(appointment.scheduled_start_time, appointment.scheduled_end_time)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 sm:py-4 px-2 sm:px-4">
                                                <Badge className={`${getStatusColor(appointment.status)} text-xs text-white whitespace-nowrap capitalize`}>
                                                    {appointment.status.toLowerCase()}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            {totalCount > 0 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-2 sm:px-0">
                                    <div className="flex items-center gap-2 sm:gap-4 order-2 sm:order-1">
                                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                                            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalCount)} of {totalCount}
                                        </div>

                                        <Select
                                            value={itemsPerPage.toString()}
                                            onValueChange={(value) => {
                                                setItemsPerPage(Number(value));
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <SelectTrigger className="w-16 h-7 sm:w-20 sm:h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="5" className="text-xs">5</SelectItem>
                                                <SelectItem value="10" className="text-xs">10</SelectItem>
                                                <SelectItem value="20" className="text-xs">20</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={prevPage}
                                            disabled={currentPage === 1}
                                            className="h-7 sm:h-8 px-2 sm:px-3 text-xs cursor-pointer"
                                        >
                                            <ChevronLeft />
                                        </Button>

                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => goToPage(page)}
                                                    className="w-6 h-6 sm:w-8 sm:h-8 p-0 text-xs"
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={nextPage}
                                            disabled={currentPage === totalPages}
                                            className="h-7 sm:h-8 px-2 sm:px-3 text-xs cursor-pointer"
                                        >
                                            <ChevronRight />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {!isLoading && appointments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        No appointments found
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
