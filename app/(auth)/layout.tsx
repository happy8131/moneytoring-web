import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인 | Moneytoring',
  description: '계정에 로그인하세요',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 로고/브랜드 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Moneytoring</h1>
          <p className="text-sm text-muted-foreground">
            투자 정보 및 포트폴리오 관리 플랫폼
          </p>
        </div>

        {/* 콘텐츠 */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          {children}
        </div>

        {/* 푸터 정보 */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2025 Moneytoring. All rights reserved.
        </p>
      </div>
    </div>
  );
}
