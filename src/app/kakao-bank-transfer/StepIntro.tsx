'use client'

export default function StepIntro({ onNext }: { onNext: () => void }) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#FFE300] text-3xl font-extrabold text-[#1E1E1E]">
                K
            </div>
            <div>
                <h1 className="text-[28px] leading-[1.15] font-extrabold tracking-[-0.02em] text-[#1E1E1E]">
                    kkobank
                </h1>
                <p className="mt-2 text-sm font-medium text-[#767676]">
                    송금을 연습해봅시다
                </p>
            </div>
            <button
                onClick={onNext}
                className="mt-4 w-full rounded-xl bg-[#FFE300] px-[18px] py-[14px] text-sm font-bold text-[#1E1E1E] active:bg-[#D9C100]">
                시작하기
            </button>
        </div>
    )
}
