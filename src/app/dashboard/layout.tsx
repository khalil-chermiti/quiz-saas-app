import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabaseServer";
import { signOutAction } from "@/actions/signout";
import Avvvatars from "avvvatars-react";
import Link from "next/link";
import { LogoutIcon } from "@/components/LogoutIcon";
import { HomeIcon } from "@/components/HomeIcon";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  // Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : user.user_metadata?.full_name || user.email;

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Header */}
      <header
        style={{
          boxShadow:
            "rgba(9, 30, 66, 0.15) 0px 1px 1px, rgba(9, 30, 66, 0.10) 0px 0px 2px 2px",
        }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-6xl
        bg-white/20 backdrop-blur-md border border-white/30 rounded-full 
        z-50 p-2 flex items-center justify-between px-6"
      >
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="
                flex items-center gap-2 bg-purple-600 text-white
                px-4 py-2 rounded-full transition font-medium cursor-pointer"
          >
            Quizzes <HomeIcon />
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="
                  flex items-center gap-2
                  rounded-lg px-4 py-2 text-red-600 transition cursor-pointer"
            >
              <span>Log out</span>
              <LogoutIcon />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="font-semibold text-gray-800">{fullName}</span>
            <span className="text-sm text-gray-600">{user.email}</span>
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-4 border-purple-500 shadow-md cursor-pointer">
            <Avvvatars
              value={user.email || "user"}
              size={40}
              style="character"
            />
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="pt-32 max-w-7xl mx-auto px-6">{children}</main>
    </div>
  );
}
