> 배포 URL: (Vercel 배포 후 이 줄에 기록)

# SQLD 함수 문제 반복 학습

SQLD 준비생을 위한 SQL 함수(윈도우 함수·집계 함수) 문제 반복 학습 MVP. 이론을 읽는 대신 문제를 풀고, 상세한 해설로 바로 이해하고, 약한 유형은 "더 풀기"로 이어서 반복한다.

자세한 배경과 범위는 [`PRD.md`](./PRD.md), 프로젝트 규칙과 암묵지는 [`CLAUDE.md`](./CLAUDE.md) 참고.

## 시작하기

```bash
npm install
npx prisma migrate dev   # 최초 1회: SQLite DB 생성
npm run seed              # 문제 20개 시드
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인.

## 스택

Next.js (App Router) + TypeScript + Prisma + SQLite (`@prisma/adapter-better-sqlite3`)

## 검증

```bash
npm run typecheck
```
