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

async function fetchSingleQuote(symbol: string, apiKey: string): Promise<FinnhubQuote | null> {
  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
    const res = await fetch(url);

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!env.finnhubApiKey) {
      return NextResponse.json({ data: [], fetchedAt: new Date().toISOString() }, { status: 200 });
    }

    const result: SectorHeatmapData[] = [];
    const sectorOrder = getSectorOrder();

    for (const sector of sectorOrder) {
      const symbols = SP500_SECTORS[sector];
      if (!symbols) continue;

      const stocks = [];

      // 청크 단위로 처리 (최대 5개씩)
      const CHUNK_SIZE = 5;
      for (let i = 0; i < symbols.length; i += CHUNK_SIZE) {
        const chunk = symbols.slice(i, i + CHUNK_SIZE);

        const quoteResults = await Promise.allSettled(
          chunk.map((symbol) => fetchSingleQuote(symbol, env.finnhubApiKey))
        );

        for (let j = 0; j < chunk.length; j++) {
          const result = quoteResults[j];
          const symbol = chunk[j];

          if (result.status === 'fulfilled' && result.value) {
            const quote = result.value;
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
        }

        // 다음 청크 전에 지연
        if (i + CHUNK_SIZE < symbols.length) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      if (stocks.length > 0) {
        result.push({
          sector,
          count: stocks.length,
          stocks,
        });
      }
    }

    return NextResponse.json(
      { data: result, fetchedAt: new Date().toISOString() },
      {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' },
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
