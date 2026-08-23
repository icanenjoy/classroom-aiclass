'use client'

import { useEffect, useRef } from 'react'
import type { AdConfig } from '@/data/adConfig'

declare global {
    interface Window {
        adsbygoogle?: unknown[]
    }
}

// 로더 스크립트는 심사용으로 layout.tsx에서 전 페이지에 이미 깔아뒀다 — 여기선 슬롯만 그린다.
export default function AdSenseBanner({ ad }: { ad: AdConfig }) {
    const pushed = useRef(false)

    // 구글 애드센스 표준 로딩 패턴: 스크립트 로드 여부와 무관하게 큐에 push해두면
    // adsbygoogle.js가 로드된 뒤 알아서 그려준다
    useEffect(() => {
        if (!ad.clientId || !ad.slotId || pushed.current) return
        pushed.current = true
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    }, [ad.clientId, ad.slotId])

    if (!ad.clientId || !ad.slotId) {
        return (
            <div className="w-full rounded-md border border-line bg-surface p-4 text-xs text-muted">
                광고 배너 준비중
            </div>
        )
    }

    return (
        <div className="w-full rounded-md border border-line bg-surface p-4">
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={ad.clientId}
                data-ad-slot={ad.slotId}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    )
}
