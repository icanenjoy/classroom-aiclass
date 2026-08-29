'use client'

import { useState } from 'react'
import { isAccountMatch, type TransferScenario } from '@/data/kakaoBankTransferMock'
import StepHeader from './StepHeader'

export default function StepAccounts({
    scenario,
    onBack,
    onNext,
}: {
    scenario: TransferScenario
    onBack: () => void
    onNext: () => void
}) {
    const [error, setError] = useState<string | null>(null)

    function handleSelect(accountNumber: string) {
        if (isAccountMatch(scenario, accountNumber)) {
            onNext()
        } else {
            setError('왼쪽 정보에 적힌 계좌가 아닙니다. 다시 선택해주세요.')
        }
    }

    return (
        <div className="flex flex-1 flex-col justify-center">
            <StepHeader title="보낼 계좌를 선택하세요" onBack={onBack} />

            <div className="flex flex-col gap-3">
                {scenario.myAccounts.map((account) => (
                    <button
                        key={account.id}
                        onClick={() => handleSelect(account.accountNumber)}
                        className="rounded-[18px] border border-[#E5E5E5] p-4 text-left active:bg-[#FAFAFA]">
                        <p className="text-[11px] font-bold text-[#767676]">
                            {account.label}
                        </p>
                        <p className="mt-1 text-base font-bold text-[#1E1E1E]">
                            {account.accountNumber}
                        </p>
                        <p className="mt-1 text-[13px] font-medium text-[#767676]">
                            잔액 {account.balance.toLocaleString()}원
                        </p>
                    </button>
                ))}
            </div>

            <div className="mt-3 min-h-5">
                {error && (
                    <p className="text-sm font-medium text-[#FF3838]">
                        {error}
                    </p>
                )}
            </div>
        </div>
    )
}
