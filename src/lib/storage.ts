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

export type Stats = {
  total: number; // 고유 문제 수 (브랜치 포함, 재시도는 중복 제외)
  correctRate: number; // 각 문제의 마지막 시도 기준 정답률(%)
};

export function getStats(): Stats {
  const attempts = getAttempts();
  const latestByQuestion = new Map<string, boolean>();
  for (const a of attempts) {
    latestByQuestion.set(a.questionId, a.correct); // 뒤에 온 시도가 앞의 것을 덮어써서 "마지막 시도"만 남음
  }
  const total = latestByQuestion.size;
  const correctCount = [...latestByQuestion.values()].filter(Boolean).length;
  const correctRate = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  return { total, correctRate };
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
