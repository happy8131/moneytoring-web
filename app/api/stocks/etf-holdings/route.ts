interface FinnhubETFHolding {
  symbol: string;
  name: string;
  share: number;
  value: number;
  pct: number;
}

interface FinnhubETFHoldingsResponse {
  holdings?: FinnhubETFHolding[];
}

export interface ETFHolding {
  symbol: string;
  name: string;
  share: number;
  value: number;
  pct: number;
}

export async function GET(request: Request) {
  try {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return Response.json(
        { error: '필수 파라미터: symbol' },
        { status: 400 }
      );
    }

    const url = `https://finnhub.io/api/v1/etf/holdings?symbol=${encodeURIComponent(
      symbol
    )}&token=${apiKey}`;

    const res = await fetch(url, {
      next: { revalidate: 86400 }, // 1일 캐시
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data: FinnhubETFHoldingsResponse = await res.json();

    const holdings: ETFHolding[] = (data.holdings || [])
      .slice(0, 20)
      .map((item) => ({
        symbol: item.symbol,
        name: item.name,
        share: item.share,
        value: item.value,
        pct: item.pct,
      }));

    return Response.json({
      symbol,
      holdings,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
