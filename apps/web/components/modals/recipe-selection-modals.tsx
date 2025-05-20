import React from "react";
import CuisineSelectionModal from "@/components/modals/cuisine-selection-modal";
import { Cuisine, DietaryTags, FoodAllergen } from "@/lib/types";

interface RecipeSelectionModalsProps {
  cuisineModalOpen: boolean;
  setCuisineModalOpen: (open: boolean) => void;
  availableCuisines: string[];
  selectedCuisines: Cuisine[];
  handleCuisineSelection: (cuisines: string[]) => void;
  
  dietaryTagsModalOpen: boolean;
  setDietaryTagsModalOpen: (open: boolean) => void;
  availableDietaryTags: string[];
  selectedDietaryTags: DietaryTags[];
  handleDietaryTagsSelection: (tags: string[]) => void;
  
  allergenModalOpen: boolean;
  setAllergenModalOpen: (open: boolean) => void;
  availableAllergens: string[];
  selectedAllergens: FoodAllergen[];
  handleAllergenSelection: (allergens: string[]) => void;
}

const RecipeSelectionModals: React.FC<RecipeSelectionModalsProps> = ({
  cuisineModalOpen,
  setCuisineModalOpen,
  availableCuisines,
  selectedCuisines,
  handleCuisineSelection,
  
  dietaryTagsModalOpen,
  setDietaryTagsModalOpen,
  availableDietaryTags,
  selectedDietaryTags,
  handleDietaryTagsSelection,
  
  allergenModalOpen,
  setAllergenModalOpen,
  availableAllergens,
  selectedAllergens,
  handleAllergenSelection
}) => {
  return (
    <>
      <CuisineSelectionModal
        open={cuisineModalOpen}
        onOpenChange={setCuisineModalOpen}
        availableCuisines={availableCuisines}
        selectedCuisines={selectedCuisines}
        onConfirm={handleCuisineSelection}
        title="Select Cuisines"
        description="Choose the cuisines for this recipe"
      />

      <CuisineSelectionModal
        open={dietaryTagsModalOpen}
        onOpenChange={setDietaryTagsModalOpen}
        availableCuisines={availableDietaryTags}
        selectedCuisines={selectedDietaryTags}
        onConfirm={handleDietaryTagsSelection}
        title="Select Dietary Tags"
        description="Choose the dietary tags for this recipe"
      />

      <CuisineSelectionModal
        open={allergenModalOpen}
        onOpenChange={setAllergenModalOpen}
        availableCuisines={availableAllergens}
        selectedCuisines={selectedAllergens}
        onConfirm={handleAllergenSelection}
        title="Select Allergens"
        description="Choose the allergens present in this recipe"
      />
    </>
  );
};

export default RecipeSelectionModals;