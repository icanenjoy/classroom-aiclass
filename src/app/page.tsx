"use client";

import { useEffect, useMemo, useState } from "react";

type Question = {
  id: string;
  topic: string;
  questionText: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  difficulty: number;
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Home() {
  const [total, setTotal] = useState<Question[]>([]);
  const [queue, setQueue] = useState<Question[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then((data: { questions: Question[] }) => {
        const shuffled = shuffle(data.questions);
        setTotal(data.questions);
        setQueue(shuffled);
        setLoading(false);
      });
  }, []);

  const current = queue[0];

  const hasMoreSameTopic = useMemo(() => {
    if (!current) return false;
    return queue.slice(1).some((q) => q.topic === current.topic);
  }, [queue, current]);

  function submitAnswer() {
    if (selected === null) return;
    setSubmitted(true);
    setAnsweredCount((c) => c + 1);
    if (selected === current.answerIndex) {
      setCorrectCount((c) => c + 1);
    }
  }

  function goNext() {
    setQueue((q) => q.slice(1));
    setSelected(null);
    setSubmitted(false);
  }

  function drillSameTopic() {
    setQueue((q) => {
      const [, ...rest] = q;
      const idx = rest.findIndex((item) => item.topic === current.topic);
      if (idx === -1) return q.slice(1);
      const picked = rest[idx];
      const others = rest.filter((_, i) => i !== idx);
      return [picked, ...others];
    });
    setSelected(null);
    setSubmitted(false);
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-xl p-6 text-gray-500">불러오는 중...</main>
    );
  }

  if (!current) {
    const rate = total.length > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">SQL 함수 {total.length}문제를 모두 풀었습니다 🎉</h1>
        <p className="text-gray-600">
          정답 {correctCount} / {answeredCount} ({rate}%)
        </p>
        <button
          className="rounded-md bg-black px-4 py-2 text-white"
          onClick={() => {
            setQueue(shuffle(total));
            setAnsweredCount(0);
            setCorrectCount(0);
          }}
        >
          다시 풀기
        </button>
      </main>
    );
  }

  const isCorrect = submitted && selected === current.answerIndex;

  return (
    <main className="mx-auto max-w-xl p-6">
      <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
        <span>
          {answeredCount} / {total.length} 문제 · 정답 {correctCount}개
        </span>
        <span className="rounded bg-gray-100 px-2 py-1">{current.topic}</span>
      </div>

      <h1 className="mb-4 whitespace-pre-wrap text-lg font-semibold">
        {current.questionText}
      </h1>

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
          <div className="flex gap-2">
            <button
              onClick={goNext}
              className="flex-1 rounded-md bg-black px-4 py-2 text-white"
            >
              다음 문제
            </button>
            {hasMoreSameTopic && (
              <button
                onClick={drillSameTopic}
                className="flex-1 rounded-md border border-black px-4 py-2"
              >
                {current.topic} 더 풀기
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
