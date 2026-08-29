'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ExamCard } from '@/components/ExamCard'
import { exams } from '@/data/exams'
import { getAllExamProgress, type ExamProgress } from '@/lib/progress'
import type { Exam } from '@/types/exam'

function CompletedBadge({
    exam,
    completedAt,
}: {
    exam: Exam
    completedAt: string | null
}) {
    return (
        <div className="flex items-center gap-3 rounded-md border border-line bg-surface p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-lg">
                🏅
            </span>
            <div>
                <p className="font-bold text-ink">{exam.name}</p>
                <p className="text-xs text-muted">
                    {completedAt
                        ? `${new Date(completedAt).toLocaleDateString('ko-KR')} 완수`
                        : '완수'}
                </p>
            </div>
        </div>
    )
}

export default function MyPage() {
    const [progress, setProgress] = useState<ExamProgress[]>([])

    useEffect(() => {
        // localStorage는 서버 렌더에 없으므로 첫 페인트는 빈 상태로 서버/클라 일치시키고, 마운트 후 채운다
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProgress(getAllExamProgress())
    }, [])

    const byId = new Map(exams.map((exam) => [exam.id, exam]))

    const completed = progress
        .filter((p) => p.status === 'completed')
        .map((p) => ({ progress: p, exam: byId.get(p.examId) }))
        .filter(
            (entry): entry is { progress: ExamProgress; exam: Exam } =>
                !!entry.exam,
        )

    const inProgress = progress
        .filter((p) => p.status === 'in_progress')
        .map((p) => byId.get(p.examId))
        .filter((exam): exam is Exam => !!exam)

    return (
        <main className="mx-auto w-full max-w-6xl px-6 py-10">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-ink">마이페이지</h1>
                <Link href="/" className="text-sm text-muted underline">
                    ← 시험 선택으로
                </Link>
            </div>

            <section className="mb-10">
                <h2 className="mb-3 text-xs font-semibold text-muted">
                    완수한 과정
                </h2>
                {completed.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {completed.map(({ exam, progress: p }) => (
                            <CompletedBadge
                                key={exam.id}
                                exam={exam}
                                completedAt={p.completedAt}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted">
                        아직 완수한 과정이 없어요.
                    </p>
                )}
            </section>

            <section>
                <h2 className="mb-3 text-xs font-semibold text-muted">
                    진행 중인 과정
                </h2>
                {inProgress.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {inProgress.map((exam) => (
                            <ExamCard key={exam.id} exam={exam} />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted">
                        진행 중인 과정이 없어요.
                    </p>
                )}
            </section>
        </main>
    )
}
