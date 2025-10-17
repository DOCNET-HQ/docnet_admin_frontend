'use client';

import React from 'react';
import { useState } from 'react';
import { 
    Settings, 
    Check, 
    Mail, 
    Phone, 
    MapPin, 
    Link2, 
    Download, 
    Calendar, 
    Package, 
    Circle, 
    Menu, 
    Video, 
    MessageSquare, 
    FileText, 
    Users, 
    ChevronDown 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DoctorProfilePage = () => {
    const [userStatus, setUserStatus] = useState("verified");
    const [showDocumentDialog, setShowDocumentDialog] = useState(false);
    const [currentDocument, setCurrentDocument] = useState<{title: string, url: string} | null>(null);
    const [showStatusConfirmDialog, setShowStatusConfirmDialog] = useState(false);
    const [pendingStatus, setPendingStatus] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");

    const handleViewDocument = (title: string, url: string) => {
        setCurrentDocument({ title, url });
        setShowDocumentDialog(true);
    };

    const handleStatusChangeRequest = (status: string) => {
        setPendingStatus(status);
        setRejectionReason("");
        setShowStatusConfirmDialog(true);
    };

    const confirmStatusChange = () => {
        if ((pendingStatus === "rejected" || pendingStatus === "suspended") && !rejectionReason.trim()) {
            alert("Please provide a reason for " + pendingStatus);
            return;
        }
        setUserStatus(pendingStatus);
        setShowStatusConfirmDialog(false);
        setRejectionReason("");
        // Here you would typically send the status and reason to your backend
        console.log("Status changed to:", pendingStatus, "Reason:", rejectionReason);
    };

    const activities = [
        {
            title: 'Video Consultation Session',
            badge: 'Latest',
            date: 'October 22, 2025',
            description: 'Completed a 45-minute video consultation with patient regarding chronic back pain management and prescribed physical therapy exercises.',
            icon: Video
        },
        {
            title: 'Patient Message Response',
            date: 'October 21, 2025',
            description: 'Responded to 12 patient messages regarding medication queries, follow-up appointments, and general health concerns.',
            icon: MessageSquare
        },
        {
            title: 'Medical Records Review',
            date: 'October 20, 2025',
            description: 'Reviewed and updated medical records for 8 patients, including lab results interpretation and treatment plan adjustments.',
            icon: FileText
        }
    ];

    const appointments = [
        { patient: 'Sarah Johnson', type: 'Video Consultation', date: '12/10/2025', status: 'scheduled' },
        { patient: 'Michael Chen', type: 'Follow-up', date: '11/28/2025', status: 'completed' },
        { patient: 'Emma Davis', type: 'Initial Consultation', date: '11/25/2025', status: 'completed' },
        { patient: 'James Wilson', type: 'Video Consultation', date: '11/20/2025', status: 'cancelled' },
        { patient: 'Olivia Brown', type: 'Prescription Renewal', date: '11/15/2025', status: 'completed' },
        { patient: 'Robert Taylor', type: 'Follow-up', date: '11/10/2025', status: 'completed' }
    ];

    const connections = [
        { name: 'Dr. Olivia Davis', specialty: 'Cardiologist', connected: false },
        { name: 'Dr. John Mitchell', specialty: 'Neurologist', connected: true },
        { name: 'Dr. Alice Smith', specialty: 'Pediatrician', connected: false },
        { name: 'Dr. Emily Martinez', specialty: 'Psychiatrist', connected: true },
        { name: 'Dr. James Wilson', specialty: 'Orthopedist', connected: true }
    ];

    const skills = ['Internal Medicine', 'Telemedicine', 'Preventive Care', 'Chronic Disease', 'Patient Education', 'Diagnostics'];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-600 hover:bg-green-600';
            case 'scheduled': return 'bg-blue-600 hover:bg-blue-600';
            case 'cancelled': return 'bg-red-600 hover:bg-red-600';
            default: return 'bg-gray-600 hover:bg-gray-600';
        }
    };

    const SidebarContent = () => (
        <div className="space-y-6">
            {/* Profile Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                        <Avatar className="w-25 h-25 mb-4">
                            <AvatarImage className="object-center object-cover" src="https://uhlbd.com/unitedhospitalapi/public/DoctorProfileImg/202412221209Haridash%20Saha%20copy.jpg" />
                            <AvatarFallback>DM</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-semibold">Dr. Michael Anderson</h2>
                            <Badge className="bg-blue-600 hover:bg-blue-600 text-xs text-white">Verified</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-6">Internal Medicine Specialist</p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 w-full py-6 border-t border-b">
                            <div>
                                <div className="text-2xl font-bold">847</div>
                                <div className="text-muted-foreground text-sm">Patients</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">1.2K</div>
                                <div className="text-muted-foreground text-sm">Consults</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">4.9</div>
                                <div className="text-muted-foreground text-sm">Rating</div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="w-full mt-6 space-y-3 text-left">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span>dr.anderson@healthcarepro.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>(+1-555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>New York, USA</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Link2 className="w-4 h-4 text-muted-foreground" />
                                <span>dranderson-health.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Package className="w-4 h-4 text-muted-foreground" />
                                <span>License: MED123456</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <ChevronDown className="w-4 h-4 text-blue-600 cursor-pointer" />
                                <span className='text-xs text-blue-600 cursor-pointer'>View More</span>
                            </div>
                        </div>


                        <div className="w-full mt-6 space-y-3 text-left">
                            <span className="text-lg font-medium">Kyc Documents</span>
                            <div className="flex items-center justify-between gap-3 text-sm">
                                <span>License Document</span>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                    onClick={() => handleViewDocument("License Document", "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")}
                                >
                                    View
                                    <Link2 className="w-4 h-4 text-white" />
                                </Button>
                            </div>
                            <div className="flex items-center justify-between gap-3 text-sm">
                                <span>ID Document</span>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                    onClick={() => handleViewDocument("ID Document", "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")}
                                >
                                    View
                                    <Link2 className="w-4 h-4 text-white" />
                                </Button>
                            </div>                            
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Completion Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Profile Completion</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Progress value={85} className="h-2" />
                        <div className="text-right text-sm text-muted-foreground">85%</div>
                    </div>
                </CardContent>
            </Card>

            {/* Specializations Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Specializations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                            >
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground -mt-5">
            {/* Header */}
            <div className="-mb-6">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <div className="mt-6">
                                    <SidebarContent />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className='px-4 sm:px-6 cursor-pointer'>
                                <span className="hidden sm:inline">KYC Status</span>
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                                onClick={() => handleStatusChangeRequest("pending")}
                                className="flex items-center justify-between"
                            >
                                <span>Pending</span>
                                {userStatus === "pending" && <Check className="w-4 h-4" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleStatusChangeRequest("verified")}
                                className="flex items-center justify-between"
                            >
                                <span>Verified</span>
                                {userStatus === "verified" && <Check className="w-4 h-4" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleStatusChangeRequest("rejected")}
                                className="flex items-center justify-between"
                            >
                                <span>Rejected</span>
                                {userStatus === "rejected" && <Check className="w-4 h-4" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleStatusChangeRequest("suspended")}
                                className="flex items-center justify-between"
                            >
                                <span>Suspended</span>
                                {userStatus === "suspended" && <Check className="w-4 h-4" />}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Sidebar - Hidden on mobile, shown in sheet */}
                    <div className="hidden lg:block">
                        <SidebarContent />
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Latest Activity */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                                    View All
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {activities.map((activity, index) => (
                                    <div key={index} className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <activity.icon className="w-5 h-5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                                            <div className="flex-1 space-y-2 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-medium text-sm sm:text-base break-words">{activity.title}</h3>
                                                    {activity.badge && (
                                                        <Badge className="bg-blue-600 hover:bg-blue-600 text-xs text-white flex-shrink-0">{activity.badge}</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                                    <Calendar className="w-3 h-3 flex-shrink-0" />
                                                    <span className="break-words">{activity.date}</span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-muted-foreground">{activity.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Appointment History & Connections */}
                        <div className="grid">
                            {/* Appointment History */}
                            <Card className="xl:col-span-2">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                    <CardTitle className="text-base sm:text-lg">Appointment History</CardTitle>

                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                                        View All
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto -mx-6 sm:mx-0">
                                        <div className="inline-block min-w-full align-middle">
                                            <table className="min-w-full">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="text-left py-3 px-4 sm:px-0 text-xs sm:text-sm font-medium text-muted-foreground">Patient</th>
                                                        <th className="text-left py-3 px-4 text-xs sm:text-sm font-medium text-muted-foreground">Reason</th>
                                                        <th className="text-left py-3 px-4 text-xs sm:text-sm font-medium text-muted-foreground">Date</th>
                                                        <th className="text-left py-3 px-4 sm:px-0 text-xs sm:text-sm font-medium text-muted-foreground">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {appointments.map((appointment, index) => (
                                                        <tr key={index} className="border-b last:border-0">
                                                            <td className="py-4 px-4 sm:px-0 text-xs sm:text-sm">{appointment.patient}</td>
                                                            <td className="py-4 px-4 text-xs sm:text-sm text-muted-foreground">{appointment.type}</td>
                                                            <td className="py-4 px-4 text-xs sm:text-sm text-muted-foreground">{appointment.date}</td>
                                                            <td className="py-4 px-4 sm:px-0">
                                                                <Badge className={`${getStatusColor(appointment.status)} text-xs text-white`}>
                                                                    {appointment.status}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
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

            {/* KYC Status Confirmation Dialog */}
            <Dialog open={showStatusConfirmDialog} onOpenChange={setShowStatusConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Status Change</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to change the KYC status to{" "}
                            <span className="font-semibold capitalize">{pendingStatus}</span>?
                        </DialogDescription>
                    </DialogHeader>
                    
                    {(pendingStatus === "rejected" || pendingStatus === "suspended") && (
                        <div className="space-y-2">
                            <Label htmlFor="reason">
                                Reason for {pendingStatus === "rejected" ? "Rejection" : "Suspension"} *
                            </Label>
                            <Textarea
                                id="reason"
                                placeholder={`Please provide a reason for ${pendingStatus}...`}
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
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmStatusChange}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DoctorProfilePage;
