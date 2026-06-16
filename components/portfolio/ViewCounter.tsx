'use client';

import { useEffect, useRef } from 'react';
import { incrementPortfolioShareViews } from '@/app/actions/portfolioShares';

interface ViewCounterProps {
  shareLink: string;
}

export function ViewCounter({ shareLink }: ViewCounterProps) {
  const hasIncremented = useRef(false);

  useEffect(() => {
    // 이미 증가했으면 다시 하지 않음
    if (hasIncremented.current) {
      return;
    }

    hasIncremented.current = true;
    incrementPortfolioShareViews(shareLink).catch(() => {
      // 에러 무시
    });
  }, [shareLink]);

  return null;
}
