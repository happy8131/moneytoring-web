import { NewsListClient } from '@/components/news/NewsListClient';
import { Suspense } from 'react';

export const metadata = {
  title: '뉴스 - Moneytoring',
  description: '주식 및 암호화폐 관련 뉴스 피드',
};

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">뉴스</h1>
        <p className="text-muted-foreground">
          금융 시장 관련 최신 뉴스를 확인하세요.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        }
      >
        <NewsListClient />
      </Suspense>
    </div>
  );
}
