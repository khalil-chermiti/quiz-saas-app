// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabaseServer";
import { signOutAction } from "@/actions/signout";
import Avvvatars from "avvvatars-react";
import { EditIcon } from "@/components/EditIcon";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get the user session on the server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login"); // redirect if not logged in
  }

  // Fetch user profile for first and last name
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : user.user_metadata?.full_name || user.email;

  const currentPath = "/dashboard";

  const quizzes = [
    {
      id: "1",
      title: "Sample Quiz 1",
      responses: 10,
      created_at: "2024-06-20T12:00:00Z",
    },
    {
      id: "2",
      title: "Sample Quiz 2",
      responses: 5,
      created_at: "2024-06-22T15:30:00Z",
    },
    {
      id: "3",
      title: "Sample Quiz 3",
      responses: 8,
      created_at: "2024-06-23T09:45:00Z",
    },
  ];

  // Simple function to calculate days ago
  const daysAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diff = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff === 0 ? "Today" : `${diff} day${diff > 1 ? "s" : ""} ago`;
  };

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
          {currentPath !== "/dashboard" && (
            <a
              href="#quizzes"
              className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition font-medium cursor-pointer"
            >
              Quizzes
            </a>
          )}
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-lg bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition cursor-pointer"
            >
              Sign Out
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

      {/* Main Dashboard Content */}
      <main className="pt-32 max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Quizzes</h1>
          <a
            href="/create"
            className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium cursor-pointer"
          >
            Create Quiz
          </a>
        </div>

        <section
          id="quizzes"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {quizzes?.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer relative"
            >
              <h2 className="font-semibold text-lg mb-2">{quiz.title}</h2>
              <p className="text-gray-600 mb-2">Responses: {quiz.responses}</p>
              {quiz.created_at && (
                <p className="text-gray-400 text-sm mb-2">
                  {daysAgo(quiz.created_at)}
                </p>
              )}
              <a
                href={`/edit/${quiz.id}`}
                className="absolute top-4 right-4 text-gray-600 hover:text-indigo-600 transition cursor-pointer
                justify-end flex items-center
                rounded-full p-2 hover:bg-gray-100
                bg-white/70 backdrop-blur-md border border-gray-200 shadow-sm
                "
              >
                {/* Placeholder for your custom EditIcon */}
                <EditIcon />
              </a>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
