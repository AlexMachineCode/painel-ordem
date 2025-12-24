"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function PlayerPage() {
  const [imagemExpandida, setImagemExpandida] = useState<string | null>(null);

  const { data: missoes, isLoading } = api.missao.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-screen animate-pulse items-center justify-center bg-black p-4 font-mono text-sm text-green-500 md:text-base">
        CARREGANDO SISTEMA...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-4 font-mono text-zinc-300 selection:bg-green-900 selection:text-white md:p-12">
      <div className="mx-auto max-w-6xl space-y-8 md:space-y-12">
        {/* CABEÇALHO RESPONSIVO */}
        <header className="mb-6 flex flex-col gap-4 border-b border-zinc-800 pb-6 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
              BASE DE DADOS <br className="md:hidden" />
              <span className="text-green-600">ORDO VERITAS</span>
            </h1>
            <p className="text-[10px] tracking-widest text-zinc-500 uppercase md:text-xs">
              Acesso Autorizado // Agente Convidado
            </p>
          </div>

          {/* Botão de Admin */}
          <Link
            href="/admin"
            className="self-start rounded border border-zinc-900 bg-zinc-900/50 p-2 text-[10px] font-bold text-zinc-700 transition-colors hover:border-green-900/30 hover:text-green-500 md:self-auto md:text-xs"
          >
            🔒 [ SYSTEM_ACCESS ]
          </Link>
        </header>

        {/* LISTA DE MISSÕES */}
        <div className="space-y-12">
          {missoes?.map((missao) => {
            return (
              <MissaoPublica
                key={missao.id}
                missao={missao}
                setZoom={setImagemExpandida}
              />
            );
          })}
        </div>

        {missoes?.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/20 py-20 text-center">
            <p className="text-sm text-zinc-600">NENHUM ARQUIVO DISPONÍVEL.</p>
          </div>
        )}
      </div>

      {/* MODAL DE ZOOM (Melhorado para Mobile) */}
      {imagemExpandida && (
        <div
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/95 p-2 backdrop-blur-sm md:p-8"
          onClick={() => setImagemExpandida(null)}
        >
          {/* Botão X flutuante para facilitar fechar no celular */}
          <button className="absolute top-4 right-4 p-2 text-2xl font-bold text-white/50 md:hidden">
            ✕
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagemExpandida}
            alt="Evidência"
            className="max-h-[90vh] max-w-full rounded-sm border border-zinc-800 object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}

// --- SUB-COMPONENTE ---
function MissaoPublica({
  missao,
  setZoom,
}: {
  missao: any;
  setZoom: (url: string) => void;
}) {
  const { data: pistas } = api.pista.getByMissao.useQuery({
    missaoId: missao.id,
  });

  const pistasReveladas = pistas?.filter((p) => p.revelada);

  if (!pistasReveladas || pistasReveladas.length === 0) return null;

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 space-y-4 duration-700 md:space-y-6">
      {/* Título da Missão */}
      <div className="flex flex-col gap-1 border-l-4 border-green-700 pl-4 md:flex-row md:items-end md:gap-4">
        <h2 className="text-xl leading-tight font-bold break-words text-white uppercase md:text-2xl">
          {missao.titulo}
        </h2>
        <span className="w-fit rounded bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-zinc-500 md:text-xs">
          CASO #{missao.id.slice(0, 4)}
        </span>
      </div>

      {/* Grid Responsivo: 
          - Mobile (padrão): 1 coluna (imagem grande) ou 2 colunas (mais denso)
          - sm (Tablet peq): 2 colunas
          - md (Tablet/PC): 3 colunas
          - lg (PC Grande): 4 colunas
      */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
        {pistasReveladas.map((pista) => (
          <div
            key={pista.id}
            className="group relative flex flex-col border border-zinc-800 bg-black p-2 transition-colors hover:border-green-600/50"
          >
            {/* Imagem */}
            <button
              onClick={() => setZoom(pista.imagemUrl)}
              className="relative aspect-square w-full cursor-zoom-in overflow-hidden bg-zinc-900"
            >
              <div className="pointer-events-none absolute inset-0 z-10 bg-green-900/10 opacity-0 transition-opacity group-hover:opacity-100" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pista.imagemUrl}
                alt={pista.titulo}
                className="h-full w-full object-cover opacity-90 transition-all duration-500 group-hover:opacity-100"
              />
            </button>

            {/* Texto da Pista */}
            <div className="mt-2 px-1 md:mt-3">
              <h3 className="truncate text-xs leading-tight font-bold text-green-500 md:text-sm">
                {pista.titulo}
              </h3>
              {pista.descricao && (
                <p className="mt-1 line-clamp-2 text-[10px] text-zinc-500 md:text-xs">
                  {pista.descricao}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
