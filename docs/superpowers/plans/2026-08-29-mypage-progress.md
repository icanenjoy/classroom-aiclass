# 마이페이지 + 진행 상태(뱃지) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 로그인 없이 localStorage로 "시작함/완료함" 상태를 기록하고, 완료 화면에 뱃지 획득을 보여주며, `/mypage`에서 완수한 과정(뱃지)과 진행 중인 과정을 모아본다.

**Architecture:** `src/lib/progress.ts`가 단일 진행 상태 저장소(localStorage) 역할을 하고, 홈 화면의 `ExamCard`(시작 시점)와 각 시험 화면(SQLD, 카카오뱅크 송금 — 완료 시점)이 이 모듈의 함수를 호출해 기록한다. `/mypage`는 이 저장소와 시험 목록을 조합해서 읽기 전용으로 보여준다.

**Tech Stack:** Next.js(App Router) + TypeScript + React, Tailwind CSS. 새 npm 의존성 없음.

**Spec:** `docs/superpowers/specs/2026-08-29-mypage-progress-design.md`

## Global Constraints

- 이 프로젝트엔 테스트 러너(jest/vitest 등)가 설치돼 있지 않고, `CLAUDE.md` 규칙상 새 의존성 추가는 사용자 승인이 필요하다. 이 계획은 새 의존성을 추가하지 않으며, 각 태스크의 "테스트" 단계는 `npm run typecheck` + 브라우저(수동 또는 Playwright MCP) 확인으로 대체한다.
- `any` 금지. 주석은 "왜"에 해당하는 경우에만 작성한다 (`CLAUDE.md`).
- 커밋은 기능 단위 하나씩 — 각 태스크 끝에 그 태스크만 커밋한다.
- 로그인/회원가입 기능은 만들지 않는다 — 모든 상태는 브라우저 localStorage 기준이다.
- `src/data/questions.ts`는 건드리지 않는다 (`CLAUDE.md`: 임의 변경 금지).

---

### Task 1: 진행 상태 데이터 모델 (`src/lib/progress.ts`)

**Files:**
- Create: `src/lib/progress.ts`

**Interfaces:**
- Produces: `type ExamStatus = 'in_progress' | 'completed'`, `type ExamProgress = { examId: string; status: ExamStatus; startedAt: string; completedAt: string | null }`, `markExamStarted(examId: string): void`, `markExamCompleted(examId: string): void`, `getAllExamProgress(): ExamProgress[]` — 전부 `@/lib/progress`에서 import.

이 태스크는 순수 로직만 추가한다. 함수 내부가 전부 `typeof window === 'undefined'` 가드로 시작해서 Node(브라우저 없는 환경)에서는 사실상 아무 것도 하지 않기 때문에, 의미 있는 동작 검증은 Task 3(ExamCard에 연결)부터 브라우저로 한다. 여기서는 타입체크만 확인한다.

- [ ] **Step 1: 파일 작성**

```ts
// src/lib/progress.ts
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
```

`markExamStarted`가 `existing`이 있으면(진행 중이든 완료든) 아무 것도 하지 않는 이유: 이미 완료된 시험을 다시 시작 화면으로 이동해도 완료 상태를 덮어쓰면 안 되고, 이미 진행 중인 시험도 `startedAt`(최초 시작 시각)을 유지해야 하기 때문.

- [ ] **Step 2: 타입체크**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/lib/progress.ts
git commit -m "feat: 시험 진행 상태(시작/완료) localStorage 저장소 추가"
```

---

### Task 2: 시험 목록을 `src/data/exams.ts`로 분리

**Files:**
- Create: `src/data/exams.ts`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `type Exam` from `@/types/exam` (기존)
- Produces: `export const exams: Exam[]` from `@/data/exams` — Task 6에서 `/mypage`가 이 값을 가져다 쓴다.

지금 `src/app/page.tsx`에 하드코딩된 `const exams: Exam[] = [...]` 배열이 있다(사용자가 챕터/이름을 계속 손보고 있으니, 그 배열의 **현재 내용을 그대로**, 값은 하나도 바꾸지 말고 옮긴다).

- [ ] **Step 1: `src/data/exams.ts` 생성**

`src/app/page.tsx`를 열어서 `const exams: Exam[] = [` 부터 그 배열을 닫는 `]`까지를 그대로 잘라내고, 아래 틀에 붙여넣는다 (배열 안의 각 항목 값은 절대 재작성하지 말고 원본 그대로 옮길 것):

```ts
// src/data/exams.ts
import type { Exam } from '@/types/exam'

