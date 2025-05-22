import { trpc } from "@/app/_trpc/client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, User } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePictureCard({
  profileImage,
}: {
  profileImage: string | null;
}) {
  const [localImage, setLocalImage] = useState<string | null>(profileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfilePicture = trpc.chefUser.updateProfilePicture.useMutation({
    onSuccess: () => {
      toast.success("Profile picture updated successfully!");
    },
  });

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLocalImage(URL.createObjectURL(file));

      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      updateProfilePicture.mutate({
        name: file.name,
        type: file.type,
        base64,
      });
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>
          Upload a professional headshot for your chef profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-primary/20">
            <AspectRatio ratio={1 / 1} className="h-full">
              {localImage ? (
                <img
                  src={localImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <User className="w-20 h-20 text-muted-foreground" />
                </div>
              )}
            </AspectRatio>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/jpeg, image/png"
          onChange={handleFileInputChange}
        />
        <Button
          variant="outline"
          className="w-full flex items-center"
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            fileInputRef.current?.click();
          }}
          isLoading={updateProfilePicture.isPending}
          leftIcon={<Upload />}
          label={
            updateProfilePicture.isPending ? "Uploading" : "Upload Photo"
          }
        />
        <div className="text-xs text-muted-foreground mt-2 space-y-1">
          <div className="px-3 py-2 bg-muted/50 rounded-md">
            <div className="text-sm font-medium mb-1">Guidelines:</div>
            <ul className="text-xs space-y-0.5 pl-4 list-disc">
              <li>Clear, well-lit photo of your face</li>
              <li>Semi-Professional attire, we want you to look your best!</li>
              <li>Max size: 8MB</li>
              <li>Formats: JPG, PNG</li>
            </ul>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
