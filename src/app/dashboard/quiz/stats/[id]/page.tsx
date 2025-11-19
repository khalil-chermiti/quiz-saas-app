"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabaseClient";

type Question = {
  id: number;
  text: string;
  options: string[];
  correct: number[];
};

export default function QuizStatsPage() {
  const params = useParams();
  const quizId = params.id;
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      // Load quiz structure
      const { data: quiz } = await supabase
        .from("quizzes")
        .select("title, content")
        .eq("id", quizId)
        .single();

      if (quiz) {
        setTitle(quiz.title);
        setQuestions(quiz.content.questions);
      }

      // Load all responses
      const { data: resp } = await supabase
        .from("quiz_responses")
        .select("answers")
        .eq("quiz_id", quizId);

      setResponses(resp || []);

      setLoading(false);
    };

    loadStats();
  }, [quizId]);

  const totalResponses = responses.length;

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">Loading statistics...</div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-800">
            {title} — Stats
          </h1>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition"
          >
            Print Stats
          </button>
        </div>

        <p className="text-gray-700 mb-8 text-lg">
          Total submissions:{" "}
          <span className="font-semibold">{totalResponses}</span>
        </p>

        {questions.map((q) => {
          // Compute stats per question
          const optionCounts = Array(q.options.length).fill(0);
          let answeredCount = 0;

          for (const r of responses) {
            const ans = r.answers[q.id];
            if (ans && ans.length > 0) {
              answeredCount++;
              ans.forEach((optIndex: number) => {
                if (optionCounts[optIndex] !== undefined)
                  optionCounts[optIndex]++;
              });
            }
          }

          return (
            <div
              key={q.id}
              className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-purple-100 hover:shadow-2xl transition"
            >
              <h2 className="text-xl font-semibold mb-4 text-purple-700">
                {q.text}
              </h2>

              <p className="text-gray-600 mb-4">
                People who answered:{" "}
                <span className="font-semibold">{answeredCount}</span>
              </p>

              <div className="space-y-4">
                {q.options.map((opt, i) => {
                  const count = optionCounts[i];
                  const percentage =
                    totalResponses > 0
                      ? Math.round((count / totalResponses) * 100)
                      : 0;

                  return (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-linear-to-r from-purple-50 to-white shadow-inner"
                    >
                      <p className="font-medium text-gray-800 mb-2">{opt}</p>
                      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-4 bg-linear-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {count} responses ({percentage}%)
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
