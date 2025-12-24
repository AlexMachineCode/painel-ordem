"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { MissaoCard } from "./_components/missao-card";
import { logout } from "./_components/actions";

export default function AdminPage() {
  const [titulo, setTitulo] = useState("");
  const utils = api.useUtils();

  const { data: missoes } = api.missao.getAll.useQuery();

  const criarMissao = api.missao.create.useMutation({
    onSuccess: async () => {
      await utils.missao.getAll.invalidate();
      setTitulo("");
    },
  });

  return (
    <main className="min-h-screen bg-zinc-950 p-4 font-mono text-green-500 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6 md:space-y-8">
        {/* Cabeçalho Responsivo */}
        <header className="flex flex-col justify-between gap-4 border-b border-green-800 pb-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tighter md:text-3xl">
              // TERMINAL DO MESTRE
            </h1>
            <p className="text-xs text-zinc-500 md:text-sm">
              Acesso Restrito: Nível V
            </p>
          </div>

          <button
            onClick={() => logout()}
            className="w-full self-start border border-red-900/50 bg-red-950/20 px-3 py-2 text-center text-xs text-red-500 transition-colors hover:border-red-500 hover:bg-red-900/30 hover:text-red-400 md:w-auto md:self-auto md:py-1"
          >
            [ ENCERRAR SESSÃO ]
          </button>
        </header>

        {/* Formulário de Nova Missão (Responsivo) */}
        <div className="rounded border border-green-900/30 bg-zinc-900 p-4 md:p-6">
          <h2 className="mb-3 text-lg text-white md:text-xl">Nova Missão</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (titulo) criarMissao.mutate({ titulo });
            }}
            className="flex flex-col gap-2 md:flex-row"
          >
            <input
              type="text"
              placeholder="Ex: O Orfanato (Ep. 1)"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="flex-1 border border-green-700 bg-black p-3 text-white focus:border-green-400 focus:outline-none md:p-2"
            />
            <button
              type="submit"
              disabled={criarMissao.isPending}
              className="bg-green-700 px-4 py-3 font-bold text-black hover:bg-green-600 disabled:opacity-50 md:py-2"
            >
              {criarMissao.isPending ? "..." : "CRIAR ARQUIVO"}
            </button>
          </form>
        </div>

        {/* Lista de Missões */}
        <div className="space-y-4">
          <h2 className="text-lg text-white md:text-xl">Arquivos Existentes</h2>

          {missoes?.length === 0 && (
            <p className="text-sm text-zinc-600">Nenhum arquivo encontrado.</p>
          )}

          <div className="grid gap-3 md:gap-4">
            {missoes?.map((missao) => (
              <MissaoCard key={missao.id} missao={missao} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
