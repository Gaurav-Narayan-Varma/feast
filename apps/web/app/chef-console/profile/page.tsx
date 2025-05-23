"use client";
import { trpc } from "@/app/_trpc/client";
import PageSpinner from "@/components/chef-console/page-spinner";
import ProfileInformationCard from "@/components/chef-console/profile/profile-information-card";
import ProfilePictureCard from "@/components/chef-console/profile/profile-picture-card";
import WeeklyAvailabilityCard from "@/components/chef-console/profile/weekly-availabilitiy-card";

export default function ProfilePage() {
  const getChefUser = trpc.chefUser.getChefUser.useQuery();

  if (getChefUser.isLoading || !getChefUser.data) {
    return <PageSpinner />;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1200px] cursor-default">
      <div className="section-title">My Profile</div>

      <div className="flex gap-6 w-full justify-center">
        <ProfileInformationCard chefUser={getChefUser.data.chefUser} />
        <ProfilePictureCard
          profileImage={getChefUser.data.chefUser.profilePictureUrl}
        />
      </div>

      {/* When data is fetched, the datetimes convert to strings */}
      {/* Converting them back to satisfy the type checker */}
      <WeeklyAvailabilityCard
        availabilities={getChefUser.data.chefUser.availabilities.map((a) => ({
          ...a,
          startTime: new Date(a.startTime),
          endTime: new Date(a.endTime),
          createdAt: new Date(a.createdAt),
          updatedAt: new Date(a.updatedAt),
        }))}
      />
    </div>
  );
}
