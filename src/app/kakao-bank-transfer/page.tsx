'use client'

import dynamic from 'next/dynamic'

// 매 실행마다 랜덤 시나리오를 만드는 화면이라 서버 렌더링과 클라이언트 렌더링 값이
// 어긋난다 — 서버에서 아예 렌더링하지 않고 클라이언트에서만 그린다.
const TransferApp = dynamic(() => import('./TransferApp'), { ssr: false })

export default function Page() {
    return <TransferApp />
}
