# 브랜치를 topic 단위 → 해설 속 키워드 단위로 전환

## 배경
지금까지 브랜치는 "윈도우함수/집계함수"라는 큰 topic 단위로 갈라졌음. 사용자 피드백:
메인 흐름은 topic처럼 커도 되지만, 브랜치는 GROUP BY·RANK()처럼 더 작은 단위여야 함.

## 변경 사항
- `Question`에 `keywords: string[]` 추가 — 해설 문장 안에 실제로 등장하는 문자열 그대로
  (예: win-1의 keywords = `["RANK()", "DENSE_RANK()", "ROW_NUMBER()"]`). 20문제 전부 추가,
  모든 키워드가 해당 문제의 explanation 문자열에 실제로 포함되는지 확인함
- `Branch.topic` → `Branch.keyword`로 의미 변경 (Question.topic은 그대로 유지 — 메인 흐름은
  topic 기반이라 안 건드림)
- 해설(`current.explanation`)을 `renderExplanation()`으로 렌더링: keywords 배열의 단어를 찾아
  밑줄 쳐진 클릭 가능한 버튼으로 감쌈. 클릭하면 그 키워드를 가진 다른 문제로 브랜치 생성
  (`drillKeyword`)
- 기존의 단일 "OO 더 풀기" 버튼은 제거. 브랜치 생성은 이제 해설 속 단어 클릭으로만 함
- `canDrillKeyword(keyword)`가 클릭 가능 여부 판정: 브랜치 깊이 5 도달, 조상 브랜치가 이미 쓴
  키워드, 그 키워드를 가진 다른 문제 없음 중 하나라도 해당하면 클릭 불가(그냥 텍스트로 표시)
- `ancestorKeywords()`가 topic 버전의 `ancestorTopics()`를 대체 — 조상 전체가 이미 쓴 키워드는
  중첩 브랜치에서 다시 못 씀
- 브랜치 안에서 "다음 문제" 지연 생성(`goNext`)도 topic 대신 keyword로 후보를 고름

## 건드릴 파일
- `src/data/questions.ts` — Question 타입에 keywords 추가, 20문제 전부에 값 채움
- `src/app/sqld/page.tsx` — Branch.keyword, drillKeyword, canDrillKeyword, ancestorKeywords,
  renderExplanation, goNext의 keywordPool
- `src/lib/storage.ts` — SavedBranch.topic → keyword

## 확인 방법
- 문제 풀고 해설에서 밑줄 쳐진 단어 클릭 → 그 단어를 keywords로 가진 다른 문제로 브랜치 생성
- 후보가 없는 키워드(예: 그 문제에만 있는 키워드)는 밑줄 없이 그냥 텍스트로 보이는지
- 중첩 브랜치에서 조상이 이미 쓴 키워드는 클릭 불가한지
- `npm run build` 통과
