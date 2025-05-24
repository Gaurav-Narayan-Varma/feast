import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Recipe } from "@/lib/types";
import { Minus, Plus } from "lucide-react";

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
    <Card>
      <CardHeader className="gap-0">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {recipes.map((recipe, i) => (
            <li key={i} className="relative flex border-b pb-4 last:border-0">
              <div className="flex-1 max-w-[70%]">
                <h4 className="font-medium">{recipe.name}</h4>
                <p className="text-sm text-ds-chef-600 mt-1">
                  {recipe.description}
                </p>
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
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
