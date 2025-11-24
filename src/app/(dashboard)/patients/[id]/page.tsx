'use client';

import React from 'react';
import { useState } from 'react';
import { 
    Mail, 
    Phone, 
    MapPin, 
    Link2, 
    Menu, 
    ChevronDown,
    CalendarIcon,
    User,
    FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useParams } from 'next/navigation';
import { useGetPatientQuery } from '@/lib/api/patientsApi';
import PatientAppointments from '@/components/dashboard/PatientAppointments';

const PatientProfilePage = () => {
    const params = useParams();
    const patientId = params.id as string;

    const [showDocumentDialog, setShowDocumentDialog] = useState(false);
    const [currentDocument, setCurrentDocument] = useState<{title: string, url: string} | null>(null);

    // Get patient data
    const { data: patient, isLoading: patientLoading, error: patientError } = useGetPatientQuery(patientId);

    const handleViewDocument = (title: string, url: string) => {
        setCurrentDocument({ title, url });
        setShowDocumentDialog(true);
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            'PENDING': { color: 'bg-yellow-500 hover:bg-yellow-500', label: 'Pending' },
            'VERIFIED': { color: 'bg-green-600 hover:bg-green-600', label: 'Verified' },
            'REJECTED': { color: 'bg-red-600 hover:bg-red-600', label: 'Rejected' },
            'SUSPENDED': { color: 'bg-orange-500 hover:bg-orange-500', label: 'Suspended' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
        
        return (
            <Badge className={`${config.color} text-xs text-white`}>
                {config.label}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const SidebarContent = () => {
        if (patientLoading) {
            return <div className="text-center py-8">Loading patient information...</div>;
        }

        if (patientError || !patient) {
            return <div className="text-center py-8 text-red-600">Error loading patient information</div>;
        }

        return (
            <div className="space-y-6">
                {/* Profile Card */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mb-4">
                                <AvatarImage 
                                    className="object-center object-cover" 
                                    src={patient.photo} 
                                />
                                <AvatarFallback>
                                    {patient.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2 mb-1 flex-wrap justify-center">
                                <h2 className="text-lg sm:text-xl font-semibold text-center">{patient.name}</h2>
                                {getStatusBadge(patient.kyc_status)}
                            </div>
                            <p className="text-muted-foreground text-sm mb-6">Patient</p>

                            {/* Stats with improved design */}
                            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full py-4 sm:py-6 border-t border-b">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <User className="w-4 h-4 text-blue-600" />
                                        <div className="text-sm font-bold capitalize">
                                            {patient.gender?.toLowerCase() || 'Not specified'}
                                        </div>
                                    </div>
                                    <div className="text-muted-foreground text-xs sm:text-sm">Gender</div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <CalendarIcon className="w-4 h-4 text-purple-600" />
                                        <div className="text-sm font-bold">
                                            {patient.dob ? formatDate(patient.dob) : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="text-muted-foreground text-xs sm:text-sm">Date of Birth</div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Badge 
                                            variant="outline" 
                                            className={`${patient.is_active ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'} px-2`}
                                        >
                                            {patient.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    <div className="text-muted-foreground text-xs sm:text-sm">Status</div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="w-full mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-left">
                                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                    <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <span className="break-words">{patient.email}</span>
                                </div>
                                {patient.phone_number && (
                                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                        <span>{patient.phone_number}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <span>
                                        {[patient.city, patient.state, patient.country].filter(Boolean).join(', ')}
                                    </span>
                                </div>
                                {patient.website && (
                                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                        <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                        <span className="break-words">{patient.website}</span>
                                    </div>
                                )}
                                
                                {/* Additional details */}
                                <div className="pt-2 border-t space-y-2">
                                    {patient.address && (
                                        <div className="flex items-start gap-2 text-xs">
                                            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                            <span className="break-words">{patient.address}</span>
                                        </div>
                                    )}
                                    {patient.bio && (
                                        <div className="text-xs">
                                            <span className="font-medium">About: </span>
                                            <span className="line-clamp-2">{patient.bio}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm pt-2">
                                    <ChevronDown className="w-4 h-4 text-blue-600 cursor-pointer flex-shrink-0" />
                                    <span className='text-xs text-blue-600 cursor-pointer'>View More</span>
                                </div>
                            </div>

                            {/* ID Document Section */}
                            {patient.id_document && (
                                <div className="w-full mt-6 space-y-3 text-left">
                                    <span className="text-sm font-medium">ID Document</span>
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span>Identity Document</span>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                            onClick={() => handleViewDocument("ID Document", patient.id_document || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")}
                                        >
                                            View
                                            <FileText className="w-4 h-4 text-white ml-1" />
                                        </Button>
                                    </div>                            
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background text-foreground -mt-5">
            {/* Header */}
            <div className="-mb-6">
                <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden">
                                    <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                                <div className="mt-4 sm:mt-6">
                                    <SidebarContent />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="hidden lg:block">
                        <SidebarContent />
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        <PatientAppointments 
                            patientId={patientId}
                            showDoctorColumn={true}
                            ableToBookAppointment={false}
                        />
                    </div>
                </div>
            </div>

            {/* Document Viewer Dialog */}
            <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
                <DialogContent className="h-[80vh] w-full max-w-[100vw]"
                    style={{ maxWidth: 'none', width: '90vw', marginBottom: '20' }}
                >
                    <DialogHeader>
                        <DialogTitle>{currentDocument?.title}</DialogTitle>
                        <DialogDescription>
                            Viewing document in full screen
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 h-full">
                        {currentDocument && (
                            <iframe
                                src={currentDocument.url}
                                className="w-full h-full border-0 rounded"
                                style={{ height: '70vh' }}
                                title={currentDocument.title}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PatientProfilePage;
