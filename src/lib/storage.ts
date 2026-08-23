export type Attempt = {
  questionId: string;
  topic: string;
  correct: boolean;
  answeredAt: string;
};

const STORAGE_KEY = "sqld_drill_attempts_v1";

export function getAttempts(): Attempt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Attempt[]) : [];
  } catch {
    return [];
  }
}

export function getSolvedCount(): number {
  const attempts = getAttempts();
  const uniqueQuestionIds = new Set(attempts.map((a) => a.questionId));
  return uniqueQuestionIds.size; // 브랜치 포함 고유 문제 수, 재시도는 중복 제외
}

export function addAttempt(attempt: Attempt): void {
  if (typeof window === "undefined") return;
  try {
    const attempts = getAttempts();
    attempts.push(attempt);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
  } catch {
    // localStorage 사용 불가(프라이빗 모드 등) — 저장 없이 그냥 진행
  }
}
