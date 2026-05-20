import { NextRequest, NextResponse } from 'next/server';
import { SP500_SECTORS, SectorHeatmapData, getSectorOrder } from '@/lib/sectorHeatmapUtils';
import { env } from '@/lib/env';

interface FinnhubQuote {
  o: number;
  h: number;
  l: number;
  c: number;
  pc: number;
  t: number;
}

async function fetchSingleQuote(symbol: string, apiKey: string, retries: number = 2): Promise<FinnhubQuote | null> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
      const res = await fetch(url);

      // 429 (Too Many Requests) 에러 시 대기 후 재시도
      if (res.status === 429) {
        const waitTime = Math.pow(2, attempt) * 2000; // 2s, 4s
        if (attempt < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
        continue;
      }

      if (!res.ok) {
        return null;
      }

      const data = await res.json();

      // 유효한 데이터인지 확인
      if (!data.c || data.c === 0) {
        return null;
      }

      return data;
    } catch (error) {
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    if (!env.finnhubApiKey) {
      return NextResponse.json({ data: [], fetchedAt: new Date().toISOString() }, { status: 200 });
    }

    const result: SectorHeatmapData[] = [];
    const sectorOrder = getSectorOrder();
    const requestStartTime = Date.now();

    for (const sector of sectorOrder) {
      const symbols = SP500_SECTORS[sector];
      if (!symbols) continue;

      const stocks = [];

      // 순차적 처리 (한 번에 1개씩만 요청) - 레이트 리미트 회피
      for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];
        const quote = await fetchSingleQuote(symbol, env.finnhubApiKey, 2);

        if (quote) {
          const change = quote.c - quote.pc;
          const percentChange = quote.pc !== 0 ? (change / quote.pc) * 100 : 0;

          stocks.push({
            symbol,
            name: symbol,
            currentPrice: quote.c,
            change,
            percentChange,
          });
        }

        // 매 요청 후 짧은 지연 (레이트 리미트 회피)
        if (i < symbols.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }

      if (stocks.length > 0) {
        result.push({
          sector,
          count: stocks.length,
          stocks,
        });
      }

      // 섹터 전환 시 추가 지연
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const totalTime = Date.now() - requestStartTime;

    return NextResponse.json(
      { data: result, fetchedAt: new Date().toISOString() },
      {
        headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=7200' },
      }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json(
      { error: errorMsg, data: [] },
      { status: 500 }
    );
  }
}
