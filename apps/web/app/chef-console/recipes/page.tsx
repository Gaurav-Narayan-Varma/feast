"use client";
import { trpc } from "@/app/_trpc/client";
import PageSpinner from "@/components/chef-console/page-spinner";
import FilterableBadgeList from "@/components/chef-console/recipes/filterable-badge-list";
import IngredientFormSection from "@/components/chef-console/recipes/ingredient-form-section";
import RecipeGrid from "@/components/chef-console/recipes/recipe-grid";
import ErrorAlert from "@/components/error-alert";
import RecipeSelectionModals from "@/components/modals/recipe-selection-modals";
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
import { IngredientDetails, Recipe } from "@/lib/types";
import {
  Cuisine,
  DietaryTags,
  FoodAllergen,
  recipeSchema,
} from "@feast/shared";
import { ArrowLeftIcon, PlusIcon, SaveIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";

export default function ChefConsoleRecipesPage() {
  const params = useSearchParams();
  const [isCreateMode, setIsCreateMode] = useState(
    params.get("create") === "true"
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [recipe, setRecipe] = useState<Recipe>({
    id: "",
    name: "",
    description: "",
    cuisines: [],
    dietaryTags: [],
    foodAllergens: [],
    ingredients: [],
    price: 0,
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

  const createRecipe = trpc.recipes.createRecipe.useMutation({
    onSuccess: () => {
      listRecipes.refetch();
      setIsCreateMode(false);
      toast.success("Recipe created successfully");
      setRecipe({
        id: "",
        name: "",
        description: "",
        cuisines: [],
        dietaryTags: [],
        foodAllergens: [],
        ingredients: [],
        price: 0,
      });
    },
  });

  const deleteRecipe = trpc.recipes.deleteRecipe.useMutation({
    onSuccess: () => {
      toast.success("Recipe deleted successfully");
      listRecipes.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const editRecipe = trpc.recipes.editRecipe.useMutation({
    onSuccess: () => {
      toast.success("Recipe updated successfully");
      listRecipes.refetch();
      setIsEditMode(false);
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

  if (listRecipes.isLoading) {
    return <PageSpinner />;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[800px]">
      <div className="flex justify-between w-full items-center">
        <div>
          <div className="section-title">My Menus</div>
          <div className="text-sm text-muted-foreground">
            Craft your individual recipes
          </div>
        </div>
        {isCreateMode || isEditMode ? (
          <Button
            label="Back to Recipes"
            leftIcon={<ArrowLeftIcon />}
            onClick={() => {
              setRecipe({
                id: "",
                name: "",
                description: "",
                cuisines: [],
                dietaryTags: [],
                foodAllergens: [],
                ingredients: [],
                price: 0,
              });
              setError(null);
              setIsCreateMode(false);
              setIsEditMode(false);
            }}
          />
        ) : (
          <Button
            label="Add Recipe"
            leftIcon={<PlusIcon />}
            onClick={() => setIsCreateMode(true)}
          />
        )}
      </div>
      {!isCreateMode &&
        !isEditMode &&
        listRecipes.data?.recipes.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-9">
              <div className="text-muted-foreground mb-4">
                You don't have any recipes yet
              </div>
              <Button
                onClick={() => {
                  setIsCreateMode(true);
                }}
                label="Create Recipe"
                leftIcon={<PlusIcon />}
              />
            </CardContent>
          </Card>
        )}
      {/* Recipe Grid */}
      {!isCreateMode && !isEditMode && listRecipes.data && (
        <RecipeGrid
          recipes={listRecipes.data.recipes as Recipe[]}
          onDelete={(id) => deleteRecipe.mutate({ recipeId: id })}
          onEdit={(recipe) => {
            setRecipe({
              ...recipe,
              cuisines: recipe.cuisines as Cuisine[],
              dietaryTags: recipe.dietaryTags as DietaryTags[],
              foodAllergens: recipe.foodAllergens as FoodAllergen[],
            });
            setIsEditMode(true);
          }}
        />
      )}

      {/* Recipe Form */}
      {(isCreateMode || isEditMode) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isCreateMode ? "Create Recipe" : "Edit Recipe"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {error?.errors[0]?.message && (
              <ErrorAlert message={error.errors[0].message} />
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

            {/* Price */}
            <div className="flex gap-6 items-center">
              <Label>Price</Label>
              <div className="flex items-center gap-2 relative">
                <span className="text-muted-foreground font-light absolute left-2 text-sm">
                  $
                </span>
                <Input
                  type="number"
                  className="w-14 pl-5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={recipe.price || ""}
                  onChange={(e) =>
                    setRecipe({ ...recipe, price: parseInt(e.target.value) })
                  }
                />
              </div>{" "}
            </div>

            {/* Badges */}
            <div className="flex flex-col gap-6">
              {/* Cuisines */}
              <FilterableBadgeList
                label="Cuisines"
                selectedItems={recipe.cuisines as Cuisine[]}
                onOpenSelector={() => setCuisineModalOpen(true)}
                onRemoveItem={removeCuisine}
              />

              {/* Dietary Tags */}
              <FilterableBadgeList
                label="Dietary Tags"
                selectedItems={recipe.dietaryTags as DietaryTags[]}
                onOpenSelector={() => setDietaryTagsModalOpen(true)}
                onRemoveItem={removeDietaryTag}
                badgeClassName="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200"
                removeButtonClassName="rounded-full hover:bg-green-200 hover:text-green-900 transition-colors"
              />

              {/* Allergens */}
              <FilterableBadgeList
                label="Allergens"
                selectedItems={recipe.foodAllergens as FoodAllergen[]}
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
              label={isCreateMode ? "Create Recipe" : "Save Changes"}
              leftIcon={<SaveIcon />}
              isLoading={
                isCreateMode ? createRecipe.isPending : editRecipe.isPending
              }
              onClick={() => {
                setError(null);
                const result = recipeSchema.safeParse(recipe);

                if (!result.success) {
                  setError(result.error);
                  return;
                }

                if (isCreateMode) {
                  createRecipe.mutate(result.data);
                } else {
                  editRecipe.mutate({
                    recipeId: recipe.id,
                    recipe: result.data,
                  });
                }
              }}
            />
          </CardFooter>
        </Card>
      )}

      <RecipeSelectionModals
        cuisineModalOpen={cuisineModalOpen}
        setCuisineModalOpen={setCuisineModalOpen}
        availableCuisines={availableCuisines}
        selectedCuisines={recipe.cuisines as Cuisine[]}
        handleCuisineSelection={handleCuisineSelection}
        dietaryTagsModalOpen={dietaryTagsModalOpen}
        setDietaryTagsModalOpen={setDietaryTagsModalOpen}
        availableDietaryTags={availableDietaryTags}
        selectedDietaryTags={recipe.dietaryTags as DietaryTags[]}
        handleDietaryTagsSelection={handleDietaryTagsSelection}
        allergenModalOpen={allergenModalOpen}
        setAllergenModalOpen={setAllergenModalOpen}
        availableAllergens={availableAllergens}
        selectedAllergens={recipe.foodAllergens as FoodAllergen[]}
        handleAllergenSelection={handleAllergenSelection}
      />
    </div>
  );
}
