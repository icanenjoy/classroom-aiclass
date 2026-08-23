import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import Script from "next/script";
import "pretendard/dist/web/static/pretendard.css";
import "./globals.css";
import { defaultAdConfig } from "@/data/adConfig";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SQLD 함수 반복학습",
  description: "SQLD 데이터모델링·SQL 반복 학습 도구",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {defaultAdConfig.clientId && (
          // 애드센스 사이트 심사가 전 페이지에서 이 스크립트를 찾으므로 layout에 둔다
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${defaultAdConfig.clientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {children}
      </body>
    </html>
  );
}
