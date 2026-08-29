import Link from 'next/link'
import AdSenseBanner from '@/components/AdSenseBanner'
import { ExamTabs } from '@/components/ExamTabs'
import { defaultAdConfig } from '@/data/adConfig'
import { exams } from '@/data/exams'

export default function ExamSelect() {
    return (
        <main className="mx-auto w-full max-w-6xl px-6 py-10">
            <div className="mb-1 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-ink">벼락치기</h1>
                <Link href="/mypage" className="text-sm text-muted underline">
                    마이페이지
                </Link>
            </div>
            <p className="mb-8 text-sm text-muted">
                시간이 없는 당신에게, 가장 효율적인 학습 방법을 제공합니다.
                시험부터 인생까지, 벼락치기로 준비하세요.
            </p>

            <ExamTabs exams={exams} />

            <div className="mt-10">
                <AdSenseBanner ad={defaultAdConfig} />
            </div>
        </main>
    )
}
