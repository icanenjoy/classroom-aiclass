'use client'

import Link from 'next/link'
import { bankName, type TransferScenario } from '@/data/kakaoBankTransferMock'

export default function StepComplete({
    scenario,
    recipientBankId,
    recipientAccountNumber,
    amount,
    onRestart,
}: {
    scenario: TransferScenario
    recipientBankId: string
    recipientAccountNumber: string
    amount: number
    onRestart: () => void
}) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DCF7E5] text-2xl text-[#1AAD5C]">
                ✓
            </div>
            <h2 className="text-[20px] font-bold text-[#1E1E1E]">
                이체 완료
            </h2>
            <p className="text-sm font-medium text-[#767676]">
                {scenario.recipientName}님 ({bankName(recipientBankId)}{' '}
                {recipientAccountNumber})에게{' '}
                <span className="font-bold text-[#1E1E1E]">
                    {amount.toLocaleString()}원
                </span>
                을 보냈습니다
            </p>
            <p className="rounded-full bg-[#FFFBE0] px-2.5 py-0.5 text-[11px] font-bold text-[#807200]">
                실제로 이체되지 않았습니다 · 연습 화면입니다
            </p>
            <p className="rounded-full bg-[#EAF6FF] px-2.5 py-0.5 text-[11px] font-bold text-[#0B74C4]">
                🏅 완수 뱃지 획득!
            </p>

            <div className="mt-2 flex w-full flex-col gap-2">
                <button
                    onClick={onRestart}
                    className="rounded-xl bg-[#FFE300] px-[18px] py-[14px] text-sm font-bold text-[#1E1E1E] active:bg-[#D9C100]">
                    처음부터 다시 연습하기
                </button>
                <Link
                    href="/"
                    className="rounded-xl border border-[#E5E5E5] px-[18px] py-[14px] text-center text-sm font-bold text-[#1E1E1E]">
                    시험 선택으로 돌아가기
                </Link>
            </div>
        </div>
    )
}
