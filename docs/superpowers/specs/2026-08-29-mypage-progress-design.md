# 마이페이지 + 진행 상태(뱃지) 설계

## 배경

지금까지 홈 화면은 시험 카드를 보여주고 클릭하면 바로 해당 시험 화면으로 이동하는
것만 지원했다. 사용자가 "저번에 말했던" 완수 뱃지 — 어떤 시험을 완료하면 뱃지를
얻고, 마이페이지에서 완수한 과정과 진행 중인 과정을 모아볼 수 있어야 한다는 요청.
로그인 기능은 아직 만들지 않으므로 전부 브라우저(localStorage) 기준으로 동작한다.

목표: 로그인 없이, (1) 사용자가 "시작하기"를 누른 시험을 "진행 중"으로 기록하고,
(2) 시험을 완료하면 "완수"로 전환하며 그 화면에서 즉시 뱃지 획득을 보여주고,
(3) `/mypage`에서 완수한 과정(뱃지)과 진행 중인 과정을 모아본다.

## 데이터 모델 — `src/lib/progress.ts` (신규)

`src/lib/storage.ts`와 동일하게 모든 접근을 try/catch로 감싼 localStorage 래퍼로
구현한다 (SSR 시 `window` 없음 / 프라이빗 모드에서 접근 실패 시 조용히 무시).

```ts
export type ExamStatus = 'in_progress' | 'completed'

export type ExamProgress = {
  examId: string
  status: ExamStatus
  startedAt: string   // ISO
  completedAt: string | null
}

const PROGRESS_KEY = 'sqld_drill_exam_progress_v1'
// 내부 저장 형태: Record<string, ExamProgress> (examId -> ExamProgress)

function readAll(): Record<string, ExamProgress>   // 비공개
function writeAll(map: Record<string, ExamProgress>): void  // 비공개

export function markExamStarted(examId: string): void
export function markExamCompleted(examId: string): void
export function getAllExamProgress(): ExamProgress[]
```

- `markExamStarted`: 해당 examId 항목이 없으면 `{status:'in_progress', startedAt:now, completedAt:null}`로 새로 만든다. 이미 `completed` 상태면 그대로 둔다(다운그레이드하지 않음). 이미 `in_progress`면 startedAt을 갱신하지 않는다(최초 시작 시각 유지).
- `markExamCompleted`: 기존 항목이 있으면 `status:'completed'`, `completedAt:now`로 갱신(startedAt은 유지). 기존 항목이 없으면(예: 세션 복원 없이 바로 완료 화면에 온 극단적 경우) startedAt도 now로 새로 만든다.
- `getAllExamProgress`: 저장된 모든 항목을 배열로 반환. 마이페이지에서 이 결과와 `exams` 목록을 examId로 매칭한다.
- 완료된 시험을 다시 풀거나(SQLD "초기화"/"다시 풀기"), 실습을 재시작해도(카카오뱅크 "다시 연습하기") 진행 상태 자체는 건드리지 않는다 — 한번 완수하면 계속 완수로 남는다. (초기화 버튼들은 각 화면 자체의 세션만 리셋하고 `progress.ts`를 호출하지 않는다.)

## 기록 시점

1. **시작**: `src/components/ExamCard.tsx` — 현재 서버에서도 렌더될 수 있는 순수 컴포넌트라 최상단에 `'use client'`를 추가하고, `href`가 있는 카드의 `<Link>`에 `onClick={() => markExamStarted(exam.id)}`를 붙인다. 링크 이동 자체는 막지 않고 기록만 먼저 한다.
2. **완료 — SQLD**: `src/app/sqld/page.tsx`에 이미 `done = !activeBranch && mainIndex >= mainFlow.length && mainFlow.length > 0` (L205-206)가 있다. 이 값 바로 아래에 `useEffect(() => { if (done) markExamCompleted('sqld') }, [done])`를 추가한다. 조건부 return(`if (loading)`, `if (done)`) 이전, 다른 훅들과 같은 위치에 두어 훅 규칙을 지킨다.
3. **완료 — 카카오뱅크 송금**: `src/app/kakao-bank-transfer/TransferApp.tsx`의 `state.step`이 `'complete'`가 되는 시점을 `useEffect(() => { if (state.step === 'complete') markExamCompleted('kakao-bank-transfer') }, [state.step])`로 감지한다.

## 뱃지 획득 표시 (완료 화면에 즉시)

