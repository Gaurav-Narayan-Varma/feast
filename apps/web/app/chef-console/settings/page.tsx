"use client";
// import { Chef } from "@/types/chef";
// import { chefApi } from "@/utils/api";
// import { ChefStatusFlags } from "@/utils/api/types/chef";
import OnboardingSection from "@/components/chef-console/settings/onboarding-section";
import { useEffect, useState } from "react";
// import ProfileDialogs from "@/components/chef-console/settings/profile-dialogs";
import { toast } from "react-hot-toast";

export default function ChefSettings() {
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [chefStatusFlags, setChefStatusFlags] = useState();
  const [chef, setChef] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChefData();
  }, []);

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
    <div className="space-y-6 w-full">
      <div className="mx-auto space-y-6">
        <OnboardingSection />
      </div>
    </div>
  );
}
