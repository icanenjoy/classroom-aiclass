export default function SqlTableBlock({
    tableName,
    header,
    rows,
}: {
    tableName: string
    header: string[]
    rows: string[][]
}) {
    return (
        <div className="my-3 overflow-x-auto rounded-md border border-line bg-bg font-mono text-sm">
            <div className="border-b border-line px-2 py-1 text-xs text-muted">
                {tableName} 테이블
            </div>
            <table className="w-full">
                <thead>
                    <tr>
                        {header.map((h, i) => (
                            <th
                                key={i}
                                className="whitespace-nowrap px-2 py-1 text-left font-normal text-muted">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="border-t border-line/60">
                            {row.map((cell, j) => (
                                <td
                                    key={j}
                                    className="whitespace-nowrap px-2 py-1 text-ink">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
