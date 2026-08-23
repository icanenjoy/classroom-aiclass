# 프로젝트
SQLD 함수(윈도우 함수·집계 함수) 문제 반복 학습 서비스. 대상: SQLD 준비생. 지금은 2주 MVP, 프로덕션 아님.

# 실행
개발 npm run dev · 타입 npm run typecheck

# 스택
Next.js + TypeScript. 문제 데이터는 src/data/questions.ts 정적 파일 (임의 변경 금지)

# 스택 변경 이력
- Prisma + SQLite로 시작했으나, Vercel 서버리스는 파일시스템이 대부분 읽기전용이라
  SQLite 파일이 배포에 안 실리는 문제로 첫 배포가 실패함. 문제 데이터가 20개짜리
  읽기전용 정적 데이터라 DB가 굳이 필요 없다고 판단해 정적 TS 파일로 전환함
  (사용자 승인됨). 쓰기/관계형 쿼리가 필요해지기 전까지는 DB를 다시 들이지 않는다.

# 규칙
- 새 의존성 추가 전 반드시 질문할 것
- 커밋은 기능 단위 하나씩
- any 금지 / 주석은 "왜"만 적을 것

# 이 프로젝트의 암묵지
- 해설은 정답만이 아니라 "왜"까지 반드시 포함한다 (부실한 오답노트 경험)
- 이론 설명은 항상 문제 수보다 짧아야 한다 (이론 위주 공부로 토익 실패 경험)
- 오답이 나온 유형은 그 자리에서 "더 풀기"로 이어서 풀 수 있어야 한다

# 하지 말 것
- 로그인/회원가입, 결제, 알림, 관리자 페이지 만들지 않기
- 테스트를 skip 처리해서 통과시키기

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
