"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { loadNotes, saveNotes } from "@/lib/notes";

export default function NotesPanel() {
  const [text, setText] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setText(loadNotes());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveNotes(text);
  }, [hydrated, text]);

  return (
    <div className="flex h-full min-h-[300px] flex-col gap-2 md:flex-row">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="마크다운으로 내용을 정리하세요..."
        className="min-h-[300px] w-full resize-y rounded-md border border-gray-300 p-3 font-mono text-sm md:w-1/2"
      />
      <div className="w-full overflow-y-auto rounded-md border border-gray-200 p-3 text-sm leading-relaxed [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:mb-1 [&_h3]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_p]:mb-2 md:w-1/2">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  );
}
