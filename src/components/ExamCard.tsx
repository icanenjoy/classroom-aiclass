import Link from 'next/link'
import type { Exam } from '@/types/exam'

export function ExamCard({ exam }: { exam: Exam }) {
    if (exam.href) {
        return (
            <Link
                href={exam.href}
                className="block rounded-md border-2 border-accent bg-surface p-6 hover:bg-accent/5">
                <h2 className="text-xl font-bold text-ink">{exam.name}</h2>
                <p className="mt-1 text-sm text-muted">{exam.description}</p>
                <span className="mt-4 inline-block rounded-sm bg-accent px-4 py-2 text-sm font-medium text-white">
                    시작하기
                </span>
            </Link>
        )
    }

    return (
        <div
            aria-disabled="true"
            className="rounded-md border-2 border-line bg-surface p-6">
            <h2 className="text-xl font-bold text-ink">{exam.name}</h2>
            <p className="mt-1 text-sm text-muted">{exam.description}</p>
            <span className="mt-4 inline-block cursor-not-allowed rounded-sm bg-line px-4 py-2 text-sm font-medium text-muted">
                준비중
            </span>
        </div>
    )
}
