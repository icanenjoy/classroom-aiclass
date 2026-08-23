"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { addAttempt, getSolvedCount } from "@/lib/storage";

type Question = {
  id: string;
  topic: string;
  questionText: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  difficulty: number;
};

type Branch = {
  id: string;
  topic: string;
  parentId: string | null; // null = 메인 흐름에서 갈라짐
  spawnIndex: number; // 부모 흐름에서 이 브랜치가 갈라진 위치
  questions: Question[];
  results: (boolean | null)[];
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
  const [mainResults, setMainResults] = useState<(boolean | null)[]>([]);
  const [mainIndex, setMainIndex] = useState(0);
  const [branches, setBranches] = useState<Record<string, Branch>>({});
  const [activeStack, setActiveStack] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionAnswered, setSessionAnswered] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);

  useEffect(() => {
    setSolvedCount(getSolvedCount());
  }, []);

  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then((data: { questions: Question[] }) => {
        const shuffled = shuffle(data.questions);
        setAllQuestions(data.questions);
        setMainFlow(shuffled);
        setMainResults(Array(shuffled.length).fill(null));
        setLoading(false);
      });
  }, []);

  const activeBranchId = activeStack[activeStack.length - 1] ?? null;
  const activeBranch = activeBranchId ? branches[activeBranchId] : null;
  const current = activeBranch ? activeBranch.questions[activeBranch.cursor] : mainFlow[mainIndex];
  const done = !activeBranch && mainIndex >= mainFlow.length && mainFlow.length > 0;

  function submitAnswer() {
    if (selected === null || !current) return;
    setSubmitted(true);
    const isCorrect = selected === current.answerIndex;
    setSessionAnswered((c) => c + 1);
    if (isCorrect) setSessionCorrect((c) => c + 1);

    addAttempt({
      questionId: current.id,
      topic: current.topic,
      correct: isCorrect,
      answeredAt: new Date().toISOString(),
    });
    setSolvedCount(getSolvedCount());

    if (activeBranch) {
      setBranches((prev) => {
        const b = prev[activeBranch.id];
        const results = [...b.results];
        results[b.cursor] = isCorrect;
        return { ...prev, [b.id]: { ...b, results } };
      });
    } else {
      setMainResults((prev) => {
        const copy = [...prev];
        copy[mainIndex] = isCorrect;
        return copy;
      });
    }
  }

  function popBranch(branch: Branch) {
    setActiveStack((stack) => stack.slice(0, -1));
    if (branch.parentId === null) {
      setMainIndex(branch.spawnIndex + 1);
    } else {
      setBranches((prev) => {
        const parent = prev[branch.parentId as string];
        return { ...prev, [parent.id]: { ...parent, cursor: branch.spawnIndex + 1 } };
      });
    }
  }

  function goNext() {
    setSelected(null);
    setSubmitted(false);
    if (activeBranch) {
      const nextCursor = activeBranch.cursor + 1;
      if (nextCursor < activeBranch.questions.length) {
        setBranches((prev) => ({
          ...prev,
          [activeBranch.id]: { ...prev[activeBranch.id], cursor: nextCursor },
        }));
      } else {
        popBranch(activeBranch);
      }
    } else {
      setMainIndex((i) => i + 1);
    }
  }

  function returnToParent() {
    if (!activeBranch) return;
    setSelected(null);
    setSubmitted(false);
    popBranch(activeBranch);
  }

  function drillTopic() {
    if (!current) return;
    const pool = shuffle(allQuestions.filter((q) => q.topic === current.topic && q.id !== current.id));
    const picked = pool.slice(0, Math.min(5, pool.length));
    if (picked.length === 0) return;
    const id = `branch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const spawnIndex = activeBranch ? activeBranch.cursor : mainIndex;
    const parentId = activeBranch ? activeBranch.id : null;
    const newBranch: Branch = {
      id,
      topic: current.topic,
      parentId,
      spawnIndex,
      questions: picked,
      results: Array(picked.length).fill(null),
      cursor: 0,
    };
    setBranches((prev) => ({ ...prev, [id]: newBranch }));
    setActiveStack((stack) => [...stack, id]);
    setSelected(null);
    setSubmitted(false);
  }

  function renderBranch(branch: Branch, depth: number) {
    return (
      <div key={branch.id} style={{ marginLeft: depth * 10 }} className="mt-1 border-l border-gray-200 pl-2">
        <p className="text-[10px] font-medium text-gray-400">↳ {branch.topic}</p>
        <div className="mt-0.5 space-y-0.5">
          {branch.questions.map((q, i) => {
            const isHere = activeBranchId === branch.id && branch.cursor === i;
            const status: "current" | "correct" | "incorrect" | "pending" = isHere
              ? "current"
              : branch.results[i] === true
                ? "correct"
                : branch.results[i] === false
                  ? "incorrect"
                  : "pending";
            const childBranches = Object.values(branches).filter(
              (b) => b.parentId === branch.id && b.spawnIndex === i
            );
            return (
              <div key={q.id}>
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
    const rate = sessionAnswered > 0 ? Math.round((sessionCorrect / sessionAnswered) * 100) : 0;
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">SQL 함수 {mainFlow.length}문제를 모두 풀었습니다 🎉</h1>
        <p className="text-gray-600">
          이번 세션 정답 {sessionCorrect} / {sessionAnswered} ({rate}%)
        </p>
        <button
          className="rounded-md bg-black px-4 py-2 text-white"
          onClick={() => {
            setMainFlow((prev) => shuffle(prev));
            setMainResults((prev) => Array(prev.length).fill(null));
            setMainIndex(0);
            setBranches({});
            setActiveStack([]);
            setSessionAnswered(0);
            setSessionCorrect(0);
          }}
        >
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
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-6 md:flex-row">
      <aside className="w-full shrink-0 overflow-x-auto md:w-52">
        <Link href="/" className="mb-3 block text-xs text-gray-500 underline">
          ← 시험 선택
        </Link>
        <p className="mb-1 text-xs font-semibold text-gray-400">메인 흐름</p>
        <div className="space-y-0.5">
          {mainFlow.map((q, i) => {
            const status: "current" | "correct" | "incorrect" | "pending" =
              !activeBranch && i === mainIndex
                ? "current"
                : mainResults[i] === true
                  ? "correct"
                  : mainResults[i] === false
                    ? "incorrect"
                    : "pending";
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

      <div className="mx-auto w-full max-w-xl">
        <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
          <span>지금까지 총 {solvedCount}문제</span>
          <span className="rounded bg-gray-100 px-2 py-1">
            {activeBranch ? `브랜치: ${activeBranch.topic}` : current.topic}
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
              <p className="whitespace-pre-wrap">{current.explanation}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={goNext} className="flex-1 rounded-md bg-black px-4 py-2 text-white">
                다음 문제
              </button>
              <button
                onClick={drillTopic}
                className="flex-1 rounded-md border border-black px-4 py-2"
              >
                {current.topic} 더 풀기
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
    </main>
  );
}
