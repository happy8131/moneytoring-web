import { NextRequest, NextResponse } from 'next/server';
import { SP500_SECTORS, SectorHeatmapData, SectorHeatmapStock, getSectorOrder } from '@/lib/sectorHeatmapUtils';

interface FinnhubQuote {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

interface QuoteData {
  symbol: string;
  currentPrice: number;
  change: number;
  percentChange: number;
}

async function fetchSingleQuote(symbol: string, apiKey: string): Promise<QuoteData> {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
  // Next.js fetch 캐싱 사용 (30초) - 같은 종목 중복 호출 방지
  const res = await fetch(url, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const raw: FinnhubQuote = await res.json();

  if (raw.c === 0 && raw.t === 0) {
    throw new Error(`심볼 없음: ${symbol}`);
  }

  return {
    symbol: symbol.toUpperCase(),
    currentPrice: raw.c,
    change: raw.d,
    percentChange: raw.dp,
  };
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { data: [], fetchedAt: new Date().toISOString(), error: 'API 키 없음' },
      { status: 200 }
    );
  }

  try {
    const sectorOrder = getSectorOrder();

    // 1단계: 모든 unique 종목 수집 (중복 제거)
    const allSymbolsSet = new Set<string>();
    for (const sector of sectorOrder) {
      const symbols = SP500_SECTORS[sector];
      if (symbols) {
        symbols.forEach(s => allSymbolsSet.add(s));
      }
    }
    const allSymbols = Array.from(allSymbolsSet);

    // 2단계: chunk 단위로 병렬 처리 (quotes endpoint와 동일 패턴)
    const CHUNK_SIZE = 10;
    const quotesMap = new Map<string, QuoteData>();

    for (let i = 0; i < allSymbols.length; i += CHUNK_SIZE) {
      const chunk = allSymbols.slice(i, i + CHUNK_SIZE);

      const chunkResults = await Promise.allSettled(
        chunk.map((symbol) => fetchSingleQuote(symbol, apiKey))
      );

      chunkResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          quotesMap.set(result.value.symbol, result.value);
        }
      });

      // chunk 간 400ms 딜레이 (rate limit 회피)
      if (i + CHUNK_SIZE < allSymbols.length) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }

    // 3단계: 섹터별로 데이터 정리
    const result: SectorHeatmapData[] = [];
    for (const sector of sectorOrder) {
      const symbols = SP500_SECTORS[sector];
      if (!symbols) {
        result.push({ sector, stocks: [], count: 0 });
        continue;
      }

      const stocks: SectorHeatmapStock[] = [];
      for (const symbol of symbols) {
        const quote = quotesMap.get(symbol.toUpperCase());
        if (quote) {
          stocks.push({
            symbol: quote.symbol,
            name: quote.symbol,
            currentPrice: quote.currentPrice,
            change: quote.change,
            percentChange: quote.percentChange,
          });
        }
      }

      result.push({ sector, stocks, count: stocks.length });
    }

    const elapsed = Date.now() - startTime;
    console.log(`[Sector Heatmap] ${quotesMap.size}/${allSymbols.length} quotes in ${elapsed}ms`);

    return NextResponse.json(
      {
        data: result,
        fetchedAt: new Date().toISOString(),
        meta: { elapsed, fetched: quotesMap.size, total: allSymbols.length },
      },
      {
        headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=7200' },
      }
    );
  } catch (error) {
    console.error('Sector heatmap error:', error);
    return NextResponse.json(
      { data: [], error: 'API 오류' },
      { status: 200 }
    );
  }
}
