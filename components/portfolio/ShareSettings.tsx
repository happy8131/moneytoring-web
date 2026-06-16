'use client';

import { useState, useEffect } from 'react';
import { getMyPortfolioShare } from '@/app/actions/portfolioShares';
import type { Holding, PortfolioShare } from '@/types';
import { ShareSettingsDialog } from '@/components/portfolio/ShareSettingsDialog';

interface ShareSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentHoldings: Holding[];
}

export function ShareSettings({ open, onOpenChange, currentHoldings }: ShareSettingsProps) {
  const [portfolioShare, setPortfolioShare] = useState<PortfolioShare | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPortfolioShare = async () => {
      try {
        const share = await getMyPortfolioShare();
        setPortfolioShare(share);
      } catch (error) {
        console.error('Failed to load portfolio share:', error);
        setPortfolioShare(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      loadPortfolioShare();
    }
  }, [open]);

  const initialTitle = portfolioShare?.title || '내 포트폴리오';
  const initialDescription = portfolioShare?.description || '';
  const initialIsPublic = portfolioShare?.isPublic || false;

  return (
    <ShareSettingsDialog
      open={open}
      onOpenChange={onOpenChange}
      currentHoldings={currentHoldings}
      initialPortfolioShare={portfolioShare}
      initialTitle={initialTitle}
      initialDescription={initialDescription}
      initialIsPublic={initialIsPublic}
      isLoading={isLoading}
    />
  );
}
