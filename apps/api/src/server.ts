import "dotenv/config";

import express from "express";
import { createServer } from "http";
import { db } from "./db.js";
import { trpcExpressRouter } from "./routes/trpc/trpcRouter.js";
import { webhookRouter } from "./routes/webhook/webhookRouter.js";

async function main() {
  const port = Number(process.env.PORT);

  const app = express();
  const httpServer = createServer(app);

  app.use("/trpc", trpcExpressRouter);
  app.use("/webhook", webhookRouter);

  app.on("close", async () => {
    await db.$disconnect().catch(async (e) => {
      console.error(e);
      await db.$disconnect();
      process.exit(1);
    });
  });

  httpServer.listen(port);

  console.info(`🐌 Server running on port ${port}`);
}

main();
