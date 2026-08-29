import type { TransferScenario } from '@/data/kakaoBankTransferMock'
import { bankName } from '@/data/kakaoBankTransferMock'

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-0.5 border-b border-line py-2 last:border-b-0">
            <span className="text-[11px] text-muted">{label}</span>
            <span className="text-sm font-semibold text-ink">{value}</span>
        </div>
    )
}

export default function ScenarioPanel({
    scenario,
}: {
    scenario: TransferScenario
}) {
    return (
        <aside className="w-full shrink-0 rounded-md border border-line bg-surface p-4 md:w-64">
            <p className="mb-2 text-xs font-semibold text-muted">
                주어진 정보 — 이대로 입력해보세요
            </p>
            <Row label="내 이름" value={scenario.myName} />
            <Row label="내 계좌번호" value={scenario.myAccountNumber} />
            <Row label="내 계좌 비밀번호" value={scenario.myPassword} />
            <Row label="받는 사람 이름" value={scenario.recipientName} />
            <Row
                label="받는 사람 계좌"
                value={`${bankName(scenario.recipientBankId)} ${scenario.recipientAccountNumber}`}
            />
            <Row
                label="송금액"
                value={`${scenario.amount.toLocaleString()}원`}
            />
        </aside>
    )
}
