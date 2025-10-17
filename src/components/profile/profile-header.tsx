import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Calendar, Mail, MapPin, PhoneCall, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useUpdateProfileMutation } from "@/lib/api/apiSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { updateUserPhoto } from "@/lib/store/slices/authSlice";
import { toast } from 'sonner';

type ProfileHeaderProps = {
  photo: string;
  name: string;
  email: string;
  phone_number: string;
  state: string;
  country: string;
  created_at: string;
};

export default function ProfileHeader(
  {
    photo,
    name,
    email,
    phone_number,
    state,
    country,
    created_at
  }: ProfileHeaderProps
) {
  const dispatch = useAppDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setSelectedImage(result);
          setSelectedFile(file);
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const handlePhotoUpdate = async () => {
    if (!selectedFile) {
      toast.error('No image selected');
      return;
    }

    const formData = new FormData();
    formData.append('photo', selectedFile);

    try {
      const result = await updateProfile(formData).unwrap();
      
      // Sync the new photo URL from backend to Redux store
      if (result.photo) {
        dispatch(updateUserPhoto(result.photo));
      }
      
      toast.success('Profile photo updated successfully!');
      // Clear the selected image after successful upload
      setSelectedImage(null);
      setSelectedFile(null);
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to update profile photo. Please try again.';
      toast.error(errorMessage);
    }
  };

  const cancelPhotoChange = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusBgColor = (status: string) => {
    if (status === "VERIFIED") {
      return "bg-green-600"
    } else if (status === "SUSPENDED") {
      return "bg-blue-600"
    } else if (status === "REJECTED") {
      return "bg-red-600"
    }

    return "bg-yellow-500"
  }

  const getDisplayImage = () => {
    if (selectedImage) return selectedImage;
    if (photo) return photo;
    return "https://bundui-images.netlify.app/avatars/08.png";
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-30 w-30">
              <AvatarImage
                className="object-center object-cover"
                src={getDisplayImage()}
                alt="Profile"
              />
              <AvatarFallback className="text-2xl">
                {name ? getInitials(name) : 'JD'}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-1 -bottom-1 h-8 w-8 rounded-full cursor-pointer p-0 border-2 border-white bg-white hover:bg-gray-100"
              onClick={handleCameraClick}
              disabled={isLoading}
            >
              <Camera className="h-4 w-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={isLoading}
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">
                {name || 'Unknown User'}
              </h1>
            </div>

            <div className="flex items-center gap-1">
              <MapPin className="size-4" />
              <span className="text-sm text-muted-foreground">
                {state || 'Unknown'}, {country || 'Unknown'}
              </span>
            </div>

            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {email || 'No email provided'}
              </div>

              <div className="flex items-center gap-1">
                <PhoneCall className="size-4" />
                {phone_number || 'No phone provided'}
              </div>

              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                Joined {" "}
                {created_at ? new Date(created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Unknown date'
                }
              </div>
            </div>
          </div>

          {selectedImage && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={cancelPhotoChange}
                disabled={isLoading}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePhotoUpdate}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Change Photo'
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
