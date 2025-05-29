"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Recipe } from "@/lib/types";
import RecipeSlot from "./recipe-slot";

export default function MenuCard({
  name,
  description,
  recipes,
  onAddToCart,
  onRemoveFromCart,
}: {
  name: string;
  description: string;
  recipes: Recipe[];
  onAddToCart: (recipe: Recipe) => void;
  onRemoveFromCart: (recipe: Recipe) => void;
}) {
  return (
    <Card className="h-fit">
      <CardHeader className="gap-0">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {recipes.map((recipe, i) => (
            <RecipeSlot
              key={i}
              i={i}
              recipe={recipe}
              onRemoveFromCart={onRemoveFromCart}
              onAddToCart={onAddToCart}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
