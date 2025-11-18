// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { EditIcon } from "@/components/EditIcon";
import { createClient } from "@/utils/supabaseServer";
import Link from "next/link";

export default async function DashboardPage() {
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

  // Fetch quizzes
  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("id, title, created_at, content")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fake responses (temporary)
  const fakeResponses = (quizId: string) => {
    const seed = quizId.length;
    return (seed * 7) % 12; // 0–11 responses
  };

  const daysAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diff = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff === 0 ? "Today" : `${diff} day${diff > 1 ? "s" : ""} ago`;
  };

  return (
    <div>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Quizzes</h1>
          <Link
            href="/dashboard/quiz/create"
            className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium cursor-pointer"
          >
            Create Quiz
          </Link>
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

              <p className="text-gray-600 mb-2">
                Responses: {fakeResponses(quiz.id)}
              </p>

              <p className="text-gray-400 text-sm mb-2">
                {daysAgo(quiz.created_at)}
              </p>

              <a
                href={`/edit/${quiz.id}`}
                className="absolute top-4 right-4 text-gray-600 hover:text-indigo-600 transition cursor-pointer
                justify-end flex items-center rounded-full p-2 hover:bg-gray-100
                bg-white/70 backdrop-blur-md border border-gray-200 shadow-sm"
              >
                <EditIcon />
              </a>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
