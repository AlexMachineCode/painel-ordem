"use client";

import { useState } from "react";

type Agente = {
  id: string;
  nome: string;
  pvAtual: number;
  pvMax: number;
  sanAtual: number;
  sanMax: number;
  peAtual: number;
  peMax: number;
};

export function SquadTracker() {
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [novoAgente, setNovoAgente] = useState({
    nome: "",
    pv: 20,
    san: 20,
    pe: 5,
  });

  const [expandido, setExpandido] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);

  // --- Lógica (Mantida igual) ---
  const addAgente = () => {
    if (!novoAgente.nome) return;
    const agente: Agente = {
      id: Math.random().toString(36).substr(2, 9),
      nome: novoAgente.nome,
      pvMax: novoAgente.pv,
      pvAtual: novoAgente.pv,
      sanMax: novoAgente.san,
      sanAtual: novoAgente.san,
      peMax: novoAgente.pe,
      peAtual: novoAgente.pe,
    };
    setAgentes([...agentes, agente]);
    setNovoAgente({ ...novoAgente, nome: "" });
    setMostrarForm(false);
  };

  const updateStat = (id: string, stat: "pv" | "san" | "pe", delta: number) => {
    setAgentes(
      agentes.map((a) => {
        if (a.id !== id) return a;
        const max =
          stat === "pv" ? a.pvMax : stat === "san" ? a.sanMax : a.peMax;
        const current =
          stat === "pv" ? a.pvAtual : stat === "san" ? a.sanAtual : a.peAtual;
        const key =
          stat === "pv" ? "pvAtual" : stat === "san" ? "sanAtual" : "peAtual";

        let novoValor = current + delta;
        if (novoValor > max) novoValor = max;
        if (novoValor < 0) novoValor = 0;

        return { ...a, [key]: novoValor };
      }),
    );
  };

  const removeAgente = (id: string) => {
    setAgentes(agentes.filter((a) => a.id !== id));
  };

  return (
    <div className="flex flex-col border border-red-900/50 bg-black shadow-[0_0_20px_rgba(220,38,38,0.1)] transition-all">
      {/* Cabeçalho */}
      <div
        className="flex cursor-pointer items-center justify-between border-b border-red-900/30 bg-red-950/10 p-3 transition-colors hover:bg-red-900/20"
        onClick={() => setExpandido(!expandido)}
      >
        <h3 className="flex items-center gap-2 text-xs font-bold tracking-widest text-red-500 uppercase">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
          MONITOR DE AGENTES
        </h3>
        <span className="text-[10px] font-bold text-red-900">
          {expandido ? "[ MINIMIZAR ]" : `[ EXPANDIR :: ${agentes.length} ]`}
        </span>
      </div>

      {expandido && (
        <div className="space-y-4 p-4">
          {/* Botão Novo Agente */}
          {!mostrarForm && (
            <button
              onClick={() => setMostrarForm(true)}
              className="w-full rounded border border-dashed border-red-900/40 py-3 text-[10px] font-bold tracking-widest text-red-900/60 uppercase transition-all hover:border-red-500 hover:bg-red-950/20 hover:text-red-500"
            >
              + Registrar Sinal Vital
            </button>
          )}

          {/* Form (Simplificado visualmente para não ocupar espaço) */}
          {mostrarForm && (
            <div className="animate-in fade-in slide-in-from-top-2 grid grid-cols-4 gap-2 rounded border border-red-800/50 bg-zinc-900/90 p-3 backdrop-blur-sm">
              <input
                placeholder="NOME"
                className="col-span-4 rounded border border-red-900/30 bg-black p-2 text-xs text-white uppercase outline-none focus:border-red-500"
                value={novoAgente.nome}
                onChange={(e) =>
                  setNovoAgente({ ...novoAgente, nome: e.target.value })
                }
                autoFocus
              />
              <div className="flex items-center gap-1 rounded border border-red-900/20 bg-black p-1">
                <span className="px-1 text-[10px] font-bold text-red-500">
                  PV
                </span>
                <input
                  type="number"
                  className="w-full bg-transparent text-center text-xs font-bold text-white outline-none"
                  value={novoAgente.pv}
                  onChange={(e) =>
                    setNovoAgente({ ...novoAgente, pv: Number(e.target.value) })
                  }
                />
              </div>
              <div className="flex items-center gap-1 rounded border border-blue-900/20 bg-black p-1">
                <span className="px-1 text-[10px] font-bold text-blue-500">
                  SAN
                </span>
                <input
                  type="number"
                  className="w-full bg-transparent text-center text-xs font-bold text-white outline-none"
                  value={novoAgente.san}
                  onChange={(e) =>
                    setNovoAgente({
                      ...novoAgente,
                      san: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex items-center gap-1 rounded border border-yellow-900/20 bg-black p-1">
                <span className="px-1 text-[10px] font-bold text-yellow-500">
                  PE
                </span>
                <input
                  type="number"
                  className="w-full bg-transparent text-center text-xs font-bold text-white outline-none"
                  value={novoAgente.pe}
                  onChange={(e) =>
                    setNovoAgente({ ...novoAgente, pe: Number(e.target.value) })
                  }
                />
              </div>
              <button
                onClick={addAgente}
                disabled={!novoAgente.nome}
                className="flex items-center justify-center rounded bg-red-900 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                OK
              </button>
              <button
                onClick={() => setMostrarForm(false)}
                className="col-span-4 mt-1 text-[10px] text-zinc-500 hover:text-red-500"
              >
                CANCELAR
              </button>
            </div>
          )}

          {/* LISTA DE AGENTES (LAYOUT NOVO) */}
          <div className="custom-scrollbar max-h-[600px] space-y-4 overflow-y-auto pr-1">
            {agentes.map((agente) => (
              <div
                key={agente.id}
                className="group relative rounded border border-red-900/20 bg-zinc-950 p-3 shadow-inner transition-all hover:border-red-500/30"
              >
                {/* Kill Switch */}
                <button
                  onClick={() => removeAgente(agente.id)}
                  className="absolute top-2 right-2 z-10 h-6 w-6 text-xs font-bold text-zinc-800 hover:text-red-600"
                >
                  X
                </button>

                {/* Nome */}
                <h5 className="mb-3 border-b border-red-900/20 pb-2 text-sm font-bold tracking-wide text-red-50 uppercase">
                  {agente.nome}
                </h5>

                <div className="space-y-3">
                  {/* --- BLOCO PV (VERMELHO) --- */}
                  <div className="rounded border border-red-900/10 bg-red-950/10 p-2">
                    <div className="mb-1 flex items-end justify-between">
                      <span className="text-[10px] font-bold text-red-700 uppercase">
                        Vitalidade
                      </span>
                      <span className="text-sm font-bold text-white">
                        {agente.pvAtual}/{agente.pvMax}
                      </span>
                    </div>
                    {/* Barra PV */}
                    <div className="mb-2 h-3 w-full overflow-hidden rounded-sm border border-red-900/30 bg-black">
                      <div
                        className={`h-full transition-all duration-300 ${agente.pvAtual < agente.pvMax / 2 ? "animate-pulse bg-red-600" : "bg-red-800"}`}
                        style={{
                          width: `${(agente.pvAtual / agente.pvMax) * 100}%`,
                        }}
                      />
                    </div>
                    {/* Botões PV */}
                    <div className="flex justify-between gap-1">
                      <BtnCtrl
                        onClick={() => updateStat(agente.id, "pv", -5)}
                        color="red"
                        label="-5"
                      />
                      <BtnCtrl
                        onClick={() => updateStat(agente.id, "pv", -1)}
                        color="red"
                        label="-1"
                      />
                      <BtnCtrl
                        onClick={() => updateStat(agente.id, "pv", 1)}
                        color="zinc"
                        label="+1"
                      />
                      <BtnCtrl
                        onClick={() => updateStat(agente.id, "pv", 5)}
                        color="zinc"
                        label="+5"
                      />
                    </div>
                  </div>

                  {/* --- GRID SAN (AZUL) & PE (AMARELO) --- */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* SANIDADE */}
                    <div className="rounded border border-blue-900/10 bg-blue-950/10 p-2">
                      <div className="mb-1 flex items-end justify-between">
                        <span className="text-[10px] font-bold text-blue-700">
                          SAN
                        </span>
                        <span className="text-sm font-bold text-blue-100">
                          {agente.sanAtual}/{agente.sanMax}
                        </span>
                      </div>
                      <div className="mb-2 h-2 w-full overflow-hidden rounded-sm border border-blue-900/30 bg-black">
                        <div
                          className="h-full bg-blue-700 transition-all"
                          style={{
                            width: `${(agente.sanAtual / agente.sanMax) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="flex gap-1">
                        <BtnCtrl
                          onClick={() => updateStat(agente.id, "san", -1)}
                          color="blue"
                          label="-"
                        />
                        <BtnCtrl
                          onClick={() => updateStat(agente.id, "san", 1)}
                          color="zinc"
                          label="+"
                        />
                      </div>
                    </div>

                    {/* PONTOS DE ESFORÇO */}
                    <div className="flex flex-col justify-between rounded border border-yellow-900/10 bg-yellow-950/10 p-2">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-yellow-700">
                          PE
                        </span>
                        <span className="text-sm font-bold text-yellow-500">
                          {agente.peAtual}/{agente.peMax}
                        </span>
                      </div>
                      {/* Sem barra para PE, foco nos botões e número */}
                      <div className="mt-auto flex gap-1">
                        <BtnCtrl
                          onClick={() => updateStat(agente.id, "pe", -1)}
                          color="yellow"
                          label="-"
                        />
                        <BtnCtrl
                          onClick={() => updateStat(agente.id, "pe", 1)}
                          color="zinc"
                          label="+"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {agentes.length === 0 && !mostrarForm && (
              <div className="py-8 text-center text-xs tracking-widest text-red-500 uppercase opacity-30">
                Sem Sinais
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Pequeno componente auxiliar para botões padronizados
function BtnCtrl({
  onClick,
  color,
  label,
}: {
  onClick: () => void;
  color: "red" | "blue" | "yellow" | "zinc";
  label: string;
}) {
  const styles = {
    red: "border-red-900/50 bg-red-950/30 text-red-500 hover:bg-red-900 hover:text-white",
    blue: "border-blue-900/50 bg-blue-950/30 text-blue-500 hover:bg-blue-900 hover:text-white",
    yellow:
      "border-yellow-900/50 bg-yellow-950/30 text-yellow-600 hover:bg-yellow-900 hover:text-white",
    zinc: "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-700 hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`flex h-7 flex-1 items-center justify-center rounded border text-xs font-bold transition-colors ${styles[color]}`}
    >
      {label}
    </button>
  );
}
