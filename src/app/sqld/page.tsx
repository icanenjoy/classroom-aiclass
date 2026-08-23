"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  addAttempt,
  saveSession,
  loadSession,
  clearSession,
  type SavedBranch,
  type AnswerRecord,
} from "@/lib/storage";

type Question = {
  id: string;
  topic: string;
  questionText: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  difficulty: number;
  keywords: string[];
};

const MAX_BRANCH_DEPTH = 5;
const MAX_BRANCH_QUESTIONS = 10; // 한 분기점(브랜치)당 최대 문제 수, 다 풀면 자동으로 상위 복귀

type Branch = {
  id: string;
  keyword: string; // 해설에서 클릭한 단어 (예: "RANK()", "GROUP BY")
  parentId: string | null; // null = 메인 흐름에서 갈라짐
  spawnIndex: number; // 부모 흐름에서 이 브랜치가 갈라진 위치
  depth: number; // 메인 흐름에서 갈라진 첫 브랜치 = 1
  questions: Question[];
  results: (AnswerRecord | null)[];
  cursor: number;
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function StatusDot({ status }: { status: "current" | "correct" | "incorrect" | "pending" }) {
  const cls =
    status === "current"
      ? "ring-2 ring-black bg-blue-300"
      : status === "correct"
        ? "bg-green-500"
        : status === "incorrect"
          ? "bg-red-400"
          : "bg-gray-200";
  return <span className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${cls}`} />;
}

export default function SqldPractice() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [mainFlow, setMainFlow] = useState<Question[]>([]);
  const [mainResults, setMainResults] = useState<(AnswerRecord | null)[]>([]);
  const [mainIndex, setMainIndex] = useState(0);
  const [branches, setBranches] = useState<Record<string, Branch>>({});
  const [activeStack, setActiveStack] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  // 브랜치 안에서 같은 문제를 반복해서 풀 수 있으므로, 여기서는 "고유 문제 수"가
  // 아니라 사이드바에 찍힌 동그라미 수(=답한 시도 수)를 그대로 센다
  const { answeredTotal, correctTotal } = useMemo(() => {
    let total = 0;
    let correct = 0;
    mainResults.forEach((r) => {
      if (r !== null && r !== undefined) {
        total++;
        if (r.correct) correct++;
      }
    });
    Object.values(branches).forEach((b) => {
      b.results.forEach((r) => {
        if (r !== null && r !== undefined) {
          total++;
          if (r.correct) correct++;
        }
      });
    });
    return { answeredTotal: total, correctTotal: correct };
  }, [mainFlow, mainResults, branches]);

  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then((data: { questions: Question[] }) => {
        setAllQuestions(data.questions);
        const byId = new Map(data.questions.map((q) => [q.id, q]));
        const saved = loadSession();

        if (saved && saved.mainFlowIds.length > 0) {
          const restoredMain = saved.mainFlowIds
            .map((id) => byId.get(id))
            .filter((q): q is Question => !!q);
          const restoredBranches: Record<string, Branch> = {};
          for (const [id, b] of Object.entries(saved.branches)) {
            restoredBranches[id] = {
              id: b.id,
              keyword: b.keyword,
              parentId: b.parentId,
              spawnIndex: b.spawnIndex,
              depth: b.depth ?? 1,
              questions: b.questionIds.map((qid) => byId.get(qid)).filter((q): q is Question => !!q),
              results: b.results,
              cursor: b.cursor,
            };
          }
          setMainFlow(restoredMain);
          setMainResults(saved.mainResults);
          setMainIndex(saved.mainIndex);
          setBranches(restoredBranches);
          setActiveStack(saved.activeStack);
        } else {
          const first = shuffle(data.questions)[0];
          setMainFlow(first ? [first] : []);
          setMainResults(first ? [null] : []);
        }

        setLoading(false);
        setHydrated(true);
      });
  }, []);

  // 메인 흐름·브랜치가 바뀔 때마다 저장 — 시험 선택 화면 갔다 와도 이어짐
  useEffect(() => {
    if (!hydrated) return;
    const savedBranches: Record<string, SavedBranch> = {};
    for (const [id, b] of Object.entries(branches)) {
      savedBranches[id] = {
        id: b.id,
        keyword: b.keyword,
        parentId: b.parentId,
        spawnIndex: b.spawnIndex,
        depth: b.depth,
        questionIds: b.questions.map((q) => q.id),
        results: b.results,
        cursor: b.cursor,
      };
    }
    saveSession({
      mainFlowIds: mainFlow.map((q) => q.id),
      mainResults,
      mainIndex,
      branches: savedBranches,
      activeStack,
    });
  }, [hydrated, mainFlow, mainResults, mainIndex, branches, activeStack]);

  const activeBranchId = activeStack[activeStack.length - 1] ?? null;
  const activeBranch = activeBranchId ? branches[activeBranchId] : null;
  const current = activeBranch ? activeBranch.questions[activeBranch.cursor] : mainFlow[mainIndex];
  const done = !activeBranch && mainIndex >= mainFlow.length && mainFlow.length > 0;

  function resetProgress() {
    clearSession();
    const first = shuffle(allQuestions)[0];
    setMainFlow(first ? [first] : []);
    setMainResults(first ? [null] : []);
    setMainIndex(0);
    setBranches({});
    setActiveStack([]);
    setSelected(null);
    setSubmitted(false);
  }

  function restart() {
    if (!window.confirm("지금까지 푼 기록을 초기화하고 처음부터 다시 시작할까요?")) return;
    resetProgress();
  }

  function submitAnswer() {
    if (selected === null || !current) return;
    setSubmitted(true);
    const isCorrect = selected === current.answerIndex;
    const record: AnswerRecord = { selectedIndex: selected, correct: isCorrect };

    addAttempt({
      questionId: current.id,
      topic: current.topic,
      correct: isCorrect,
      answeredAt: new Date().toISOString(),
    });

    if (activeBranch) {
      setBranches((prev) => {
        const b = prev[activeBranch.id];
        const results = [...b.results];
        results[b.cursor] = record;
        return { ...prev, [b.id]: { ...b, results } };
      });
    } else {
      setMainResults((prev) => {
        const copy = [...prev];
        copy[mainIndex] = record;
        return copy;
      });
    }
  }

  // 브랜치를 닫고 상위(부모) 흐름으로 돌아간다. 분기를 냈던 문제 자리로
  // 돌아가서, 그 문제를 이미 제출된 상태 그대로 다시 보여준다.
  function popBranch(branch: Branch) {
    setActiveStack((stack) => stack.slice(0, -1));
    const record: AnswerRecord | null | undefined =
      branch.parentId === null
        ? mainResults[branch.spawnIndex]
        : branches[branch.parentId]?.results[branch.spawnIndex];

    if (branch.parentId === null) {
      setMainIndex(branch.spawnIndex);
    } else {
      setBranches((prev) => {
        const parent = prev[branch.parentId as string];
        return { ...prev, [parent.id]: { ...parent, cursor: branch.spawnIndex } };
      });
    }

    if (record) {
      setSelected(record.selectedIndex);
      setSubmitted(true);
    } else {
      setSelected(null);
      setSubmitted(false);
    }
  }

  function goNext() {
    if (activeBranch) {
      const nextCursor = activeBranch.cursor + 1;
      if (nextCursor >= MAX_BRANCH_QUESTIONS) {
        // 한 분기점에서 10문제를 다 풀면 무조건 상위 흐름으로 돌아간다
        popBranch(activeBranch);
        return;
      }
      if (nextCursor < activeBranch.questions.length) {
        setSelected(null);
        setSubmitted(false);
        setBranches((prev) => ({
          ...prev,
          [activeBranch.id]: { ...prev[activeBranch.id], cursor: nextCursor },
        }));
        return;
      }
      // 미리 만들어두지 않고, 지금 필요한 시점에 같은 keyword 문제를 하나 더 뽑는다.
      // 안 쓴 문제를 우선 뽑되, 그 keyword를 이미 다 써버렸으면 반복해서 또 뽑는다
      // (사용자가 원할 때까지 계속 풀 수 있어야 하고, "상위로 돌아가기"를 눌러야만 끝남)
      const usedIds = new Set(activeBranch.questions.map((q) => q.id));
      const keywordPool = allQuestions.filter((q) => q.keywords.includes(activeBranch.keyword));
      const unused = keywordPool.filter((q) => !usedIds.has(q.id));
      const pool = unused.length > 0 ? unused : keywordPool;
      if (pool.length > 0) {
        const nextQuestion = shuffle(pool)[0];
        setSelected(null);
        setSubmitted(false);
        setBranches((prev) => {
          const b = prev[activeBranch.id];
          return {
            ...prev,
            [b.id]: {
              ...b,
              questions: [...b.questions, nextQuestion],
              results: [...b.results, null],
              cursor: nextCursor,
            },
          };
        });
      } else {
        // 이 keyword에 문제가 아예 없는 경우(데이터 문제)에만 상위로 자동 복귀
        popBranch(activeBranch);
      }
    } else {
      setSelected(null);
      setSubmitted(false);
      const nextIndex = mainIndex + 1;
      if (nextIndex < mainFlow.length) {
        // 브랜치 갔다가 돌아온 뒤라 이미 생성돼 있는 자리
        setMainIndex(nextIndex);
        return;
      }
      // 메인 흐름도 20개를 미리 만들어두지 않고, 필요한 시점에 하나씩 뽑는다
      const usedIds = new Set(mainFlow.map((q) => q.id));
      const candidates = allQuestions.filter((q) => !usedIds.has(q.id));
      if (candidates.length > 0) {
        const nextQuestion = shuffle(candidates)[0];
        setMainFlow((prev) => [...prev, nextQuestion]);
        setMainResults((prev) => [...prev, null]);
      }
      setMainIndex(nextIndex);
    }
  }

  function returnToParent() {
    if (!activeBranch) return;
    popBranch(activeBranch);
  }

  // 지금 브랜치부터 위(부모) 방향으로 이미 쓰인 keyword를 전부 모은다
  function ancestorKeywords(branch: Branch): Set<string> {
    const used = new Set<string>();
    let cur: Branch | undefined = branch;
    while (cur) {
      used.add(cur.keyword);
      cur = cur.parentId ? branches[cur.parentId] : undefined;
    }
    return used;
  }

  // 해설 안의 단어(keyword)를 클릭해서 브랜치를 만들 수 있는지 판정.
  // - 브랜치 깊이가 5에 도달했으면 더 못 만듦
  // - 중첩 브랜치는 조상 전체가 이미 쓴 keyword는 다시 못 씀(같은 개념 반복 방지)
  // - 그 keyword를 가진 다른 문제가 없으면(현재 문제 제외) 못 만듦
  function canDrillKeyword(keyword: string): boolean {
    if (!current) return false;
    if (activeBranch) {
      if (activeBranch.depth >= MAX_BRANCH_DEPTH) return false;
      if (ancestorKeywords(activeBranch).has(keyword)) return false;
    }
    return allQuestions.some((q) => q.id !== current.id && q.keywords.includes(keyword));
  }

  function drillKeyword(keyword: string) {
    if (!current || !canDrillKeyword(keyword)) return;
    const candidates = allQuestions.filter((q) => q.id !== current.id && q.keywords.includes(keyword));
    if (candidates.length === 0) return;
    const picked = shuffle(candidates)[0];
    const id = `branch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const spawnIndex = activeBranch ? activeBranch.cursor : mainIndex;
    const parentId = activeBranch ? activeBranch.id : null;
    const depth = activeBranch ? activeBranch.depth + 1 : 1;
    const newBranch: Branch = {
      id,
      keyword,
      parentId,
      spawnIndex,
      depth,
      questions: [picked],
      results: [null],
      cursor: 0,
    };
    setBranches((prev) => ({ ...prev, [id]: newBranch }));
    setActiveStack((stack) => [...stack, id]);
    setSelected(null);
    setSubmitted(false);
  }

  // 해설 문장 안에서 keywords 배열에 있는 단어를 찾아 클릭 가능한 버튼으로 감싼다
  function renderExplanation(text: string, keywords: string[]) {
    type Seg = { start: number; end: number; keyword: string };
    const segs: Seg[] = [];
    for (const kw of keywords) {
      const idx = text.indexOf(kw);
      if (idx !== -1) segs.push({ start: idx, end: idx + kw.length, keyword: kw });
    }
    segs.sort((a, b) => a.start - b.start);
    const clean: Seg[] = [];
    let lastEnd = -1;
    for (const s of segs) {
      if (s.start >= lastEnd) {
        clean.push(s);
        lastEnd = s.end;
      }
    }
    const nodes: ReactNode[] = [];
    let cursor = 0;
    clean.forEach((s, i) => {
      if (s.start > cursor) nodes.push(text.slice(cursor, s.start));
      const clickable = canDrillKeyword(s.keyword);
      nodes.push(
        clickable ? (
          <button
            key={i}
            type="button"
            onClick={() => drillKeyword(s.keyword)}
            className="underline decoration-dotted decoration-blue-400 underline-offset-2 text-blue-700 hover:bg-blue-50"
          >
            {s.keyword}
          </button>
        ) : (
          <span key={i}>{s.keyword}</span>
        )
      );
      cursor = s.end;
    });
    if (cursor < text.length) nodes.push(text.slice(cursor));
    return nodes;
  }

  function renderBranch(branch: Branch, depth: number) {
    return (
      <div key={branch.id} style={{ marginLeft: depth * 10 }} className="mt-1 border-l-2 border-gray-300 pl-2">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 shrink-0 border-b-2 border-l-2 border-gray-300" />
          <p className="text-[10px] font-medium text-gray-400">{branch.keyword}</p>
        </div>
        <div className="mt-0.5 space-y-0.5">
          {branch.questions.map((q, i) => {
            const isHere = activeBranchId === branch.id && branch.cursor === i;
            const status: "current" | "correct" | "incorrect" | "pending" = isHere
              ? "current"
              : branch.results[i] == null
                ? "pending"
                : branch.results[i]!.correct
                  ? "correct"
                  : "incorrect";
            const childBranches = Object.values(branches).filter(
              (b) => b.parentId === branch.id && b.spawnIndex === i
            );
            return (
              <div key={`${branch.id}-${i}`}>
                <div className="flex items-center gap-1.5">
                  <StatusDot status={status} />
                  <span className="text-[10px] text-gray-400">{i + 1}</span>
                </div>
                {childBranches.map((cb) => renderBranch(cb, depth + 1))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (loading) {
    return <main className="mx-auto max-w-3xl p-6 text-gray-500">불러오는 중...</main>;
  }

  if (done) {
    const rate = answeredTotal > 0 ? Math.round((correctTotal / answeredTotal) * 100) : 0;
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">SQL 함수 {mainFlow.length}문제를 모두 풀었습니다 🎉</h1>
        <p className="text-gray-600">
          정답 {correctTotal} / {answeredTotal} ({rate}%)
        </p>
        <button className="rounded-md bg-black px-4 py-2 text-white" onClick={resetProgress}>
          다시 풀기
        </button>
        <Link href="/" className="text-sm text-gray-500 underline">
          시험 선택으로 돌아가기
        </Link>
      </main>
    );
  }

  if (!current) return null;

  const isCorrect = submitted && selected === current.answerIndex;
  const topBranches = Object.values(branches).filter((b) => b.parentId === null);

  return (
    <main className="mx-auto grid w-full grid-cols-1 gap-6 px-[100px] py-6 md:grid-cols-3">
      <aside className="w-full overflow-x-auto">
        <div className="mb-3 flex items-center justify-between">
          <Link href="/" className="text-xs text-gray-500 underline">
            ← 시험 선택
          </Link>
          <button onClick={restart} className="text-xs text-gray-400 underline">
            초기화
          </button>
        </div>
        <p className="mb-1 text-xs font-semibold text-gray-400">메인 흐름</p>
        <div className="space-y-0.5 border-l-2 border-gray-300 pl-2">
          {mainFlow.map((q, i) => {
            const status: "current" | "correct" | "incorrect" | "pending" =
              !activeBranch && i === mainIndex
                ? "current"
                : mainResults[i] == null
                  ? "pending"
                  : mainResults[i]!.correct
                    ? "correct"
                    : "incorrect";
            const childBranches = topBranches.filter((b) => b.spawnIndex === i);
            return (
              <div key={q.id}>
                <div className="flex items-center gap-1.5">
                  <StatusDot status={status} />
                  <span className="text-[11px] text-gray-500">
                    {i + 1}. {q.topic}
                  </span>
                </div>
                {childBranches.map((b) => renderBranch(b, 1))}
              </div>
            );
          })}
        </div>
      </aside>

      <div className="w-full">
        <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
          <span>지금까지 총 {answeredTotal}문제</span>
          <span className="rounded bg-gray-100 px-2 py-1">
            {activeBranch ? `브랜치: ${activeBranch.keyword}` : current.topic}
          </span>
        </div>

        <h1 className="mb-4 whitespace-pre-wrap text-lg font-semibold">{current.questionText}</h1>

        <div className="flex flex-col gap-2">
          {current.choices.map((choice, i) => {
            const isSelected = selected === i;
            const isAnswer = i === current.answerIndex;
            let style = "border-gray-300";
            if (submitted) {
              if (isAnswer) style = "border-green-600 bg-green-50";
              else if (isSelected) style = "border-red-500 bg-red-50";
            } else if (isSelected) {
              style = "border-black";
            }
            return (
              <button
                key={i}
                disabled={submitted}
                onClick={() => setSelected(i)}
                className={`rounded-md border px-4 py-2 text-left ${style}`}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {!submitted ? (
          <button
            disabled={selected === null}
            onClick={submitAnswer}
            className="mt-4 rounded-md bg-black px-4 py-2 text-white disabled:opacity-30"
          >
            제출
          </button>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            <div
              className={`rounded-md p-3 text-sm ${
                isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
            >
              <p className="mb-1 font-semibold">{isCorrect ? "정답입니다" : "오답입니다"}</p>
              <p className="whitespace-pre-wrap">
                {renderExplanation(current.explanation, current.keywords)}
              </p>
              <p className="mt-2 text-xs text-gray-400">
                밑줄 친 단어를 누르면 그 개념만 더 풀 수 있어요
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={goNext} className="flex-1 rounded-md bg-black px-4 py-2 text-white">
                다음 문제
              </button>
              {activeBranch && (
                <button
                  onClick={returnToParent}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-500"
                >
                  상위 흐름으로 돌아가기
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 오른쪽 1/3 — 다음에 새 기능 들어갈 자리, 지금은 비워둠 */}
      <div className="hidden w-full md:block" />
    </main>
  );
}
