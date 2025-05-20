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
export {};
