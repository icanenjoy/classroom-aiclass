export type AdConfig = {
    clientId: string | null // 애드센스 퍼블리셔 ID, ca-pub-로 시작
    slotId: string | null // 애드센스 광고 단위(슬롯) ID
}

// clientId는 사이트 심사 신청 시 발급됨. slotId는 심사 승인 후 광고 단위를 만들어야 나온다 —
// slotId가 null인 동안은 AdSenseBanner가 자리만 잡고 실제 광고는 안 띄운다.
export const defaultAdConfig: AdConfig = {
    clientId: 'ca-pub-9377978262474926',
    slotId: null,
}
