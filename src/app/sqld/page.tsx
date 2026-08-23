"use client";

import { useEffect, useMemo, useState } from "react";
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
};

type Branch = {
  id: string;
  topic: string;
  parentId: string | null; // null = 메인 흐름에서 갈라짐
  spawnIndex: number; // 부모 흐름에서 이 브랜치가 갈라진 위치
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

  const { solvedCount, answeredTotal, correctTotal } = useMemo(() => {
    const ids = new Set<string>();
    let total = 0;
    let correct = 0;
    mainFlow.forEach((q, i) => {
      const r = mainResults[i];
      if (r !== null && r !== undefined) {
        ids.add(q.id);
        total++;
        if (r.correct) correct++;
      }
    });
    Object.values(branches).forEach((b) => {
      b.questions.forEach((q, i) => {
        const r = b.results[i];
        if (r !== null && r !== undefined) {
          ids.add(q.id);
          total++;
          if (r.correct) correct++;
        }
      });
    });
    return { solvedCount: ids.size, answeredTotal: total, correctTotal: correct };
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
              topic: b.topic,
              parentId: b.parentId,
              spawnIndex: b.spawnIndex,
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
        topic: b.topic,
        parentId: b.parentId,
        spawnIndex: b.spawnIndex,
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
      if (nextCursor < activeBranch.questions.length) {
        setSelected(null);
        setSubmitted(false);
        setBranches((prev) => ({
          ...prev,
          [activeBranch.id]: { ...prev[activeBranch.id], cursor: nextCursor },
        }));
        return;
      }
      // 미리 만들어두지 않고, 지금 필요한 시점에 같은 topic 문제를 하나 더 뽑는다
      const usedIds = new Set(activeBranch.questions.map((q) => q.id));
      const candidates = allQuestions.filter(
        (q) => q.topic === activeBranch.topic && !usedIds.has(q.id)
      );
      if (candidates.length > 0) {
        const nextQuestion = shuffle(candidates)[0];
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
        // 같은 topic 문제를 다 써버렸으면 상위로 자동 복귀
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

  // 브랜치 안에서 또 브랜치를 만들 때는(중첩) 같은 주제를 또 파고들지 않고
  // 반드시 다른 주제로 넘어간다. 첫 번째 브랜치(메인 흐름에서 갈라지는 것)는
  // 지금 막힌 그 개념을 그대로 더 푸는 것이므로 같은 주제 유지
  function nextDrillTopic(): string | null {
    if (!current) return null;
    if (!activeBranch) return current.topic;
    const otherTopics = Array.from(new Set(allQuestions.map((q) => q.topic))).filter(
      (t) => t !== activeBranch.topic
    );
    return otherTopics.length > 0 ? otherTopics[0] : activeBranch.topic;
  }

  function drillTopic() {
    if (!current) return;
    const targetTopic = nextDrillTopic();
    if (!targetTopic) return;
    const candidates = allQuestions.filter((q) => q.topic === targetTopic && q.id !== current.id);
    if (candidates.length === 0) return;
    const picked = shuffle(candidates)[0];
    const id = `branch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const spawnIndex = activeBranch ? activeBranch.cursor : mainIndex;
    const parentId = activeBranch ? activeBranch.id : null;
    const newBranch: Branch = {
      id,
      topic: targetTopic,
      parentId,
      spawnIndex,
      questions: [picked],
      results: [null],
      cursor: 0,
    };
    setBranches((prev) => ({ ...prev, [id]: newBranch }));
    setActiveStack((stack) => [...stack, id]);
    setSelected(null);
    setSubmitted(false);
  }

  function renderBranch(branch: Branch, depth: number) {
    return (
      <div key={branch.id} style={{ marginLeft: depth * 10 }} className="mt-1 border-l-2 border-gray-300 pl-2">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 shrink-0 border-b-2 border-l-2 border-gray-300" />
          <p className="text-[10px] font-medium text-gray-400">{branch.topic}</p>
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
    const rate = answeredTotal > 0 ? Math.round((correctTotal / answeredTotal) * 100) : 0;
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">SQL 함수 {mainFlow.length}문제를 모두 풀었습니다 🎉</h1>
        <p className="text-gray-600">
          정답 {correctTotal} / {answeredTotal} ({rate}%)
        </p>
        <button
          className="rounded-md bg-black px-4 py-2 text-white"
          onClick={() => {
            clearSession();
            const first = shuffle(allQuestions)[0];
            setMainFlow(first ? [first] : []);
            setMainResults(first ? [null] : []);
            setMainIndex(0);
            setBranches({});
            setActiveStack([]);
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
    <main className="mx-auto grid w-full grid-cols-1 gap-6 px-[100px] py-6 md:grid-cols-3">
      <aside className="w-full overflow-x-auto">
        <Link href="/" className="mb-3 block text-xs text-gray-500 underline">
          ← 시험 선택
        </Link>
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
                {nextDrillTopic() ?? current.topic} 더 풀기
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
