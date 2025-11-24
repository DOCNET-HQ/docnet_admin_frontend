'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    Calendar,
    Clock,
    User,
    Stethoscope,
    FileText,
    ArrowLeft,
} from 'lucide-react';
import { useGetAppointmentQuery } from '@/lib/api/appointmentsApi';
import { Loader } from '@/components/dashboard/loader';
import Link from 'next/link';

export default function AppointmentDetailsPage() {
    const params = useParams();
    const appointmentId = params.id as string;

    const { data: appointment, isLoading, error } = useGetAppointmentQuery(appointmentId);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (error || !appointment) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Appointment</h2>
                    <p className="text-muted-foreground mb-4">Failed to load appointment details.</p>
                    <Link href="/appointments">
                        <Button>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Appointments
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

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

    const getInitials = (name: string) => {
        return name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'NA';
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/appointments">
                            <Button variant="outline" size="sm" className="cursor-pointer">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Appointment Details</h1>
                            {/* <p className="text-muted-foreground">Appointment ID: {appointment.id}</p> */}
                        </div>
                    </div>
                    <Badge className={`${getStatusColor(appointment.status)} px-3 py-1 text-sm capitalize`}>
                        {appointment.status?.toLowerCase()}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Appointment Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Appointment Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Date</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(appointment.scheduled_start_time)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Time</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                {formatTime(appointment.scheduled_start_time)} - {formatTime(appointment.scheduled_end_time)}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Duration</label>
                                        <p className="mt-1">{appointment.duration || '30 minutes'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Type</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Stethoscope className="w-4 h-4" />
                                            <span className="capitalize">{getAppointmentType(appointment.appointment_type)}</span>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Reason for Visit</label>
                                    <p className="mt-1">{appointment.reason || 'No reason provided'}</p>
                                </div>

                                {appointment.notes && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Additional Notes</label>
                                        <p className="mt-1">{appointment.notes}</p>
                                    </div>
                                )}

                                {appointment.cancellation_reason && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground text-red-600">Cancellation Reason</label>
                                        <p className="mt-1 text-red-600">{appointment.cancellation_reason}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Doctor Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Doctor
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={appointment.doctor?.photo} alt={appointment.doctor?.name} />
                                        <AvatarFallback>
                                            {getInitials(appointment.doctor?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">Dr. {appointment.doctor?.name}</h3>
                                        <p className="text-sm text-muted-foreground">{appointment.doctor?.email}</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Link href={`/doctors/${appointment.doctor?.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full cursor-pointer">
                                            View Profile
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Patient Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Patient
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={appointment.patient?.photo} alt={appointment.patient?.name} />
                                        <AvatarFallback>
                                            {getInitials(appointment.patient?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">{appointment.patient?.name}</h3>
                                        <p className="text-sm text-muted-foreground">{appointment.patient?.email}</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Link href={`/patients/${appointment.patient?.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full cursor-pointer">
                                            View Profile
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Appointment Metadata */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Metadata
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Created</span>
                                    <span>{formatDate(appointment.created_at)}</span>
                                </div>
                                {appointment.timezone && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Timezone</span>
                                        <span>{appointment.timezone}</span>
                                    </div>
                                )}
                                {appointment.cancelled_by && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Cancelled By</span>
                                        <span className="capitalize">{appointment.cancelled_by}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
