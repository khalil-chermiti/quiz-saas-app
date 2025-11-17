"use server";
import { createClient } from "@/utils/supabaseServer";
import { redirect } from "next/navigation";

export async function signupAction(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const is_enterprise = formData.get("is_enterprise") === "on";

  const { data: authData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
  });

  // return error saying signup failed
  if (signupError || !authData.user) {
    redirect("/signup?error=" + encodeURIComponent("Signup failed!"));
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    first_name,
    last_name,
    is_enterprise,
  });

  if (profileError) {
    redirect(`/signup?error=${encodeURIComponent("Profile creation failed!")}`);
  }

  redirect("/dashboard");
}
