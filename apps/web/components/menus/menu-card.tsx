"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Menu } from "@/lib/types";
import { ChevronDownIcon, EditIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import RecipeGrid from "../recipes/recipe-grid";

export default function MenuCard({
  menu,
  setIsEditMode,
  setSelectedMenu,
}: {
  menu: Menu;
  setIsEditMode: (isEditMode: boolean) => void;
  setSelectedMenu: (menu: Menu) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const utils = trpc.useUtils();

  const deleteMenu = trpc.menus.deleteMenu.useMutation({
    onSuccess: () => {
      utils.menus.listMenus.invalidate();
      toast.success("Menu deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">{menu.name}</div>
          <div className="flex items-center gap-1">
            <Button
              leftIcon={<EditIcon />}
              variant="ghost"
              className="p-2"
              onClick={() => {
                setIsEditMode(true);
                setSelectedMenu(menu);
              }}
            />
            <Button
              leftIcon={<TrashIcon />}
              variant="ghost"
              className="p-2 text-red-500"
              isLoading={deleteMenu.isPending}
              onClick={() => {
                deleteMenu.mutate({ menuId: menu.id ?? "" });
              }}
            />
          </div>
        </div>
        {/* Description */}
        <div className="text-sm text-muted-foreground">{menu.description}</div>
        {/* Recipes */}
        <div className="border-t pt-3 mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground ">
            {menu.recipes.length} recipes
          </div>
          <Button
            rightIcon={
              <ChevronDownIcon
                className={`transform transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            }
            variant="ghost"
            label="View Recipes"
            className="p-2 gap-1"
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>

        {/* Recipes Grid */}
        {isExpanded && (
          <div className="mt-4">
            <RecipeGrid recipes={menu.recipes} nonSelectable />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
