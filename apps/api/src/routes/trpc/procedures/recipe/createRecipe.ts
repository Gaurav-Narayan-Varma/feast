import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { Cuisine, DietaryTags, FoodAllergen, PriceRange } from "@feast/shared";
import { z } from "zod";

export const createRecipe = chefUserProcedure
  .input(
    z.object({
      name: z.string().min(1, "Recipe name is required"),
      description: z.string(),
      priceRange: z.nativeEnum(PriceRange),
      cuisines: z.array(z.nativeEnum(Cuisine)),
      dietaryTags: z.array(z.nativeEnum(DietaryTags)),
      foodAllergens: z.array(z.nativeEnum(FoodAllergen)),
      ingredients: z.array(
        z.object({
          name: z.string(),
          quantity: z.number(),
          unit: z.string(),
          preparation: z.string(),
        })
      ),
    })
  )
  .mutation(async ({ ctx, input }) => {
    // const recipe = await ctx.db.recipe.create({
    //   data: {
    //     ...input,
    //     chefId: ctx.chefUserId,
    //   },
    // });
    // return recipe;
  });
