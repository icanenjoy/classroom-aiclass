"use client";

import { loadNotes } from "@/lib/notes";

export default function NotesDownloadButton() {
  function handleDownload() {
    const text = loadNotes();
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="rounded-md border border-line px-4 py-2 text-sm text-muted hover:bg-accent/5"
    >
      정리한 노트 다운로드
    </button>
  );
}
