import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function LoginPage() {
  // --- SERVER ACTION (Roda no servidor) ---
  async function logar(formData: FormData) {
    "use server"; // Isso garante que o código rode no backend

    const senhaDigitada = formData.get("senha");
    const senhaCorreta = process.env.ADMIN_PASSWORD;

    // Verifica a senha
    if (senhaDigitada === senhaCorreta) {
      // Cria o cookie de sessão (dura 1 dia)
      const cookieStore = await cookies();
      cookieStore.set("admin-session", "autorizado", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 dia
        path: "/",
      });

      // Manda pro Admin
      redirect("/admin");
    } else {
      // Se errar, volta pro login (podemos melhorar o erro depois)
      redirect("/login?erro=true");
    }
  }

  // --- HTML (Visual) ---
  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-4 font-mono text-green-500">
      <div className="w-full max-w-md space-y-8 rounded border border-green-800 bg-zinc-900 p-8 shadow-[0_0_20px_rgba(0,255,0,0.1)]">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-white">
            🔒 ACESSO RESTRITO
          </h1>
          <p className="mt-2 text-sm text-zinc-500">Identifique-se, Agente.</p>
        </div>

        <form action={logar} className="space-y-6">
          <div>
            <label className="mb-2 block text-xs text-zinc-400 uppercase">
              Chave de Acesso
            </label>
            <input
              name="senha"
              type="password"
              required
              placeholder="••••••••"
              className="w-full border border-green-900 bg-black p-3 text-center text-white placeholder-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-800 py-3 font-bold text-black transition-colors hover:bg-green-600 hover:shadow-[0_0_15px_rgba(0,255,0,0.4)]"
          >
            AUTENTICAR
          </button>
        </form>

        <div className="text-center text-[10px] text-zinc-600">
          Tentativas não autorizadas serão rastreadas.
        </div>
      </div>
    </main>
  );
}
