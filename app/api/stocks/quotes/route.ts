import { NextRequest, NextResponse } from 'next/server';

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

export interface StockQuote {
  symbol: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  previousClose: number;
  timestamp: number;
  updatedAt: string;
}

export interface QuotesResponse {
  data: StockQuote[];
  errors: { symbol: string; message: string }[];
  fetchedAt: string;
}

async function fetchSingleQuote(
  symbol: string,
  apiKey: string
): Promise<StockQuote> {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
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
    highPrice: raw.h,
    lowPrice: raw.l,
    openPrice: raw.o,
    previousClose: raw.pc,
    timestamp: raw.t,
    updatedAt: new Date(raw.t * 1000).toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get('symbols');

  if (!symbolsParam) {
    return NextResponse.json(
      { error: 'symbols 파라미터가 필요합니다.' },
      { status: 400 }
    );
  }

  const symbols = symbolsParam
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter((s) => /^[A-Z]{1,10}$/.test(s))
    .slice(0, 20);

  if (symbols.length === 0) {
    return NextResponse.json(
      { error: '유효한 심볼이 없습니다.' },
      { status: 400 }
    );
  }

  const CHUNK_SIZE = 10;
  const results: StockQuote[] = [];
  const errors: { symbol: string; message: string }[] = [];

  for (let i = 0; i < symbols.length; i += CHUNK_SIZE) {
    const chunk = symbols.slice(i, i + CHUNK_SIZE);

    const chunkResults = await Promise.allSettled(
      chunk.map((symbol) => fetchSingleQuote(symbol, apiKey))
    );

    chunkResults.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        errors.push({
          symbol: chunk[idx],
          message: result.reason?.message ?? '알 수 없는 오류',
        });
      }
    });

    if (i + CHUNK_SIZE < symbols.length) {
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }

  const response: QuotesResponse = {
    data: results,
    errors,
    fetchedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    },
  });
}
