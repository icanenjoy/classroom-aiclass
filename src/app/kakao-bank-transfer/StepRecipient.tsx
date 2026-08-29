'use client'

import { useState } from 'react'
import {
    BANKS,
    isRecipientMatch,
    type TransferScenario,
} from '@/data/kakaoBankTransferMock'
import StepHeader from './StepHeader'

export default function StepRecipient({
    scenario,
    onBack,
    onNext,
}: {
    scenario: TransferScenario
    onBack: () => void
    onNext: (bankId: string, accountNumber: string) => void
}) {
    const [bankId, setBankId] = useState(BANKS[0].id)
    const [accountNumberInput, setAccountNumberInput] = useState('')
    const [result, setResult] = useState<'idle' | 'success' | 'fail'>('idle')

    return (
        <div className="flex flex-1 flex-col">
            <StepHeader title="어디로 보낼까요?" onBack={onBack} />

            <p className="mb-1.5 text-[11px] font-bold text-[#767676]">
                은행 선택
            </p>
            <div className="flex flex-wrap gap-2">
                {BANKS.map((bank) => (
                    <button
                        key={bank.id}
                        onClick={() => {
                            setBankId(bank.id)
                            setResult('idle')
                        }}
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                            bankId === bank.id
                                ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white'
                                : 'border-[#E5E5E5] text-[#1E1E1E]'
                        }`}>
                        {bank.name}
                    </button>
                ))}
            </div>

            <p className="mt-5 mb-1.5 text-[11px] font-bold text-[#767676]">
                계좌번호
            </p>
            <input
                inputMode="numeric"
                value={accountNumberInput}
                onChange={(e) => {
                    setAccountNumberInput(e.target.value)
                    setResult('idle')
                }}
                placeholder="숫자만 입력"
                className="rounded-xl bg-[#F5F5F5] px-4 py-3 text-base font-medium text-[#1E1E1E] outline-none focus:ring-2 focus:ring-[#FFE300]"
            />

            <div className="flex flex-1 flex-col justify-center">
                {result === 'fail' && (
                    <p className="text-sm font-medium text-[#FF3838]">
                        일치하는 계좌를 찾을 수 없습니다. 왼쪽 정보를 다시
                        확인해 주세요.
                    </p>
                )}

                {result === 'success' && (
                    <p className="rounded-xl bg-[#DCF7E5] px-3 py-2 text-sm font-bold text-[#1AAD5C]">
                        예금주 확인: {scenario.recipientName}
                    </p>
                )}
            </div>

            {result === 'success' ? (
                <button
                    onClick={() => onNext(bankId, accountNumberInput)}
                    className="rounded-xl bg-[#FFE300] px-[18px] py-[14px] text-sm font-bold text-[#1E1E1E] active:bg-[#D9C100]">
                    다음
                </button>
            ) : (
                <button
                    onClick={() =>
                        setResult(
                            isRecipientMatch(
                                scenario,
                                bankId,
                                accountNumberInput,
                            )
                                ? 'success'
                                : 'fail',
                        )
                    }
                    disabled={accountNumberInput.length === 0}
                    className="rounded-xl bg-[#FFE300] px-[18px] py-[14px] text-sm font-bold text-[#1E1E1E] disabled:opacity-40">
                    예금주 조회
                </button>
            )}
        </div>
    )
}
