import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Recipe } from "@/lib/types";
import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";
import { useState } from "react";

export default function RecipeSlot({
  i,
  recipe,
  onRemoveFromCart,
  onAddToCart,
}: {
  i: number;
  recipe: Recipe;
  onRemoveFromCart: (recipe: Recipe) => void;
  onAddToCart: (recipe: Recipe) => void;
}) {
  const [isIngredientsExpanded, setIsIngredientsExpanded] = useState(false);

  return (
    <li
      key={i}
      className="relative flex flex-col border-b pb-4 last:border-0 gap-3"
    >
      <div className="flex">
        <div className="flex-1">
          <h4 className="font-medium">{recipe.name}</h4>
          <p className="text-sm text-ds-chef-600 mt-1">{recipe.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {recipe.dietaryTags?.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs bg-green-100 text-green-800 hover:bg-green-200"
              >
                {tag}
              </Badge>
            ))}
            {recipe.foodAllergens?.length > 0 && (
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200 text-xs"
              >
                Contains: {recipe.foodAllergens.join(", ")}
              </Badge>
            )}
          </div>
        </div>
        <div
          className="flex-shrink-0 flex flex-col items-end ml-4"
          style={{ width: "30%" }}
        >
          <div className="font-medium mb-2">${recipe.price}</div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              className="py-0 hover:bg-ds-chef-100 text-ds-chef-500 px-2"
              onClick={() => onRemoveFromCart(recipe)}
              leftIcon={<Minus size={12} />}
            />
            <Button
              variant="outline"
              className="py-0 hover:bg-ds-chef-100 text-ds-chef-500 px-2"
              onClick={() => onAddToCart(recipe)}
              leftIcon={<Plus size={12} />}
            />
          </div>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        {recipe.ingredients.length > 0 && (
          <Button
            className="text-muted-foreground"
            variant="outline"
            onClick={() => setIsIngredientsExpanded(!isIngredientsExpanded)}
            label={
              isIngredientsExpanded ? "Hide ingredients" : "Show ingredients"
            }
            rightIcon={isIngredientsExpanded ? <ChevronUp /> : <ChevronDown />}
          />
        )}
        <div
          className={`transition-all overflow-y-auto duration-200 ${
            isIngredientsExpanded ? "max-h-40" : "max-h-0"
          }`}
        >
          <div className="pt-2 px-2 flex flex-col gap-2">
            {recipe.ingredients.map((ingredient) => (
              <li
                key={ingredient.name}
                className="text-sm list-disc list-inside"
              >
                {ingredient.name}
              </li>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}
