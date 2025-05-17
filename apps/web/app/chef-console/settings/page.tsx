"use client";
// import { Chef } from "@/types/chef";
// import { chefApi } from "@/utils/api";
// import { ChefStatusFlags } from "@/utils/api/types/chef";
import { useEffect, useRef, useState } from "react";
import AdminSection from "@/components/chef-console/settings/admin-section";
import ChefPreferences from "@/components/chef-console/settings/preferences-section";
// import ProfileDialogs from "@/components/chef-console/settings/profile-dialogs";
import { toast } from "react-hot-toast";

export default function ChefSettings() {
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [chefStatusFlags, setChefStatusFlags] =
    useState();
  const [chef, setChef] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const administrativeSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChefData();
  }, []);

  // Check for hash in URL to scroll to specific section
  useEffect(() => {
    if (window.location.hash === "#administrative") {
      setTimeout(() => {
        administrativeSectionRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 300);
    }
  }, [isLoading]);

  // Function to fetch chef profile data
  const fetchChefData = async () => {
    try {
      setIsLoading(true);

    //   const [chefData, chefStatusFlags] = await Promise.all([
    //     chefApi.getProfile(),
    //     chefApi.getChefStatusFlags(),
    //   ]);

    //   if (!chefData) {
    //     throw new Error("Failed to load chef profile data");
    //   }

    //   setChef(chefData);
    //   setChefStatusFlags(chefStatusFlags.statuses as ChefStatusFlags);
    setIsLoading(false);
    } catch (error) {
      toast.error("Failed to load profile data. Please try again later.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">Account Settings</h2>

        <ChefPreferences chef={chef} refreshProfile={fetchChefData} />

        <div ref={administrativeSectionRef}>
          <AdminSection
            onOpenContractDialog={() => setContractDialogOpen(true)}
            onOpenPasswordDialog={() => setPasswordDialogOpen(true)}
            chefStatusFlags={chefStatusFlags}
          />
        </div>
      </div>

      {/* <ProfileDialogs
        contractDialogOpen={contractDialogOpen}
        setContractDialogOpen={setContractDialogOpen}
        passwordDialogOpen={passwordDialogOpen}
        setPasswordDialogOpen={setPasswordDialogOpen}
        chef={chef}
        // Only include the props needed for administrative dialogs
        cuisineModalOpen={false}
        setCuisineModalOpen={() => {}}
        profileImageUploadOpen={false}
        setProfileImageUploadOpen={() => {}}
        exampleHeadshotsOpen={false}
        setExampleHeadshotsOpen={() => {}}
        exampleHeadshots={[]}
        onUploadProfileImage={() => {}}
        selectedCuisines={[]}
        onConfirmCuisines={() => {}}
      /> */}
    </div>
  );
}
