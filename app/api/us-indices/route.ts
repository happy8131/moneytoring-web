/**
 * 미국 주요 지수 조회 API 라우트
 *
 * GET /api/us-indices
 * GET /api/us-indices?indices=sp500,nasdaq,dow
 *
 * - Finnhub /api/v1/quote 엔드포인트 사용
 * - ETF 심볼 기반 (SPY=S&P500, QQQ=NASDAQ-100, DIA=Dow Jones)
 * - 캐시: 30초 revalidate
 */

import { NextRequest, NextResponse } from 'next/server';

// ────────────────────────────────────────────────────────────────────────────
// 지수 심볼 매핑
// ────────────────────────────────────────────────────────────────────────────

const INDEX_MAP: Record<
  string,
  { symbol: string; name: string; fullName: string }
> = {
  sp500: {
    symbol: 'SPY',
    name: 'S&P 500',
    fullName: 'SPDR S&P 500 ETF Trust',
  },
  nasdaq: {
    symbol: 'QQQ',
    name: 'NASDAQ 100',
    fullName: 'Invesco QQQ Trust',
  },
  dow: {
    symbol: 'DIA',
    name: 'Dow Jones',
    fullName: 'SPDR Dow Jones Industrial Average ETF',
  },
};

const DEFAULT_INDICES = ['sp500', 'nasdaq', 'dow'];

// ────────────────────────────────────────────────────────────────────────────
// 타입 정의
// ────────────────────────────────────────────────────────────────────────────

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

export interface USIndexQuote {
  id: string;
  symbol: string;
  name: string;
  fullName: string;
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

export interface USIndicesResponse {
  data: USIndexQuote[];
  errors: { id: string; symbol: string; message: string }[];
  fetchedAt: string;
}

// ────────────────────────────────────────────────────────────────────────────
// 조회 함수
// ────────────────────────────────────────────────────────────────────────────

async function fetchIndexQuote(
  id: string,
  apiKey: string
): Promise<USIndexQuote> {
  const indexInfo = INDEX_MAP[id];
  if (!indexInfo) {
    throw new Error(`알 수 없는 지수 ID: ${id}`);
  }

  const url = `https://finnhub.io/api/v1/quote?symbol=${indexInfo.symbol}&token=${apiKey}`;
  const res = await fetch(url, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error(`Finnhub HTTP ${res.status}`);
  }

  const raw: FinnhubQuote = await res.json();

  if (raw.c === 0 && raw.t === 0) {
    throw new Error(`데이터 없음: ${indexInfo.symbol}`);
  }

  return {
    id,
    symbol: indexInfo.symbol,
    name: indexInfo.name,
    fullName: indexInfo.fullName,
    currentPrice: raw.c,
    change: raw.d ?? 0,
    percentChange: raw.dp ?? 0,
    highPrice: raw.h,
    lowPrice: raw.l,
    openPrice: raw.o,
    previousClose: raw.pc,
    timestamp: raw.t,
    updatedAt: new Date(raw.t * 1000).toISOString(),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// GET /api/us-indices
// ────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'FINNHUB_API_KEY가 서버에 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const indicesParam = searchParams.get('indices');

  const requestedIds = indicesParam
    ? indicesParam
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s in INDEX_MAP)
    : DEFAULT_INDICES;

  if (requestedIds.length === 0) {
    return NextResponse.json(
      {
        error: '유효한 지수 ID가 없습니다.',
        validIds: Object.keys(INDEX_MAP),
      },
      { status: 400 }
    );
  }

  const results = await Promise.allSettled(
    requestedIds.map((id) => fetchIndexQuote(id, apiKey))
  );

  const data: USIndexQuote[] = [];
  const errors: { id: string; symbol: string; message: string }[] = [];

  results.forEach((result, idx) => {
    const id = requestedIds[idx];
    if (result.status === 'fulfilled') {
      data.push(result.value);
    } else {
      errors.push({
        id,
        symbol: INDEX_MAP[id]?.symbol ?? id,
        message: result.reason?.message ?? '알 수 없는 오류',
      });
    }
  });

  const response: USIndicesResponse = {
    data,
    errors,
    fetchedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    },
  });
}
