// types.ts

declare global {
  namespace PrismaJson {
    type Ingredient = {
      name: string;
      quantity: number;
      unit: string;
      preparation: string;
    };
  }
}

// The file MUST be a module!
export {};
