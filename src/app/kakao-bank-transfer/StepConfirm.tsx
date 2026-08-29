'use client'

import { useState } from 'react'
import {
    bankName,
    isPasswordMatch,
    type TransferScenario,
} from '@/data/kakaoBankTransferMock'
import NumericKeypad from './NumericKeypad'
import StepHeader from './StepHeader'

export default function StepConfirm({
    scenario,
    recipientBankId,
    recipientAccountNumber,
    amount,
    onBack,
    onNext,
}: {
    scenario: TransferScenario
    recipientBankId: string
    recipientAccountNumber: string
    amount: number
    onBack: () => void
    onNext: () => void
}) {
    const [pin, setPin] = useState('')
    const [error, setError] = useState<string | null>(null)

    function pressKey(key: string) {
        if (key === '⌫') {
            setPin((prev) => prev.slice(0, -1))
            return
        }
        if (pin.length >= 4) return
        setPin((prev) => prev + key)
    }

    function handleConfirm() {
        if (isPasswordMatch(scenario, pin)) {
            onNext()
        } else {
            setError('비밀번호가 일치하지 않습니다')
            setPin('')
        }
    }

    return (
        <div className="flex flex-1 flex-col">
            <StepHeader title="이체 확인" onBack={onBack} />

            <div className="rounded-[18px] border border-[#E5E5E5] p-4 text-sm">
                <div className="flex justify-between text-[#767676]">
                    <span>보내는 계좌</span>
                    <span className="font-medium text-[#1E1E1E]">
                        {scenario.myName} · {scenario.myAccountNumber}
                    </span>
                </div>
                <div className="mt-2 flex justify-between text-[#767676]">
                    <span>받는 사람</span>
                    <span className="font-medium text-[#1E1E1E]">
                        {scenario.recipientName} · {bankName(recipientBankId)}{' '}
                        {recipientAccountNumber}
                    </span>
                </div>
                <div className="mt-3 border-t border-[#E5E5E5] pt-3 text-right text-2xl font-extrabold text-[#1E1E1E]">
                    {amount.toLocaleString()}원
                </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-3">
                <p className="text-[13px] font-medium text-[#767676]">
                    계좌 비밀번호 4자리를 입력하세요
                </p>
                <div className="flex justify-center gap-3">
                    {[0, 1, 2, 3].map((i) => (
                        <span
                            key={i}
                            className={`h-3 w-3 rounded-full border border-[#E5E5E5] ${
                                i < pin.length
                                    ? 'bg-[#1E1E1E]'
                                    : 'bg-transparent'
                            }`}
                        />
                    ))}
                </div>
                {error && (
                    <p className="text-sm font-medium text-[#FF3838]">
                        {error}
                    </p>
                )}
            </div>

            <NumericKeypad onPress={pressKey} />

            <button
                onClick={handleConfirm}
                disabled={pin.length < 4}
                className="mt-3 rounded-xl bg-[#FFE300] px-[18px] py-[14px] text-sm font-bold text-[#1E1E1E] disabled:opacity-40">
                이체하기
            </button>
        </div>
    )
}
