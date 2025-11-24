import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

// Tabs
import Personal from "@/components/profile/tabs/personal";
import Account from "@/components/profile/tabs/account";
import Security from "@/components/profile/tabs/security";

export default function ProfileContent( { profileData }: { profileData: any } ) {
  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 bg-muted p-1">
        <TabsTrigger
          className="cursor-pointer data-[state=active]:!bg-blue-600 data-[state=active]:!text-white data-[state=active]:shadow-sm"
          value="personal"
        >
          Personal
        </TabsTrigger>
        {/* <TabsTrigger
          className="cursor-pointer data-[state=active]:!bg-blue-600 data-[state=active]:!text-white data-[state=active]:shadow-sm"
          value="kyc"
        >
          KYC Information
        </TabsTrigger> */}
        <TabsTrigger
          className="cursor-pointer data-[state=active]:!bg-blue-600 data-[state=active]:!text-white data-[state=active]:shadow-sm"
          value="account"
        >
          Account
        </TabsTrigger>
        <TabsTrigger
          className="cursor-pointer data-[state=active]:!bg-blue-600 data-[state=active]:!text-white data-[state=active]:shadow-sm"
          value="security"
        >
          Security
        </TabsTrigger>
      </TabsList>

      {/* Personal Information */}
      <Personal
        name={profileData?.name}
        email={profileData?.email}
        phone_number={profileData?.phone_number}
        state={profileData?.state}
        country={profileData?.country}
        city={profileData?.city}
      />

      {/* KYC Information */}
      {/* <KYC
        registration_number={profileData?.registration_number}
        license_name={profileData?.license_name}
        license_issuance_authority={profileData?.license_issuance_authority}
        license_number={profileData?.license_number}
        license_issue_date={profileData?.license_issue_date}
        license_expiry_date={profileData?.license_expiry_date}
        license_document={profileData?.license_document}
        id_document={profileData?.id_document}
      /> */}

      {/* Account Settings */}
      <Account
        is_active={profileData?.is_active}
        is_visible={profileData?.is_visible}
      />

      {/* Security Settings */}
      <Security />
    </Tabs>
  );
}
