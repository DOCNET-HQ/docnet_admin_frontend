"use client";

import { useState } from "react";
import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { DateInput } from "@/components/utils/date-input";
import { useUpdateProfileMutation } from "@/lib/api/apiSlice";
import { Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { FileUploader } from "@/components/utils/file-uploader";

type KYCTabProps = {
    registration_number: string;
    license_name: string;
    license_issuance_authority: string;
    license_number: string;
    license_issue_date: string;
    license_expiry_date: string;
    license_document: string;
    id_document: string;
};

export default function KYC(
    {
        registration_number,
        license_name,
        license_issuance_authority,
        license_number,
        license_issue_date,
        license_expiry_date,
        license_document,
        id_document,
    }: KYCTabProps
) {
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();
    const [formData, setFormData] = useState({
        registration_number: registration_number || "",
        license_name: license_name || "",
        license_issuance_authority: license_issuance_authority || "",
        license_number: license_number || "",
        license_issue_date: license_issue_date || "",
        license_expiry_date: license_expiry_date || "",
    });

    // File state management
    const [licenseDocumentFiles, setLicenseDocumentFiles] = useState<File[]>([]);
    const [idDocumentFiles, setIdDocumentFiles] = useState<File[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleDateChange = (id: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleLicenseDocumentDrop = (files: File[]) => {
        setLicenseDocumentFiles(files);
        if (files.length > 0) {
            toast.success(`Successfully selected ${files.length} license document(s)`);
        }
    };

    const handleIdDocumentDrop = (files: File[]) => {
        setIdDocumentFiles(files);
        if (files.length > 0) {
            toast.success(`Successfully selected ${files.length} ID document(s)`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Create FormData for multipart/form-data submission
        const submitData = new FormData();

        // Append text fields
        Object.entries(formData).forEach(([key, value]) => {
            if (value) {
                submitData.append(key, value);
            }
        });

        // Append files
        if (licenseDocumentFiles.length > 0) {
            licenseDocumentFiles.forEach((file) => {
                submitData.append('license_document', file);
            });
        }

        if (idDocumentFiles.length > 0) {
            idDocumentFiles.forEach((file) => {
                submitData.append('id_document', file);
            });
        }

        try {
            await updateProfile(submitData).unwrap();
            toast.success('KYC information updated successfully!');
        } catch (err: any) {
            const errorMessage = err?.data?.message || 'An error occurred while updating KYC information. Please try again.';
            toast.error(errorMessage);
        }
    };

    return (
        <TabsContent value="kyc" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>KYC Information</CardTitle>
                    <CardDescription>Update your admin KYC information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="registration_number">Registration Number</Label>
                                <Input
                                    id="registration_number"
                                    value={formData.registration_number}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="license_name">License Name</Label>
                                <Input
                                    id="license_name"
                                    value={formData.license_name}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="license_issuance_authority">License Issuance Authority</Label>
                                <Input
                                    id="license_issuance_authority"
                                    value={formData.license_issuance_authority}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="license_number">License Number</Label>
                                <Input
                                    id="license_number"
                                    value={formData.license_number}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="license_issue_date">License Issue Date</Label>
                                <DateInput
                                    id="license_issue_date"
                                    defaultValue={formData.license_issue_date || null}
                                    onChange={(value: string) => handleDateChange('license_issue_date', value)}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="license_expiry_date">License Expiry Date</Label>
                                <DateInput
                                    id="license_expiry_date"
                                    defaultValue={formData.license_expiry_date || null}
                                    onChange={(value: string) => handleDateChange('license_expiry_date', value)}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="license_document">Upload Admin License Document</Label>
                                <FileUploader
                                    id="license_document"
                                    onDrop={handleLicenseDocumentDrop}
                                    existingFileUrl={license_document}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="id_document">Upload Admin ID Document (Passport e.t.c)</Label>
                                <FileUploader
                                    id="id_document"
                                    onDrop={handleIdDocumentDrop}
                                    existingFileUrl={id_document}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <Button
                                type="submit"
                                variant="default"
                                className="bg-blue-600 px-15 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </TabsContent>
    )
}
