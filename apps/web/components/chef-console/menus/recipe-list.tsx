import React from "react";
import { Recipe, Menu } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  totalRecipes: number;
  onEditRecipe?: (recipe: Recipe) => void;
  onRemoveRecipe?: (recipeId: string) => void;
  onMoveRecipe?: (recipeId: string, direction: 'up' | 'down') => void;
  extraActions?: (recipe: Recipe) => React.ReactNode;
  actionOptions?: {
    showEdit?: boolean;
    showDelete?: boolean;
    showMove?: boolean;
  };
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  index,
  totalRecipes,
  onEditRecipe,
  onRemoveRecipe,
  onMoveRecipe,
  extraActions,
  actionOptions = {
    showEdit: true,
    showDelete: true,
    showMove: true
  }
}) => {
  const recipeId = recipe.id || recipe._id || "";
  
  // Ensure we have a valid ID
  if (!recipeId && (recipe._id || recipe.id)) {
    console.warn(`Recipe has id//_id but no valid recipeId was generated:`, recipe);
  }
  
  return (
    <Card key={recipeId} className="overflow-hidden">
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{recipe.name}</CardTitle>
            <div className="flex items-center mt-1 text-muted-foreground">
              <span>{recipe.priceRange}</span>
            </div>
          </div>
          
          <div className="flex gap-1">
            {/* Move buttons */}
            {onMoveRecipe && actionOptions.showMove && (
              <div className="flex flex-col mr-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onMoveRecipe(recipeId, "up")}
                  disabled={index === 0}
                  className="h-7 w-7 mb-1"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onMoveRecipe(recipeId, "down")}
                  disabled={index === totalRecipes - 1}
                  className="h-7 w-7"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
            
            {/* Edit button */}
            {onEditRecipe && actionOptions.showEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEditRecipe(recipe)}
                className="h-7 w-7"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            )}
            
            {/* Delete button */}
            {onRemoveRecipe && actionOptions.showDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveRecipe(recipeId)}
                className="h-7 w-7 text-destructive hover:text-destructive"
              >
                <Trash className="h-3.5 w-3.5" />
              </Button>
            )}
            
            {/* Render any extra action buttons */}
            {extraActions && extraActions(recipe)}
          </div>
        </div>
        
        {recipe.description && (
          <CardDescription className="mt-1">{recipe.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-1 mb-3">
          {recipe.cuisines.map((cuisine) => (
            <Badge key={cuisine} variant="outline" className="text-xs">{cuisine}</Badge>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {recipe.dietaryTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs bg-green-100 text-green-800 hover:bg-green-200">{tag}</Badge>
          ))}
        </div>
        
        {recipe.foodAllergens && recipe.foodAllergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {recipe.foodAllergens.map((allergen) => (
              <Badge key={allergen} variant="secondary" className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-200">{allergen}</Badge>
            ))}
          </div>
        )}
        
        {recipe.ingredients.length > 0 && (
          <div className="mt-2 text-sm">
            <span className="font-medium">Ingredients: </span>
            <span className="text-muted-foreground">
              {recipe.ingredients.map(i => i.name).join(", ")}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface RecipeListProps {
  recipes: Recipe[];
  menu: Menu;
  onEditRecipe?: (recipe: Recipe) => void;
  onRemoveRecipe?: (recipeId: string) => void;
  onUpdateMenu?: (updatedRecipes: Recipe[]) => void;
  onMoveRecipe?: (recipeId: string, direction: 'up' | 'down') => void;
  extraActions?: (recipe: Recipe) => React.ReactNode;
  actionOptions?: {
    showEdit?: boolean;
    showDelete?: boolean;
    showMove?: boolean;
  };
}

const RecipeList: React.FC<RecipeListProps> = ({ 
  recipes, 
  menu, 
  onEditRecipe, 
  onRemoveRecipe,
  onUpdateMenu,
  onMoveRecipe,
  extraActions,
  actionOptions
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe, index) => (
        <RecipeCard 
          key={recipe.id || recipe._id || `recipe-${index}`}
          recipe={recipe}
          index={index}
          totalRecipes={recipes.length}
          onEditRecipe={onEditRecipe}
          onRemoveRecipe={onRemoveRecipe}
          onMoveRecipe={onMoveRecipe}
          extraActions={extraActions}
          actionOptions={actionOptions}
        />
      ))}
    </div>
  );
};

export default RecipeList;