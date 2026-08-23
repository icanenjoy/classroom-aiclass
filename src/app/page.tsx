import Link from 'next/link'

type Category = '문제형' | '실습형' | '미분류'

type Exam = {
    id: string
    name: string
    description: string
    href: string | null
    category: Category
}

const exams: Exam[] = [
    {
        id: 'sqld',
        name: 'SQLD',
        description: '데이터모델링·SQL 기본/활용 30문제',
        href: '/sqld',
        category: '문제형',
    },
    {
        id: 'korean',
        name: '한국사능력검정시험',
        description: '준비중',
        href: null,
        category: '문제형',
    },
    {
        id: 'excel',
        name: '엑셀',
        description: '준비중',
        href: null,
        category: '문제형',
    },
    {
        id: 'kiosk',
        name: '키오스크',
        description: '준비중',
        href: null,
        category: '실습형',
    },
    {
        id: 'excel-practice',
        name: '엑셀실습',
        description: '준비중',
        href: null,
        category: '실습형',
    },
    {
        id: 'react',
        name: '리액트',
        description: '준비중',
        href: null,
        category: '실습형',
    },
    {
        id: 'sqlp',
        name: 'SQLP',
        description: '준비중',
        href: null,
        category: '미분류',
    },
    {
        id: 'toeic',
        name: '토익',
        description: '준비중',
        href: null,
        category: '문제형',
    },
    {
        id: 'nextjs',
        name: 'Next.js',
        description: '준비중',
        href: null,
        category: '미분류',
    },
    {
        id: 'c',
        name: 'C언어',
        description: '준비중',
        href: null,
        category: '미분류',
    },
    {
        id: 'housework',
        name: '설거지하는 방법',
        description: '준비중',
        href: null,
        category: '실습형',
    },
    {
        id: 'unemployment-benefit',
        name: '실업급여 받는 방법',
        description: '준비중',
        href: null,
        category: '실습형',
    },
    {
        id: 'job-preparation',
        name: '취업 준비하는 방법',
        description: '준비중',
        href: null,
        category: '실습형',
    },
    {
        id: 'opening-a-store',
        name: '가게 내는 방법',
        description: '준비중',
        href: null,
        category: '실습형',
    },
    {
        id: 'starting-a-business',
        name: '창업하는 방법',
        description: '준비중',
        href: null,
        category: '실습형',
    },
    {
        id: 'cpa',
        name: 'CPA',
        description: '준비중',
        href: null,
        category: '문제형',
    },
    {
        id: 'gsat',
        name: 'GSAT',
        description: '준비중',
        href: null,
        category: '문제형',
    },
    {
        id: 'ncs',
        name: 'NCS',
        description: '준비중',
        href: null,
        category: '문제형',
    },
]

const categories: Category[] = ['문제형', '실습형', '미분류']

export default function ExamSelect() {
    const heroExam = exams.find((exam) => exam.href)
    const comingSoon = exams.filter((exam) => !exam.href)

    return (
        <main className="mx-auto max-w-2xl px-6 py-10">
            <h1 className="mb-1 text-2xl font-bold text-ink">시험을 선택하세요</h1>
            <p className="mb-8 text-sm text-muted">
                문제를 풀면서 익힙니다. 이론보다 실습이 먼저입니다.
            </p>

            {heroExam && (
                <Link
                    href={heroExam.href!}
                    className="mb-10 block rounded-md border-2 border-accent bg-surface p-6 hover:bg-accent/5">
                    <p className="text-xs font-semibold tracking-wide text-accent uppercase">
                        지금 풀 수 있는 시험
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-ink">
                        {heroExam.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                        {heroExam.description}
                    </p>
                    <span className="mt-4 inline-block rounded-sm bg-accent px-4 py-2 text-sm font-medium text-white">
                        시작하기
                    </span>
                </Link>
            )}

            <section>
                <h3 className="mb-3 text-xs font-semibold text-muted">준비중</h3>
                <div className="space-y-2">
                    {categories.map((category) => {
                        const items = comingSoon.filter(
                            (exam) => exam.category === category,
                        )
                        if (items.length === 0) return null
                        return (
                            <div
                                key={category}
                                className="flex flex-wrap items-center gap-2">
                                <span className="w-16 shrink-0 text-[11px] text-muted">
                                    {category}
                                </span>
                                {items.map((exam) => (
                                    <span
                                        key={exam.id}
                                        className="rounded-sm border border-line px-2 py-1 text-xs text-muted">
                                        {exam.name}
                                    </span>
                                ))}
                            </div>
                        )
                    })}
                </div>
            </section>
        </main>
    )
}
