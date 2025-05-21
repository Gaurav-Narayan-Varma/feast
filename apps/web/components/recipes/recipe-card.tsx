import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Recipe } from "@/lib/types";
import { EditIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const RecipeCard = ({
  recipe,
  onDelete,
  onEdit,
}: {
  recipe: Recipe;
  onDelete: () => void;
  onEdit: () => void;
}) => {
  return (
    <Card key={recipe.id} className="gap-1 pb-2">
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {recipe.description}
        </p>
        <div className="flex justify-end">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  leftIcon={<EditIcon className="" />}
                  className="p-2 h-fit"
                  variant="ghost"
                  onClick={onEdit}
                />
              </TooltipTrigger>
              <TooltipContent className="text-xs">Edit Recipe</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  leftIcon={<TrashIcon className="stroke-red-500" />}
                  className="p-2 h-fit"
                  variant="ghost"
                  onClick={onDelete}
                />
              </TooltipTrigger>
              <TooltipContent className="text-xs">Delete Recipe</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};
