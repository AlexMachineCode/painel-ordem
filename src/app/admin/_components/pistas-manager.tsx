"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function PistasManager({ missaoId }: { missaoId: string }) {
  const [titulo, setTitulo] = useState("");
  const [url, setUrl] = useState("");
  const [imagemExpandida, setImagemExpandida] = useState<string | null>(null);

  const utils = api.useUtils();
  const { data: pistas } = api.pista.getByMissao.useQuery({ missaoId });

  const criarPista = api.pista.create.useMutation({
    onSuccess: async () => {
      await utils.pista.getByMissao.invalidate({ missaoId });
      setTitulo("");
      setUrl("");
    },
  });

  const deletarPista = api.pista.delete.useMutation({
    onSuccess: async () => {
      await utils.pista.getByMissao.invalidate({ missaoId });
    },
  });

  const alternarVisibilidade = api.pista.toggleRevelada.useMutation({
    onSuccess: async () => {
      await utils.pista.getByMissao.invalidate({ missaoId });
    },
  });

  return (
    <div className="relative mt-2 border-t border-red-900/20 bg-zinc-950/50 p-2 md:p-4">
      {/* Título da Seção */}
      <h4 className="mb-4 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-red-500 uppercase">
        <span className="h-1 w-1 rounded-full bg-red-500" />
        EVIDÊNCIAS E ANEXOS
      </h4>

      {/* Formulário de Pista (Estilo Terminal de Entrada) */}
      <div className="mb-6 flex flex-col items-stretch gap-2 md:flex-row">
        <div className="group relative flex-1">
          <span className="absolute top-2 left-2 text-[8px] font-bold text-red-900">
            NOME DO ARQUIVO
          </span>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="h-full w-full border border-red-900/30 bg-black px-2 pt-4 pb-1 text-xs text-white uppercase placeholder-transparent focus:border-red-500 focus:outline-none"
            placeholder="Título"
          />
        </div>

        <div className="group relative flex-[2]">
          <span className="absolute top-2 left-2 text-[8px] font-bold text-red-900">
            FONTE DE DADOS (URL)
          </span>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-full w-full border border-red-900/30 bg-black px-2 pt-4 pb-1 text-xs text-zinc-400 placeholder-transparent focus:border-red-500 focus:outline-none"
            placeholder="URL"
          />
        </div>

        <button
          onClick={() =>
            criarPista.mutate({ missaoId, titulo, imagemUrl: url })
          }
          disabled={!titulo || !url || criarPista.isPending}
          className="border border-transparent bg-red-900 px-6 py-2 text-[10px] font-bold tracking-widest text-white uppercase transition-all hover:border-red-500 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {criarPista.isPending ? "PROCESSANDO..." : "ANEXAR"}
        </button>
      </div>

      {/* Grid de Pistas */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
        {pistas?.map((pista) => (
          <div
            key={pista.id}
            className={`group relative flex flex-col justify-between border transition-all duration-300 ${
              pista.revelada
                ? "border-red-500/50 bg-red-950/10 shadow-[0_0_15px_rgba(220,38,38,0.1)]"
                : "border-zinc-800 bg-zinc-900/40 opacity-75 hover:opacity-100"
            }`}
          >
            {/* Cabeçalho do Card */}
            <div className="flex items-start justify-between border-b border-white/5 p-2">
              <p className="w-full truncate pr-4 text-[10px] font-bold text-zinc-300 uppercase transition-colors group-hover:text-white">
                {pista.titulo}
              </p>
              {/* Botão Deletar (X discreto no canto) */}
              <button
                onClick={() => deletarPista.mutate({ id: pista.id })}
                className="absolute top-1 right-1 p-1 text-[10px] text-zinc-700 hover:text-red-500"
                title="Excluir Evidência"
              >
                ✕
              </button>
            </div>

            {/* Imagem */}
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <div className="pointer-events-none absolute inset-0 z-10 bg-red-500/0 transition-colors group-hover:bg-red-500/10" />
              {/* Botão de Zoom Invisível sobre a imagem */}
              <button
                onClick={() => setImagemExpandida(pista.imagemUrl)}
                className="absolute inset-0 z-20 h-full w-full cursor-zoom-in"
              />

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pista.imagemUrl}
                alt={pista.titulo}
                className={`h-full w-full object-cover transition-all duration-500 ${
                  pista.revelada
                    ? "opacity-100 grayscale-0"
                    : "opacity-50 grayscale"
                }`}
              />
            </div>

            {/* Controles de Visibilidade (Switch) */}
            <button
              onClick={() =>
                alternarVisibilidade.mutate({
                  id: pista.id,
                  revelada: !pista.revelada,
                })
              }
              className={`w-full py-1.5 text-[9px] font-bold tracking-widest uppercase transition-all ${
                pista.revelada
                  ? "animate-pulse bg-red-600 text-white"
                  : "bg-black text-zinc-600 hover:bg-zinc-800"
              }`}
            >
              {pista.revelada ? "● TRANSMITINDO" : "○ SIGILO"}
            </button>
          </div>
        ))}

        {pistas?.length === 0 && (
          <div className="col-span-full rounded border border-dashed border-zinc-800 bg-zinc-900/20 py-8 text-center">
            <span className="text-[10px] tracking-widest text-zinc-600 uppercase">
              Pasta Vazia
            </span>
          </div>
        )}
      </div>

      {/* Modal Zoom (Estilo Red) */}
      {imagemExpandida && (
        <div
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          onClick={() => setImagemExpandida(null)}
        >
          <div className="relative w-full max-w-5xl">
            <button className="absolute -top-8 right-0 text-sm font-bold text-zinc-500 hover:text-white">
              [ FECHAR ]
            </button>

            {/* Moldura da Imagem */}
            <div className="border border-red-900 bg-black shadow-[0_0_50px_rgba(220,38,38,0.1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagemExpandida}
                alt="Zoom"
                className="max-h-[80vh] w-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="border-t border-red-900/50 bg-red-950/20 p-2 text-center">
                <p className="text-[10px] font-bold tracking-[0.3em] text-red-500 uppercase">
                  Visualização de Evidência
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
