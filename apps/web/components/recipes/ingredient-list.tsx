import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IngredientDetails } from "@/lib/types";
import { Camera, MoreHorizontal, Trash } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import ImageUploadDialog from "./image-upload-dialog";

interface IngredientListProps {
  ingredients: IngredientDetails[];
  onRemove: (ingredientName: string) => void;
  onAddScreenshot?: (ingredientName: string, file: File) => void;
}

const IngredientList: React.FC<IngredientListProps> = ({
  ingredients,
  onRemove,
  onAddScreenshot,
}) => {
  const [selectedIngredientName, setSelectedIngredientName] = useState<
    string | null
  >(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const handleOpenScreenshotDialog = (ingredientName: string) => {
    setSelectedIngredientName(ingredientName);
    setIsImageDialogOpen(true);
  };

  const handleImageUpload = (file: File) => {
    if (selectedIngredientName && onAddScreenshot) {
      onAddScreenshot(selectedIngredientName, file);
      toast.success("Screenshot added");
    }
    setSelectedIngredientName(null);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px]">Quantity</TableHead>
            <TableHead className="w-[80px]">Unit</TableHead>
            <TableHead className="w-[140px]">Preparation</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingredients.map((ingredient) => (
            <TableRow key={ingredient.name}>
              <TableCell className="font-medium">{ingredient.name}</TableCell>
              <TableCell>{ingredient.quantity}</TableCell>
              <TableCell>{ingredient.unit}</TableCell>
              <TableCell
                className="truncate max-w-[140px]"
                title={ingredient.preparation}
              >
                {ingredient.preparation}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    {onAddScreenshot && (
                      <>
                        <DropdownMenuItem
                          onClick={() =>
                            handleOpenScreenshotDialog(
                              ingredient.name as string
                            )
                          }
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Add Screenshot
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onRemove(ingredient.name as string)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {ingredients.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-4 text-muted-foreground"
              >
                No ingredients added
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ImageUploadDialog
        open={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        onUpload={handleImageUpload}
        title="Add Ingredient Screenshot"
        description="Upload a photo of the ingredient preparation or final result"
      />
    </div>
  );
};

export default IngredientList;
