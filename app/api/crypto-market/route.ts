/**
 * 암호화폐 시장 데이터 조회 API 라우트
 *
 * GET /api/crypto-market
 *
 * - CoinGecko global API 사용
 * - 시가총액, BTC 도미넌스, Fear & Greed Index 조회
 * - 캐시: 1시간 revalidate
 */

import { NextResponse } from 'next/server';

// ────────────────────────────────────────────────────────────────────────────
// 타입 정의
// ────────────────────────────────────────────────────────────────────────────

interface CoinGeckoGlobal {
  data?: {
    total_market_cap?: Record<string, number>;
    market_cap_percentage?: Record<string, number>;
    btc_dominance?: number;
    market_cap_change_percentage_24h_usd?: number;
    total_volume?: Record<string, number>;
  };
}

interface FearGreedData {
  value: string;
  valueClassification: string;
  timestamp: string;
}

interface FearGreedResponse {
  data: FearGreedData[];
}

export interface CryptoMarketData {
  totalMarketCap: number;
  totalMarketCapUSD: number;
  marketCapChangePercent24h: number;
  btcDominance: number;
  ethDominance: number;
  totalVolume24h: number;
  fearGreedIndex: number;
  fearGreedClassification: string;
  updatedAt: string;
}

export interface CryptoMarketResponse {
  data: CryptoMarketData | null;
  error: string | null;
  fetchedAt: string;
}

// ────────────────────────────────────────────────────────────────────────────
// GET /api/crypto-market
// ────────────────────────────────────────────────────────────────────────────

export async function GET() {
  try {
    // 1. CoinGecko Global 데이터 조회
    const globalRes = await fetch('https://api.coingecko.com/api/v3/global', {
      next: { revalidate: 3600 },
    });

    if (!globalRes.ok) {
      throw new Error('CoinGecko global API 실패');
    }

    const globalData: CoinGeckoGlobal = await globalRes.json();

    if (!globalData.data) {
      throw new Error('CoinGecko 응답 형식 오류');
    }

    const usdMarketCap = globalData.data.total_market_cap?.usd ?? 0;
    const marketCapPercent24h = globalData.data.market_cap_change_percentage_24h_usd ?? 0;
    const btcDom = globalData.data.btc_dominance ?? 0;
    const ethDom = globalData.data.market_cap_percentage?.eth ?? 0;
    const totalVol = globalData.data.total_volume?.usd ?? 0;

    // 2. Fear & Greed Index 조회 (외부 API)
    let fearGreedIndex = 50;
    let fearGreedClass = 'Neutral';

    try {
      const fngRes = await fetch('https://api.alternative.me/fng/?limit=1', {
        next: { revalidate: 3600 },
      });

      if (fngRes.ok) {
        const fngData: FearGreedResponse = await fngRes.json();
        if (fngData.data && fngData.data.length > 0) {
          fearGreedIndex = parseInt(fngData.data[0].value, 10);
          fearGreedClass = fngData.data[0].valueClassification;
        }
      }
    } catch {
      // Fear & Greed 조회 실패 시 기본값 사용
    }

    const response: CryptoMarketResponse = {
      data: {
        totalMarketCap: usdMarketCap,
        totalMarketCapUSD: usdMarketCap,
        marketCapChangePercent24h: marketCapPercent24h,
        btcDominance: btcDom,
        ethDominance: ethDom,
        totalVolume24h: totalVol,
        fearGreedIndex,
        fearGreedClassification: fearGreedClass,
        updatedAt: new Date().toISOString(),
      },
      error: null,
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';

    return NextResponse.json(
      {
        data: null,
        error: `암호화폐 시장 데이터 조회 실패: ${errorMessage}`,
        fetchedAt: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
