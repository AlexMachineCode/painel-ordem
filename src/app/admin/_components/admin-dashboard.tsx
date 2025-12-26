"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
// Ajustei os imports pois agora estamos dentro da pasta _components
import { MissaoCard } from "./missao-card";
import { logout } from "./actions"; // Verifique se o arquivo actions.ts está aqui
import { MasterTools } from "./master-tools";
import { SquadTracker } from "./squad-tracker";
import { InitiativeTracker } from "./iniciative-tracker"; // Mantive seu nome de arquivo

export function AdminDashboard() {
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
    <main className="relative min-h-screen overflow-x-hidden bg-black p-4 pb-8 font-mono text-red-500 selection:bg-red-900 selection:text-white md:p-6">
      {/* BACKGROUND GRID */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(50,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(50,0,0,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1600px] space-y-8">
        {/* CABEÇALHO */}
        <header className="sticky top-0 z-40 flex flex-col justify-between gap-4 border-b-2 border-red-800 bg-black/50 pt-2 pb-4 backdrop-blur-sm md:flex-row md:items-end">
          <div>
            <h1 className="glitch-text text-2xl font-bold tracking-tighter text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] md:text-3xl">
              PAINEL DE COMANDO
            </h1>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              <p className="text-[10px] font-bold tracking-[0.2em] text-red-900 md:text-xs">
                ACESSO ROOT // CONEXÃO SEGURA
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="group relative w-full self-start overflow-hidden border border-red-900 bg-red-950/30 px-4 py-2 text-center text-xs font-bold text-red-500 transition-all hover:bg-red-900 hover:text-white md:w-auto md:self-auto"
          >
            <span className="relative z-10">[ ENCERRAR SESSÃO ]</span>
            <div className="absolute inset-0 translate-y-full bg-red-600/20 transition-transform group-hover:translate-y-0" />
          </button>
        </header>

        {/* --- LAYOUT 3 COLUNAS --- */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {/* 1. ESQUERDA: INICIATIVA (Sticky) */}
          <div className="sticky top-24 flex flex-col gap-6 lg:col-span-1">
            <div className="border border-red-900/30 bg-black/50 p-1 shadow-[0_0_20px_rgba(220,38,38,0.1)]">
              <InitiativeTracker />
            </div>
          </div>

          {/* 2. MEIO: MISSÕES (Principal) */}
          <div className="space-y-6 lg:col-span-1 xl:col-span-2">
            {/* Card de Criação */}
            <div className="rounded border border-red-900/50 bg-zinc-900/80 p-4 shadow-[0_0_20px_rgba(220,38,38,0.05)] backdrop-blur">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold tracking-widest text-red-100 uppercase">
                <span className="text-red-600">»</span> Nova Operação
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (titulo) criarMissao.mutate({ titulo });
                }}
                className="flex flex-col gap-2 md:flex-row"
              >
                <div className="group relative flex-1">
                  <input
                    type="text"
                    placeholder="NOME CÓDIGO..."
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full border border-red-900 bg-black p-2 text-sm text-white uppercase placeholder-red-900/50 transition-all focus:border-red-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={criarMissao.isPending}
                  className="border border-transparent bg-red-800 px-4 py-2 text-xs font-bold tracking-wider text-white uppercase transition-all hover:border-red-400 hover:bg-red-600 disabled:opacity-50"
                >
                  {criarMissao.isPending ? "..." : "CRIAR"}
                </button>
              </form>
            </div>

            {/* Lista de Missões */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-red-900/30 pb-2">
                <h2 className="text-sm font-bold tracking-widest text-red-100 uppercase">
                  Arquivos
                </h2>
                <span className="text-[10px] text-red-900">
                  {missoes?.length || 0} ENCONTRADOS
                </span>
              </div>

              <div className="grid gap-4">
                {missoes?.map((missao) => (
                  <div key={missao.id} className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-900 opacity-0 blur transition duration-500 group-hover:opacity-20" />
                    <div className="relative">
                      <MissaoCard missao={missao} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. DIREITA: FERRAMENTAS & SQUAD (Sticky) */}
          <div className="sticky top-24 flex flex-col gap-6 lg:col-span-1">
            <div className="border border-red-900/30 bg-black/50 p-1">
              <SquadTracker />
            </div>

            <div className="border border-red-900/30 bg-black/50 p-1">
              <MasterTools />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
