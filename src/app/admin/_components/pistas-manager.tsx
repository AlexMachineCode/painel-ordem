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
    <div className="relative mt-4 border-t border-zinc-700 bg-black/50 p-3 md:p-4">
      <h4 className="mb-3 text-xs font-bold text-yellow-500 md:text-sm">
        &gt;&gt; EVIDÊNCIAS COLETADAS
      </h4>

      {/* Formulário de Pista (Responsivo) */}
      <div className="mb-4 flex flex-col gap-2 md:flex-row">
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título da Pista"
          className="w-full border border-zinc-700 bg-black p-2 text-sm text-white focus:border-yellow-500 focus:outline-none md:w-1/3 md:p-1"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL da Imagem..."
          className="flex-1 border border-zinc-700 bg-black p-2 text-sm text-white focus:border-yellow-500 focus:outline-none md:p-1"
        />
        <button
          onClick={() =>
            criarPista.mutate({ missaoId, titulo, imagemUrl: url })
          }
          disabled={!titulo || !url || criarPista.isPending}
          className="bg-yellow-600 px-3 py-2 text-xs font-bold text-black hover:bg-yellow-500 disabled:opacity-50 md:py-1"
        >
          {criarPista.isPending ? "..." : "ADD +"}
        </button>
      </div>

      {/* Grid de Pistas (Responsivo) */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {pistas?.map((pista) => (
          <div
            key={pista.id}
            className={`group relative flex flex-col justify-between border p-2 transition-all ${
              pista.revelada
                ? "border-green-500/50 bg-green-950/10"
                : "border-zinc-800 bg-zinc-900"
            }`}
          >
            <div>
              {/* Imagem */}
              <button
                onClick={() => setImagemExpandida(pista.imagemUrl)}
                className="relative mb-2 aspect-square w-full cursor-zoom-in overflow-hidden bg-black"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pista.imagemUrl}
                  alt={pista.titulo}
                  className={`h-full w-full object-cover transition-opacity ${pista.revelada ? "opacity-100" : "opacity-60 grayscale"}`}
                />
              </button>
              <p className="mb-2 truncate text-xs font-bold text-white">
                {pista.titulo}
              </p>
            </div>

            {/* Controles */}
            <div className="flex items-center justify-between gap-1 border-t border-white/10 pt-2">
              <button
                onClick={() =>
                  alternarVisibilidade.mutate({
                    id: pista.id,
                    revelada: !pista.revelada,
                  })
                }
                className={`flex-1 rounded px-1 py-1 text-center text-[10px] font-bold ${
                  pista.revelada
                    ? "bg-green-600 text-white"
                    : "bg-zinc-700 text-zinc-400"
                }`}
              >
                {pista.revelada ? "VISÍVEL" : "OCULTO"}
              </button>

              <button
                onClick={() => deletarPista.mutate({ id: pista.id })}
                className="border border-transparent px-2 py-1 text-[10px] text-red-600 hover:border-red-900/50 hover:text-red-400"
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Zoom */}
      {imagemExpandida && (
        <div
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/90 p-2"
          onClick={() => setImagemExpandida(null)}
        >
          <button className="absolute top-4 right-4 p-2 text-2xl font-bold text-white/50 md:hidden">
            ✕
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagemExpandida}
            alt="Zoom"
            className="max-h-[85vh] max-w-full border border-zinc-800 object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
