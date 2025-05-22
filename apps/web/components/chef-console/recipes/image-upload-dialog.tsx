
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File) => void;
  title: string;
  description?: string;
  loading?: boolean;
  disabled?: boolean;
}

const ImageUploadDialog = ({
  open,
  onOpenChange,
  onUpload,
  title,
  description,
  loading = false,
  disabled = false
}: ImageUploadDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      if (!selectedFile.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      // Check file size (8MB max)
      const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB in bytes
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 8MB");
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
      setFile(null);
      setPreview(null);
      onOpenChange(false);
      // Success toast moved to parent component after upload completes
    } else {
      toast.error("Please select a file first");
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            {preview ? (
              <div className="relative w-full border rounded-md overflow-hidden">
                <AspectRatio ratio={1/1}>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-white bg-opacity-70"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                >
                  Change
                </Button>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
              >
                <AspectRatio ratio={1/1} className="w-full">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 h-full">
                    {loading ? (
                      <Loader2 className="w-8 h-8 mb-2 text-gray-400 animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    )}
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      JPEG, PNG (MAX. 8MB)
                    </p>
                  </div>
                </AspectRatio>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={disabled || loading}
                />
              </label>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!file || disabled || loading}
            className={!file || disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;
