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
      className={`flex flex-col border p-3 transition-all md:p-4 ${
        isOpen
          ? "border-green-500 bg-zinc-900"
          : "border-zinc-800 bg-zinc-900/50 hover:border-green-500/30"
      }`}
    >
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-0">
        {/* Informações */}
        <div>
          <h3 className="text-base font-bold break-words text-white md:text-lg">
            {missao.titulo}
          </h3>
          <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-zinc-500 md:text-xs">
            <span>ID: {missao.id.slice(0, 8)}...</span>
            <span className="hidden md:inline">|</span>
            <span className={missao.ativa ? "text-green-500" : "text-red-500"}>
              {missao.ativa ? "ATIVA" : "ARQUIVADA"}
            </span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex w-full items-center gap-2 self-end md:w-auto md:gap-3 md:self-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex-1 border px-3 py-2 text-center text-xs md:flex-none md:py-1 ${
              isOpen
                ? "border-yellow-500 text-yellow-500"
                : "border-zinc-600 text-zinc-400 hover:text-white"
            }`}
          >
            {isOpen ? "[-]" : "[+] ABRIR PASTA"}
          </button>

          <button
            onClick={() => {
              if (confirm("⚠️ Tem certeza que deseja deletar este arquivo?")) {
                deletarMissao.mutate({ id: missao.id });
              }
            }}
            disabled={deletarMissao.isPending}
            className="border border-red-900/30 px-3 py-2 text-xs text-red-700 hover:border-red-500 hover:text-red-500 disabled:opacity-50 md:py-1"
          >
            X
          </button>
        </div>
      </div>

      {/* Renderiza o gerenciador só se estiver aberto */}
      {isOpen && <PistasManager missaoId={missao.id} />}
    </div>
  );
}
