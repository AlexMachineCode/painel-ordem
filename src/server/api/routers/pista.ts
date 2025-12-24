import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const pistaRouter = createTRPCRouter({
  // 1. Criar Pista (precisa do ID da missão)
  create: publicProcedure
    .input(
      z.object({
        missaoId: z.string(),
        titulo: z.string().min(1),
        descricao: z.string().optional(),
        imagemUrl: z.string().url(), // Valida se é um link de verdade
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.pista.create({
        data: {
          missaoId: input.missaoId,
          titulo: input.titulo,
          descricao: input.descricao,
          imagemUrl: input.imagemUrl,
        },
      });
    }),

  // 2. Buscar Pistas de uma Missão Específica
  getByMissao: publicProcedure
    .input(z.object({ missaoId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.pista.findMany({
        where: { missaoId: input.missaoId },
        orderBy: { createdAt: "desc" },
      });
    }),

  // 3. Deletar Pista
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.pista.delete({
        where: { id: input.id },
      });
    }),

  // 4. Alternar Visibilidade (Revelar/Esconder)
  toggleRevelada: publicProcedure
    .input(z.object({ id: z.string(), revelada: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.pista.update({
        where: { id: input.id },
        data: { revelada: input.revelada },
      });
    }),
});
