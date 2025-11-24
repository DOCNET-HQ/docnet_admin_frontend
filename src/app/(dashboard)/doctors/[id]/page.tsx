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
    Users,
    Award,
    Star,
    FileText,
    Check,
    Settings,
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
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useParams } from 'next/navigation';
import { useGetDoctorQuery } from '@/lib/api/doctorsApi';
import { useCreateDoctorKycRecordMutation } from '@/lib/api/kycApi';
import DoctorAppointments from '@/components/dashboard/DoctorAppointments';
import ReviewsCarousel from "@/components/dashboard/ReviewsCarousel";
import { toast } from 'sonner';

const DoctorProfilePage = () => {
    const params = useParams();
    const doctorId = params.id as string;

    const [showDocumentDialog, setShowDocumentDialog] = useState(false);
    const [currentDocument, setCurrentDocument] = useState<{title: string, url: string} | null>(null);
    const [showStatusConfirmDialog, setShowStatusConfirmDialog] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED'>('PENDING');
    const [rejectionReason, setRejectionReason] = useState("");

    // Get doctor data
    const { data: doctor, isLoading: doctorLoading, error: doctorError } = useGetDoctorQuery(doctorId);

    // KYC mutation
    const [createDoctorKycRecord, { isLoading: isUpdatingKyc }] = useCreateDoctorKycRecordMutation();

    const handleViewDocument = (title: string, url: string) => {
        setCurrentDocument({ title, url });
        setShowDocumentDialog(true);
    };

    const handleStatusChangeRequest = (status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED') => {
        setPendingStatus(status);
        setRejectionReason("");
        setShowStatusConfirmDialog(true);
    };

    const confirmStatusChange = async () => {
        if ((pendingStatus === 'REJECTED' || pendingStatus === 'SUSPENDED') && !rejectionReason.trim()) {
            toast.error(`Please provide a reason for ${pendingStatus.toLowerCase()}`);
            return;
        }

        try {
            await createDoctorKycRecord({
                doctor: doctorId,
                status: pendingStatus,
                reason: rejectionReason || undefined,
            }).unwrap();

            toast.success(`Doctor KYC status updated to ${pendingStatus.toLowerCase()}`);
            setShowStatusConfirmDialog(false);
            setRejectionReason("");
        } catch (error: any) {
            console.error('KYC update error:', error);
            if (error.data) {
                // Handle field-specific errors
                const errorData = error.data;
                if (typeof errorData === 'object') {
                    Object.keys(errorData).forEach(field => {
                        const fieldErrors = errorData[field];
                        if (Array.isArray(fieldErrors)) {
                            fieldErrors.forEach((errorMessage: string) => {
                                const formattedField = field
                                    .split('_')
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(' ');
                                toast.error(`${formattedField}: ${errorMessage}`);
                            });
                        }
                    });
                } else if (typeof errorData === 'string') {
                    toast.error(errorData);
                } else {
                    toast.error('Failed to update KYC status. Please try again.');
                }
            } else {
                toast.error('Failed to update KYC status. Please try again.');
            }
        }
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

    const SidebarContent = () => {
        if (doctorLoading) {
            return <div className="text-center py-8">Loading doctor information...</div>;
        }

        if (doctorError || !doctor) {
            return <div className="text-center py-8 text-red-600">Error loading doctor information</div>;
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
                                    src={doctor.photo} 
                                />
                                <AvatarFallback>
                                    {doctor.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2 mb-1 flex-wrap justify-center">
                                <h2 className="text-lg sm:text-xl font-semibold text-center">Dr. {doctor.name}</h2>
                                {getStatusBadge(doctor.kyc_status)}
                            </div>
                            <p className="text-muted-foreground text-sm mb-6">{doctor.specialty}</p>

                            {/* Stats with improved design */}
                            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full py-4 sm:py-6 border-t border-b">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Users className="w-4 h-4 text-blue-600" />
                                        <div className="text-xl sm:text-2xl font-bold">{doctor.num_of_patients || 0}</div>
                                    </div>
                                    <div className="text-muted-foreground text-xs sm:text-sm">Patients</div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Award className="w-4 h-4 text-purple-600" />
                                        <div className="text-xl sm:text-2xl font-bold">{doctor.num_of_appointments || 0}</div>
                                    </div>
                                    <div className="text-muted-foreground text-xs sm:text-sm">Consults</div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        <div className="text-xl sm:text-2xl font-bold">
                                            {doctor.rating?.average_rating || '0.0'}
                                        </div>
                                    </div>
                                    <div className="text-muted-foreground text-xs sm:text-sm">
                                        Rating 
                                        <p className="inline-block ml-1 text-muted-foreground text-xs">
                                            ({doctor.rating?.total_reviews || '0'} review(s))
                                        </p>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Award className="w-4 h-4 text-green-600" />
                                        <div className="text-xl sm:text-2xl font-bold">{doctor.years_of_experience || '0'}</div>
                                    </div>
                                    <div className="text-muted-foreground text-xs sm:text-sm">Years Exp.</div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="w-full mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-left">
                                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                    <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <span className="break-words">{doctor.email}</span>
                                </div>
                                {doctor.phone_number && (
                                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                        <span>{doctor.phone_number}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <span>
                                        {[doctor.city, doctor.state, doctor.country].filter(Boolean).join(', ')}
                                    </span>
                                </div>
                                {doctor.website && (
                                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                        <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                        <span className="break-words">{doctor.website}</span>
                                    </div>
                                )}
                                
                                {/* Important details before "View More" */}
                                <div className="pt-2 border-t space-y-2">
                                    {doctor.gender && (
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="font-medium">Gender:</span>
                                            <span className="capitalize">{doctor.gender.toLowerCase()}</span>
                                        </div>
                                    )}
                                    {doctor.bio && (
                                        <div className="text-xs">
                                            <span className="font-medium">About: </span>
                                            <span className="line-clamp-2">{doctor.bio}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm pt-2">
                                    <ChevronDown className="w-4 h-4 text-blue-600 cursor-pointer flex-shrink-0" />
                                    <span className='text-xs text-blue-600 cursor-pointer'>View More</span>
                                </div>
                            </div>

                            {/* KYC Documents Section */}
                            <div className="w-full mt-6 space-y-3 text-left">
                                <span className="text-sm font-medium">KYC Documents</span>
                                <div className="flex items-center justify-between gap-3 text-sm">
                                    <span>License Document</span>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                        onClick={() => handleViewDocument("License Document", doctor.license_document || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")}
                                    >
                                        View
                                        <FileText className="w-4 h-4 text-white ml-1" />
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between gap-3 text-sm">
                                    <span>ID Document</span>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                        onClick={() => handleViewDocument("ID Document", doctor.id_document || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")}
                                    >
                                        View
                                        <FileText className="w-4 h-4 text-white ml-1" />
                                    </Button>
                                </div>                            
                            </div>
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

                    {/* KYC Status Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className='px-4 sm:px-6 cursor-pointer'>
                                <Settings className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">KYC Status</span>
                                <ChevronDown className="w-4 h-4 ml-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                                onClick={() => handleStatusChangeRequest('PENDING')}
                                className="flex items-center justify-between"
                            >
                                <span>Pending</span>
                                {doctor?.kyc_status === 'PENDING' && <Check className="w-4 h-4" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleStatusChangeRequest('VERIFIED')}
                                className="flex items-center justify-between"
                            >
                                <span>Verified</span>
                                {doctor?.kyc_status === 'VERIFIED' && <Check className="w-4 h-4" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleStatusChangeRequest('REJECTED')}
                                className="flex items-center justify-between"
                            >
                                <span>Rejected</span>
                                {doctor?.kyc_status === 'REJECTED' && <Check className="w-4 h-4" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleStatusChangeRequest('SUSPENDED')}
                                className="flex items-center justify-between"
                            >
                                <span>Suspended</span>
                                {doctor?.kyc_status === 'SUSPENDED' && <Check className="w-4 h-4" />}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                        <DoctorAppointments 
                            doctorId={doctorId}
                            showPatientColumn={true}
                            ableToBookAppointment={false}
                        />
                    </div>
                </div>
            </div>

            {/* Reviews Section - Read Only */}
            <div className="mx-0 md:mx-15 mb-10">
                <ReviewsCarousel 
                    entityId={doctorId} 
                    entityType="doctor" 
                    readOnly={true}
                />
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

            {/* KYC Status Confirmation Dialog */}
            <Dialog open={showStatusConfirmDialog} onOpenChange={setShowStatusConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm KYC Status Change</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to change the KYC status to{" "}
                            <span className="font-semibold capitalize">{pendingStatus.toLowerCase()}</span>?
                        </DialogDescription>
                    </DialogHeader>                    
                    {(pendingStatus === 'REJECTED' || pendingStatus === 'SUSPENDED') && (
                        <div className="space-y-2">
                            <Label htmlFor="reason">
                                Reason for {pendingStatus === 'REJECTED' ? "Rejection" : "Suspension"} *
                            </Label>
                            <Textarea
                                id="reason"
                                placeholder={`Please provide a reason for ${pendingStatus.toLowerCase()}...`}
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowStatusConfirmDialog(false);
                                setRejectionReason("");
                            }}
                            disabled={isUpdatingKyc}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmStatusChange}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={isUpdatingKyc}
                        >
                            {isUpdatingKyc ? "Updating..." : "Confirm"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DoctorProfilePage;
