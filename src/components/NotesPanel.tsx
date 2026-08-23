"use client";

import { useEffect, useRef } from "react";
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import "./notes-panel-overrides.css";
import { loadNotes, saveNotes } from "@/lib/notes";

export default function NotesPanel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let crepe: Crepe | null = new Crepe({
      root: containerRef.current,
      defaultValue: loadNotes(),
    });
    crepe.on((api) => {
      api.markdownUpdated((_ctx, markdown) => {
        saveNotes(markdown);
      });
    });
    crepe.create();

    return () => {
      crepe?.destroy();
      crepe = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-[300px] w-full overflow-y-auto rounded-md border border-gray-200 text-sm"
    />
  );
}
