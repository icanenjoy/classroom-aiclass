import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
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
      {defaultAdConfig.clientId && (
        // 애드센스가 요구하는 그대로 정적 HTML <head> 안에 raw script 태그로 넣는다 —
        // next/script는 실제 태그를 JS로 뒤늦게 주입해서 정적 HTML만 보는 크롤러엔 안 잡힐 수 있음
        <head>
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${defaultAdConfig.clientId}`}
            crossOrigin="anonymous"
          />
        </head>
      )}
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
