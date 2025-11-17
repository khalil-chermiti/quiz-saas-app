"use server";
import { createClient } from "@/utils/supabaseServer";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });


  if (error || !authData.user) {
    redirect("/login?error=" + encodeURIComponent(error?.message || "Login failed"));
  }

  redirect("/dashboard");
}