export const exams: Exam[] = [
    // ↓ src/app/page.tsx에 있던 배열 내용을 값 변경 없이 그대로 붙여넣기
]
```

- [ ] **Step 2: `src/app/page.tsx`에서 배열 제거하고 import로 교체**

`page.tsx` 상단의 `import type { Exam } from '@/types/exam'`을 지우고 (더 이상 이 파일에서 `Exam` 타입을 직접 쓰지 않음), 대신 아래를 추가:

```ts
import { exams } from '@/data/exams'
```

파일 안에 남아있던 `const exams: Exam[] = [...]` 전체 블록은 삭제한다. `<ExamTabs exams={exams} />` 사용부는 그대로 둔다(이름이 같아서 다른 코드 변경 불필요).

- [ ] **Step 3: 타입체크**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 4: 브라우저 확인**

`npm run dev` 실행 중인 상태에서 `http://localhost:3000` 접속 → 홈 화면이 이전과 완전히 동일하게(탭, 챕터, 카드) 보이는지 확인.

- [ ] **Step 5: 커밋**

```bash
git add src/data/exams.ts src/app/page.tsx
git commit -m "refactor: 시험 목록 배열을 src/data/exams.ts로 분리"
```

---

### Task 3: `ExamCard`에서 "시작하기" 클릭 시 진행 상태 기록

**Files:**
- Modify: `src/components/ExamCard.tsx`

**Interfaces:**
- Consumes: `markExamStarted(examId: string): void` from `@/lib/progress` (Task 1)

**Files 변경 전 현재 내용:**
```tsx
import Link from 'next/link'
import type { Exam } from '@/types/exam'

export function ExamCard({ exam }: { exam: Exam }) {
    if (exam.href) {
        return (
            <Link
                href={exam.href}
                className="block rounded-md border-2 border-accent bg-surface p-6 hover:bg-accent/5">
                <h2 className="text-xl font-bold text-ink">{exam.name}</h2>
                <p className="mt-1 text-sm text-muted">{exam.description}</p>
                <span className="mt-4 inline-block rounded-sm bg-accent px-4 py-2 text-sm font-medium text-white">
                    시작하기
                </span>
            </Link>
        )
    }
    ...
```

- [ ] **Step 1: `'use client'` 추가 + `onClick` 연결**

파일 최상단에 `'use client'`를 추가하고(이 컴포넌트가 이벤트 핸들러를 갖게 되므로 필요), import와 `<Link>`를 아래처럼 바꾼다:

```tsx
'use client'

import Link from 'next/link'
import { markExamStarted } from '@/lib/progress'
import type { Exam } from '@/types/exam'

export function ExamCard({ exam }: { exam: Exam }) {
    if (exam.href) {
        return (
            <Link
                href={exam.href}
                onClick={() => markExamStarted(exam.id)}
                className="block rounded-md border-2 border-accent bg-surface p-6 hover:bg-accent/5">
                <h2 className="text-xl font-bold text-ink">{exam.name}</h2>
                <p className="mt-1 text-sm text-muted">{exam.description}</p>
                <span className="mt-4 inline-block rounded-sm bg-accent px-4 py-2 text-sm font-medium text-white">
                    시작하기
                </span>
            </Link>
        )
    }
```

나머지(비활성 카드 분기)는 그대로 둔다.

- [ ] **Step 2: 타입체크**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 3: 브라우저로 기록 확인**

`npm run dev` 실행 중, 브라우저에서 `http://localhost:3000` 접속 후 개발자 도구 콘솔(또는 Playwright MCP의 `browser_evaluate`)에서 먼저 아래로 초기화:

```js
localStorage.removeItem('sqld_drill_exam_progress_v1')
```

홈 화면에서 SQLD 카드의 "시작하기"를 클릭해 `/sqld`로 이동한 다음, 콘솔에서:

```js
localStorage.getItem('sqld_drill_exam_progress_v1')
```

