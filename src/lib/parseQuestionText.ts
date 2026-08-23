export type Segment =
    | { type: 'table'; tableName: string; header: string[]; rows: string[][] }
    | { type: 'text'; content: string }

// questionText 안에 박혀 있는 "[X 테이블]\n번호 | ... \n1 | ..." 형태의 샘플 데이터 블록을
// 표로 분리해낸다. 블록은 "|"가 포함된 줄이 이어지는 동안 계속되고, "|" 없는 줄(빈 줄이든
// 바로 이어지는 산문이든)에서 끝난다. 데이터셋 전체에서 "|"가 들어간 줄은 항상 표 행이다.
export function parseQuestionText(text: string): Segment[] {
    const lines = text.split('\n')
    const segments: Segment[] = []
    let buf: string[] = []

    const flush = () => {
        if (buf.length) segments.push({ type: 'text', content: buf.join('\n') })
        buf = []
    }

    let i = 0
    while (i < lines.length) {
        const m = lines[i].match(/^\[(.+) 테이블\]$/)
        if (m) {
            flush()
            const tableName = m[1]
            i++
            const rowLines: string[] = []
            while (i < lines.length && lines[i].includes('|')) {
                rowLines.push(lines[i])
                i++
            }
            const rows = rowLines.map((l) => l.split('|').map((c) => c.trim()))
            const [header, ...body] = rows
            segments.push({ type: 'table', tableName, header, rows: body })
            continue
        }
        buf.push(lines[i])
        i++
    }
    flush()
    return segments
}

export type TextParagraph = { kind: 'sql' | 'prose'; content: string; isHeadline: boolean }

const SQL_START = /^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH|MERGE)\b/i

// 일반 텍스트 세그먼트를 문단 단위로 나눠 SQL/산문으로 분류하고,
// "마지막 산문 문단"을 헤드라인(질문 본문)으로 표시한다.
export function classifyParagraphs(content: string): TextParagraph[] {
    const paragraphs = content
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0)

    const result: TextParagraph[] = paragraphs.map((p) => ({
        kind: SQL_START.test(p) ? 'sql' : 'prose',
        content: p,
        isHeadline: false,
    }))

    for (let i = result.length - 1; i >= 0; i--) {
        if (result[i].kind === 'prose') {
            result[i].isHeadline = true
            break
        }
    }

    return result
}
