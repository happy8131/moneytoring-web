'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CryptoDetailHeader } from '@/components/crypto/CryptoDetailHeader';
import { CryptoPriceChart } from '@/components/crypto/CryptoPriceChart';
import { CryptoMetricsGrid } from '@/components/crypto/CryptoMetricsGrid';
import { CryptoCommunityData } from '@/components/crypto/CryptoCommunityData';
import { CryptoDeveloperActivity } from '@/components/crypto/CryptoDeveloperActivity';
import { ArrowLeft } from 'lucide-react';

type Props = {
  params: Promise<{ id: string }>;
};

export default function CryptoDetailPage({ params }: Props) {
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  if (!id) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          돌아가기
        </Link>

        {/* Header */}
        <CryptoDetailHeader id={id} />

        {/* Chart */}
        <CryptoPriceChart id={id} />

        {/* Metrics */}
        <CryptoMetricsGrid id={id} />

        {/* Community & Developer Data */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CryptoCommunityData id={id} />
          <CryptoDeveloperActivity id={id} />
        </div>
      </div>
    </div>
  );
}
