"use client";
import { trpc } from "@/app/_trpc/client";
import FilterableBadgeList from "@/components/chef-console/recipes/filterable-badge-list";
import CuisineSelectionModal from "@/components/modals/cuisine-selection-modal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type AppRouter } from "@feast/api";
import { Cuisine } from "@feast/shared";
import { inferRouterOutputs } from "@trpc/server";
import { AlertCircle, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";

const profileFormSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  bio: z.string().nullable().optional(),
  zipCode: z
    .string({ required_error: "Zip code is required" })
    .min(5, "Zip code must be 5 digits"),
  cuisines: z.array(z.nativeEnum(Cuisine)).optional(),
});

type ProfileForm = z.infer<typeof profileFormSchema>;

type RouterOutput = inferRouterOutputs<AppRouter>;
type GetChefUserOutput = RouterOutput["chefUser"]["getChefUser"];

export default function ProfileInformationCard({
  chefUser,
}: {
  chefUser: GetChefUserOutput["chefUser"];
}) {
  const updateProfile = trpc.chefUser.updateChefUser.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
  });

  const [cuisineModalOpen, setCuisineModalOpen] = useState(false);
  const [error, setError] = useState<z.ZodError | null>(null);
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: chefUser.name,
    bio: chefUser.bio,
    zipCode: chefUser.zipCode,
    cuisines: chefUser.cuisines as Cuisine[],
  });

  const removeCuisine = (cuisine: Cuisine) => {
    setProfileForm({
      ...profileForm,
      cuisines: profileForm.cuisines?.filter((c) => c !== cuisine),
    });
  };

  const handleCuisineSelection = (selectedCuisines: string[]) => {
    setProfileForm({
      ...profileForm,
      cuisines: selectedCuisines as Cuisine[],
    });
  };

  const handleUpdateProfile = () => {
    setError(null);

    const result = profileFormSchema.safeParse(profileForm);

    if (!result.success) {
      setError(result.error);

      return;
    }

    updateProfile.mutate({
      data: {
        name: result.data.name,
        bio: result.data.bio ?? undefined,
        zipCode: result.data.zipCode,
        cuisines: result.data.cuisines,
      },
    });
  };

  return (
    <Card className="w-1/2 h-fit gap-4 flex-1">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Upload a professional headshot for your chef profile
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error?.errors[0]?.message}
            </AlertDescription>
          </Alert>
        )}
        {/* Name */}
        <div className="flex flex-col gap-2">
          <Label>Name</Label>
          <Input
            type="text"
            placeholder="Enter name"
            value={profileForm.name}
            onChange={(e) =>
              setProfileForm({
                ...profileForm,
                name: e.target.value,
              })
            }
          />
        </div>
        {/* Email */}
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input
            type="text"
            placeholder="Enter email"
            value={chefUser.email}
            disabled
          />
        </div>
        {/* Bio */}
        <div className="flex flex-col gap-2">
          <Label>Bio</Label>
          <Textarea
            placeholder="Enter bio"
            value={profileForm.bio ?? ""}
            onChange={(e) =>
              setProfileForm({
                ...profileForm,
                bio: e.target.value,
              })
            }
          />
        </div>
        {/* Zip Code */}
        <div className="flex flex-col gap-2">
          <Label>Zip Code</Label>
          <Input
            placeholder="Enter zip code"
            value={profileForm.zipCode ?? ""}
            onChange={(e) =>
              setProfileForm({
                ...profileForm,
                zipCode: e.target.value,
              })
            }
          />
        </div>
        <FilterableBadgeList
          label="Cuisines"
          selectedItems={profileForm.cuisines as Cuisine[] | []}
          onOpenSelector={() => setCuisineModalOpen(true)}
          onRemoveItem={removeCuisine}
        />

        <div className="flex justify-end">
          <Button
            label="Save"
            variant="secondary"
            leftIcon={<Save />}
            onClick={handleUpdateProfile}
            isLoading={updateProfile.isPending}
          />
        </div>
      </CardContent>

      <CuisineSelectionModal
        open={cuisineModalOpen}
        onOpenChange={setCuisineModalOpen}
        availableCuisines={Object.values(Cuisine)}
        selectedCuisines={profileForm.cuisines as Cuisine[] | []}
        onConfirm={handleCuisineSelection}
        title="Select Cuisines"
        description="Choose the cuisines for this profile"
      />
    </Card>
  );
}
