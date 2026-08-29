'use client'

import { useState } from 'react'
import { ExamCard } from '@/components/ExamCard'
import type { Exam } from '@/types/exam'

export type { Category, Exam } from '@/types/exam'

const tabs: Array<'문제형' | '실습형'> = ['문제형', '실습형']

export function ExamTabs({ exams }: { exams: Exam[] }) {
    const [activeTab, setActiveTab] = useState<'문제형' | '실습형'>('문제형')
    const [query, setQuery] = useState('')

    const categoryItems = exams
        .filter((exam) => exam.category === activeTab)
        .toSorted((a, b) => Number(!a.href) - Number(!b.href))

    const trimmedQuery = query.trim()
    const items = trimmedQuery
        ? categoryItems.filter((exam) =>
              exam.name.toLowerCase().includes(trimmedQuery.toLowerCase()),
          )
        : categoryItems

    const chapters = new Map<string, Exam[]>()
    for (const exam of items) {
        const chapterItems = chapters.get(exam.chapter) ?? []
        chapterItems.push(exam)
        chapters.set(exam.chapter, chapterItems)
    }

    return (
        <div>
            <div className="flex gap-4 border-b border-line">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`-mb-px border-b-2 px-1 pb-2 text-sm ${
                            activeTab === tab
                                ? 'border-accent font-bold text-ink'
                                : 'border-transparent text-muted'
                        }`}>
                        {tab}
                    </button>
                ))}
            </div>

            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="시험 이름으로 검색"
                className="mt-4 w-full rounded-md border border-line bg-surface px-4 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
            />

            {items.length > 0 ? (
                <div className="mt-6 space-y-6">
                    {[...chapters.entries()].map(([chapter, chapterItems]) => (
                        <div key={chapter}>
                            <div className="mb-3 flex items-center gap-3">
                                <span className="shrink-0 text-xs font-semibold text-muted">
                                    {chapter}
                                </span>
                                <span className="h-px flex-1 bg-line" />
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                {chapterItems.map((exam) => (
                                    <ExamCard key={exam.id} exam={exam} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-4 text-sm text-muted">
                    {trimmedQuery
                        ? `'${trimmedQuery}'와 일치하는 시험이 없어요.`
                        : '아직 등록된 시험이 없어요.'}
                </p>
            )}
        </div>
    )
}
