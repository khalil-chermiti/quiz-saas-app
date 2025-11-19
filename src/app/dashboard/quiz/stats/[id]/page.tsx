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

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading statistics...
      </div>
    );
  }

  const totalResponses = responses.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{title} — Stats</h1>
        <p className="text-gray-600 mb-8">
          Total submissions: <strong>{totalResponses}</strong>
        </p>

        {questions.map((q) => {
          // For this question, accumulate stats
          const optionCounts = Array(q.options.length).fill(0);
          let answeredCount = 0;

          for (const r of responses) {
            const ans = r.answers[q.id];
            if (ans && ans.length > 0) {
              answeredCount++;
              ans.forEach((optIndex: number) => {
                if (optionCounts[optIndex] !== undefined) {
                  optionCounts[optIndex]++;
                }
              });
            }
          }

          return (
            <div
              key={q.id}
              className="mb-8 p-6 bg-white rounded-xl shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4">{q.text}</h2>

              <p className="text-gray-600 mb-3">
                People who answered:{" "}
                <strong>{answeredCount}</strong>
              </p>

              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  const count = optionCounts[i];
                  const percentage =
                    totalResponses > 0
                      ? Math.round((count / totalResponses) * 100)
                      : 0;

                  return (
                    <div
                      key={i}
                      className="p-3 border rounded-xl bg-gray-50"
                    >
                      <p className="font-medium">{opt}</p>

                      <div className="mt-1 w-full bg-gray-200 h-3 rounded-full">
                        <div
                          className="h-3 bg-purple-600 rounded-full transition-all"
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
