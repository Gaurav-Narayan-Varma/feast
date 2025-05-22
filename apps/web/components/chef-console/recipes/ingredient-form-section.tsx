import IngredientList from "@/components/chef-console/recipes/ingredient-list";
import IngredientSearch from "@/components/chef-console/recipes/ingredient-search";
import { Button } from "@/components/ui/button";
import { ItemQuantity } from "@/components/ui/item-quantity";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IngredientDetails,
  IngredientPreparation,
  Ingredients,
  MeasurementUnit,
} from "@/lib/types";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface IngredientFormSectionProps {
  /** List of current ingredients */
  ingredients: IngredientDetails[];
  /** Handler for removing an ingredient */
  onRemoveIngredient: (name: string) => void;
  /** Handler for adding a new ingredient */
  onAddIngredient: (ingredient: IngredientDetails) => void;
}

/**
 * Component for managing ingredients in a recipe
 */
const IngredientFormSection: React.FC<IngredientFormSectionProps> = ({
  ingredients,
  onRemoveIngredient,
  onAddIngredient,
}) => {
  const [newIngredient, setNewIngredient] = useState<IngredientDetails>({
    name: "" as unknown as Ingredients,
    quantity: 1,
    unit: MeasurementUnit.NA,
    preparation: IngredientPreparation.NA,
  });

  const handleAddIngredient = () => {
    if (!newIngredient.name.trim()) {
      toast.error("Ingredient name is required");
      return;
    }

    // Check for duplicate ingredients by name
    const isDuplicate = ingredients.some(
      (ingredient) => ingredient.name === newIngredient.name
    );

    if (isDuplicate) {
      toast.error("This ingredient is already added to the recipe");
      return;
    }

    // Call the parent handler with the new ingredient
    onAddIngredient({ ...newIngredient });

    // Reset the form
    setNewIngredient({
      name: "" as unknown as Ingredients,
      quantity: 1,
      unit: MeasurementUnit.NA,
      preparation: IngredientPreparation.NA,
    });
  };

  return (
    <div className="pt-4 border-t">
      <h3 className="text-lg font-semibold mb-4">Ingredients</h3>

      <div className="space-y-4">
        <div className="flex gap-3">
          {/* Name field */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-2 grow-1">
            <Label htmlFor="ingredient-name">Name</Label>
            <IngredientSearch
              onSelect={(ingredientName) =>
                setNewIngredient({
                  ...newIngredient,
                  name: ingredientName as unknown as Ingredients,
                })
              }
              placeholder="Enter ingredient name"
              initialValue={newIngredient.name as string}
              className="w-full"
            />
          </div>

          {/* Quantity field */}
          <div className="col-span-4 md:col-span-2 flex flex-col gap-2">
            <Label htmlFor="ingredient-quantity mb-2">Quantity</Label>
            <div className="flex items-center">
              <ItemQuantity
                quantity={newIngredient.quantity}
                onIncrease={() =>
                  setNewIngredient({
                    ...newIngredient,
                    quantity: newIngredient.quantity + 1,
                  })
                }
                onDecrease={() =>
                  setNewIngredient({
                    ...newIngredient,
                    quantity: Math.max(1, newIngredient.quantity - 1),
                  })
                }
                onChange={(value) =>
                  setNewIngredient({ ...newIngredient, quantity: value })
                }
              />
            </div>
          </div>

          {/* Unit field */}
          <div className="col-span-4 md:col-span-2 flex flex-col gap-2">
            <Label htmlFor="ingredient-unit mb-2">Unit</Label>
            <Select
              value={newIngredient.unit}
              onValueChange={(value) =>
                setNewIngredient({
                  ...newIngredient,
                  unit: value as MeasurementUnit,
                })
              }
            >
              <SelectTrigger id="ingredient-unit" className="h-10">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {Object.values(MeasurementUnit).map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preparation field */}
          <div className="col-span-4 md:col-span-3 flex flex-col gap-2">
            <Label htmlFor="ingredient-preparation mb-2">Preparation</Label>
            <Select
              value={newIngredient.preparation}
              onValueChange={(value) =>
                setNewIngredient({
                  ...newIngredient,
                  preparation: value as IngredientPreparation,
                })
              }
            >
              <SelectTrigger id="ingredient-preparation" className="h-10">
                <SelectValue placeholder="Prep" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {Object.values(IngredientPreparation).map((prep) => (
                  <SelectItem key={prep} value={prep}>
                    {prep}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Add button */}
          <div className="col-span-12 md:col-span-1 items-end flex flex-col justify-end">
            <Button
              onClick={handleAddIngredient}
              className="w-full h-10"
              type="button"
              leftIcon={<Plus />}
              label="Add"
            ></Button>
          </div>
        </div>

        {ingredients.length > 0 ? (
          <IngredientList
            ingredients={ingredients}
            onRemove={onRemoveIngredient}
          />
        ) : (
          <div className="text-center p-4 border border-dashed rounded-md">
            <p className="text-muted-foreground">No ingredients added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientFormSection;
