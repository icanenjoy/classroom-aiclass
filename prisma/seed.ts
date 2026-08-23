import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

type Seed = {
  topic: "윈도우함수" | "집계함수";
  questionText: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  difficulty: number;
};

const questions: Seed[] = [
  {
    topic: "윈도우함수",
    questionText:
      "부서별 급여 순위를 매기는데, 급여가 같으면 같은 순위를 주고 다음 순위를 건너뛰고 싶다. 사용할 함수는?",
    choices: ["ROW_NUMBER()", "RANK()", "DENSE_RANK()", "NTILE()"],
    answerIndex: 1,
    explanation:
      "RANK()는 동점에게 같은 순위를 주고, 그 다음 순위를 동점 인원 수만큼 건너뜁니다(1,2,2,4). DENSE_RANK()는 건너뛰지 않고(1,2,2,3), ROW_NUMBER()는 동점이어도 무조건 순번을 다르게 매깁니다(1,2,3,4). '건너뛴다'는 조건이 핵심이라 RANK가 정답입니다.",
    difficulty: 1,
  },
  {
    topic: "윈도우함수",
    questionText:
      "동점자에게 같은 순위를 주되, 다음 순위를 건너뛰지 않고 연속된 번호를 매기고 싶다면?",
    choices: ["RANK()", "DENSE_RANK()", "ROW_NUMBER()", "SUM() OVER()"],
    answerIndex: 1,
    explanation:
      "DENSE_RANK()는 동점자에게 같은 순위를 주지만 다음 순위는 건너뛰지 않고 바로 이어집니다(1,2,2,3). RANK()와 헷갈리기 쉬운데, '건너뛴다/안 건너뛴다'가 둘을 구분하는 유일한 기준입니다.",
    difficulty: 1,
  },
  {
    topic: "윈도우함수",
    questionText:
      "동점 여부와 상관없이 무조건 1,2,3,4처럼 고유한 순번을 매기고 싶을 때 쓰는 함수는?",
    choices: ["RANK()", "DENSE_RANK()", "ROW_NUMBER()", "LAG()"],
    answerIndex: 2,
    explanation:
      "ROW_NUMBER()는 정렬 기준값이 같아도 무조건 서로 다른 순번을 하나씩 부여합니다. 동점 처리를 전혀 하지 않는다는 점이 RANK/DENSE_RANK와 다릅니다.",
    difficulty: 1,
  },
  {
    topic: "윈도우함수",
    questionText:
      "다음 SQL에서 PARTITION BY가 하는 역할로 가장 정확한 설명은?\nSELECT dept, name, salary,\n  RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk\nFROM employee;",
    choices: [
      "전체 결과를 dept 컬럼 기준으로 오름차순 정렬한다",
      "dept가 같은 행끼리 하나의 그룹으로 묶어, 그룹별로 순위를 처음부터 다시 매긴다",
      "dept가 NULL인 행을 제외하고 계산한다",
      "GROUP BY처럼 dept별로 행 개수를 1개로 줄인다",
    ],
    answerIndex: 1,
    explanation:
      "PARTITION BY는 GROUP BY처럼 행을 압축하지 않고, 윈도우 함수의 계산 범위만 그룹 단위로 나눕니다. 즉 부서(dept)마다 순위(RANK)가 1부터 새로 시작됩니다. 원본 행 수는 그대로 유지된다는 점이 GROUP BY와의 가장 큰 차이입니다.",
    difficulty: 2,
  },
  {
    topic: "윈도우함수",
    questionText:
      "SUM(salary) OVER (PARTITION BY dept ORDER BY hire_date) 와 같이 ORDER BY가 함께 있는 누적 합계는 무엇을 의미하는가?",
    choices: [
      "부서 전체 급여 합계를 모든 행에 동일하게 표시한다",
      "입사일 순으로 정렬했을 때, 현재 행까지의 누적 급여 합계를 표시한다",
      "부서별 평균 급여를 표시한다",
      "가장 최근 입사자의 급여만 표시한다",
    ],
    answerIndex: 1,
    explanation:
      "ORDER BY 없이 PARTITION BY만 쓰면 파티션 전체 합계가 모든 행에 동일하게 나오지만(디폴트 프레임이 전체 파티션), ORDER BY가 추가되면 기본 프레임이 '파티션 시작부터 현재 행까지'로 바뀌어 누적(running total) 합계가 됩니다. ORDER BY 유무가 결과를 완전히 바꾼다는 게 시험에서 자주 나오는 함정입니다.",
    difficulty: 3,
  },
  {
    topic: "윈도우함수",
    questionText:
      "각 직원의 급여와, 같은 부서에서 바로 이전에 입사한 직원의 급여를 한 행에 같이 보고 싶다. 사용할 함수는?",
    choices: ["LAG()", "LEAD()", "FIRST_VALUE()", "RANK()"],
    answerIndex: 0,
    explanation:
      "LAG()는 현재 행 기준으로 이전(과거) 행의 값을 가져오고, LEAD()는 다음(미래) 행의 값을 가져옵니다. '이전 입사자'라는 조건이 핵심이라 LAG가 정답입니다. LAG/LEAD를 반대로 외워서 틀리는 경우가 많습니다.",
    difficulty: 2,
  },
  {
    topic: "윈도우함수",
    questionText:
      "다음 중 파티션 내에서 다음 순번 행의 값을 가져오는 함수는?",
    choices: ["LAG()", "LEAD()", "NTH_VALUE()", "SUM() OVER()"],
    answerIndex: 1,
    explanation:
      "LEAD()는 현재 행 기준으로 지정한 만큼 뒤(다음)에 있는 행의 값을 가져옵니다. 전월 대비, 익월 대비 값을 비교할 때 LAG/LEAD를 함께 자주 씁니다.",
    difficulty: 2,
  },
  {
    topic: "윈도우함수",
    questionText:
      "전체 사원을 급여 순으로 4개 그룹으로 균등하게 나누고 싶을 때(4분위) 쓰는 함수는?",
    choices: ["RANK()", "NTILE(4)", "ROW_NUMBER()", "PARTITION BY(4)"],
    answerIndex: 1,
    explanation:
      "NTILE(n)은 결과 집합을 지정한 n개의 그룹으로 최대한 균등하게 나누고 그룹 번호를 반환합니다. NTILE(4)는 상위 25%, 25~50% 같은 분위수 분석에 쓰입니다. PARTITION BY(4) 같은 문법은 존재하지 않습니다.",
    difficulty: 2,
  },
  {
    topic: "윈도우함수",
    questionText:
      "GROUP BY와 윈도우 함수(OVER절)의 가장 근본적인 차이는 무엇인가?",
    choices: [
      "GROUP BY는 정렬을 지원하지 않는다",
      "GROUP BY는 그룹당 한 행으로 결과를 압축하지만, 윈도우 함수는 원본 행 수를 그대로 유지하며 각 행에 집계값을 붙여준다",
      "윈도우 함수는 SELECT 절에서 쓸 수 없다",
      "GROUP BY는 SQLite에서 지원하지 않는다",
    ],
    answerIndex: 1,
    explanation:
      "이 문제가 윈도우 함수 챕터에서 가장 중요한 개념입니다. GROUP BY는 '개별 행 + 그룹별 합계'를 동시에 보여줄 수 없지만(그룹당 1행으로 축소됨), 윈도우 함수는 원본 행을 그대로 두고 그 옆에 집계/순위 컬럼을 추가로 붙여줍니다. 그래서 '개별 데이터도 보고 싶고 순위/누적합도 같이 보고 싶다'는 요구에는 윈도우 함수를 씁니다.",
    difficulty: 2,
  },
  {
    topic: "윈도우함수",
    questionText:
      "부서별로 급여가 가장 높은 직원 1명씩만 조회하려고 한다. 가장 적절한 방법은?",
    choices: [
      "GROUP BY dept, MAX(salary)로 바로 조회한다",
      "RANK() OVER (PARTITION BY dept ORDER BY salary DESC)를 서브쿼리로 감싼 뒤 rnk = 1인 행만 필터링한다",
      "ORDER BY salary DESC LIMIT 1만 사용한다",
      "HAVING salary = MAX(salary)를 조건 없이 사용한다",
    ],
    answerIndex: 1,
    explanation:
      "부서별 최고 급여 '직원 정보 전체'가 필요하면(이름 등 다른 컬럼 포함) GROUP BY + MAX만으로는 부족합니다(집계 안 한 컬럼을 같이 조회 못함). RANK()를 PARTITION BY dept로 매긴 뒤 바깥 쿼리에서 rnk=1인 행만 골라내는 것이 '부서별 TOP-N' 문제의 표준 패턴입니다.",
    difficulty: 3,
  },
  {
    topic: "집계함수",
    questionText: "COUNT(*)와 COUNT(컬럼명)의 차이로 옳은 것은?",
    choices: [
      "차이가 없다",
      "COUNT(*)는 NULL을 포함한 전체 행 수를 세고, COUNT(컬럼명)은 해당 컬럼이 NULL이 아닌 행만 센다",
      "COUNT(컬럼명)이 항상 더 큰 값을 반환한다",
      "COUNT(*)는 중복을 자동으로 제거한다",
    ],
    answerIndex: 1,
    explanation:
      "COUNT(*)는 행 자체의 개수를 세므로 NULL과 무관하게 전체 행 수가 나옵니다. 반면 COUNT(컬럼명)은 그 컬럼 값이 NULL인 행을 세지 않습니다. 이 차이 때문에 두 결과가 다르게 나오는 문제가 SQLD에 자주 출제됩니다.",
    difficulty: 1,
  },
  {
    topic: "집계함수",
    questionText: "SUM(), AVG() 같은 집계 함수가 NULL 값을 만났을 때의 기본 동작은?",
    choices: [
      "NULL을 0으로 취급해서 계산한다",
      "NULL이 하나라도 있으면 결과 전체가 NULL이 된다",
      "NULL인 행은 계산에서 제외하고, 나머지 값들로만 계산한다",
      "오류가 발생해서 쿼리가 실패한다",
    ],
    answerIndex: 2,
    explanation:
      "SUM, AVG, MAX, MIN, COUNT(컬럼) 등 대부분의 집계 함수는 NULL 값을 자동으로 무시(제외)하고 나머지 값만으로 계산합니다. 'NULL=0'이라고 착각하기 쉬운데, 특히 AVG()는 분모(개수)에도 NULL 행이 포함되지 않으므로 평균값이 예상과 달라질 수 있습니다.",
    difficulty: 2,
  },
  {
    topic: "집계함수",
    questionText:
      "GROUP BY로 묶은 그룹 중에서, 그룹별 합계가 조건을 만족하는 그룹만 걸러내고 싶다. 사용할 절은?",
    choices: ["WHERE", "HAVING", "ORDER BY", "QUALIFY"],
    answerIndex: 1,
    explanation:
      "WHERE는 GROUP BY로 묶기 '전' 개별 행을 필터링하고, HAVING은 GROUP BY로 묶은 '이후' 집계 결과(예: SUM, COUNT)를 조건으로 필터링합니다. 'SUM(salary) > 5000000인 부서만' 같은 조건은 반드시 HAVING을 써야 합니다.",
    difficulty: 1,
  },
  {
    topic: "집계함수",
    questionText:
      "다음 쿼리가 오류 없이 실행되지 않는 이유는?\nSELECT dept, name, SUM(salary)\nFROM employee\nGROUP BY dept;",
    choices: [
      "SUM() 함수는 GROUP BY와 함께 쓸 수 없다",
      "SELECT 절에 있는 name 컬럼이 GROUP BY 절에도, 집계 함수 안에도 없어서 값이 하나로 정해지지 않는다",
      "dept 컬럼은 GROUP BY에 쓸 수 없다",
      "SUM(salary)에는 별칭(AS)이 반드시 필요하다",
    ],
    answerIndex: 1,
    explanation:
      "GROUP BY를 쓰면 SELECT 절에는 (1) GROUP BY에 명시된 컬럼과 (2) 집계 함수로 감싼 컬럼만 올 수 있습니다. name은 부서 안에서 여러 값을 가질 수 있는데 어떤 name을 보여줘야 할지 정해지지 않으므로 표준 SQL에서는 오류입니다(DBMS에 따라 허용하기도 하지만 결과가 비결정적이라 SQLD에서는 오류로 간주).",
    difficulty: 2,
  },
  {
    topic: "집계함수",
    questionText: "다음 중 GROUP BY 없이 단독으로 사용해도 항상 결과가 1행만 나오는 함수 조합은?",
    choices: [
      "SELECT dept, MAX(salary) FROM employee;",
      "SELECT MAX(salary), MIN(salary), COUNT(*) FROM employee;",
      "SELECT dept, name FROM employee;",
      "SELECT * FROM employee WHERE salary > AVG(salary);",
    ],
    answerIndex: 1,
    explanation:
      "GROUP BY 없이 집계 함수만 SELECT에 나열하면 테이블 전체를 하나의 그룹으로 보고 결과가 항상 1행으로 나옵니다. 반대로 dept처럼 집계 안 된 컬럼이 섞이면(①) GROUP BY 없이는 오류입니다. ④는 WHERE 절에 집계 함수를 직접 쓸 수 없어 오류입니다(집계 결과로 필터링하려면 서브쿼리나 HAVING 필요).",
    difficulty: 2,
  },
  {
    topic: "집계함수",
    questionText: "GROUP BY 절에서 여러 컬럼(dept, position)으로 묶으면 그룹은 어떻게 나뉘는가?",
    choices: [
      "dept만 기준으로 그룹이 나뉘고 position은 무시된다",
      "dept와 position의 조합(조합값)이 같은 행끼리 하나의 그룹이 된다",
      "dept, position 각각 별도의 결과셋 두 개가 나온다",
      "position만 기준으로 그룹이 나뉜다",
    ],
    answerIndex: 1,
    explanation:
      "GROUP BY에 여러 컬럼을 나열하면 나열된 컬럼 값의 '조합'이 동일한 행끼리 하나의 그룹으로 묶입니다. 예를 들어 (개발팀, 사원)과 (개발팀, 대리)는 dept가 같아도 서로 다른 그룹입니다.",
    difficulty: 1,
  },
  {
    topic: "집계함수",
    questionText:
      "COUNT(DISTINCT dept)는 무엇을 계산하는가?",
    choices: [
      "dept 값이 NULL이 아닌 전체 행 수",
      "dept의 중복을 제거한 서로 다른 부서의 개수",
      "부서별 인원 수를 부서마다 각각 반환",
      "전체 테이블의 행 수",
    ],
    answerIndex: 1,
    explanation:
      "DISTINCT는 중복 값을 하나로 합치므로, COUNT(DISTINCT dept)는 '서로 다른 부서가 몇 개 있는가'를 셉니다. 부서별 인원수(③)를 구하려면 GROUP BY dept와 COUNT(*)를 함께 써야 합니다.",
    difficulty: 1,
  },
  {
    topic: "집계함수",
    questionText:
      "부서별 평균 급여가 전체 평균 급여보다 높은 부서만 조회하려고 한다. 가장 적절한 절 조합은?",
    choices: [
      "WHERE dept AND AVG(salary)",
      "GROUP BY dept ... HAVING AVG(salary) > (SELECT AVG(salary) FROM employee)",
      "ORDER BY AVG(salary) DESC LIMIT 1",
      "WHERE salary > AVG(salary) GROUP BY dept",
    ],
    answerIndex: 1,
    explanation:
      "부서별 집계값(AVG)을 기준으로 그룹을 필터링해야 하므로 HAVING을 쓰고, '전체 평균'은 서브쿼리로 따로 구해서 비교합니다. WHERE 절에는 집계 함수를 직접 쓸 수 없다는 점이 오답 ④를 걸러내는 포인트입니다.",
    difficulty: 3,
  },
  {
    topic: "윈도우함수",
    questionText:
      "윈도우 함수는 SQL 실행 순서상 어느 단계 근처에서 처리되는가?",
    choices: [
      "FROM/WHERE보다 먼저 처리된다",
      "WHERE, GROUP BY, HAVING이 끝난 뒤, SELECT 목록을 구성할 때쯤 처리된다",
      "ORDER BY보다 나중에 처리된다",
      "실행 순서와 무관하게 파싱 단계에서 바로 값이 정해진다",
    ],
    answerIndex: 1,
    explanation:
      "SQL 논리적 실행 순서는 FROM → WHERE → GROUP BY → HAVING → 윈도우 함수(SELECT 절 계산) → ORDER BY 순입니다. 그래서 WHERE 절에서는 윈도우 함수의 결과(예: RANK() 값)로 바로 필터링할 수 없고, 서브쿼리로 한 번 감싸야 합니다.",
    difficulty: 3,
  },
  {
    topic: "윈도우함수",
    questionText:
      "RANK() OVER (ORDER BY salary DESC) = 1 조건을 WHERE 절에 직접 쓰면 오류가 나는 이유는?",
    choices: [
      "RANK() 함수 자체에 오타가 있어서",
      "윈도우 함수는 WHERE 절이 처리되는 시점에는 아직 계산되지 않았기 때문에",
      "ORDER BY는 WHERE 절 안에서 쓸 수 없기 때문에",
      "= 1 대신 반드시 LIMIT 1을 써야 하기 때문에",
    ],
    answerIndex: 1,
    explanation:
      "SQL 실행 순서상 WHERE가 먼저 처리되고 윈도우 함수는 그 뒤에 계산되므로, WHERE 시점에는 RANK() 값이 아직 존재하지 않습니다. 그래서 RANK()로 필터링하려면 먼저 서브쿼리(또는 CTE)로 RANK()를 계산한 뒤, 바깥 쿼리의 WHERE에서 그 결과 컬럼을 필터링해야 합니다.",
    difficulty: 3,
  },
];

async function main() {
  await prisma.question.deleteMany();
  for (const q of questions) {
    await prisma.question.create({
      data: {
        topic: q.topic,
        questionText: q.questionText,
        choices: JSON.stringify(q.choices),
        answerIndex: q.answerIndex,
        explanation: q.explanation,
        difficulty: q.difficulty,
      },
    });
  }
  console.log(`시드 완료: 문제 ${questions.length}개`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
