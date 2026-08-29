'use client'

export default function StepHeader({
    title,
    onBack,
}: {
    title: string
    onBack: () => void
}) {
    return (
        <div className="mb-4 flex items-center gap-1">
            <button
                onClick={onBack}
                aria-label="뒤로가기"
                className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full text-xl text-[#1E1E1E] active:bg-[#F5F5F5]">
                ‹
            </button>
            <h2 className="text-[20px] leading-[1.27] font-bold tracking-[-0.015em] text-[#1E1E1E]">
                {title}
            </h2>
        </div>
    )
}
