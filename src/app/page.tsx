import AdSenseBanner from '@/components/AdSenseBanner'
import { ExamTabs } from '@/components/ExamTabs'
import { defaultAdConfig } from '@/data/adConfig'
import type { Exam } from '@/types/exam'

const exams: Exam[] = [
    {
        id: 'sqld',
        name: 'SQLD',
        description: '데이터모델링·SQL 기본/활용 30문제',
        href: '/sqld',
        category: '문제형',
        chapter: 'IT자격증',
    },
    {
        id: 'korean',
        name: '한국사능력검정시험',
        description: '준비중',
        href: null,
        category: '문제형',
        chapter: '어학/한국사',
    },
    {
        id: 'excel',
        name: '엑셀',
        description: '준비중',
        href: null,
        category: '문제형',
        chapter: '자격증',
    },
    {
        id: 'kiosk',
        name: '키오스크',
        description: '준비중',
        href: null,
        category: '실습형',
        chapter: '디지털실습',
    },
    {
        id: 'excel-practice',
        name: '엑셀실습',
        description: '준비중',
        href: null,
        category: '실습형',
        chapter: '실무실습',
    },
    {
        id: 'react',
        name: '리액트',
        description: '준비중',
        href: null,
        category: '실습형',
        chapter: '실무실습',
    },
    {
        id: 'sqlp',
        name: 'SQLP',
        description: '준비중',
        href: null,
        category: '문제형',
        chapter: 'IT자격증',
    },
    {
        id: 'toeic',
        name: '토익',
        description: '준비중',
        href: null,
        category: '문제형',
        chapter: '어학/한국사',
    },
    {
        id: 'nextjs',
        name: 'Next.js',
        description: '준비중',
        href: null,
        category: '실습형',
        chapter: '실무실습',
    },
    {
        id: 'c',
        name: 'C언어',
        description: '준비중',
        href: null,
        category: '실습형',
        chapter: '실무실습',
    },
    {
        id: 'housework',
        name: '설거지하는 방법',
        description: '준비중',
        href: null,
        category: '실습형',
        chapter: '인생실습',
    },
    {
        id: 'unemployment-benefit',
        name: '실업급여 받는 방법',
        description: '준비중',
        href: null,
        category: '실습형',
        chapter: '인생실습',
    },
    {
        id: 'job-preparation',
        name: '취업 준비하는 방법',
        description: '준비중',
        href: null,
        category: '실습형',
        chapter: '인생실습',
    },
    {
        id: 'opening-a-store',
        name: '가게 내는 방법',
        description: '준비중',
        href: null,
        category: '실습형',
        chapter: '인생실습',
    },
    {
        id: 'starting-a-business',
        name: '창업하는 방법',
        description: '준비중',
        href: null,
        category: '실습형',
        chapter: '인생실습',
    },
    {
        id: 'cpa',
        name: 'CPA',
        description: '준비중',
        href: null,
        category: '문제형',
        chapter: '전문자격',
    },
    {
        id: 'gsat',
        name: 'GSAT',
        description: '준비중',
        href: null,
        category: '문제형',
        chapter: '취업적성',
    },
    {
        id: 'ncs',
        name: 'NCS',
        description: '준비중',
        href: null,
        category: '문제형',
        chapter: '취업적성',
    },
    {
        id: 'kakao-bank-transfer',
        name: '카카오뱅크 송금하는 방법',
        description: '카카오뱅크 송금하기 실습',
        href: '/kakao-bank-transfer',
        category: '실습형',
        chapter: '디지털실습',
    },
]

export default function ExamSelect() {
    return (
        <main className="mx-auto w-full max-w-6xl px-6 py-10">
            <h1 className="mb-1 text-2xl font-bold text-ink">
                시험을 선택하세요
            </h1>
            <p className="mb-8 text-sm text-muted">
                문제를 풀면서 익힙니다. 이론보다 실습이 먼저입니다.
            </p>

            <ExamTabs exams={exams} />

            <div className="mt-10">
                <AdSenseBanner ad={defaultAdConfig} />
            </div>
        </main>
    )
}
