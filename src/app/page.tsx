// src/app/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PlayerDashboard } from "./_components/player-dashboard";

export default async function Page() {
  // 1. Verifica se o cookie de acesso existe
  const cookieStore = await cookies();
  const acessoLiberado = cookieStore.get("agente-autorizado");

  // 2. SERVER ACTION: Valida a senha no servidor
  async function validarAcesso(formData: FormData) {
    "use server"; // Garante que roda no backend

    const senhaDigitada = formData.get("senha");
    const senhaCorreta = process.env.PLAYER_PASSWORD;

    // LÓGICA ATUALIZADA:
    // Verifica se a senha existe, é uma string, e compara tudo em minúsculo
    if (
      senhaDigitada &&
      typeof senhaDigitada === "string" &&
      senhaDigitada.toLowerCase() === senhaCorreta?.toLowerCase()
    ) {
      // Cria o cookie de autorização (dura 7 dias)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);

      const c = await cookies();
      c.set("agente-autorizado", "true", {
        httpOnly: true,
        expires: expirationDate,
        path: "/",
      });

      // Recarrega a página
      redirect("/");
    }
  }

  // 3. Se tiver o cookie, mostra o Painel
  if (acessoLiberado?.value === "true") {
    return <PlayerDashboard />;
  }

  // 4. Se NÃO tiver, mostra a tela de bloqueio
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black font-mono text-green-500 selection:bg-green-900 selection:text-white">
      <div
        className="pointer-events-none fixed inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-sm border border-green-900/50 bg-zinc-950/80 p-8 shadow-[0_0_50px_rgba(0,255,0,0.1)] backdrop-blur-sm">
        <div className="mb-8 space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 animate-pulse items-center justify-center rounded-full border border-green-500">
            🔒
          </div>
          <h1 className="glitch-text text-3xl font-bold tracking-tighter text-white">
            ORDO VERITAS
          </h1>
          <p className="border-b border-zinc-800 pb-4 text-[10px] tracking-[0.3em] text-zinc-500 uppercase">
            Acesso Restrito // Classe B
          </p>
        </div>

        <form action={validarAcesso} className="flex flex-col gap-6">
          <div className="group relative">
            <input
              name="senha"
              type="password"
              placeholder="SENHA DE ACESSO"
              required
              className="w-full border border-green-900 bg-black px-4 py-3 text-center tracking-widest text-white uppercase placeholder-green-900/30 transition-all focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full border border-green-800 bg-green-900/20 py-3 text-xs font-bold tracking-widest text-green-500 uppercase transition-all duration-300 hover:bg-green-500 hover:text-black hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]"
          >
            Descriptografar
          </button>
        </form>

        <div className="mt-8 text-center font-mono text-[9px] text-zinc-700">
          <p>IP: RASTREADO</p>
        </div>
      </div>
    </main>
  );
}