- **SQLD** (`src/app/sqld/page.tsx` L527-554, `done` 분기): 제목 위/아래에 뱃지 획득 문구를 한 줄 추가한다. 예: `🏅 완수 뱃지 획득!`을 `accent` 색 배지 형태로 (기존 톤 유지: `rounded-sm bg-accent px-3 py-1 text-xs text-white` 등).
- **카카오뱅크** (`src/app/kakao-bank-transfer/StepComplete.tsx`): "실제로 이체되지 않았습니다" 배지 근처에 같은 톤으로 뱃지 획득 문구를 추가한다. 이 컴포넌트는 은행 앱을 흉내낸 자체 색상 팔레트(`#1AAD5C`, `#FFE300` 등)를 쓰므로 그 팔레트에 맞춰 작은 배지 칩을 하나 더 넣는다.
- 두 화면 모두 "완료 상태에 도달했을 때는 항상" 뱃지 문구를 보여준다 — "최초 완료 1회만" 같은 별도 판정은 하지 않는다(단순함 우선, 이미 완수한 시험을 다시 풀어도 뱃지 문구가 다시 보이는 것은 자연스러운 축하 메시지로 취급).

## `/mypage` 화면 (신규)

- `exams` 배열을 재사용해야 하므로 `src/app/page.tsx`에 있던 배열을 `src/data/exams.ts`로 옮기고, `page.tsx`와 `mypage/page.tsx` 양쪽에서 `import { exams } from '@/data/exams'`로 가져온다. (`Exam`/`Category` 타입은 그대로 `src/types/exam.ts`에 유지)
- `src/app/mypage/page.tsx`: `'use client'` (localStorage 읽어야 함). `getAllExamProgress()`로 진행 상태를 가져와 `exams`와 `examId`로 매칭한다.
  - **완수한 과정**: `status === 'completed'`인 시험들을 뱃지 스타일 카드로 표시 — 메달 아이콘(🏅) + 시험 이름 + 완료일(`completedAt`을 `toLocaleDateString('ko-KR')`로). 기존 `ExamCard`와는 다른, 좀 더 컴팩트하고 원형/뱃지 느낌의 마크업을 새로 짠다(둥근 배지 톤: `rounded-full` 아이콘 원 + 텍스트). 없으면 "아직 완수한 과정이 없어요."
  - **진행 중인 과정**: `status === 'in_progress'`인 시험들을 기존 `ExamCard` 그대로 재사용해서 그리드로 보여준다(클릭하면 이어서 진행 — SQLD는 이미 자체 localStorage 세션으로 이어풀기를 지원하므로 추가 작업 불필요). 없으면 "진행 중인 과정이 없어요."
  - 두 섹션 다 챕터/탭 구분 없이 완료 시각·시작 시각 순으로 단순 나열(현재 시험 수가 적어 탭이 필요 없음 — 늘어나면 나중에 챕터처럼 나눌 수 있음).
- `src/app/page.tsx`: 제목(`시험을 선택하세요`) 옆에 "마이페이지" 텍스트 링크를 추가한다(`Link href="/mypage"`).

## 에러 처리

- `progress.ts`의 모든 함수는 `storage.ts`와 동일하게 `typeof window === 'undefined'`와 try/catch로 방어한다 — 실패해도 화면이 깨지지 않고 그냥 "진행 중/완수 없음"으로 보인다.
- `getAllExamProgress()`가 반환한 `examId`가 현재 `exams` 배열에 없는 경우(예전에 있다가 삭제된 시험) 마이페이지에서는 그 항목을 무시한다(매칭 안 되면 렌더링하지 않음).

## 확인 방법

- `npm run typecheck`
- 브라우저로 직접 확인:
  1. 홈에서 SQLD "시작하기" 클릭 → `/mypage`에 "진행 중인 과정"으로 SQLD가 뜨는지
  2. SQLD 30문제를 다 풀고 완료 화면에서 뱃지 획득 문구가 보이는지 → `/mypage`에서 SQLD가 "완수한 과정"으로 옮겨갔는지 (진행 중 목록에서는 빠짐)
  3. 카카오뱅크 송금 실습을 끝까지 진행 → StepComplete 화면에 뱃지 문구, `/mypage`에 반영되는지
  4. localStorage를 비우고 새로고침 → 마이페이지가 "완수한 과정이 없어요" / "진행 중인 과정이 없어요" 빈 상태로 정상 표시되는지
