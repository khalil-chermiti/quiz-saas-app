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
    .order("created_at", { ascending: false })

  const fakeResponses = (quizId: string) => {
    const seed = quizId.length;
    return (seed * 7) % 12;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Your Quizzes</h1>
          <p className="text-gray-600 mt-1">
            Manage, edit, and track your quizzes in one place.
          </p>
        </div>
        <Link
          href="/dashboard/quiz/create"
          className="px-5 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium shadow-md cursor-pointer"
        >
          + Create Quiz
        </Link>
      </header>

      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white rounded-2xl shadow-md">
          <p className="text-gray-500 text-sm">Total Quizzes</p>
          <h2 className="text-2xl font-bold mt-1">{quizzes?.length || 0}</h2>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-md">
          <p className="text-gray-500 text-sm">Total Responses</p>
          <h2 className="text-2xl font-bold mt-1">
            {quizzes?.reduce((acc, q) => acc + fakeResponses(q.id), 0) || 0}
          </h2>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-md">
          <p className="text-gray-500 text-sm">Last Quiz Added</p>
          <h2 className="text-2xl font-bold mt-1">
            {quizzes?.[0]?.title || "-"}
          </h2>
        </div>
      </div>

      {/* Quiz Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes?.length! > 0 ? (
          quizzes?.map((quiz) => (
            <QuizCard
              key={quiz.id}
              id={quiz.id}
              title={quiz.title}
              created_at={quiz.created_at}
              responses={fakeResponses(quiz.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-20">
            You have no quizzes yet. Click "Create Quiz" to add your first one!
          </div>
        )}
      </section>
    </div>
  );
}
