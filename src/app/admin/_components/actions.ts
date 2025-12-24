"use server"; // <--- Isso é OBRIGATÓRIO na primeira linha

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  // Apaga o cookie de sessão
  (await cookies()).delete("admin-session");

  // Manda de volta pro login
  redirect("/");
}
