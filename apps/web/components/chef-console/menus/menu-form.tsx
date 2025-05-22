"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Menu, Recipe } from "@/lib/types";
import { menuSchema } from "@feast/shared";
import { PlusIcon, SaveIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import ErrorAlert from "../../error-alert";
import RecipeGrid from "../recipes/recipe-grid";
import RecipeSelector from "./recipe-selector";

function MenuForm({
  selectedMenu,
  setIsCreateMode,
  setIsEditMode,
  setSelectedMenu,
}: {
  selectedMenu: Menu | null;
  setIsCreateMode: (isCreateMode: boolean) => void;
  setIsEditMode: (isEditMode: boolean) => void;
  setSelectedMenu: (menu: Menu | null) => void;
}) {
  const [menu, setMenu] = useState<Menu>(
    selectedMenu
      ? {
          ...selectedMenu,
        }
      : {
          name: "",
          description: "",
          recipes: [],
        }
  );
  const [isRecipeSelectorOpen, setIsRecipeSelectorOpen] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<z.ZodError | null>(null);
  const utils = trpc.useUtils();

  const createMenu = trpc.menus.createMenu.useMutation({
    onSuccess: () => {
      setIsCreateMode(false);
      toast.success("Menu created successfully");
      utils.menus.listMenus.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMenu = trpc.menus.updateMenu.useMutation({
    onSuccess: () => {
      setIsEditMode(false);
      toast.success("Menu updated successfully");
      utils.menus.listMenus.invalidate();
      setSelectedMenu(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const removeRecipeFromMenu = trpc.menus.removeRecipeFromMenu.useMutation({
    onSuccess: (data) => {
      setMenu({
        ...menu,
        recipes: menu.recipes.filter((recipe) => recipe.id !== data.recipeId),
      });
      utils.recipes.listAvailableRecipes.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleSave() {
    setError(null);

    /**
     * Zod field `z.array(z.string()).min(1, "At least one recipe is required")` NOT working
     * So manually checking for empty array
     */
    if (menu.recipes.length === 0) {
      setError(
        new z.ZodError([
          {
            code: "custom",
            path: ["recipes"],
            message: "At least one recipe is required",
          },
        ])
      );
      return;
    }

    const menuData = {
      name: menu.name,
      description: menu.description,
      recipes: menu.recipes.map((recipe) => recipe.id),
    };

    const result = menuSchema.safeParse(menuData);

    if (!result.success) {
      setError(result.error);
      return;
    }

    if (!selectedMenu?.id) {
      createMenu.mutate(menuData);
    } else {
      updateMenu.mutate({
        menuId: selectedMenu.id,
        menu: menuData,
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{selectedMenu ? "Edit Menu" : "Create Menu"}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {error?.errors[0]?.message && (
          <ErrorAlert message={error.errors[0].message} />
        )}
        {/* Menu Name */}
        <div className="flex flex-col gap-2">
          <Label>Menu Name</Label>
          <Input
            type="text"
            placeholder="Enter menu name"
            value={menu.name}
            onChange={(e) => setMenu({ ...menu, name: e.target.value })}
          />
        </div>
        {/* Menu Description */}
        <div className="flex flex-col gap-2">
          <Label>Menu Description</Label>
          <Textarea
            placeholder="Enter menu description"
            value={menu.description}
            onChange={(e) => setMenu({ ...menu, description: e.target.value })}
          />
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recipes</h3>
            <Button
              size="sm"
              label="Add Recipe"
              leftIcon={<PlusIcon />}
              onClick={() => {
                setIsRecipeSelectorOpen(true);
              }}
            />
          </div>

          {/* Recipe Grid */}
          {menu.recipes.length > 0 ? (
            <RecipeGrid
              recipes={menu.recipes}
              onDelete={(recipeId) => {
                removeRecipeFromMenu.mutate({
                  menuId: selectedMenu?.id ?? "",
                  recipeId,
                });
              }}
              isRemovableFromMenu={true}
              nonSelectable
            />
          ) : (
            <div className="text-center p-8 border border-dashed rounded-md text-muted-foreground flex flex-col gap-4 items-center">
              No recipes added to this menu yet
              <Button
                onClick={() => {
                  setIsRecipeSelectorOpen(true);
                }}
                size="sm"
                label="Add Recipe"
                className="w-fit"
                leftIcon={<PlusIcon />}
              />
            </div>
          )}

          {/* Recipe Selector Modal */}
          <RecipeSelector
            open={isRecipeSelectorOpen}
            onOpenChange={(open) => {
              setIsRecipeSelectorOpen(open);
              setSelectedRecipes([]);
            }}
            menuId={selectedMenu?.id}
            onSelectRecipe={(recipe) => {
              setSelectedRecipes([...selectedRecipes, recipe]);
            }}
            onDeselectRecipe={(recipe) => {
              setSelectedRecipes(
                selectedRecipes.filter((r) => r.id !== recipe.id)
              );
            }}
            addToMenu={() => {
              setMenu({
                ...menu,
                recipes: [...menu.recipes, ...selectedRecipes],
              });
              setIsRecipeSelectorOpen(false);
            }}
            selectedRecipes={selectedRecipes}
            menuRecipes={menu.recipes}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          label={selectedMenu ? "Save Changes" : "Create Menu"}
          leftIcon={<SaveIcon />}
          onClick={() => handleSave()}
        />
      </CardFooter>
    </Card>
  );
}

export default MenuForm;
