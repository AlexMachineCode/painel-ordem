"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { PistasManager } from "./pistas-manager";
import type { RouterOutputs } from "~/trpc/react";

type Missao = RouterOutputs["missao"]["getAll"][number];

export function MissaoCard({ missao }: { missao: Missao }) {
  const [isOpen, setIsOpen] = useState(false);
  const utils = api.useUtils();

  const deletarMissao = api.missao.delete.useMutation({
    onSuccess: async () => {
      await utils.missao.getAll.invalidate();
    },
  });

  return (
    <div
      className={`group flex flex-col border-y border-r border-l-4 transition-all duration-300 ${
        isOpen
          ? "border-y-red-900/30 border-r-red-900/30 border-l-red-600 bg-red-950/10 shadow-[0_0_20px_rgba(220,38,38,0.1)]"
          : "border-y-zinc-900 border-r-zinc-900 border-l-zinc-700 bg-zinc-950 hover:border-l-red-500 hover:bg-zinc-900"
      }`}
    >
      <div className="flex flex-col justify-between gap-4 p-4 md:flex-row md:items-center md:gap-0">
        {/* Informações da Missão */}
        <div
          className="flex-1 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="mb-1 flex items-center gap-2">
            {/* Indicador de Status */}
            <div
              className={`h-1.5 w-1.5 rounded-full ${missao.ativa ? "animate-pulse bg-red-500 shadow-[0_0_5px_red]" : "bg-zinc-600"}`}
            />
            <span
              className={`text-[10px] font-bold tracking-widest uppercase ${missao.ativa ? "text-red-500" : "text-zinc-600"}`}
            >
              {missao.ativa ? "OPERAÇÃO ATIVA" : "ARQUIVADO"}
            </span>
          </div>

          <h3
            className={`text-lg font-bold tracking-tight uppercase transition-colors ${isOpen ? "text-white" : "text-zinc-400 group-hover:text-red-100"}`}
          >
            {missao.titulo}
          </h3>

          <div className="mt-1 flex items-center gap-2 font-mono text-[10px] text-zinc-600">
            <span>CASE ID: {missao.id.slice(0, 8).toUpperCase()}</span>
            <span>//</span>
            <span>LEVEL: OMEGA</span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex w-full items-center gap-3 self-end border-t border-zinc-900 pt-3 md:w-auto md:border-t-0 md:pt-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex-1 border px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all md:flex-none md:py-1.5 ${
              isOpen
                ? "border-red-500 bg-red-500 text-black hover:bg-red-400"
                : "border-zinc-800 bg-black text-zinc-400 hover:border-red-900 hover:text-white"
            }`}
          >
            {isOpen ? "FECHAR DOSSIÊ" : "ACESSAR DADOS"}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation(); // Evita abrir a pasta ao clicar em deletar
              if (
                confirm(
                  "⚠️ AVISO: Isso apagará permanentemente todos os registros desta missão. Confirmar expurgo?",
                )
              ) {
                deletarMissao.mutate({ id: missao.id });
              }
            }}
            disabled={deletarMissao.isPending}
            className="group/del border border-zinc-900 bg-zinc-950 px-3 py-2 text-zinc-600 hover:border-red-900 hover:bg-red-950 hover:text-red-500 disabled:opacity-50 md:py-1.5"
            title="Expurgar Arquivo"
          >
            {deletarMissao.isPending ? (
              <span className="inline-block animate-spin">↻</span>
            ) : (
              <span className="font-bold">✕</span>
            )}
          </button>
        </div>
      </div>

      {/* Renderiza o gerenciador com uma separação visual clara */}
      {isOpen && (
        <div className="animate-in slide-in-from-top-2 border-t border-red-900/30 bg-black/50 p-4 duration-300">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs text-red-900">└</span>
            <span className="text-[10px] font-bold tracking-widest text-red-900 uppercase">
              Conteúdo da Pasta
            </span>
            <div className="h-px w-full bg-red-900/20" />
          </div>

          {/* Aqui entra o seu componente de Pistas */}
          <PistasManager missaoId={missao.id} />
        </div>
      )}
    </div>
  );
}
