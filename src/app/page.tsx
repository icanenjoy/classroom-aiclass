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
        description: 'SQL 함수(윈도우·집계) 20문제',
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

function ExamCard({ exam }: { exam: Exam }) {
    if (exam.href) {
        return (
            <Link
                href={exam.href}
                className="rounded-md border border-black p-4 hover:bg-gray-50">
                <p className="font-semibold">{exam.name}</p>
                <p className="text-sm text-gray-500">{exam.description}</p>
            </Link>
        )
    }
    return (
        <div className="rounded-md border border-gray-200 p-4 text-gray-400">
            <p className="font-semibold">{exam.name}</p>
            <p className="text-sm">{exam.description}</p>
        </div>
    )
}

export default function ExamSelect() {
    return (
        <main className="mx-auto max-w-xl p-6">
            <h1 className="mb-1 text-2xl font-bold">시험을 선택하세요</h1>
            <p className="mb-6 text-sm text-gray-500">
                문제를 풀면서 익힙니다. 이론보다 실습이 먼저입니다.
            </p>
            {categories.map((category) => {
                const items = exams.filter((exam) => exam.category === category)
                if (items.length === 0) return null
                return (
                    <section key={category} className="mb-6">
                        <h2 className="mb-2 text-sm font-semibold text-gray-500">
                            {category}
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {items.map((exam) => (
                                <ExamCard key={exam.id} exam={exam} />
                            ))}
                        </div>
                    </section>
                )
            })}
        </main>
    )
}
