import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
// 1. Mudamos de Discord para Google
import GoogleProvider from "next-auth/providers/google";

import { db } from "~/server/db";
// 2. Importamos o env para pegar as chaves e o email
import { env } from "~/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    // 3. Configuração do Google com as variáveis do .env
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    // 4. O PORTEIRO (SignIn Callback)
    // Essa função roda ANTES de criar o usuário no banco
    signIn: async ({ user }) => {
      // Se o email de quem está logando for igual ao seu do .env
      if (user.email === env.ADMIN_EMAIL) {
        return true; // Pode entrar
      }

      // Se não for, bloqueia
      console.log(
        `❌ Tentativa de invasão bloqueada: ${user.email ?? "Sem email"}`,
      );
      return false;
    },

    // 5. Mantém a sessão funcionando
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
} satisfies NextAuthConfig;
