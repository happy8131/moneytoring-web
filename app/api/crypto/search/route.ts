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
  marketCapRank: number | null;
  isEtf: boolean;
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
    // 한글 쿼리 감지 (CoinGecko API는 한글을 지원하지 않음)
    const isKorean = /[가-힯]/.test(query);
    if (isKorean) {
      return NextResponse.json(
        { data: [], total: 0 },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          },
        }
      );
    }

    const url = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const raw: CoinGeckoSearchResponse = await res.json();

    // coins 배열이 없거나 배열이 아닌 경우 처리
    if (!raw?.coins || !Array.isArray(raw.coins)) {
      return NextResponse.json(
        { data: [], total: 0 },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          },
        }
      );
    }

    const filtered = raw.coins
      .slice(0, 10)
      .map(
        (coin): CryptoSearchResult => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          image: coin.large,
          marketCapRank: coin.market_cap_rank,
          isEtf: /etf|index fund|basket/i.test(coin.name),
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

    // 한글 검색이나 네트워크 오류 시 빈 배열 반환
    return NextResponse.json(
      { data: [], total: 0, error: message },
      {
        status: 200, // 빈 결과를 정상 응답으로 처리
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  }
}
