import { NextRequest, NextResponse } from 'next/server';

interface FinnhubSearchResult {
  count: number;
  result: {
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
  }[];
}

export interface StockSearchResult {
  symbol: string;
  displaySymbol: string;
  description: string;
  type: string;
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API 키 미설정' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query || query.length < 1) {
    return NextResponse.json(
      { error: '검색어(q)가 필요합니다.' },
      { status: 400 }
    );
  }

  if (query.length < 2) {
    return NextResponse.json({ data: [], total: 0 });
  }

  const url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${apiKey}`;
  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `Finnhub API 오류: ${res.status}` },
      { status: res.status }
    );
  }

  const raw: FinnhubSearchResult = await res.json();

  const ALLOWED_TYPES = ['Common Stock', 'ETP'];
  // 중복 심볼 제거 (같은 심볼이 여러 거래소에서 나타날 수 있음)
  const seen = new Set<string>();
  const filtered = raw.result
    .filter((item) => {
      if (seen.has(item.symbol)) return false; // 중복된 심볼은 건너뛰기
      if (!ALLOWED_TYPES.includes(item.type)) return false;
      seen.add(item.symbol);
      return true;
    })
    .slice(0, 10)
    .map(
      (item): StockSearchResult => ({
        symbol: item.symbol,
        displaySymbol: item.displaySymbol,
        description: item.description,
        type: item.type,
      })
    );

  return NextResponse.json(
    { data: filtered, total: filtered.length },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    }
  );
}
