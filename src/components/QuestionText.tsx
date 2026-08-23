import { parseQuestionText, classifyParagraphs } from '@/lib/parseQuestionText'
import SqlTableBlock from './SqlTableBlock'

export default function QuestionText({ text }: { text: string }) {
    const segments = parseQuestionText(text)

    return (
        <div className="mb-4 space-y-1">
            {segments.map((seg, i) => {
                if (seg.type === 'table') {
                    return (
                        <SqlTableBlock
                            key={i}
                            tableName={seg.tableName}
                            header={seg.header}
                            rows={seg.rows}
                        />
                    )
                }
                if (!seg.content.trim()) return null
                const paragraphs = classifyParagraphs(seg.content)
                return paragraphs.map((p, j) => {
                    if (p.kind === 'sql') {
                        return (
                            <pre
                                key={`${i}-${j}`}
                                className="my-2 whitespace-pre-wrap rounded-md border border-line bg-bg px-3 py-2 font-mono text-sm text-ink">
                                {p.content}
                            </pre>
                        )
                    }
                    return (
                        <p
                            key={`${i}-${j}`}
                            className={
                                p.isHeadline
                                    ? 'whitespace-pre-wrap text-lg font-semibold text-ink'
                                    : 'whitespace-pre-wrap text-sm text-muted'
                            }>
                            {p.content}
                        </p>
                    )
                })
            })}
        </div>
    )
}
