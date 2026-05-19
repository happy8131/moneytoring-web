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
      console.error('[ETF Holdings API] FINNHUB_API_KEY is not set');
      return Response.json(
        { error: 'API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }
    console.log('[ETF Holdings API] FINNHUB_API_KEY loaded successfully');

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

    console.log('[ETF Holdings API] Fetching from Finnhub:', url.replace(apiKey, '***'));

    const res = await fetch(url);

    console.log('[ETF Holdings API] Finnhub response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[ETF Holdings API] Finnhub error response:', errorText);
      throw new Error(`Finnhub HTTP ${res.status}: ${errorText}`);
    }

    const data: FinnhubETFHoldingsResponse = await res.json();
    console.log('[ETF Holdings API] Data received:', data);

    const holdings: ETFHolding[] = (data.holdings || [])
      .slice(0, 20)
      .map((item) => ({
        symbol: item.symbol,
        name: item.name,
        share: item.share,
        value: item.value,
        pct: item.pct,
      }));

    return Response.json(
      {
        symbol,
        holdings,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[ETF Holdings API] Error:', errorMessage);
    console.error('[ETF Holdings API] Full error:', error);
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
