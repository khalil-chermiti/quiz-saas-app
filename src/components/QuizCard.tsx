"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabaseClient";
import { EditIcon } from "./EditIcon";
import { LinkIcon } from "./LinkIcon";
import { PieChartIcon } from "./PieChartIcon";
import { DeleteIcon } from "./DeleteIcon";
import { QRCodeIcon } from "./QRCodeIcon";
import QRCode from "react-qr-code";
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
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

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

  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/quiz/${id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-linear-to-br from-white to-purple-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition relative">
      <h2 className="font-bold text-xl text-purple-800 mb-1 truncate">
        {title}
      </h2>
      <p className="text-gray-600 mb-1">Responses: {responses}</p>
      <p className="text-gray-400 text-sm mb-4">{daysAgo(created_at)}</p>

      <div className="flex flex-row items-center justify-between gap-1 bg-purple-100/30 rounded-full px-3 py-2">
        <button
          className="flex items-center gap-1 cursor-pointer p-1 hover:bg-purple-200 rounded-full transition whitespace-nowrap"
          onClick={copyLink}
        >
          <LinkIcon /> {copied ? "Copied!" : "Link"}
        </button>

        <Link
          href={`/dashboard/quiz/stats/${id}`}
          className="flex items-center gap-1 cursor-pointer p-2 hover:bg-purple-200 rounded-full transition whitespace-nowrap"
        >
          <PieChartIcon /> Stats
        </Link>

        <button
          className="flex items-center gap-1 cursor-pointer p-2 hover:bg-purple-200 rounded-full transition whitespace-nowrap"
          onClick={() => setShowQR(true)}
        >
          <QRCodeIcon /> QR
        </button>

        <button
          className="flex items-center gap-1 cursor-pointer p-2 hover:bg-red-200 rounded-full transition whitespace-nowrap"
          onClick={deleteQuiz}
          disabled={isDeleting}
        >
          <DeleteIcon /> Delete
        </button>
      </div>

      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl relative w-[280px]">
            <button
              className="absolute -top-3 -right-3 bg-white border border-gray-300 rounded-full px-3 py-1 shadow"
              onClick={() => setShowQR(false)}
            >
              ✕
            </button>

            <h3 className="text-center font-semibold text-purple-700 mb-3 truncate">
              {title}
            </h3>

            <div className="flex justify-center">
              <QRCode value={url} size={300} />
            </div>
          </div>
        </div>
      )}

      <Link
        href={`/dashboard/quiz/edit/${id}`}
        className="absolute top-5 right-5 transition cursor-pointer justify-end flex items-center rounded-full px-3 py-1 bg-white/90 backdrop-blur-sm border border-purple-200 shadow-md hover:bg-purple-50"
      >
        <EditIcon />
        <span className="ml-1 text-purple-700 font-medium">Edit</span>
      </Link>
    </div>
  );
}
