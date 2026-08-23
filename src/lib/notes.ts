const NOTES_KEY = "sqld_drill_notes_v1";

export function loadNotes(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(NOTES_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveNotes(text: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NOTES_KEY, text);
  } catch {
    // localStorage 사용 불가(프라이빗 모드 등) — 저장 없이 그냥 진행
  }
}

export function clearNotes(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(NOTES_KEY);
  } catch {
    // localStorage 사용 불가 — 그냥 무시
  }
}
