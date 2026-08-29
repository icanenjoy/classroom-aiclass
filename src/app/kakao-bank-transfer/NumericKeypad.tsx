'use client'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']

export default function NumericKeypad({
    onPress,
}: {
    onPress: (key: string) => void
}) {
    return (
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-[#F0F0F0]">
            {KEYS.map((key, i) => (
                <button
                    key={i}
                    type="button"
                    onClick={() => key && onPress(key)}
                    disabled={key === ''}
                    className="bg-white py-4 text-xl font-medium text-[#1E1E1E] active:bg-[#F5F5F5] disabled:bg-white">
                    {key}
                </button>
            ))}
        </div>
    )
}
