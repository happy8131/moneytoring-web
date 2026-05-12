import { NextRequest, NextResponse } from 'next/server';

interface CoinGeckoSearchData {
  id: string;
  name: string;
  api_symbol: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  large: string;
}

interface CoinGeckoSearchResponse {
  coins: CoinGeckoSearchData[];
}

export interface CryptoSearchResult {
  id: string;
  name: string;
  symbol: string;
  image: string;
}

export async function GET(request: NextRequest) {
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

  try {
    const url = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const raw: CoinGeckoSearchResponse = await res.json();

    const filtered = raw.coins
      .slice(0, 10)
      .map(
        (coin): CryptoSearchResult => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          image: coin.large,
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
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '알 수 없는 오류';

    return NextResponse.json(
      { error: `CoinGecko API 오류: ${message}` },
      { status: 500 }
    );
  }
}
