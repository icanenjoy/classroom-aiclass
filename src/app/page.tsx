import Link from "next/link";

type Exam = {
  id: string;
  name: string;
  description: string;
  href: string | null;
};

const exams: Exam[] = [
  { id: "sqld", name: "SQLD", description: "SQL 함수(윈도우·집계) 20문제", href: "/sqld" },
  { id: "sqlp", name: "SQLP", description: "준비중", href: null },
  { id: "toeic", name: "토익", description: "준비중", href: null },
  { id: "react", name: "리액트", description: "준비중", href: null },
  { id: "nextjs", name: "Next.js", description: "준비중", href: null },
  { id: "c", name: "C언어", description: "준비중", href: null },
];

export default function ExamSelect() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-1 text-2xl font-bold">시험을 선택하세요</h1>
      <p className="mb-6 text-sm text-gray-500">
        문제를 풀면서 익힙니다. 이론보다 실습이 먼저입니다.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {exams.map((exam) =>
          exam.href ? (
            <Link
              key={exam.id}
              href={exam.href}
              className="rounded-md border border-black p-4 hover:bg-gray-50"
            >
              <p className="font-semibold">{exam.name}</p>
              <p className="text-sm text-gray-500">{exam.description}</p>
            </Link>
          ) : (
            <div
              key={exam.id}
              className="rounded-md border border-gray-200 p-4 text-gray-400"
            >
              <p className="font-semibold">{exam.name}</p>
              <p className="text-sm">{exam.description}</p>
            </div>
          )
        )}
      </div>
    </main>
  );
}
