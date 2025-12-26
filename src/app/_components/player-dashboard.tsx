"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";

// 1. IMPORTANTE: Importamos o signIn para chamar o Google direto
import { signIn } from "next-auth/react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RouterOutputs = inferRouterOutputs<AppRouter>;
type MissaoData = RouterOutputs["missao"]["getAll"][number];

const ScrambleText = ({ text }: { text: string }) => {
  const [display, setDisplay] = useState(text);
  const chars = "!@#$%^&*()_+-=[]{}|;':,./<>?";

  useEffect(() => {
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((letter, index) => {
            if (index < iterations) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join(""),
      );
      if (iterations >= text.length) clearInterval(interval);
      iterations += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{display}</span>;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function PlayerDashboard() {
  const [imagemExpandida, setImagemExpandida] = useState<string | null>(null);
  const [modoCRT, setModoCRT] = useState(true);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { data: missoes, isLoading } = api.missao.getAll.useQuery();

  // 2. FUNÇÃO DE LOGIN DIRETO
  const handleSystemAccess = async () => {
    setIsLoggingIn(true);
    // Dispara o Google e manda voltar pro /admin se der certo
    await signIn("google", { callbackUrl: "/admin" });
  };

  useEffect(() => {
    if (isLoading) {
      const lines = [
        "> INICIANDO PROTOCOLO ORDO...",
        "> ESTABELECENDO CONEXÃO SEGURA (SSL/TLS)...",
        "> DESCRIPTOGRAFANDO PACOTES DE DADOS...",
        "> BUSCANDO ARQUIVOS NO SERVIDOR CENTRAL...",
        "> ACESSO CONCEDIDO. BEM-VINDO, AGENTE.",
      ];
      let currentLine = 0;
      const interval = setInterval(() => {
        if (currentLine < lines.length) {
          setBootLines((prev) => [...prev, lines[currentLine]!]);
          currentLine++;
        } else {
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen cursor-wait flex-col items-start justify-center bg-black p-8 font-mono text-xs text-green-500/80 selection:bg-green-900 selection:text-white md:text-sm">
        <div className="max-w-lg space-y-2">
          {bootLines.map((line, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="border-l-2 border-green-500 pl-2"
            >
              {line}
            </motion.p>
          ))}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="mt-4 text-green-400"
          >
            <span className="mr-1 inline-block h-4 w-2 bg-green-500 align-middle"></span>
            AGUARDANDO RESPOSTA DO SERVIDOR...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <main
      className={cn(
        "relative min-h-screen overflow-x-hidden bg-zinc-950 font-mono text-zinc-300 transition-all duration-500 selection:bg-green-900 selection:text-white",
        modoCRT && "contrast-125 saturate-50",
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
      }}
    >
      {modoCRT && (
        <div className="pointer-events-none fixed inset-0 z-50 h-screen w-screen overflow-hidden">
          <motion.div
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-0 h-32 w-full bg-gradient-to-b from-transparent via-green-500/10 to-transparent"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl space-y-8 p-4 md:space-y-12 md:p-12">
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="mb-6 flex flex-col gap-4 border-b border-zinc-800 pb-6 md:mb-10 md:flex-row md:items-end md:justify-between"
        >
          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold tracking-tighter text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.5)] sm:text-4xl md:text-5xl">
              BASE DE DADOS <br className="md:hidden" />
              <span className="glitch-text text-green-600">ORDO VERITAS</span>
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-[10px] tracking-widest text-zinc-500 uppercase md:text-xs">
                Acesso Autorizado // Agente Convidado
              </p>
              <button
                onClick={() => setModoCRT(!modoCRT)}
                className="rounded border border-zinc-800 px-1 py-0.5 text-[9px] text-zinc-600 transition-colors hover:border-green-500/30 hover:text-green-500"
              >
                {modoCRT ? "DESATIVAR CRT" : "ATIVAR CRT"}
              </button>
            </div>
          </div>

          {/* 3. BOTÃO QUE CHAMA O GOOGLE DIRETO */}
          <button
            onClick={handleSystemAccess}
            disabled={isLoggingIn}
            className="group relative self-start overflow-hidden rounded border border-zinc-900 bg-zinc-900/50 p-2 text-[10px] font-bold text-zinc-700 transition-all hover:text-green-500 disabled:opacity-50 md:self-auto md:text-xs"
          >
            <span className="relative z-10">
              {isLoggingIn ? "🔄 AUTH_PROTOCOL..." : "🔒 [ SYSTEM_ACCESS ]"}
            </span>
            <div className="absolute inset-0 z-0 translate-y-full bg-green-900/20 transition-transform group-hover:translate-y-0" />
          </button>
        </motion.header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-12"
        >
          {missoes?.map((missao) => (
            <motion.div key={missao.id} variants={itemVariants}>
              <MissaoPublica missao={missao} setZoom={setImagemExpandida} />
            </motion.div>
          ))}
        </motion.div>

        {missoes?.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/20 py-20 text-center">
            <p className="text-sm text-zinc-600">NENHUM ARQUIVO DISPONÍVEL.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {imagemExpandida && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/95 p-2 backdrop-blur-sm md:p-8"
            onClick={() => setImagemExpandida(null)}
          >
            <button className="absolute top-4 right-4 p-2 text-2xl font-bold text-white/50 md:hidden">
              ✕
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              src={imagemExpandida}
              alt="Evidência"
              className={`max-h-[90vh] max-w-full rounded-sm border border-zinc-800 object-contain shadow-[0_0_50px_rgba(34,197,94,0.2)] ${
                modoCRT ? "brightness-90 contrast-125 sepia-[.3]" : ""
              }`}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function MissaoPublica({
  missao,
  setZoom,
}: {
  missao: MissaoData;
  setZoom: (url: string) => void;
}) {
  const { data: pistas } = api.pista.getByMissao.useQuery({
    missaoId: missao.id,
  });

  const pistasReveladas = pistas?.filter((p) => p.revelada);

  if (!pistasReveladas || pistasReveladas.length === 0) return null;

  return (
    <section className="space-y-4 md:space-y-6">
      <div className="relative flex flex-col gap-1 overflow-hidden border-l-4 border-green-700 pl-4 md:flex-row md:items-end md:gap-4">
        <div className="absolute top-0 left-0 h-full w-1 animate-pulse bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]" />

        <h2 className="text-xl leading-tight font-bold break-words text-white uppercase shadow-green-500/20 drop-shadow-lg md:text-2xl">
          <ScrambleText text={missao.titulo} />
        </h2>
        <span className="w-fit rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-zinc-500 md:text-xs">
          CASO #{missao.id.slice(0, 4)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
        {pistasReveladas.map((pista, idx) => (
          <motion.div
            key={pista.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="group relative flex flex-col border border-zinc-800 bg-black p-2 transition-all hover:border-green-500/50 hover:bg-green-950/20 hover:shadow-[0_0_20px_rgba(22,163,74,0.15)]"
          >
            <button
              onClick={() => setZoom(pista.imagemUrl)}
              className="relative aspect-square w-full cursor-zoom-in overflow-hidden border border-zinc-900 bg-zinc-900"
            >
              <div className="pointer-events-none absolute inset-0 z-10 bg-green-500/0 transition-colors duration-300 group-hover:bg-green-500/10" />

              <motion.img
                whileHover={{ scale: 1.1 }}
                src={pista.imagemUrl}
                alt={pista.titulo}
                className="h-full w-full object-cover opacity-80 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
              />
            </button>

            <div className="mt-2 px-1 md:mt-3">
              <h3 className="truncate text-xs leading-tight font-bold text-green-700 transition-colors group-hover:text-green-400 md:text-sm">
                {pista.titulo}
              </h3>
              {pista.descricao && (
                <p className="mt-1 line-clamp-2 text-[10px] font-medium text-zinc-600 transition-colors group-hover:text-zinc-400 md:text-xs">
                  {pista.descricao}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
