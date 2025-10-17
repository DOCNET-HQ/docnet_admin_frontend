"use client";

import { useEffect } from "react";
import { Loader } from "@/components/dashboard/loader";
import { useGetProfileQuery } from "@/lib/api/apiSlice";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileContent from "@/components/profile/profile-content";
import ErrorDisplay from "@/components/utils/error-display";

export default function Page() {
  // RTK Query hook - destructure refetch function
  const { data, isLoading, isError, refetch } = useGetProfileQuery();

  // Now you can use refetch directly
  const refetchProfile = () => {
    refetch();
  };

  // Log data when it arrives
  useEffect(() => {
    if (data) {
      console.log("Profile data:", data);
    }
  }, [data]);

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <ErrorDisplay
        title="Failed to Load Profile"
        onRetry={refetchProfile}
        type="server"
      />
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-2 md:px-5 lg:px-25 py-4">
      <ProfileHeader
        photo={data?.photo}
        name={data?.name}
        email={data?.email}
        phone_number={data?.phone_number}
        state={data?.state}
        country={data?.country}
        created_at={data?.created_at}
      />
      <ProfileContent
        profileData={data}
      />
    </div>
  );
}
