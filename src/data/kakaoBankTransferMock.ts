export type MockBank = {
    id: string
    name: string
}

export const BANKS: MockBank[] = [
    { id: 'kakaobank', name: '카카오뱅크' },
    { id: 'kb', name: 'KB국민은행' },
    { id: 'shinhan', name: '신한은행' },
    { id: 'woori', name: '우리은행' },
    { id: 'nh', name: 'NH농협은행' },
]

export type MockMyAccount = {
    id: string
    label: string
    accountNumber: string
    balance: number
}

export type TransferScenario = {
    myName: string
    myAccountNumber: string
    myBalance: number
    myPassword: string
    myAccounts: MockMyAccount[]
    recipientName: string
    recipientBankId: string
    recipientAccountNumber: string
    amount: number
}

const MY_NAME_POOL = ['김민준', '이서연', '박도윤', '최지우', '정하은']
const RECIPIENT_NAME_POOL = [
    '강태양',
    '윤소미',
    '한지호',
    '오세영',
    '임수아',
]

function pickRandom<T>(pool: T[]): T {
    return pool[Math.floor(Math.random() * pool.length)]
}

function randomDigits(length: number): string {
    let result = ''
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10).toString()
    }
    return result
}

function randomAmount(): number {
    const options = [10000, 30000, 50000, 70000, 100000, 150000, 200000]
    return pickRandom(options)
}

function shuffle<T>(items: T[]): T[] {
    const copy = [...items]
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
}

export function generateScenario(): TransferScenario {
    const amount = randomAmount()
    const myAccountNumber = `3333-${randomDigits(2)}-${randomDigits(7)}`
    const myBalance = amount + randomAmount()

    // 계좌 목록 화면에서 고를 진짜 계좌 하나 + 헷갈리게 하는 가짜 계좌 하나.
    // 순서를 섞어서 항상 첫 번째가 정답이 되지 않게 한다.
    const myAccounts = shuffle([
        {
            id: 'primary',
            label: '입출금통장',
            accountNumber: myAccountNumber,
            balance: myBalance,
        },
        {
            id: 'savings',
            label: '저축예금',
            accountNumber: `3333-${randomDigits(2)}-${randomDigits(7)}`,
            balance: randomAmount() * 3,
        },
    ])

    return {
        myName: pickRandom(MY_NAME_POOL),
        myAccountNumber,
        myBalance,
        myPassword: randomDigits(4),
        myAccounts,
        recipientName: pickRandom(RECIPIENT_NAME_POOL),
        recipientBankId: pickRandom(BANKS).id,
        recipientAccountNumber: randomDigits(11),
        amount,
    }
}

function digitsOnly(value: string): string {
    return value.replace(/[^0-9]/g, '')
}

export function isAccountMatch(
    scenario: TransferScenario,
    accountNumber: string,
): boolean {
    return accountNumber === scenario.myAccountNumber
}

export function isRecipientMatch(
    scenario: TransferScenario,
    bankId: string,
    accountNumberInput: string,
): boolean {
    return (
        bankId === scenario.recipientBankId &&
        digitsOnly(accountNumberInput) === scenario.recipientAccountNumber
    )
}

export function isAmountMatch(
    scenario: TransferScenario,
    amountInput: number,
): boolean {
    return amountInput === scenario.amount
}

export function isPasswordMatch(
    scenario: TransferScenario,
    passwordInput: string,
): boolean {
    return passwordInput === scenario.myPassword
}

export function bankName(bankId: string): string {
    return BANKS.find((bank) => bank.id === bankId)?.name ?? bankId
}
