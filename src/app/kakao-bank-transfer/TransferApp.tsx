'use client'

import { useState } from 'react'
import { generateScenario, type TransferScenario } from '@/data/kakaoBankTransferMock'
import ScenarioPanel from './ScenarioPanel'
import PhoneFrame from './PhoneFrame'
import StepIntro from './StepIntro'
import StepAccounts from './StepAccounts'
import StepRecipient from './StepRecipient'
import StepAmount from './StepAmount'
import StepConfirm from './StepConfirm'
import StepComplete from './StepComplete'

type Step =
    | 'intro'
    | 'accounts'
    | 'recipient'
    | 'amount'
    | 'confirm'
    | 'complete'

type RecipientInfo = {
    bankId: string
    accountNumber: string
}

type TransferState = {
    step: Step
    recipient: RecipientInfo | null
    amount: number | null
}

const initialState: TransferState = {
    step: 'intro',
    recipient: null,
    amount: null,
}

export default function KakaoBankTransferPractice() {
    // 이 컴포넌트는 page.tsx에서 next/dynamic(ssr:false)으로 클라이언트에서만
    // 렌더링되므로, Math.random() 기반 시나리오를 초기값에서 바로 생성해도
    // 서버/클라이언트 값이 어긋나는 하이드레이션 불일치가 생기지 않는다.
    const [scenario, setScenario] = useState<TransferScenario>(() =>
        generateScenario(),
    )
    const [state, setState] = useState<TransferState>(initialState)

    function handleRestart() {
        setScenario(generateScenario())
        setState(initialState)
    }

    return (
        <main className="mx-auto max-w-5xl px-6 py-10">
            <h1 className="mb-1 text-2xl font-bold text-ink">
                카카오뱅크 송금하는 방법
            </h1>
            <p className="mb-6 text-sm text-muted">
                왼쪽 정보를 보고 그대로 입력해서 송금을 완료해보세요.
            </p>

            {/* 사이드바와 같은 너비의 빈 3번째 칸을 오른쪽에 둬서 가운데 칸(폰 UI)이
                사이드바에 치우치지 않고 화면 정중앙에 오도록 균형을 맞춘다 */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[16rem_1fr_16rem] md:items-start">
                <ScenarioPanel scenario={scenario} />

                <div className="flex justify-center">
                    <PhoneFrame>
                        {state.step === 'intro' && (
                            <StepIntro
                                onNext={() =>
                                    setState((prev) => ({
                                        ...prev,
                                        step: 'accounts',
                                    }))
                                }
                            />
                        )}

                        {state.step === 'accounts' && (
                            <StepAccounts
                                scenario={scenario}
                                onBack={() =>
                                    setState((prev) => ({
                                        ...prev,
                                        step: 'intro',
                                    }))
                                }
                                onNext={() =>
                                    setState((prev) => ({
                                        ...prev,
                                        step: 'recipient',
                                    }))
                                }
                            />
                        )}

                        {state.step === 'recipient' && (
                            <StepRecipient
                                scenario={scenario}
                                onBack={() =>
                                    setState((prev) => ({
                                        ...prev,
                                        step: 'accounts',
                                    }))
                                }
                                onNext={(bankId, accountNumber) =>
                                    setState({
                                        step: 'amount',
                                        recipient: { bankId, accountNumber },
                                        amount: null,
                                    })
                                }
                            />
                        )}

                        {state.step === 'amount' && state.recipient && (
                            <StepAmount
                                scenario={scenario}
                                onBack={() =>
                                    setState((prev) => ({
                                        ...prev,
                                        step: 'recipient',
                                    }))
                                }
                                onNext={(amount) =>
                                    setState((prev) => ({
                                        ...prev,
                                        step: 'confirm',
                                        amount,
                                    }))
                                }
                            />
                        )}

                        {state.step === 'confirm' &&
                            state.recipient &&
                            state.amount !== null && (
                                <StepConfirm
                                    scenario={scenario}
                                    recipientBankId={state.recipient.bankId}
                                    recipientAccountNumber={
                                        state.recipient.accountNumber
                                    }
                                    amount={state.amount}
                                    onBack={() =>
                                        setState((prev) => ({
                                            ...prev,
                                            step: 'amount',
                                        }))
                                    }
                                    onNext={() =>
                                        setState((prev) => ({
                                            ...prev,
                                            step: 'complete',
                                        }))
                                    }
                                />
                            )}

                        {state.step === 'complete' &&
                            state.recipient &&
                            state.amount !== null && (
                                <StepComplete
                                    scenario={scenario}
                                    recipientBankId={state.recipient.bankId}
                                    recipientAccountNumber={
                                        state.recipient.accountNumber
                                    }
                                    amount={state.amount}
                                    onRestart={handleRestart}
                                />
                            )}
                    </PhoneFrame>
                </div>

                <div aria-hidden className="hidden md:block" />
            </div>
        </main>
    )
}
