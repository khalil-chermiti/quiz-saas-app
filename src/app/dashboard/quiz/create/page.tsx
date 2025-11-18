"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabaseClient";

type Question = {
  id: number;
  text: string;
  options: string[];
  correct: number[];
};

export default function CreateQuizPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([
    { id: Date.now(), text: "", options: ["", ""], correct: [] },
  ]);
  const [error, setError] = useState<string>("");

  const addQuestion = (): void => {
    setQuestions([...questions, { id: Date.now(), text: "", options: ["", ""], correct: [] }]);
  };

  const deleteQuestion = (qid: number) => {
    setQuestions(questions.filter(q => q.id !== qid));
  };

  const updateQuestionText = (id: number, value: string): void => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, text: value } : q)));
  };

  const addOption = (qid: number): void => {
    setQuestions(questions.map(q => (q.id === qid ? { ...q, options: [...q.options, ""] } : q)));
  };

  const deleteOption = (qid: number, index: number) => {
    setQuestions(
      questions.map(q => {
        if (q.id === qid) {
          const newOptions = q.options.filter((_, i) => i !== index);
          const newCorrect = q.correct.filter(i => i !== index).map(i => (i > index ? i - 1 : i));
          return { ...q, options: newOptions, correct: newCorrect };
        }
        return q;
      })
    );
  };

  const updateOption = (qid: number, index: number, value: string): void => {
    setQuestions(
      questions.map(q =>
        q.id === qid ? { ...q, options: q.options.map((o, i) => (i === index ? value : o)) } : q
      )
    );
  };

  const toggleCorrect = (qid: number, index: number, checked: boolean): void => {
    setQuestions(
      questions.map(q => {
        if (q.id === qid) {
          const newCorrect = checked ? [...q.correct, index] : q.correct.filter(i => i !== index);
          return { ...q, correct: newCorrect };
        }
        return q;
      })
    );
  };

  const validateQuiz = (): boolean => {
    if (!title.trim()) {
      setError("Quiz title is required.");
      return false;
    }
    if (!description.trim()) {
      setError("Quiz description is required.");
      return false;
    }
    if (questions.length === 0) {
      setError("You must add at least one question.");
      return false;
    }

    for (const q of questions) {
      if (!q.text.trim()) {
        setError("Each question must have text.");
        return false;
      }
      if (q.options.length < 2) {
        setError("Each question must have at least 2 options.");
        return false;
      }
      if (q.correct.length < 1) {
        setError("Each question must have at least one correct answer.");
        return false;
      }
    }

    setError("");
    return true;
  };

  const saveQuiz = async (): Promise<void> => {
    if (!validateQuiz()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("quizzes").insert({
      user_id: user.id,
      title,
      description,
      content: { questions },
    });

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 relative p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Create Quiz</h1>
          <button
            onClick={saveQuiz}
            className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium cursor-pointer"
          >
            Save Quiz
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        <div className="mb-6 p-6 bg-white rounded-2xl shadow-lg">
          <label className="font-medium">Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-3 border rounded-xl mt-2"
          />

          <label className="font-medium mt-4 block">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-3 border rounded-xl mt-2"
            rows={3}
          />
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">Questions</h2>
        {questions.map((q, qi) => (
          <div key={q.id} className="mb-6 p-6 bg-white rounded-2xl shadow-lg relative">
            <button
              onClick={() => deleteQuestion(q.id)}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-bold cursor-pointer"
            >
              Delete Question
            </button>

            <label className="font-medium">Question {qi + 1}</label>
            <input
              value={q.text}
              onChange={e => updateQuestionText(q.id, e.target.value)}
              className="w-full p-3 border rounded-xl mt-2 mb-3"
            />

            <p className="font-medium mb-2">Options</p>
            {q.options.map((opt, i) => (
              <div key={i} className="mb-2 flex items-center gap-3 relative">
                <input
                  value={opt}
                  onChange={e => updateOption(q.id, i, e.target.value)}
                  className="flex-1 p-2 border rounded-xl"
                />
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={q.correct.includes(i)}
                    onChange={e => toggleCorrect(q.id, i, e.target.checked)}
                  />
                  Correct
                </label>
                <button
                  onClick={() => deleteOption(q.id, i)}
                  className="text-red-600 hover:text-red-800 font-bold cursor-pointer"
                >
                  Delete Option
                </button>
              </div>
            ))}

            <button
              onClick={() => addOption(q.id)}
              className="mt-2 px-3 py-1 bg-gray-200 rounded cursor-pointer"
            >
              Add Option
            </button>
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition cursor-pointer"
        >
          Add Question
        </button>
      </div>
    </div>
  );
}