Expected: `{"sqld":{"examId":"sqld","status":"in_progress","startedAt":"...","completedAt":null}}` 형태의 JSON 문자열이 나온다.

- [ ] **Step 4: 커밋**

```bash
git add src/components/ExamCard.tsx
git commit -m "feat: 시험 카드 시작 클릭 시 진행 상태 기록"
```

---

### Task 4: SQLD 완료 시 진행 상태 갱신 + 뱃지 획득 표시

**Files:**
- Modify: `src/app/sqld/page.tsx`

**Interfaces:**
- Consumes: `markExamCompleted(examId: string): void` from `@/lib/progress` (Task 1)

- [ ] **Step 1: import 추가**

`src/app/sqld/page.tsx` 상단의 다음 import 블록:

```ts
import { defaultAdConfig } from '@/data/adConfig'
```

바로 아래에 한 줄 추가:

```ts
import { markExamCompleted } from '@/lib/progress'
```

- [ ] **Step 2: `done`이 true가 되는 순간 완료 기록**

현재 이런 코드가 있다:

```ts
    const done =
        !activeBranch && mainIndex >= mainFlow.length && mainFlow.length > 0

    function resetProgress() {
        clearSession()
```

`const done = ...` 줄과 `function resetProgress()` 사이에 아래를 추가한다 (다른 훅들과 마찬가지로 조건부 return보다 앞이라 훅 규칙에 위배되지 않음):

```ts
    useEffect(() => {
        if (done) markExamCompleted('sqld')
    }, [done])
```

- [ ] **Step 3: 완료 화면에 뱃지 문구 추가**

현재 완료 화면 코드:

```tsx
                <h1 className="text-2xl font-bold text-ink">
                    SQLD {mainFlow.length}문제를 모두 풀었습니다 🎉
                </h1>
                <p className="text-muted">
                    정답 {correctTotal} / {answeredTotal} ({rate}%)
                </p>
```

`<h1>...</h1>`과 `<p className="text-muted">` 사이에 뱃지 문구를 추가:

```tsx
                <h1 className="text-2xl font-bold text-ink">
                    SQLD {mainFlow.length}문제를 모두 풀었습니다 🎉
                </h1>
                <p className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                    🏅 완수 뱃지 획득!
                </p>
                <p className="text-muted">
                    정답 {correctTotal} / {answeredTotal} ({rate}%)
                </p>
```

- [ ] **Step 4: 타입체크**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 5: 브라우저로 완료 흐름 확인**

30문제를 실제로 다 풀지 않고, 완료 상태를 인위적으로 만들어서 확인한다. 브라우저 콘솔(또는 Playwright MCP `browser_evaluate`)에서:

```js
const res = await fetch('/api/questions')
const data = await res.json()
const firstId = data.questions[0].id
localStorage.setItem('sqld_drill_session_v1', JSON.stringify({
    mainFlowIds: [firstId],
    mainResults: [{ selectedIndex: 0, correct: true }],
    mainIndex: 1,
    branches: {},
    activeStack: [],
}))
```

그 다음 `/sqld`로 이동(또는 새로고침). Expected:
- "SQLD 1문제를 모두 풀었습니다 🎉" 완료 화면과 "🏅 완수 뱃지 획득!" 문구가 보인다.
- 콘솔에서 `localStorage.getItem('sqld_drill_exam_progress_v1')`을 찍으면 `sqld` 항목의 `status`가 `"completed"`이고 `completedAt`이 채워져 있다.

확인 후 `localStorage.removeItem('sqld_drill_session_v1')`로 테스트용 세션을 정리한다.

- [ ] **Step 6: 커밋**

```bash
git add src/app/sqld/page.tsx
git commit -m "feat: SQLD 완료 시 진행 상태 완료 처리 + 뱃지 획득 표시"
```

---

### Task 5: 카카오뱅크 송금 완료 시 진행 상태 갱신 + 뱃지 획득 표시

**Files:**
- Modify: `src/app/kakao-bank-transfer/TransferApp.tsx`
- Modify: `src/app/kakao-bank-transfer/StepComplete.tsx`

**Interfaces:**
- Consumes: `markExamCompleted(examId: string): void` from `@/lib/progress` (Task 1)

- [ ] **Step 1: `TransferApp.tsx`에 완료 감지 추가**

현재 파일 상단:

