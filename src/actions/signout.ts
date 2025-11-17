"use server";
import { createClient } from "@/utils/supabaseServer";
import { redirect } from "next/navigation";

export async function signOutAction() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign out error:", error.message);
    // Optional: redirect anyway
    redirect("/");
  }

  redirect("/");
}
