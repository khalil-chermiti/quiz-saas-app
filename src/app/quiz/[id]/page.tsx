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

    // ---- SAVE TO quiz_responses ----
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("quiz_responses").insert({
      quiz_id: quizId,
      user_id: user ? user.id : null,
      answers: answers,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{description}</p>

        {submitted ? (
          <div className="p-6 bg-white shadow-lg rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-2">Your Score</h2>
            <p className="text-lg">
              {score} / {questions.length}
            </p>
          </div>
        ) : (
          <>
            {questions.map((q, qi) => (
              <div
                key={q.id}
                className="mb-6 bg-white p-6 shadow-lg rounded-xl"
              >
                <h3 className="font-semibold mb-3">
                  {qi + 1}. {q.text}
                </h3>

                {q.options.map((option, i) => {
                  const isMultiple = q.correct.length > 1;

                  return (
                    <label
                      key={i}
                      className="flex items-center gap-3 p-2 border rounded-xl cursor-pointer mb-2"
                    >
                      <input
                        type={isMultiple ? "checkbox" : "radio"}
                        name={`q-${q.id}`}
                        checked={(answers[q.id] || []).includes(i)}
                        onChange={(e) => {
                          if (isMultiple) {
                            toggleAnswer(q.id, i, e.target.checked);
                          } else {
                            setAnswers((prev) => ({
                              ...prev,
                              [q.id]: [i],
                            }));
                          }
                        }}
                        className="h-5 w-5"
                      />
                      {option}
                    </label>
                  );
                })}
              </div>
            ))}

            <button
              onClick={submitQuiz}
              className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition cursor-pointer"
            >
              Submit Quiz
            </button>
          </>
        )}
      </div>
    </div>
  );
}
