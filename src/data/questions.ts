export type Question = {
  id: string;
  topic:
    | "윈도우함수"
    | "집계함수"
    | "데이터모델링"
    | "정규화"
    | "조인"
    | "서브쿼리"
    | "집합연산자"
    | "계층형질의";
  questionText: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  difficulty: number;
  // 해설 문장 안에 실제로 등장하는 문자열 그대로 적어야 클릭 가능한 단어로 표시됨
  keywords: string[];
};

export const questions: Question[] = [
  {
    id: "dm-1",
    topic: "데이터모델링",
    questionText: "데이터 모델링에서 '엔터티(Entity)'에 대한 설명으로 가장 옳은 것은?",
    choices: [
      "엔터티는 반드시 하나의 속성만 가질 수 있다",
      "업무에서 관리가 필요한 인적·물적 대상으로서, 서로 구별되는 인스턴스들의 집합이다",
      "엔터티는 다른 엔터티와 관계(Relationship)를 가질 수 없다",
      "엔터티는 반드시 시스템에 저장되지 않아도 된다",
    ],
    answerIndex: 1,
    explanation:
      "엔터티는 업무상 관리 대상이 되는 사물·사건을 나타내며, 여러 개의 속성을 가지고 서로 구별되는 인스턴스(개별 값)들의 집합입니다. 엔터티는 하나 이상의 속성을 가지며, 다른 엔터티와 관계를 맺을 수 있다는 점에서 ①·③은 틀린 설명입니다.",
    difficulty: 1,
    keywords: ["엔터티"],
  },
  {
    id: "dm-2",
    topic: "데이터모델링",
    questionText:
      "원래 업무에서 사용되지 않던 값을, 주식별자 조건(유일성 등)을 만족시키기 위해 시스템에서 인위적으로 만들어 부여하는 식별자는?",
    choices: ["본질식별자", "인조식별자", "외부식별자", "복합식별자"],
    answerIndex: 1,
    explanation:
      "인조식별자는 본질적으로 업무에 존재하지 않지만 주식별자의 조건(유일성·최소성 등)을 만족시키기 위해 인위적으로 만들어 부여하는 식별자입니다(예: 자동 증가하는 회원번호). 반대로 본질식별자는 업무 자체에서 원래 존재하던 값(예: 주민등록번호)을 그대로 식별자로 쓰는 경우입니다. 이 구분은 식별자를 스스로 만들었는지를 따지는 기준이라, 관계에서 왔는지를 따지는 외부식별자·내부식별자 구분과는 서로 다른 분류 축입니다.",
    difficulty: 2,
    keywords: ["인조식별자", "본질식별자", "주식별자", "외부식별자", "내부식별자"],
  },
  {
    id: "dm-3",
    topic: "데이터모델링",
    questionText:
      "다른 엔터티와 관계를 맺으면서 그 엔터티의 주식별자를 자신의 속성으로 포함하게 된 식별자로, 관계형 DB의 외래키(FK)에 대응하는 것은?",
    choices: ["내부식별자", "외부식별자", "단일식별자", "복합식별자"],
    answerIndex: 1,
    explanation:
      "외부식별자(Foreign Identifier)는 다른 엔터티와 관계를 맺으면서 그 엔터티의 주식별자를 자신의 속성으로 포함하게 된 식별자로, 관계형 데이터베이스의 외래키(FK)로 구현됩니다. 관계와 무관하게 엔터티 자체에서 생성된 식별자는 내부식별자라고 합니다. 이 구분은 값을 스스로 만들었는지를 따지는 본질식별자·인조식별자 구분과는 별개의 기준입니다.",
    difficulty: 2,
    keywords: ["외부식별자", "내부식별자", "엔터티", "주식별자", "본질식별자", "인조식별자"],
  },
  {
    id: "dm-4",
    topic: "데이터모델링",
    questionText:
      "고객 한 명이 여러 개의 주문을 할 수 있고, 하나의 주문은 반드시 한 명의 고객에게만 속한다고 할 때, 고객과 주문 엔터티 사이의 관계 차수(Cardinality)는?",
    choices: ["1:1", "1:N", "N:M", "0:1"],
    answerIndex: 1,
    explanation:
      "고객(1) : 주문(N) 관계로, 고객 하나에 주문 여러 건이 대응되지만 주문 하나는 고객 하나에만 대응되므로 1:N(일대다) 관계입니다. 만약 N:M(다대다) 관계가 나오면, 두 엔터티 사이에 관계 엔터티(연결/교차 엔터티)를 추가로 두어 1:N 관계 두 개로 풀어내야 합니다. 이런 1:N 관계에서 자식(주문)이 부모(고객)의 주식별자를 상속받아 식별관계로 연결되는 경우가 많습니다.",
    difficulty: 2,
    keywords: ["1:N", "N:M", "엔터티", "주식별자", "식별관계"],
  },
  {
    id: "dm-5",
    topic: "데이터모델링",
    questionText: "부모 엔터티의 주식별자가 자식 엔터티의 주식별자 일부(또는 전부)로 그대로 포함되는 관계는?",
    choices: ["비식별관계", "식별관계", "자기참조관계", "배타적관계"],
    answerIndex: 1,
    explanation:
      "식별관계(Identifying Relationship)는 부모의 주식별자를 자식 엔터티의 주식별자 일부로 그대로 상속시키는 관계이고, 비식별관계(Non-Identifying Relationship)는 부모의 주식별자를 자식의 일반 속성(외부식별자)으로만 포함시킵니다. 자식 엔터티가 부모 없이 독립적으로 존재할 수 있는지가 둘을 구분하는 핵심 기준입니다. 보통 1:N 관계에서 자식이 부모 없이는 의미가 없는 경우 식별관계로 설계합니다.",
    difficulty: 3,
    keywords: ["식별관계", "비식별관계", "엔터티", "주식별자", "1:N"],
  },
  {
    id: "norm-1",
    topic: "정규화",
    questionText: "제1정규형(1NF)을 만족하기 위한 조건으로 옳은 것은?",
    choices: [
      "모든 속성이 원자값(더 이상 쪼갤 수 없는 하나의 값)만 가져야 한다",
      "기본키가 아닌 모든 속성이 기본키에 완전 함수 종속해야 한다",
      "이행적 함수 종속을 제거해야 한다",
      "후보키가 아닌 결정자를 모두 제거해야 한다",
    ],
    answerIndex: 0,
    explanation:
      "제1정규형은 테이블의 모든 속성(컬럼)이 더 이상 쪼갤 수 없는 원자값을 가져야 한다는 조건입니다(반복 그룹·다중값 속성 금지). ②는 제2정규형(부분 함수 종속 제거), ③은 제3정규형(이행적 함수 종속 제거), ④는 보이스-코드 정규형(BCNF)에 대한 설명입니다. 정규형은 1NF→2NF→3NF→BCNF 순으로 단계가 올라갈수록 더 엄격한 조건을 만족해야 합니다.",
    difficulty: 1,
    keywords: ["제1정규형", "제2정규형", "제3정규형", "보이스-코드 정규형", "정규형"],
  },
  {
    id: "norm-2",
    topic: "정규화",
    questionText:
      "복합키(주문번호, 상품번호)를 기본키로 갖는 테이블에서 '상품명'이 상품번호에만 종속되고 주문번호에는 종속되지 않는다면, 어떤 정규화 위반인가?",
    choices: [
      "원자성 위반",
      "부분 함수 종속(2NF 위반)",
      "이행적 함수 종속(3NF 위반)",
      "다치 종속 위반",
    ],
    answerIndex: 1,
    explanation:
      "기본키가 여러 컬럼(복합키)으로 이루어져 있을 때, 기본키 전체가 아니라 그 일부에만 종속되는 속성이 있으면 부분 함수 종속이라 하며, 이를 제거하는 것이 제2정규형입니다. 상품명은 상품번호만으로 결정되므로 별도의 상품 테이블로 분리해야 합니다. 이 부분 함수 종속을 제거해 2NF가 된 뒤, 기본키가 아닌 컬럼끼리의 이행적 함수 종속까지 마저 제거해야 3NF가 됩니다.",
    difficulty: 2,
    keywords: ["부분 함수 종속", "제2정규형", "정규형", "이행적 함수 종속"],
  },
  {
    id: "norm-3",
    topic: "정규화",
    questionText:
      "테이블에 (사원번호 → 부서코드 → 부서명)처럼, 기본키가 아닌 컬럼을 매개로 다른 컬럼이 간접적으로 결정되는 종속 관계를 무엇이라 하며, 이를 제거하는 정규형은?",
    choices: [
      "부분 함수 종속 / 2NF",
      "이행적 함수 종속 / 3NF",
      "다치 종속 / 4NF",
      "결정자 종속 / BCNF",
    ],
    answerIndex: 1,
    explanation:
      "사원번호 → 부서코드, 부서코드 → 부서명처럼 기본키가 아닌 컬럼(부서코드)을 매개로 다른 컬럼이 간접적으로 결정되는 관계를 이행적 함수 종속이라 합니다. 이를 제거해 부서 정보를 별도 테이블로 분리하는 것이 제3정규형입니다. 부분 함수 종속을 먼저 제거해 2NF를 만족한 뒤에야 이행적 함수 종속 제거(3NF)로 넘어갈 수 있습니다.",
    difficulty: 2,
    keywords: ["이행적 함수 종속", "제3정규형", "정규형", "부분 함수 종속"],
  },
  {
    id: "norm-4",
    topic: "정규화",
    questionText:
      "정규화로 나뉜 테이블을 조회할 때 조인이 많아져 성능이 떨어질 수 있을 때, 의도적으로 중복을 허용해 테이블을 합치거나 컬럼을 추가하는 기법은?",
    choices: ["정규화", "반정규화(De-normalization)", "인덱싱", "파티셔닝"],
    answerIndex: 1,
    explanation:
      "반정규화(De-normalization)는 정규화로 나뉜 테이블을 다시 합치거나 중복 컬럼을 추가해 조인 횟수를 줄임으로써 조회 성능을 높이는 기법입니다. 대신 데이터 중복이 생겨 갱신 이상(값을 바꿀 때 여러 곳을 함께 고쳐야 하는 문제) 위험이 커지므로, 무결성과 성능 사이의 트레이드오프를 고려해 신중히 적용해야 합니다. 정규형 단계를 높여가는 정규화와 반대로, 반정규화는 성능을 위해 일부러 그 단계를 낮추는 방향입니다.",
    difficulty: 2,
    keywords: ["반정규화(De-normalization)", "정규화", "정규형"],
  },
  {
    id: "norm-5",
    topic: "정규화",
    questionText: "관계형 데이터베이스에서 NULL에 대한 설명으로 옳은 것은?",
    choices: [
      "NULL은 0이나 공백 문자열과 동일하게 취급된다",
      "NULL은 '아직 정해지지 않았거나 알 수 없는 값'을 뜻하며, 0이나 공백과는 다른 별개의 상태다",
      "기본키(Primary Key) 컬럼은 NULL을 허용해도 된다",
      "NULL은 다른 NULL과 비교했을 때 항상 참(TRUE)이다",
    ],
    answerIndex: 1,
    explanation:
      "NULL은 값이 없음·미정·모름을 나타내는 특수한 상태로, 숫자 0이나 빈 문자열('')과는 전혀 다릅니다. 기본키(Primary Key)는 데이터 모델링의 주식별자에 대응하는 개념으로, 엔터티 무결성 규칙에 따라 NULL을 허용하지 않으며, NULL은 다른 NULL과 비교해도 참/거짓이 아닌 알 수 없음(UNKNOWN)이 됩니다(그래서 '= NULL'이 아니라 IS NULL을 씁니다).",
    difficulty: 2,
    keywords: ["NULL", "기본키(Primary Key)", "주식별자"],
  },
  {
    id: "win-1",
    topic: "윈도우함수",
    questionText:
      "부서별 급여 순위를 매기는데, 급여가 같으면 같은 순위를 주고 다음 순위를 건너뛰고 싶다. 사용할 함수는?",
    choices: ["ROW_NUMBER()", "RANK()", "DENSE_RANK()", "NTILE()"],
    answerIndex: 1,
    explanation:
      "RANK()는 동점에게 같은 순위를 주고, 그 다음 순위를 동점 인원 수만큼 건너뜁니다(1,2,2,4). DENSE_RANK()는 건너뛰지 않고(1,2,2,3), ROW_NUMBER()는 동점이어도 무조건 순번을 다르게 매깁니다(1,2,3,4). '건너뛴다'는 조건이 핵심이라 RANK가 정답입니다.",
    difficulty: 1,
    keywords: ["RANK()", "DENSE_RANK()", "ROW_NUMBER()"],
  },
  {
    id: "win-4",
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
    keywords: ["PARTITION BY", "GROUP BY"],
  },
  {
    id: "win-6",
    topic: "윈도우함수",
    questionText:
      "각 직원의 급여와, 같은 부서에서 바로 이전에 입사한 직원의 급여를 한 행에 같이 보고 싶다. 사용할 함수는?",
    choices: ["LAG()", "LEAD()", "FIRST_VALUE()", "RANK()"],
    answerIndex: 0,
    explanation:
      "LAG()는 현재 행 기준으로 이전(과거) 행의 값을 가져오고, LEAD()는 다음(미래) 행의 값을 가져옵니다. '이전 입사자'라는 조건이 핵심이라 LAG가 정답입니다. LAG/LEAD를 반대로 외워서 틀리는 경우가 많습니다.",
    difficulty: 2,
    keywords: ["LAG()", "LEAD()"],
  },
  {
    id: "win-10",
    topic: "윈도우함수",
    questionText: "부서별로 급여가 가장 높은 직원 1명씩만 조회하려고 한다. 가장 적절한 방법은?",
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
    keywords: ["RANK()", "PARTITION BY", "GROUP BY"],
  },
  {
    id: "agg-1",
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
    keywords: ["COUNT(*)", "COUNT(컬럼명)"],
  },
  {
    id: "agg-2",
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
    keywords: ["AVG()", "NULL"],
  },
  {
    id: "agg-3",
    topic: "집계함수",
    questionText:
      "GROUP BY로 묶은 그룹 중에서, 그룹별 합계가 조건을 만족하는 그룹만 걸러내고 싶다. 사용할 절은?",
    choices: ["WHERE", "HAVING", "ORDER BY", "QUALIFY"],
    answerIndex: 1,
    explanation:
      "WHERE는 GROUP BY로 묶기 '전' 개별 행을 필터링하고, HAVING은 GROUP BY로 묶은 '이후' 집계 결과(예: SUM, COUNT)를 조건으로 필터링합니다. 'SUM(salary) > 5000000인 부서만' 같은 조건은 반드시 HAVING을 써야 합니다.",
    difficulty: 1,
    keywords: ["WHERE", "HAVING", "GROUP BY"],
  },
  {
    id: "agg-4",
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
    keywords: ["GROUP BY"],
  },
  {
    id: "join-1",
    topic: "조인",
    questionText: "두 테이블을 조인할 때, 조인 조건을 만족하는 행만 결과에 포함시키는 조인은?",
    choices: ["LEFT OUTER JOIN", "INNER JOIN", "FULL OUTER JOIN", "CROSS JOIN"],
    answerIndex: 1,
    explanation:
      "INNER JOIN(내부 조인)은 양쪽 테이블에서 조인 조건이 일치하는 행끼리만 결과에 남기고, 한쪽에만 있어 매칭되지 않는 행은 결과에서 제외합니다. 매칭되지 않는 행도 결과에 남기고 싶다면 LEFT OUTER JOIN 같은 OUTER JOIN을 써야 합니다.",
    difficulty: 1,
    keywords: ["INNER JOIN", "OUTER JOIN", "조인", "LEFT OUTER JOIN"],
  },
  {
    id: "join-2",
    topic: "조인",
    questionText:
      "부서 테이블을 기준으로, 소속 사원이 한 명도 없는 부서까지 모두 조회하고 싶다(그런 부서의 사원 정보는 NULL로 표시). 올바른 조인 방향은?",
    choices: [
      "department LEFT OUTER JOIN employee (department 기준)",
      "employee LEFT OUTER JOIN department (employee 기준)",
      "department INNER JOIN employee",
      "department CROSS JOIN employee",
    ],
    answerIndex: 0,
    explanation:
      "LEFT OUTER JOIN은 왼쪽(LEFT) 테이블의 모든 행을 결과에 남기고, 오른쪽 테이블에 매칭되는 값이 없으면 NULL로 채웁니다. '부서는 전부 나오고 사원이 없으면 NULL'이 목표이므로 department를 왼쪽에 두고 employee를 LEFT OUTER JOIN(조인) 해야 합니다. 조인 조건이 안 맞아도 왼쪽 행을 무조건 남긴다는 점이 INNER JOIN과의 차이입니다.",
    difficulty: 2,
    keywords: ["LEFT OUTER JOIN", "OUTER JOIN", "조인", "INNER JOIN"],
  },
  {
    id: "join-4",
    topic: "조인",
    questionText:
      "사원 테이블에서 각 사원과 그 사원의 상사(매니저) 이름을 한 행에 같이 조회하려고 한다(상사도 같은 employee 테이블에 사원으로 존재). 사용할 조인은?",
    choices: [
      "CROSS JOIN",
      "SELF JOIN(자기 자신과의 조인)",
      "FULL OUTER JOIN",
      "서브쿼리만 가능하고 조인으로는 불가능하다",
    ],
    answerIndex: 1,
    explanation:
      "SELF JOIN(자기 자신과의 조인)은 같은 테이블을 서로 다른 별칭(alias)으로 두 번 참조해서 조인하는 방식입니다. 사원(e) 테이블과 상사(m) 테이블처럼 별칭만 다르게 준 같은 employee 테이블을 e.manager_id = m.emp_id 조건으로 조인하면 각 사원의 상사 이름을 함께 조회할 수 있습니다.",
    difficulty: 2,
    keywords: ["SELF JOIN(자기 자신과의 조인)", "조인"],
  },
  {
    id: "sub-1",
    topic: "서브쿼리",
    questionText:
      "서브쿼리의 실행 결과가 반드시 1행만 반환됨을 전제로, 비교 연산자(=, >, < 등)를 바로 사용할 수 있는 서브쿼리는?",
    choices: ["다중행 서브쿼리", "단일행 서브쿼리", "다중열 서브쿼리", "상관 서브쿼리"],
    answerIndex: 1,
    explanation:
      "단일행 서브쿼리는 결과가 정확히 1행(값 하나)만 나온다는 전제 하에 =, >, <, >= 같은 일반 비교 연산자와 함께 씁니다. 서브쿼리가 여러 행을 반환하면 오류가 발생하므로, 여러 행이 나올 수 있다면 다중행 서브쿼리용 연산자인 IN, ANY, ALL을 써야 합니다.",
    difficulty: 1,
    keywords: ["단일행 서브쿼리", "다중행 서브쿼리", "서브쿼리"],
  },
  {
    id: "sub-2",
    topic: "서브쿼리",
    questionText:
      "서브쿼리가 여러 값을 반환할 수 있을 때, '서브쿼리 결과값 중 하나라도 조건을 만족하면 참'이 되는 연산자는?",
    choices: ["ALL", "ANY(또는 SOME)", "IN만 가능하다", "EXISTS만 가능하다"],
    answerIndex: 1,
    explanation:
      "ANY(또는 SOME)는 서브쿼리가 반환한 여러 값 중 하나라도 비교 조건을 만족하면 참이 됩니다(예: salary > ANY(...)는 서브쿼리 결과 중 하나보다만 크면 참). 반대로 ALL은 반환된 모든 값을 만족해야 참이 됩니다. IN도 다중행 서브쿼리에서 값 비교에 쓸 수 있지만 '=' 비교만 지원한다는 점이 ANY/ALL과 다릅니다.",
    difficulty: 2,
    keywords: ["ANY(또는 SOME)", "ALL", "IN", "서브쿼리", "다중행 서브쿼리"],
  },
  {
    id: "sub-3",
    topic: "서브쿼리",
    questionText:
      "서브쿼리 안에서 바깥쪽(메인) 쿼리의 컬럼을 참조해서, 바깥쪽 행이 한 행씩 바뀔 때마다 서브쿼리도 다시 실행되는 서브쿼리는?",
    choices: ["스칼라 서브쿼리", "상관 서브쿼리(Correlated Subquery)", "인라인 뷰", "다중열 서브쿼리"],
    answerIndex: 1,
    explanation:
      "상관 서브쿼리(Correlated Subquery)는 서브쿼리 안에 바깥 쿼리의 테이블·컬럼을 참조하는 조건이 있어서, 바깥 쿼리가 한 행씩 처리될 때마다 그 행의 값을 넘겨받아 서브쿼리가 매번 다시 실행됩니다. '각 부서의 평균보다 급여가 높은 사원'처럼 행마다 비교 기준이 달라지는 문제에 자주 쓰입니다.",
    difficulty: 3,
    keywords: ["상관 서브쿼리(Correlated Subquery)", "서브쿼리"],
  },
  {
    id: "set-1",
    topic: "집합연산자",
    questionText: "UNION과 UNION ALL의 차이로 옳은 것은?",
    choices: [
      "UNION은 중복 행을 제거하는 과정이 추가되지만, UNION ALL은 중복을 제거하지 않고 그대로 합쳐서 더 빠르다",
      "UNION ALL이 항상 결과 행 수가 더 적다",
      "둘 다 완전히 동일하게 동작한다",
      "UNION은 두 SELECT 문의 컬럼 개수가 달라도 사용할 수 있다",
    ],
    answerIndex: 0,
    explanation:
      "UNION은 집합 연산자 중 하나로, 두 결과 집합을 합친 뒤 중복된 행을 제거하는 과정에서 내부적으로 정렬·비교가 추가로 일어나 비용이 더 큽니다. UNION ALL은 중복 제거 없이 단순히 이어 붙이기만 하므로 더 빠르고, 결과 행 수도 UNION보다 같거나 많습니다.",
    difficulty: 1,
    keywords: ["UNION", "UNION ALL", "집합 연산자"],
  },
  {
    id: "set-2",
    topic: "집합연산자",
    questionText: "두 SELECT 문의 결과에서 양쪽 모두에 공통으로 존재하는 행만 반환하는 집합 연산자는?",
    choices: ["UNION", "INTERSECT", "MINUS", "UNION ALL"],
    answerIndex: 1,
    explanation:
      "INTERSECT는 집합 연산자 중 하나로, 두 조회 결과의 교집합, 즉 양쪽 SELECT 문에 공통으로 나타나는 행만 반환합니다(중복은 자동 제거됨). 수학의 교집합(∩) 개념과 동일하며, 차집합을 구하는 MINUS와 자주 헷갈립니다.",
    difficulty: 1,
    keywords: ["INTERSECT", "집합 연산자", "MINUS"],
  },
  {
    id: "set-3",
    topic: "집합연산자",
    questionText:
      "첫 번째 SELECT 결과에서 두 번째 SELECT 결과에 존재하는 행을 제외하고 반환하는 집합 연산자는? (Oracle 기준 명칭)",
    choices: ["INTERSECT", "MINUS", "UNION ALL", "CROSS"],
    answerIndex: 1,
    explanation:
      "MINUS는 집합 연산자 중 하나로, 앞쪽 SELECT 결과에서 뒤쪽 SELECT 결과와 겹치는 행을 뺀 차집합을 반환합니다(Oracle에서 쓰는 이름이며, 표준 SQL과 일부 DBMS에서는 EXCEPT라고 부릅니다). 순서를 바꾸면(A MINUS B와 B MINUS A) 결과가 달라진다는 점이 시험 함정으로 자주 나옵니다. 공통된 부분만 남기는 INTERSECT와 헷갈리지 않도록 주의해야 합니다.",
    difficulty: 2,
    keywords: ["MINUS", "EXCEPT", "집합 연산자", "INTERSECT"],
  },
  {
    id: "hier-1",
    topic: "계층형질의",
    questionText:
      "조직도처럼 부모-자식 관계(예: 상사-부하 직원)를 트리 구조로 조회할 때 사용하는 SQL 구문은?",
    choices: [
      "GROUP BY ... HAVING",
      "START WITH ... CONNECT BY",
      "PARTITION BY ... ORDER BY",
      "UNION ... INTERSECT",
    ],
    answerIndex: 1,
    explanation:
      "START WITH ... CONNECT BY는 자기참조(Self-Reference) 관계를 가진 테이블에서 계층 구조(트리)를 따라가며 조회하는 계층형 질의(Hierarchical Query) 구문입니다. START WITH로 최상위(루트) 행을 지정하고, CONNECT BY로 부모-자식을 연결하는 조건을 정의합니다.",
    difficulty: 2,
    keywords: ["START WITH ... CONNECT BY", "계층형 질의(Hierarchical Query)", "계층형 질의", "START WITH", "CONNECT BY"],
  },
  {
    id: "hier-2",
    topic: "계층형질의",
    questionText:
      "CONNECT BY 절에서 CONNECT BY PRIOR emp_id = manager_id처럼 PRIOR를 자식 쪽 컬럼(emp_id)에 붙이면, 조회 방향은?",
    choices: [
      "위에서 아래로(상위 → 하위, 순방향)",
      "아래에서 위로(하위 → 상위, 역방향)",
      "방향과 무관하게 항상 같은 결과가 나온다",
      "PRIOR의 위치는 결과에 영향을 주지 않는다",
    ],
    answerIndex: 0,
    explanation:
      "계층형 질의의 CONNECT BY 절에서 PRIOR는 '바로 이전(부모) 행의 값'을 가리킵니다. CONNECT BY PRIOR emp_id = manager_id처럼 자식 식별자(emp_id) 쪽에 PRIOR를 붙이면 '부모의 emp_id = 현재 행의 manager_id' 조건이 되어 위에서 아래로(상위 → 하위, 순방향) 전개가 되고, 반대로 PRIOR를 manager_id 쪽에 붙이면 아래에서 위로(하위 → 상위, 역방향) 전개가 됩니다.",
    difficulty: 3,
    keywords: [
      "PRIOR",
      "위에서 아래로(상위 → 하위, 순방향)",
      "아래에서 위로(하위 → 상위, 역방향)",
      "계층형 질의",
      "CONNECT BY",
    ],
  },
  {
    id: "hier-3",
    topic: "계층형질의",
    questionText:
      "계층형 질의에서 루트(최상위) 행을 1로 시작해서, 현재 행이 트리에서 몇 단계 깊이에 있는지 알려주는 의사컬럼(pseudo column)은?",
    choices: ["ROWNUM", "LEVEL", "CONNECT_BY_ROOT", "SYS_CONNECT_BY_PATH"],
    answerIndex: 1,
    explanation:
      "LEVEL은 계층형 질의 전용 의사컬럼으로, START WITH로 지정한 루트 행을 1로 시작해서 자식으로 내려갈 때마다 1씩 증가합니다. 들여쓰기로 트리 구조를 표현하거나(예: LPAD(' ', LEVEL) || name) 특정 깊이까지만 조회할 때(WHERE LEVEL <= 3) 활용합니다.",
    difficulty: 2,
    keywords: ["LEVEL", "계층형 질의", "START WITH"],
  },
];
