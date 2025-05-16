import { publicProcedure } from "../trpcBase";

type Response = {
  message: string;
};

export const logHelloWorld = publicProcedure.query<Response>(() => {
  console.log("Hello, world!");

  return {
    message: "Hello, world!",
  };
});
