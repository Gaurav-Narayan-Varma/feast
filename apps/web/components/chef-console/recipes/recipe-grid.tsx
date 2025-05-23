import { Recipe } from "@/lib/types";
import { Cuisine, DietaryTags, FoodAllergen } from "@feast/shared";
import { RecipeCard } from "./recipe-card";

export default function RecipeGrid({
  recipes,
  onDelete,
  onEdit,
  onSelect,
  onDeselect,
  isRemovableFromMenu,
  nonSelectable,
}: {
  recipes: Recipe[];
  onDelete?: (id: string) => void;
  onEdit?: (recipe: Recipe) => void;
  onSelect?: (recipe: Recipe) => void;
  onDeselect?: (recipe: Recipe) => void;
  isRemovableFromMenu?: boolean;
  nonSelectable?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={{
            ...recipe,
            cuisines: recipe.cuisines as Cuisine[],
            dietaryTags: recipe.dietaryTags as DietaryTags[],
            foodAllergens: recipe.foodAllergens as FoodAllergen[],
          }}
          isEditable={!!onEdit}
          isRemovableFromMenu={isRemovableFromMenu ?? false}
          onDelete={() => {
            onDelete?.(recipe.id);
          }}
          onEdit={() => {
            onEdit?.(recipe);
          }}
          onSelect={() => {
            onSelect?.(recipe);
          }}
          onDeselect={() => {
            onDeselect?.(recipe);
          }}
          nonSelectable={nonSelectable ?? false}
        />
      ))}
    </div>
  );
}
