'use client';

import { ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';

// Recharts width(-1) height(-1) 경고 필터링
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0]?.toString() || '';
    if (message.includes('width(-1) and height(-1)')) {
      return;
    }
    originalWarn(...args);
  };
}

// QueryClient 인스턴스 생성 (싱글톤 패턴)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분 (캐시 타임)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // 기존 localStorage 포트폴리오 데이터 정리 (DB 마이그레이션 이후)
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('moneytoring_portfolio');
      } catch (error) {
        // 무시
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{children}</TooltipProvider>
    </QueryClientProvider>
  );
}
