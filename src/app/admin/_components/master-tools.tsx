"use client";

import { useState, useRef, useEffect, type JSX } from "react";

export function MasterTools() {
  const [abaAtiva, setAbaAtiva] = useState<"dados" | "ref">("dados");
  const [historico, setHistorico] = useState<
    Array<{
      dado: string;
      valor: number;
      critico: boolean;
      timestamp: string;
    }>
  >([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll no log quando rolar dado
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historico]);

  const rolar = (lados: number) => {
    const resultado = Math.floor(Math.random() * lados) + 1;
    // Crítico no 20 (D20) ou Máximo nos outros dados
    const isCritico =
      (lados === 20 && resultado === 20) ||
      (lados !== 20 && resultado === lados);
    const isDesastre = lados === 20 && resultado === 1;

    const time = new Date().toLocaleTimeString("pt-BR", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    setHistorico((prev) => [
      ...prev.slice(-19), // Mantém os últimos 20 (mas joga no final pro scroll funcionar estilo chat)
      {
        dado: `D${lados}`,
        valor: resultado,
        critico: isCritico || isDesastre,
        timestamp: time,
      },
    ]);
  };

  return (
    <div className="flex h-[600px] flex-col overflow-hidden rounded border border-red-900/50 bg-black shadow-[0_0_30px_rgba(220,38,38,0.1)]">
      {/* CABEÇALHO / ABAS TIPO "FOLDER" */}
      <div className="flex border-b border-red-900/30 bg-red-950/10">
        <button
          onClick={() => setAbaAtiva("dados")}
          className={`flex-1 py-3 text-xs font-bold tracking-widest transition-all ${
            abaAtiva === "dados"
              ? "bg-red-900/20 text-red-500 shadow-[inset_0_-2px_0_#ef4444]"
              : "text-zinc-600 hover:bg-red-900/10 hover:text-red-400"
          }`}
        >
          🎲 PROBABILIDADE
        </button>
        <button
          onClick={() => setAbaAtiva("ref")}
          className={`flex-1 py-3 text-xs font-bold tracking-widest transition-all ${
            abaAtiva === "ref"
              ? "bg-red-900/20 text-red-500 shadow-[inset_0_-2px_0_#ef4444]"
              : "text-zinc-600 hover:bg-red-900/10 hover:text-red-400"
          }`}
        >
          📂 ARQUIVOS
        </button>
      </div>

      {/* --- CONTEÚDO: DADOS --- */}
      {abaAtiva === "dados" && (
        <div className="flex flex-1 flex-col p-4">
          {/* Grid de Botões (Estilo Keypad) */}
          <div className="mb-4 grid grid-cols-4 gap-2">
            {[4, 6, 8, 10, 12, 20, 100].map((d) => (
              <button
                key={d}
                onClick={() => rolar(d)}
                className="group relative overflow-hidden rounded border border-red-900/40 bg-zinc-900 py-3 text-xs font-bold text-red-600 transition-all hover:border-red-500 hover:bg-red-950/30 hover:shadow-[0_0_10px_rgba(220,38,38,0.3)] active:scale-95"
              >
                <span className="relative z-10">D{d}</span>
                {/* Efeito de Scanline no Hover */}
                <div className="absolute inset-0 -translate-y-full bg-red-500/10 transition-transform group-hover:translate-y-0" />
              </button>
            ))}
            <button
              onClick={() => setHistorico([])}
              className="col-span-1 rounded border border-red-900/20 text-[10px] font-bold text-zinc-600 hover:bg-red-950/50 hover:text-red-500"
            >
              CLR
            </button>
          </div>

          {/* Log de Rolagem (Estilo Terminal) */}
          <div className="flex-1 overflow-hidden rounded border border-red-900/30 bg-black p-2 font-mono text-xs shadow-inner">
            <div className="scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-transparent h-full overflow-y-auto pr-2">
              <div className="mb-2 border-b border-zinc-900 pb-1 text-zinc-600">
                // SYSTEM_LOG_OUTPUT
              </div>

              {historico.length === 0 && (
                <div className="flex h-full items-center justify-center text-red-900/40">
                  <span className="animate-pulse">AGUARDANDO INPUT...</span>
                </div>
              )}

              {historico.map((roll, i) => (
                <div
                  key={i}
                  className="mb-1 flex items-center justify-between border-l-2 border-red-900/50 bg-red-950/5 px-2 py-1"
                >
                  <div className="flex gap-2">
                    <span className="text-zinc-600">[{roll.timestamp}]</span>
                    <span className="text-red-400">Rolagem {roll.dado}</span>
                  </div>
                  <span
                    className={`font-bold ${
                      roll.critico
                        ? "text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]"
                        : "text-white"
                    }`}
                  >
                    {roll.valor < 10 && "0"}
                    {roll.valor}
                  </span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      )}

      {/* --- CONTEÚDO: REFERÊNCIAS --- */}
      {abaAtiva === "ref" && (
        <div className="custom-scrollbar scrollbar-red flex-1 overflow-y-auto p-4">
          {/* Seção DT */}
          <section className="mb-6">
            <h4 className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wider text-red-500 uppercase">
              <span className="h-px w-4 bg-red-500"></span>
              Classes de Dificuldade
            </h4>
            <div className="grid grid-cols-2 gap-px border border-red-900/30 bg-red-900/30">
              {[
                { l: "Fácil", v: 15 },
                { l: "Média", v: 20 },
                { l: "Difícil", v: 25 },
                { l: "Extrema", v: 30 },
              ].map((item) => (
                <div
                  key={item.l}
                  className="flex justify-between bg-zinc-950 p-2 text-xs"
                >
                  <span className="text-zinc-400">{item.l}</span>
                  <span className="font-bold text-red-100">{item.v}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Seção Armas */}
          <section className="mb-6">
            <h4 className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wider text-red-500 uppercase">
              <span className="h-px w-4 bg-red-500"></span>
              Arsenal Comum
            </h4>
            <table className="w-full text-left text-[10px] md:text-xs">
              <thead className="bg-red-950/20 text-red-400">
                <tr>
                  <th className="p-2 font-normal">ITEM</th>
                  <th className="p-2 text-right font-normal">DANO</th>
                  <th className="p-2 text-right font-normal">CRIT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-900/20 text-zinc-300">
                {[
                  { n: "Pistola", d: "1d12", c: "18/x2" },
                  { n: "Revólver", d: "2d6", c: "19/x3" },
                  { n: "Espingarda", d: "4d6", c: "20/x3" },
                  { n: "Fuzil Ass.", d: "2d10", c: "19/x3" },
                  { n: "Katana", d: "1d10", c: "19/x2" },
                ].map((w, i) => (
                  <tr key={i} className="transition-colors hover:bg-red-900/10">
                    <td className="p-2 font-medium text-red-100">{w.n}</td>
                    <td className="p-2 text-right font-mono text-zinc-400">
                      {w.d}
                    </td>
                    <td className="p-2 text-right font-mono text-yellow-600">
                      {w.c}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Seção Condições */}
          <section>
            <h4 className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wider text-red-500 uppercase">
              <span className="h-px w-4 bg-red-500"></span>
              Condições Críticas
            </h4>
            <div className="space-y-1">
              {[
                { t: "Abalado", d: "-2 em Perícias (Intelecto/Presença)" },
                { t: "Fraco", d: "-2 em Físicos (Força/Agi/Vigor)" },
                { t: "Vulnerável", d: "-2 na Defesa Passiva" },
                { t: "Sangrando", d: "1d6 dano/rodada (CD 15 Vigor)" },
              ].map((c, i) => (
                <div
                  key={i}
                  className="border-l border-red-900/50 bg-zinc-900/50 p-2 text-xs"
                >
                  <strong className="text-red-400">{c.t}:</strong>{" "}
                  <span className="text-zinc-500">{c.d}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
