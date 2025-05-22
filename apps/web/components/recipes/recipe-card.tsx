"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Recipe } from "@/lib/types";
import cx from "clsx";
import { Check, EditIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const RecipeCard = ({
  recipe,
  isEditable,
  onDelete,
  onEdit,
  onSelect,
  onDeselect,
  isRemovableFromMenu,
  nonSelectable,
}: {
  recipe: Recipe;
  isEditable: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onSelect: () => void;
  onDeselect: () => void;
  isRemovableFromMenu: boolean;
  nonSelectable?: boolean;
}) => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <Card
      key={recipe.id}
      className={cx(
        "gap-1 cursor-default relative",
        {
          "pb-2": isEditable,
          "pb-4": !isEditable,
          "bg-ds-chef-800/[0.05] border border-ds-chef-800/40": isSelected,
        }
      )}
      onClick={() => {
        if (!isEditable && !nonSelectable) {
          if (isSelected) {
            setIsSelected(false);
            onDeselect();
          } else {
            setIsSelected(true);
            onSelect();
          }
        }
      }}
    >
      {isRemovableFromMenu && (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                leftIcon={<TrashIcon className="h-4 w-4 text-red-500" />}
                className="p-2 h-fit absolute top-3 right-3"
                variant="ghost"
                onClick={onDelete}
              />
            </TooltipTrigger>
            <TooltipContent className="text-xs">
              Remove from Menu
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {isSelected && (
        <Check className="absolute top-2.5 right-3 text-ds-chef-800 stroke-3 w-5 h-5" />
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2">{recipe.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {recipe.description}
        </p>

        {isEditable && (
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
                <TooltipContent className="text-xs">
                  Delete Recipe
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
