// types.ts

declare global {
  namespace PrismaJson {
    type Ingredient = {
      name: string;
      quantity: number;
      unit: string;
      preparation: string;
    };

    type BookingItem = {
      recipe: {
        id: string;
        name: string;
        price: number;
      };
      quantity: number;
    };
  }
}

// The file MUST be a module!
export {};
