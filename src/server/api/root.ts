import { postRouter } from "~/server/api/routers/post";
import { missaoRouter } from "~/server/api/routers/missao"; // <--- 1. Importar
import { pistaRouter } from "~/server/api/routers/pista"; // <--- Aproveita e já importa a pista também
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter, // Pode deixar ou tirar, tanto faz
  missao: missaoRouter, // <--- 2. Adicionar aqui
  pista: pistaRouter, // <--- Adicionar aqui
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 * ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
