"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabaseClient";
import { EditIcon } from "./EditIcon";
import { LinkIcon } from "./LinkIcon";
import { PieChartIcon } from "./PieChartIcon";
import { DeleteIcon } from "./DeleteIcon";
import Link from "next/link";

type QuizCardProps = {
  id: string;
  title: string;
  created_at: string;
  responses: number;
};

export default function QuizCard({
  id,
  title,
  created_at,
  responses,
}: QuizCardProps) {
  const supabase = createClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const daysAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diff = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff === 0 ? "Today" : `${diff} day${diff > 1 ? "s" : ""} ago`;
  };

  const deleteQuiz = async () => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    setIsDeleting(true);
    await supabase.from("quizzes").delete().eq("id", id);
    window.location.reload();
  };

  const publishQuiz = () => {
    alert("Publish button clicked");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition relative">
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <p className="text-gray-600 mb-2">Responses: {responses}</p>
      <p className="text-gray-400 text-sm mb-4">{daysAgo(created_at)}</p>

      {/* Pill-shaped icon container */}
      <div
        className="
        w-full
        flex items-center justify-around gap-3 bg-gray-100 rounded-full 
        px-3 py-1"
      >
        <button
          className="
          flex items-center gap-2
          cursor-pointer p-2 hover:bg-gray-200 rounded-full"
          onClick={() => {
            const url = `${window.location.origin}/quiz/${id}`;
            navigator.clipboard.writeText(url);
          }}
        >
          <LinkIcon /> Link
        </button>

        <Link
          href={`/dashboard/quiz/stats/${id}`}
          className="
          flex items-center gap-2
          cursor-pointer p-2 hover:bg-gray-200 rounded-full"
        >
          <PieChartIcon /> stats
        </Link>
        <button
          className="
          flex items-center gap-2
          cursor-pointer p-2 hover:bg-gray-200 rounded-full"
          onClick={deleteQuiz}
          disabled={isDeleting}
        >
          <DeleteIcon /> delete
        </button>
      </div>

      <Link
        href={`/dashboard/quiz/edit/${id}`}
        className="
        absolute top-5 right-5 transition cursor-pointer
        justify-end flex items-center rounded-full px-2 py-1  hover:bg-gray-100
        bg-white/70 backdrop-blur-md border border-gray-200 shadow-sm"
      >
        <EditIcon />
        <span className="p-1">Edit</span>
      </Link>
    </div>
  );
}
