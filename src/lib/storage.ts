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

// 현재 진행 중인 문제풀이 흐름(메인 흐름 + 브랜치) 자체를 저장 — 시험 선택
// 화면으로 갔다가 돌아와도 어디까지 풀었는지 그대로 이어짐

export type AnswerRecord = { selectedIndex: number; correct: boolean };

export type SavedBranch = {
  id: string;
  topic: string;
  parentId: string | null;
  spawnIndex: number;
  depth: number;
  questionIds: string[];
  results: (AnswerRecord | null)[];
  cursor: number;
};

export type SavedSession = {
  mainFlowIds: string[];
  mainResults: (AnswerRecord | null)[];
  mainIndex: number;
  branches: Record<string, SavedBranch>;
  activeStack: string[];
};

const SESSION_KEY = "sqld_drill_session_v1";

export function saveSession(session: SavedSession): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // localStorage 사용 불가 — 그냥 무시
  }
}

export function loadSession(): SavedSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // localStorage 사용 불가 — 그냥 무시
  }
}
