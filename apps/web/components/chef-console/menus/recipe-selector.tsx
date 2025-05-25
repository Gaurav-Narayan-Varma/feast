import { trpc } from "@/app/_trpc/client";
import RecipeGrid from "@/components/chef-console/recipes/recipe-grid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Recipe } from "@/lib/types";
import type { Cuisine, DietaryTags, FoodAllergen } from "@feast/shared";
import { skipToken } from "@tanstack/react-query";
import { Loader2, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Menu recipes are recipes user sees in menu form recipe grid
 * - So these could be recipes the user added, or a smaller subset if the user removed recipes
 */
export default function RecipeSelector({
  open,
  onOpenChange,
  onSelectRecipe,
  menuId,
  selectedRecipes,
  onDeselectRecipe,
  addToMenu,
  menuRecipes,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectRecipe: (selectedRecipe: Recipe) => void;
  menuId?: string;
  selectedRecipes: Recipe[];
  onDeselectRecipe: (deselectedRecipe: Recipe) => void;
  addToMenu: () => void;
  menuRecipes: Recipe[];
}) {
  const listAvailableRecipes = trpc.recipes.listAvailableRecipes.useQuery(
    menuId ? { menuId } : skipToken,
    {
      enabled: !!menuId,
    }
  );

  const listRecipes = trpc.recipes.listRecipes.useQuery(
    menuId ? skipToken : undefined
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col lg:w-1/2 lg:h-1/2">
        <DialogHeader className="mb-2">
          <DialogTitle>Select Recipes</DialogTitle>
        </DialogHeader>

        {/* Recipe Grid */}
        {listRecipes.isLoading || listAvailableRecipes.isLoading ? (
          <div className="py-8 text-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (menuId
            ? listAvailableRecipes.data?.recipes.filter(
                (recipe) =>
                  !menuRecipes.some((menuRecipe) => menuRecipe.id === recipe.id)
              )
            : listRecipes.data?.recipes.filter(
                (recipe) =>
                  !menuRecipes.some((menuRecipe) => menuRecipe.id === recipe.id)
              )
          )?.length === 0 ? (
          <EmptyRecipeState onOpenChange={onOpenChange} />
        ) : (
          <div className="flex-1 overflow-y-auto">
            <RecipeGrid
              recipes={
                (menuId
                  ? listAvailableRecipes.data?.recipes.filter(
                      (recipe) =>
                        !menuRecipes.some(
                          (menuRecipe) => menuRecipe.id === recipe.id
                        )
                    )
                  : listRecipes.data?.recipes.filter(
                      (recipe) =>
                        !menuRecipes.some(
                          (menuRecipe) => menuRecipe.id === recipe.id
                        )
                    )
                )?.map((recipe) => ({
                  ...recipe,
                  cuisines: recipe.cuisines as Cuisine[],
                  dietaryTags: recipe.dietaryTags as DietaryTags[],
                  foodAllergens: recipe.foodAllergens as FoodAllergen[],
                })) || []
              }
              onSelect={(recipe) => {
                onSelectRecipe(recipe);
              }}
              onDeselect={(recipe) => {
                onDeselectRecipe(recipe);
              }}
            />
          </div>
        )}

        <DialogFooter className="pt-4 border-t mt-2">
          <div className="flex flex-col sm:flex-row justify-between w-full gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="text-sm">
                {selectedRecipes.length} recipe
                {selectedRecipes.length !== 1 ? "s" : ""} selected
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                label="Cancel"
              />
              <Button
                onClick={() => {
                  addToMenu();
                  onOpenChange(false);
                }}
                disabled={selectedRecipes.length === 0}
                label="Add to Menu"
              />
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EmptyRecipeState({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  return (
    <div className="py-8 text-center flex flex-col items-center gap-2">
      <div className="text-muted-foreground">No recipes available</div>
      <Button
        variant="outline"
        onClick={() => {
          onOpenChange(false);
          router.push("/chef-console/recipes?create=true");
        }}
        label="Create Recipe"
        leftIcon={<PlusIcon />}
      />
    </div>
  );
}
