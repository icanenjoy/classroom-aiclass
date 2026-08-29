'use client'

import { useState } from 'react'
import { isAmountMatch, type TransferScenario } from '@/data/kakaoBankTransferMock'
import NumericKeypad from './NumericKeypad'
import StepHeader from './StepHeader'

const PRESETS = [10000, 50000, 100000]

export default function StepAmount({
    scenario,
    onBack,
    onNext,
}: {
    scenario: TransferScenario
    onBack: () => void
    onNext: (amount: number) => void
}) {
    const [digits, setDigits] = useState('')
    const [error, setError] = useState<string | null>(null)
    const amount = digits.length > 0 ? Number(digits) : 0

    function pressKey(key: string) {
        setError(null)
        if (key === '⌫') {
            setDigits((prev) => prev.slice(0, -1))
            return
        }
        if (digits.length >= 9) return
        setDigits((prev) => (prev === '0' ? key : prev + key))
    }

    function handleNext() {
        if (amount <= 0) {
            setError('금액을 입력해주세요')
            return
        }
        if (amount > scenario.myBalance) {
            setError('잔액이 부족합니다')
            return
        }
        if (!isAmountMatch(scenario, amount)) {
            setError('왼쪽에 주어진 송금액과 일치하지 않습니다')
            return
        }
        onNext(amount)
    }

    return (
        <div className="flex flex-1 flex-col">
            <StepHeader title="얼마를 보낼까요?" onBack={onBack} />

            <p className="text-[13px] font-medium text-[#767676]">
                {scenario.myAccountNumber} · 잔액{' '}
                {scenario.myBalance.toLocaleString()}원
            </p>

            <div className="flex flex-1 items-center justify-center">
                <p className="text-[48px] font-extrabold tracking-[-0.025em] text-[#1E1E1E]">
                    {amount > 0 ? amount.toLocaleString() : '0'}
                    <span className="ml-1 text-2xl text-[#767676]">원</span>
                </p>
            </div>

            {error && (
                <p className="mb-2 text-center text-sm font-medium text-[#FF3838]">
                    {error}
                </p>
            )}

            <div className="mb-3 flex gap-2">
                {PRESETS.map((preset) => (
                    <button
                        key={preset}
                        onClick={() => {
                            setDigits(String(preset))
                            setError(null)
                        }}
                        className="flex-1 rounded-full border border-[#E5E5E5] py-2 text-xs font-bold text-[#1E1E1E]">
                        {preset.toLocaleString()}원
                    </button>
                ))}
            </div>

            <NumericKeypad onPress={pressKey} />

            <button
                onClick={handleNext}
                disabled={amount <= 0}
                className="mt-3 rounded-xl bg-[#FFE300] px-[18px] py-[14px] text-sm font-bold text-[#1E1E1E] disabled:opacity-40">
                다음
            </button>
        </div>
    )
}
