import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // LOG DE DEBUG
  console.log("🔍 MIDDLEWARE RODANDO NA ROTA:", request.nextUrl.pathname);

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const authCookie = request.cookies.get("admin-session");

    console.log("🍪 Cookie encontrado?", authCookie?.value);

    if (!authCookie || authCookie.value !== "autorizado") {
      console.log("⛔ Acesso negado! Redirecionando...");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
