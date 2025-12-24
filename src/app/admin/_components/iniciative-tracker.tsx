"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Combatente = {
  id: string;
  nome: string;
  valor: number;
  tipo: "player" | "enemy" | "npc";
};

export function InitiativeTracker() {
  const [combatentes, setCombatentes] = useState<Combatente[]>([]);
  const [turnoAtual, setTurnoAtual] = useState(0);
  const [rodada, setRodada] = useState(1);

  // Estados do Formulário
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<"player" | "enemy" | "npc">("enemy");

  const listRef = useRef<HTMLDivElement>(null);

  // Adicionar Combatente
  const adicionar = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!nome || !valor) return;

    const novo: Combatente = {
      id: Math.random().toString(36).substr(2, 9),
      nome,
      valor: Number(valor),
      tipo,
    };

    // Adiciona e ordena decrescente (Maior iniciativa primeiro)
    setCombatentes((prev) => {
      const lista = [...prev, novo];
      return lista.sort((a, b) => b.valor - a.valor);
    });

    setNome("");
    setValor("");
    // Mantém o tipo anterior para facilitar inserção em massa
  };

  // Avançar Turno
  const proximoTurno = () => {
    if (combatentes.length === 0) return;

    if (turnoAtual >= combatentes.length - 1) {
      setTurnoAtual(0);
      setRodada((r) => r + 1);
    } else {
      setTurnoAtual((t) => t + 1);
    }

    // Auto-scroll para o combatente ativo
    // (Opcional, se a lista for muito grande)
  };

  const remover = (id: string) => {
    setCombatentes((prev) => prev.filter((c) => c.id !== id));
    if (turnoAtual >= combatentes.length - 1) setTurnoAtual(0);
  };

  const resetarCombate = () => {
    if (confirm("Confirmar reinício da sequência de combate?")) {
      setCombatentes([]);
      setTurnoAtual(0);
      setRodada(1);
    }
  };

  return (
    <div className="flex h-[500px] flex-col border border-red-900/50 bg-black shadow-[0_0_20px_rgba(220,38,38,0.1)] transition-all">
      {/* CABEÇALHO TÁTICO */}
      <div className="flex items-center justify-between border-b border-red-900/30 bg-red-950/10 p-3">
        <h3 className="flex items-center gap-2 text-xs font-bold tracking-widest text-red-500 uppercase">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
          SEQUÊNCIA TÁTICA
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest text-red-900 uppercase">
            RODADA{" "}
            <span className="ml-1 text-sm text-white">
              {rodada < 10 ? `0${rodada}` : rodada}
            </span>
          </span>
          <button
            onClick={resetarCombate}
            className="ml-2 rounded border border-zinc-800 px-1 text-[10px] font-bold text-zinc-600 hover:text-red-500"
          >
            RST
          </button>
        </div>
      </div>

      {/* INPUTS DE ENTRADA */}
      <form
        onSubmit={adicionar}
        className="flex gap-2 border-b border-red-900/20 bg-zinc-950 p-3"
      >
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="NOME"
          className="flex-1 border border-red-900/30 bg-black px-2 py-1 text-xs text-white uppercase placeholder-zinc-700 outline-none focus:border-red-500"
        />
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="INI"
          className="w-12 border border-red-900/30 bg-black px-1 py-1 text-center font-mono text-xs font-bold text-white placeholder-zinc-700 outline-none focus:border-red-500"
        />
        {/* Seletor de Tipo Compacto */}
        <div className="flex overflow-hidden rounded border border-red-900/30 bg-black">
          <button
            type="button"
            onClick={() => setTipo("player")}
            className={`px-2 text-[10px] font-bold ${tipo === "player" ? "bg-blue-900 text-white" : "text-zinc-600 hover:text-blue-500"}`}
          >
            PL
          </button>
          <button
            type="button"
            onClick={() => setTipo("enemy")}
            className={`px-2 text-[10px] font-bold ${tipo === "enemy" ? "bg-red-900 text-white" : "text-zinc-600 hover:text-red-500"}`}
          >
            EN
          </button>
        </div>
        <button
          type="submit"
          className="bg-red-900 px-3 text-xs font-bold text-white transition-colors hover:bg-red-700"
        >
          +
        </button>
      </form>

      {/* LISTA DE COMBATE */}
      <div
        ref={listRef}
        className="custom-scrollbar scrollbar-red flex-1 space-y-1 overflow-y-auto p-2"
      >
        <AnimatePresence mode="popLayout">
          {combatentes.map((c, index) => {
            const isTurno = index === turnoAtual;

            return (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0, scale: isTurno ? 1.02 : 1 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`relative flex items-center justify-between border border-transparent p-2 transition-colors ${
                  isTurno
                    ? "z-10 border-l-4 border-y-red-900/30 border-l-red-500 bg-red-950/40 shadow-[0_0_15px_rgba(220,38,38,0.15)]"
                    : "border-l-4 border-l-zinc-800 bg-zinc-900/40 hover:bg-zinc-900"
                }`}
              >
                {/* Marcador de Tipo (Corzinha lateral) */}
                <div
                  className={`absolute top-0 bottom-0 left-0 w-1 ${
                    c.tipo === "player"
                      ? "bg-blue-500/20"
                      : c.tipo === "enemy"
                        ? "bg-red-500/20"
                        : "bg-yellow-500/20"
                  }`}
                />

                <div className="flex items-center gap-3 pl-2">
                  {/* Número da Iniciativa */}
                  <span
                    className={`font-mono text-sm font-bold ${isTurno ? "text-white" : "text-zinc-500"}`}
                  >
                    {c.valor}
                  </span>

                  {/* Nome */}
                  <span
                    className={`text-xs font-bold tracking-wide uppercase ${
                      isTurno
                        ? "text-red-100"
                        : c.tipo === "player"
                          ? "text-blue-200/70"
                          : "text-red-200/60"
                    }`}
                  >
                    {c.nome}
                  </span>
                </div>

                <button
                  onClick={() => remover(c.id)}
                  className="px-2 text-[10px] font-bold text-zinc-700 hover:text-red-500"
                >
                  X
                </button>

                {/* Efeito de Scanline no item ativo */}
                {isTurno && (
                  <motion.div
                    className="pointer-events-none absolute inset-0 bg-red-500/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {combatentes.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-red-900 opacity-30">
            <span className="mb-2 text-2xl">⚔️</span>
            <span className="text-[10px] font-bold tracking-widest uppercase">
              Sem Hostilidades
            </span>
          </div>
        )}
      </div>

      {/* BOTÃO DE AVANÇAR */}
      {combatentes.length > 0 && (
        <button
          onClick={proximoTurno}
          className="border-t border-red-950 bg-red-900 p-3 text-xs font-bold tracking-[0.2em] text-white uppercase transition-all hover:bg-red-700 active:scale-[0.99]"
        >
          Próximo Turno &gt;&gt;
        </button>
      )}
    </div>
  );
}