```tsx
'use client'

import { useState } from 'react'
import { generateScenario, type TransferScenario } from '@/data/kakaoBankTransferMock'
```

아래처럼 바꾼다 (`useEffect` 추가, `markExamCompleted` import 추가):

```tsx
'use client'

import { useEffect, useState } from 'react'
import { generateScenario, type TransferScenario } from '@/data/kakaoBankTransferMock'
import { markExamCompleted } from '@/lib/progress'
```

현재 이런 코드가 있다:

```tsx
    const [state, setState] = useState<TransferState>(initialState)

    function handleRestart() {
```

`const [state, setState] = useState<TransferState>(initialState)`와 `function handleRestart()` 사이에 추가:

```tsx
    useEffect(() => {
        if (state.step === 'complete') markExamCompleted('kakao-bank-transfer')
    }, [state.step])
```

- [ ] **Step 2: `StepComplete.tsx`에 뱃지 문구 추가**

현재 코드:

```tsx
            <p className="rounded-full bg-[#FFFBE0] px-2.5 py-0.5 text-[11px] font-bold text-[#807200]">
                실제로 이체되지 않았습니다 · 연습 화면입니다
            </p>

            <div className="mt-2 flex w-full flex-col gap-2">
```

그 사이에 뱃지 문구를 추가:

```tsx
            <p className="rounded-full bg-[#FFFBE0] px-2.5 py-0.5 text-[11px] font-bold text-[#807200]">
                실제로 이체되지 않았습니다 · 연습 화면입니다
            </p>
            <p className="rounded-full bg-[#EAF6FF] px-2.5 py-0.5 text-[11px] font-bold text-[#0B74C4]">
                🏅 완수 뱃지 획득!
            </p>

            <div className="mt-2 flex w-full flex-col gap-2">
```

- [ ] **Step 3: 타입체크**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 4: 브라우저로 전체 플로우 확인**

`/kakao-bank-transfer`로 이동해 "시작하기" → 화면 왼쪽 시나리오 패널에 표시된 계좌를 선택 → 시나리오에 표시된 은행/계좌번호를 입력하고 "예금주 조회" → 시나리오 금액만큼 입력 → 화면에 표시된 비밀번호(또는 시나리오가 알려주는 값)로 확인까지 끝까지 진행한다.

Expected:
- StepComplete 화면에 "🏅 완수 뱃지 획득!" 문구가 보인다.
- 콘솔에서 `localStorage.getItem('sqld_drill_exam_progress_v1')` → `kakao-bank-transfer` 항목의 `status`가 `"completed"`.

- [ ] **Step 5: 커밋**

```bash
git add src/app/kakao-bank-transfer/TransferApp.tsx src/app/kakao-bank-transfer/StepComplete.tsx
git commit -m "feat: 카카오뱅크 송금 실습 완료 시 진행 상태 완료 처리 + 뱃지 획득 표시"
```

---

### Task 6: `/mypage` 화면 + 홈 화면 진입 링크

**Files:**
- Create: `src/app/mypage/page.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `getAllExamProgress(): ExamProgress[]`, `type ExamProgress` from `@/lib/progress` (Task 1); `exams: Exam[]` from `@/data/exams` (Task 2); `ExamCard` from `@/components/ExamCard` (Task 3); `type Exam` from `@/types/exam`

- [ ] **Step 1: `/mypage` 화면 작성**

```tsx
// src/app/mypage/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ExamCard } from '@/components/ExamCard'
import { exams } from '@/data/exams'
import { getAllExamProgress, type ExamProgress } from '@/lib/progress'
import type { Exam } from '@/types/exam'

function CompletedBadge({
    exam,
    completedAt,
}: {
    exam: Exam
    completedAt: string | null
}) {
    return (
        <div className="flex items-center gap-3 rounded-md border border-line bg-surface p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-lg">
                🏅
            </span>
            <div>
                <p className="font-bold text-ink">{exam.name}</p>
                <p className="text-xs text-muted">
                    {completedAt
                        ? `${new Date(completedAt).toLocaleDateString('ko-KR')} 완수`
                        : '완수'}
                </p>
            </div>
        </div>
    )
}

