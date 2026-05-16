import { NextRequest, NextResponse } from 'next/server';
import type { CryptoChartPoint, CryptoMarketChartResponse } from '@/lib/cryptoUtils';

interface CoinGeckoMarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

function formatChartDate(timestamp: number, days: number): string {
  const date = new Date(timestamp);

  if (days <= 1) {
    // HH:mm 형식
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  } else if (days <= 90) {
    // MM/DD 형식
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  } else {
    // YYYY-MM-DD 형식
    return date.toISOString().split('T')[0];
  }
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.COINGECKO_API_KEY;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const daysParam = searchParams.get('days');

  if (!id || !daysParam) {
    return NextResponse.json(
      { error: '코인 ID와 days 파라미터가 필요합니다.', data: [] },
      { status: 400 }
    );
  }

  try {
    const url = new URL(`https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}/market_chart`);
    url.searchParams.append('vs_currency', 'usd');
    url.searchParams.append('days', daysParam);

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: '코인을 찾을 수 없습니다.', data: [] },
          { status: 404 }
        );
      }
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'API 요청 제한됨. 잠시 후 다시 시도해주세요.', data: [] },
          { status: 503, headers: { 'Retry-After': '300' } }
        );
      }
      return NextResponse.json(
        { error: `CoinGecko API 오류: ${response.status}`, data: [] },
        { status: response.status }
      );
    }

    const raw: CoinGeckoMarketChart = await response.json();

    // prices, market_caps, total_volumes 배열을 zip하여 CryptoChartPoint[] 생성
    const dataLength = Math.min(raw.prices.length, raw.total_volumes.length);
    const data: CryptoChartPoint[] = [];

    for (let i = 0; i < dataLength; i++) {
      const [priceTs, price] = raw.prices[i];
      const [_, volume] = raw.total_volumes[i];
      const [__, marketCap] = raw.market_caps[i] || [priceTs, 0];

      data.push({
        t: Math.floor(priceTs / 1000), // 밀리초 → 초
        date: formatChartDate(priceTs, parseInt(daysParam)),
        price,
        volume,
        marketCap,
      });
    }

    const result: CryptoMarketChartResponse = {
      id,
      days: parseInt(daysParam),
      data,
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json(
      { error: errorMsg, data: [] },
      { status: 500 }
    );
  }
}
