"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabaseClient";
import { DeleteIcon } from "@/components/DeleteIcon";

type Question = {
  id: number;
  text: string;
  options: string[];
  correct: number[];
};

export default function UpdateQuizPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const quizId = params.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      const { data } = await supabase
        .from("quizzes")
        .select("title, description, content")
        .eq("id", quizId)
        .single();

      if (data) {
        setTitle(data.title);
        setDescription(data.description);
        setQuestions(
          data.content.questions.map((q: any) => ({
            id: q.id,
            text: q.text,
            options: q.options,
            correct: q.correct,
          })),
        );
      }
    };
    fetchQuiz();
  }, [quizId, supabase]);

  const addQuestion = () =>
    setQuestions([
      ...questions,
      { id: Date.now(), text: "", options: ["", ""], correct: [] },
    ]);

  const deleteQuestion = (qid: number) =>
    setQuestions(questions.filter((q) => q.id !== qid));

  const updateQuestionText = (id: number, value: string) =>
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, text: value } : q)),
    );

  const addOption = (qid: number) =>
    setQuestions(
      questions.map((q) =>
        q.id === qid ? { ...q, options: [...q.options, ""] } : q,
      ),
    );

  const deleteOption = (qid: number, index: number) =>
    setQuestions(
      questions.map((q) => {
        if (q.id === qid) {
          const newOptions = q.options.filter((_, i) => i !== index);
          const newCorrect = q.correct
            .filter((i) => i !== index)
            .map((i) => (i > index ? i - 1 : i));
          return { ...q, options: newOptions, correct: newCorrect };
        }
        return q;
      }),
    );

  const updateOption = (qid: number, index: number, value: string) =>
    setQuestions(
      questions.map((q) =>
        q.id === qid
          ? {
              ...q,
              options: q.options.map((o, i) => (i === index ? value : o)),
            }
          : q,
      ),
    );

  const toggleCorrect = (qid: number, index: number, checked: boolean) =>
    setQuestions(
      questions.map((q) => {
        if (q.id === qid) {
          const newCorrect = checked
            ? [...q.correct, index]
            : q.correct.filter((i) => i !== index);
          return { ...q, correct: newCorrect };
        }
        return q;
      }),
    );

  const validateQuiz = (): boolean => {
    if (!title.trim()) return (setError("Quiz title is required."), false);
    if (!description.trim())
      return (setError("Quiz description is required."), false);
    if (questions.length === 0)
      return (setError("Add at least one question."), false);

    for (const q of questions) {
      if (!q.text.trim())
        return (setError("Each question must have text."), false);
      if (q.options.length < 2)
        return (setError("Each question must have at least 2 options."), false);
      if (q.correct.length < 1)
        return (
          setError("Each question must have at least one correct answer."),
          false
        );
    }

    setError("");
    return true;
  };

  const updateQuiz = async () => {
    if (!validateQuiz()) return;

    await supabase
      .from("quizzes")
      .update({ title, description, content: { questions } })
      .eq("id", quizId);

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-800">Update Quiz</h1>
          <button
            onClick={updateQuiz}
            className="px-4 py-2 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition font-medium cursor-pointer"
          >
            Update Quiz
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded shadow">
            {error}
          </div>
        )}

        <div className="mb-6 p-6 bg-white rounded-2xl shadow-lg border border-purple-100">
          <label className="font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-xl mt-2 shadow-sm focus:ring-2 focus:ring-purple-300"
          />

          <label className="font-medium mt-4 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border rounded-xl mt-2 shadow-sm focus:ring-2 focus:ring-purple-300"
            rows={3}
          />
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-purple-700">
          Questions
        </h2>
        {questions.map((q, qi) => (
          <div
            key={q.id}
            className="mb-6 p-6 bg-white rounded-2xl shadow-lg relative hover:shadow-2xl transition border border-purple-100"
          >
            <button
              onClick={() => deleteQuestion(q.id)}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-bold cursor-pointer"
            >
              <DeleteIcon />
            </button>

            <label className="font-medium">Question {qi + 1}</label>
            <input
              value={q.text}
              onChange={(e) => updateQuestionText(q.id, e.target.value)}
              className="w-full p-3 border rounded-xl mt-2 mb-3 shadow-sm focus:ring-2 focus:ring-purple-200"
            />

            <p className="font-medium mb-2">Options</p>
            {q.options.map((opt, i) => (
              <div key={i} className="mb-2 flex items-center gap-3 relative">
                <input
                  value={opt}
                  onChange={(e) => updateOption(q.id, i, e.target.value)}
                  className="flex-1 p-2 border rounded-xl shadow-sm focus:ring-1 focus:ring-purple-200"
                />
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 rounded cursor-pointer"
                    checked={q.correct.includes(i)}
                    onChange={(e) => toggleCorrect(q.id, i, e.target.checked)}
                  />
                  Correct
                </label>
                <button
                  onClick={() => deleteOption(q.id, i)}
                  className="text-red-600 hover:text-red-800 font-bold cursor-pointer"
                >
                  <DeleteIcon />
                </button>
              </div>
            ))}

            <button
              onClick={() => addOption(q.id)}
              className="mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition"
            >
              Add Option
            </button>
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition cursor-pointer shadow"
        >
          Add Question
        </button>
      </div>
    </div>
  );
}
