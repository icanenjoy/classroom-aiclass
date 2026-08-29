import type { ReactNode } from 'react'

export default function PhoneFrame({ children }: { children: ReactNode }) {
    return (
        <div className="w-[380px] max-w-full overflow-hidden rounded-[2.5rem] border-[10px] border-[#1C1C1C] bg-white shadow-xl">
            <div className="flex items-center justify-between bg-white px-6 pt-3 pb-1">
                <span className="text-[11px] font-semibold text-[#1E1E1E]">
                    9:41
                </span>
                <span className="rounded-full bg-[#FFFBE0] px-2.5 py-0.5 text-[11px] font-bold text-[#807200]">
                    연습용 · 실제 송금 아님
                </span>
            </div>
            {/* 실제 폰처럼 화면 크기가 스텝마다 절대 바뀌지 않도록 높이를 고정한다 —
                콘텐츠가 넘치면 이 안에서만 스크롤된다 */}
            <div className="flex h-[600px] flex-col overflow-y-auto bg-white px-5 pt-3 pb-6">
                {children}
            </div>
        </div>
    )
}
