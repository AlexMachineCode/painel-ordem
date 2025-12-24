import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const missaoRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        titulo: z.string().min(1),
        descricao: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.missao.create({
        data: {
          titulo: input.titulo,
          descricao: input.descricao,
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.missao.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  // --- ADICIONE ISTO AQUI EMBAIXO ---
  delete: publicProcedure
    .input(z.object({ id: z.string() })) // Recebe o ID da missão
    .mutation(async ({ ctx, input }) => {
      return ctx.db.missao.delete({
        where: { id: input.id },
      });
    }),
});
