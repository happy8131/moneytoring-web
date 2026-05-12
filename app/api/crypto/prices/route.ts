import { NextRequest, NextResponse } from 'next/server';

interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  last_updated: string;
}

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  marketCap: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  updatedAt: string;
}

export interface CryptoPricesResponse {
  data: CryptoPrice[];
  errors: { id: string; message: string }[];
  fetchedAt: string;
}

async function fetchCoinGeckoData(
  ids: string[],
  apiKey?: string
): Promise<CryptoPrice[]> {
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };

  if (apiKey) {
    headers['x-cg-demo-api-key'] = apiKey;
  }

  const url = new URL('https://api.coingecko.com/api/v3/coins/markets');
  url.searchParams.append('vs_currency', 'usd');
  url.searchParams.append('ids', ids.join(','));
  url.searchParams.append('order', 'market_cap_desc');
  url.searchParams.append('per_page', Math.min(ids.length, 250).toString());
  url.searchParams.append('sparkline', 'false');
  url.searchParams.append('locale', 'en');

  const res = await fetch(url.toString(), {
    headers,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data: CoinGeckoMarketData[] = await res.json();

  return data.map((coin) => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    image: coin.image,
    currentPrice: coin.current_price,
    priceChange24h: coin.price_change_24h,
    priceChangePercent24h: coin.price_change_percentage_24h,
    marketCap: coin.market_cap,
    volume24h: coin.total_volume,
    high24h: coin.high_24h,
    low24h: coin.low_24h,
    updatedAt: coin.last_updated,
  }));
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.COINGECKO_API_KEY;

  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get('ids');

  if (!idsParam) {
    return NextResponse.json(
      { error: 'ids 파라미터가 필요합니다.' },
      { status: 400 }
    );
  }

  const ids = idsParam
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0)
    .slice(0, 50);

  if (ids.length === 0) {
    return NextResponse.json(
      { error: '유효한 코인 ID가 없습니다.' },
      { status: 400 }
    );
  }

  try {
    const prices = await fetchCoinGeckoData(ids, apiKey);

    const response: CryptoPricesResponse = {
      data: prices,
      errors: [],
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '알 수 없는 오류';

    return NextResponse.json(
      { error: `CoinGecko API 오류: ${message}` },
      { status: 500 }
    );
  }
}
