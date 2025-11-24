import { useState } from "react";
import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useUpdateProfileMutation } from "@/lib/api/apiSlice";
import { toast } from 'sonner';

type AccountTabProps = {
    is_active: boolean;
    is_visible: boolean;
}

export default function Account(
    { is_active, is_visible }: AccountTabProps
) {
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();
    const [visibilityState, setVisibilityState] = useState(is_visible);

    const getStatusBgColor = (is_active: boolean) => {
        if (is_active) {
            return "border-green-200 bg-green-600"
        } else {
            return "border-red-200 bg-red-600"
        }
    }

    // const handleVisibilityChange = async (checked: boolean) => {
    //     // Optimistically update the UI
    //     setVisibilityState(checked);

    //     try {
    //         await updateProfile({ is_visible: checked }).unwrap();
    //         toast.success(`Account visibility ${checked ? 'enabled' : 'disabled'} successfully!`);
    //     } catch (err: any) {
    //         // Revert the state if the update fails
    //         setVisibilityState(!checked);
    //         const errorMessage = err?.data?.message || 'Failed to update account visibility. Please try again.';
    //         toast.error(errorMessage);
    //     }
    // };

    return (
        <TabsContent value="account" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label className="text-base">Account Status</Label>
                            <p className="text-muted-foreground text-sm">Your account is currently active</p>
                        </div>

                        <Badge variant="outline" className={`${getStatusBgColor(is_active)} text-white py-2 px-3 rounded-full`}>
                            {is_active ? "Active" : "Not Active"}
                        </Badge>
                    </div>
                    <Separator />
                    {/* <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label className="text-base">Account Visibility</Label>
                            <p className="text-muted-foreground text-sm">
                                Make your profile visible to other users
                            </p>
                        </div>
                        <Switch
                            className="cursor-pointer"
                            checked={visibilityState}
                            onCheckedChange={handleVisibilityChange}
                            disabled={isLoading}
                        />
                    </div>
                    <Separator /> */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label className="text-base">Data Export</Label>
                            <p className="text-muted-foreground text-sm">Download a copy of your data</p>
                        </div>
                        <Button variant="outline">Export Data</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible and destructive actions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label className="text-base">Delete Account</Label>
                            <p className="text-muted-foreground text-sm">
                                Permanently delete your account and all data
                            </p>
                        </div>
                        <Button variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    )
}
