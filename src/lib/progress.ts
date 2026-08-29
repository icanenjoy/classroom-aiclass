export type ExamStatus = 'in_progress' | 'completed'

export type ExamProgress = {
    examId: string
    status: ExamStatus
    startedAt: string
    completedAt: string | null
}

const PROGRESS_KEY = 'sqld_drill_exam_progress_v1'

function readAll(): Record<string, ExamProgress> {
    if (typeof window === 'undefined') return {}
    try {
        const raw = window.localStorage.getItem(PROGRESS_KEY)
        if (!raw) return {}
        const parsed = JSON.parse(raw)
        return parsed && typeof parsed === 'object' ? parsed : {}
    } catch {
        return {}
    }
}

function writeAll(map: Record<string, ExamProgress>): void {
    if (typeof window === 'undefined') return
    try {
        window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(map))
    } catch {
        // localStorage 사용 불가(프라이빗 모드 등) — 저장 없이 그냥 진행
    }
}

export function markExamStarted(examId: string): void {
    const all = readAll()
    const existing = all[examId]
    if (existing) return
    all[examId] = {
        examId,
        status: 'in_progress',
        startedAt: new Date().toISOString(),
        completedAt: null,
    }
    writeAll(all)
}

export function markExamCompleted(examId: string): void {
    const all = readAll()
    const existing = all[examId]
    all[examId] = {
        examId,
        status: 'completed',
        startedAt: existing?.startedAt ?? new Date().toISOString(),
        completedAt: new Date().toISOString(),
    }
    writeAll(all)
}

export function getAllExamProgress(): ExamProgress[] {
    return Object.values(readAll())
}
