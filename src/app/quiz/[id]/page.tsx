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

export default function QuizAnswerPage() {
  const params = useParams();
  const quizId = params.id;
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Load quiz
  useEffect(() => {
    const loadQuiz = async () => {
      const { data } = await supabase
        .from("quizzes")
        .select("title, description, content")
        .eq("id", quizId)
        .single();

      if (data) {
        setTitle(data.title);
        setDescription(data.description);
        setQuestions(data.content.questions);
      }
    };
    loadQuiz();
  }, [quizId, supabase]);

  const toggleAnswer = (qid: number, optIndex: number, checked: boolean) => {
    setAnswers((prev) => {
      const existing = prev[qid] || [];
      if (checked) {
        return { ...prev, [qid]: [...existing, optIndex] };
      } else {
        return { ...prev, [qid]: existing.filter((i) => i !== optIndex) };
      }
    });
  };

  const submitQuiz = async () => {
    let points = 0;

    for (const q of questions) {
      const given = answers[q.id] || [];
      const correct = q.correct;

      const isCorrect =
        given.length === correct.length &&
        given.every((i) => correct.includes(i));

      if (isCorrect) points++;
    }

    setScore(points);
    setSubmitted(true);

    // Save answers
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("quiz_responses").insert({
      quiz_id: quizId,
      user_id: user ? user.id : null,
      answers,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-purple-800 mb-3">
          {title}
        </h1>
        <p className="text-gray-700 mb-8 text-lg">{description}</p>

        {submitted ? (
          <div className="p-8 bg-white shadow-xl rounded-3xl text-center border-t-8 border-purple-600 animate-fadeIn">
            <h2 className="text-3xl font-bold mb-4 text-purple-700">
              Your Score
            </h2>
            <p className="text-xl">
              {score} / {questions.length} correct
            </p>
          </div>
        ) : (
          <>
            {questions.map((q, qi) => (
              <div
                key={q.id}
                className="mb-8 p-6 bg-white shadow-xl rounded-3xl hover:shadow-2xl transition-transform transform hover:-translate-y-1"
              >
                <h3 className="font-semibold text-2xl mb-4">
                  {qi + 1}. {q.text}
                </h3>

                <div className="space-y-3">
                  {q.options.map((option, i) => {
                    const isMultiple = q.correct.length > 1;
                    const checked = (answers[q.id] || []).includes(i);

                    return (
                      <label
                        key={i}
                        className={`flex items-center gap-4 p-3 border rounded-2xl cursor-pointer transition
                          ${checked ? "bg-purple-100 border-purple-300" : "hover:bg-purple-50"}
                        `}
                      >
                        <input
                          type={isMultiple ? "checkbox" : "radio"}
                          name={`q-${q.id}`}
                          checked={checked}
                          onChange={(e) => {
                            if (isMultiple) {
                              toggleAnswer(q.id, i, e.target.checked);
                            } else {
                              setAnswers((prev) => ({ ...prev, [q.id]: [i] }));
                            }
                          }}
                          className="h-5 w-5 accent-purple-600"
                        />
                        <span className="text-gray-800 font-medium">
                          {option}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={submitQuiz}
              className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 shadow-lg transition text-lg font-semibold w-full md:w-auto"
            >
              Submit Quiz
            </button>
          </>
        )}
      </div>
    </div>
  );
}
