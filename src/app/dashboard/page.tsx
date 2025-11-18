import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabaseServer";
import QuizCard from "@/components/QuizCard";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("id, title, created_at, content")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const fakeResponses = (quizId: string) => {
    const seed = quizId.length;
    return (seed * 7) % 12;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Your Quizzes</h1>
        <Link
          href="/dashboard/quiz/create"
          className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium cursor-pointer"
        >
          Create Quiz
        </Link>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes?.map((quiz) => (
          <QuizCard
            key={quiz.id}
            id={quiz.id}
            title={quiz.title}
            created_at={quiz.created_at}
            responses={fakeResponses(quiz.id)}
          />
        ))}
      </section>
    </div>
  );
}