export default function MyPage() {
    const [progress, setProgress] = useState<ExamProgress[]>([])

    useEffect(() => {
        setProgress(getAllExamProgress())
    }, [])

    const byId = new Map(exams.map((exam) => [exam.id, exam]))

    const completed = progress
        .filter((p) => p.status === 'completed')
        .map((p) => ({ progress: p, exam: byId.get(p.examId) }))
        .filter(
            (entry): entry is { progress: ExamProgress; exam: Exam } =>
                !!entry.exam,
        )

    const inProgress = progress
        .filter((p) => p.status === 'in_progress')
        .map((p) => byId.get(p.examId))
        .filter((exam): exam is Exam => !!exam)

    return (
        <main className="mx-auto w-full max-w-6xl px-6 py-10">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-ink">마이페이지</h1>
                <Link href="/" className="text-sm text-muted underline">
                    ← 시험 선택으로
                </Link>
            </div>

            <section className="mb-10">
                <h2 className="mb-3 text-xs font-semibold text-muted">
                    완수한 과정
                </h2>
                {completed.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {completed.map(({ exam, progress: p }) => (
                            <CompletedBadge
                                key={exam.id}
                                exam={exam}
                                completedAt={p.completedAt}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted">
                        아직 완수한 과정이 없어요.
                    </p>
                )}
            </section>

            <section>
                <h2 className="mb-3 text-xs font-semibold text-muted">
                    진행 중인 과정
                </h2>
                {inProgress.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {inProgress.map((exam) => (
                            <ExamCard key={exam.id} exam={exam} />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted">
                        진행 중인 과정이 없어요.
                    </p>
                )}
            </section>
        </main>
    )
}
```

- [ ] **Step 2: 홈 화면에 "마이페이지" 링크 추가**

`src/app/page.tsx`에서 (Task 2 이후 기준) 현재 이런 형태다:

```tsx
import AdSenseBanner from '@/components/AdSenseBanner'
import { ExamTabs } from '@/components/ExamTabs'
import { defaultAdConfig } from '@/data/adConfig'
import { exams } from '@/data/exams'
```

상단에 `Link` import를 추가:

```tsx
import Link from 'next/link'
import AdSenseBanner from '@/components/AdSenseBanner'
import { ExamTabs } from '@/components/ExamTabs'
import { defaultAdConfig } from '@/data/adConfig'
import { exams } from '@/data/exams'
```

`<h1>` 줄(제목 텍스트는 현재 파일에 있는 그대로 유지 — 재작성하지 말 것)을 찾아서, 그 `<h1>...</h1>` 태그 전체를 아래처럼 flex 컨테이너로 감싸고 옆에 링크를 추가한다:

```tsx
            <div className="mb-1 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-ink">
                    (기존 h1 안의 텍스트를 그대로 유지)
                </h1>
                <Link href="/mypage" className="text-sm text-muted underline">
                    마이페이지
                </Link>
            </div>
```

(`mb-1` 클래스는 원래 `<h1>`에 있던 걸 바깥 `<div>`로 옮긴 것 — `<h1>` 자체의 `className`에서는 `mb-1`을 빼도 되고 그대로 둬도 시각적으로 큰 차이 없음. 기존 `<h1>` 텍스트 내용은 절대 다른 문구로 바꾸지 말 것.)

- [ ] **Step 3: 타입체크**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 4: 브라우저로 전체 확인**

1. `localStorage.clear()`로 초기화 후 `/mypage` 접속 → "아직 완수한 과정이 없어요." / "진행 중인 과정이 없어요." 둘 다 보이는지
2. 홈에서 SQLD "시작하기" 클릭 → `/mypage`에서 "진행 중인 과정"에 SQLD 카드가 보이는지 (완수한 과정은 비어있음)
3. Task 4의 Step 5 방법으로 SQLD를 완료 상태로 만든 뒤 `/mypage` 재방문 → SQLD가 "완수한 과정"에 뱃지 카드로 뜨고, "진행 중인 과정"에서는 빠졌는지
4. 홈 화면 제목 옆 "마이페이지" 링크 클릭이 `/mypage`로 정상 이동하는지

- [ ] **Step 5: 커밋**

```bash
git add src/app/mypage/page.tsx src/app/page.tsx
git commit -m "feat: 마이페이지 화면 추가 (완수 뱃지 + 진행 중인 과정)"
```
