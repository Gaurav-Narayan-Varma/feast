"use client";
import { trpc } from "@/app/_trpc/client";
import RecipeSelectionModals from "@/components/modals/recipe-selection-modals";
import FilterableBadgeList from "@/components/recipes/filterable-badge-list";
import IngredientFormSection from "@/components/recipes/ingredient-form-section";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IngredientDetails, Recipe } from "@/lib/types";
import { Cuisine, DietaryTags, FoodAllergen, PriceRange } from "@feast/shared";
import { recipeSchema } from "@feast/shared";
import {
  AlertCircle,
  ArrowLeftIcon,
  Info,
  PlusIcon,
  SaveIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";

export default function ChefConsoleRecipesPage() {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [recipe, setRecipe] = useState<Recipe>({
    name: "",
    description: "",
    cuisines: [],
    dietaryTags: [],
    foodAllergens: [],
    ingredients: [],
    priceRange: PriceRange.BUDGET,
  });
  const [isFormModified, setIsFormModified] = useState(false);
  const [cuisineModalOpen, setCuisineModalOpen] = useState(false);
  const [dietaryTagsModalOpen, setDietaryTagsModalOpen] = useState(false);
  const [allergenModalOpen, setAllergenModalOpen] = useState(false);
  const [error, setError] = useState<z.ZodError | null>(null);

  const availableCuisines = Object.values(Cuisine);
  const availableDietaryTags = Object.values(DietaryTags);
  const availableAllergens = Object.values(FoodAllergen);

  const listRecipes = trpc.recipes.listRecipes.useQuery();

  if (listRecipes.data) {
    // console.log("listRecipes.data", listRecipes.data);

    // listRecipes.data.recipes.map((recipe) => {
    //   // console.log("recipe", recipe);
    // });
  }

  const createRecipe = trpc.recipes.createRecipe.useMutation({
    onSuccess: () => {
      setIsCreateMode(false);
      toast.success("Recipe created successfully");
      setRecipe({
        name: "",
        description: "",
        cuisines: [],
        dietaryTags: [],
        foodAllergens: [],
        ingredients: [],
        priceRange: PriceRange.BUDGET,
      });
    },
  });
  
  const removeAllergen = (allergen: FoodAllergen) => {
    setRecipe({
      ...recipe,
      foodAllergens: recipe.foodAllergens.filter((a) => a !== allergen),
    });
    setIsFormModified(true);
  };

  const removeDietaryTag = (tag: DietaryTags) => {
    setRecipe({
      ...recipe,
      dietaryTags: recipe.dietaryTags.filter((t) => t !== tag),
    });
    setIsFormModified(true);
  };

  const removeCuisine = (cuisine: Cuisine) => {
    setRecipe({
      ...recipe,
      cuisines: recipe.cuisines.filter((c) => c !== cuisine),
    });
    setIsFormModified(true);
  };

  const handleCuisineSelection = (selectedCuisines: string[]) => {
    setRecipe({
      ...recipe,
      cuisines: selectedCuisines as Cuisine[],
    });
    setIsFormModified(true);
  };

  const handleDietaryTagsSelection = (selectedTags: string[]) => {
    setRecipe({
      ...recipe,
      dietaryTags: selectedTags as DietaryTags[],
    });
    setIsFormModified(true);
  };

  const handleAllergenSelection = (selectedAllergens: string[]) => {
    setRecipe({
      ...recipe,
      foodAllergens: selectedAllergens as FoodAllergen[],
    });
    setIsFormModified(true);
  };

  const handleAddIngredient = (newIngredient: IngredientDetails) => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { ...newIngredient }],
    });
    setIsFormModified(true);
  };

  const handleRemoveIngredient = (ingredientName: string) => {
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients.filter((i) => i.name !== ingredientName),
    });
    setIsFormModified(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <div className="section-title">My Recipes</div>
        {isCreateMode ? (
          <Button
            label="Back to Recipes"
            leftIcon={<ArrowLeftIcon />}
            onClick={() => setIsCreateMode(false)}
          />
        ) : (
          <Button
            label="Add Recipe"
            leftIcon={<PlusIcon />}
            onClick={() => setIsCreateMode(true)}
          />
        )}
      </div>

      {!isCreateMode && listRecipes.data && (
        <div className="flex flex-col gap-4">
          {listRecipes.data.recipes.map((recipe) => (
            <Card key={recipe.id}>
              <CardHeader>
                <CardTitle>{recipe.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{recipe.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isCreateMode && (
        <Card>
          <CardHeader>
            <CardTitle>Create Recipe</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {error?.errors[0]?.message && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {error.errors[0].message}
                </AlertDescription>
              </Alert>
            )}
            {/* Recipe Name */}
            <div className="flex flex-col gap-2">
              <Label>Recipe Name</Label>
              <Input
                type="text"
                placeholder="Enter recipe name"
                value={recipe.name}
                onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
              />
            </div>
            {/* Recipe Description */}
            <div className="flex flex-col gap-2">
              <Label>Recipe Description</Label>
              <Textarea
                placeholder="Enter recipe description"
                value={recipe.description}
                onChange={(e) =>
                  setRecipe({ ...recipe, description: e.target.value })
                }
              />
            </div>
            {/* Recipe Price */}
            <div className="flex gap-6 items-center">
              <div className="flex gap-2 items-center">
                <Label>Price Range</Label>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help stroke-[1.5]" />
                    </TooltipTrigger>
                    <TooltipContent className="p-3 text-xs text-muted-foreground">
                      <li>$ Budget: ~$8/dish ($50 for 6 servings)</li>
                      <li>$$ Standard: ~$16/dish ($95 for 6 servings)</li>
                      <li>$$$ Premium: ~$25/dish ($150 for 6 servings)</li>
                      <li>$$$$ Luxury: ~$35+/dish ($210+ for 6 servings)</li>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <RadioGroup
                value={recipe.priceRange}
                onValueChange={(value) =>
                  setRecipe({ ...recipe, priceRange: value as PriceRange })
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={PriceRange.BUDGET} id="budget" />
                  <Label
                    htmlFor="budget"
                    className="font-light text-sm text-muted-foreground"
                  >
                    $
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={PriceRange.LOW} id="low" />
                  <Label
                    htmlFor="low"
                    className="font-light text-sm text-muted-foreground"
                  >
                    $$
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={PriceRange.MEDIUM} id="medium" />
                  <Label
                    htmlFor="medium"
                    className="font-light text-sm text-muted-foreground"
                  >
                    $$$
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={PriceRange.HIGH} id="high" />
                  <Label
                    htmlFor="high"
                    className="font-light text-sm text-muted-foreground"
                  >
                    $$$$
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Badges */}
            <div className="flex flex-col gap-6">
              {/* Cuisines */}
              <FilterableBadgeList
                label="Cuisines"
                selectedItems={recipe.cuisines}
                onOpenSelector={() => setCuisineModalOpen(true)}
                onRemoveItem={removeCuisine}
              />

              {/* Dietary Tags */}
              <FilterableBadgeList
                label="Dietary Tags"
                selectedItems={recipe.dietaryTags}
                onOpenSelector={() => setDietaryTagsModalOpen(true)}
                onRemoveItem={removeDietaryTag}
                badgeClassName="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200"
                removeButtonClassName="rounded-full hover:bg-green-200 hover:text-green-900 transition-colors"
              />

              {/* Allergens */}
              <FilterableBadgeList
                label="Allergens"
                selectedItems={recipe.foodAllergens}
                onOpenSelector={() => setAllergenModalOpen(true)}
                onRemoveItem={removeAllergen}
                badgeClassName="flex items-center gap-1 bg-amber-100 text-amber-800 hover:bg-amber-200"
                removeButtonClassName="rounded-full hover:bg-amber-200 hover:text-amber-900 transition-colors"
              />
            </div>

            <IngredientFormSection
              ingredients={recipe.ingredients}
              onRemoveIngredient={handleRemoveIngredient}
              onAddIngredient={handleAddIngredient}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              label="Create Recipe"
              leftIcon={<SaveIcon />}
              isLoading={createRecipe.isPending}
              onClick={() => {
                setError(null);
                const result = recipeSchema.safeParse(recipe);

                if (!result.success) {
                  setError(result.error);
                  return;
                }

                createRecipe.mutate({
                  ...recipe,
                });
              }}
            />
          </CardFooter>
        </Card>
      )}

      <RecipeSelectionModals
        cuisineModalOpen={cuisineModalOpen}
        setCuisineModalOpen={setCuisineModalOpen}
        availableCuisines={availableCuisines}
        selectedCuisines={recipe.cuisines}
        handleCuisineSelection={handleCuisineSelection}
        dietaryTagsModalOpen={dietaryTagsModalOpen}
        setDietaryTagsModalOpen={setDietaryTagsModalOpen}
        availableDietaryTags={availableDietaryTags}
        selectedDietaryTags={recipe.dietaryTags}
        handleDietaryTagsSelection={handleDietaryTagsSelection}
        allergenModalOpen={allergenModalOpen}
        setAllergenModalOpen={setAllergenModalOpen}
        availableAllergens={availableAllergens}
        selectedAllergens={recipe.foodAllergens}
        handleAllergenSelection={handleAllergenSelection}
      />
    </div>
  );
}
