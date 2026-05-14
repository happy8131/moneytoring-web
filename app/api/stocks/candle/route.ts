import { CandleData } from '@/lib/stockUtils';

interface FinnhubCandleResponse {
  s: string; // ok or no_data
  t: number[];
  o: number[];
  h: number[];
  l: number[];
  c: number[];
  v: number[];
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
    const resolution = searchParams.get('resolution') || 'D';
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!symbol || !from || !to) {
      return Response.json(
        { error: '필수 파라미터: symbol, from, to' },
        { status: 400 }
      );
    }

    const url = `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(
      symbol
    )}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`;

    const res = await fetch(url, {
      next: { revalidate: 300 }, // 5분 캐시
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data: FinnhubCandleResponse = await res.json();

    if (data.s !== 'ok') {
      return Response.json({
        symbol,
        resolution,
        data: [],
        fetchedAt: new Date().toISOString(),
      });
    }

    const candleData: CandleData[] = data.t.map((timestamp, index) => {
      const date = new Date(timestamp * 1000);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return {
        t: timestamp,
        o: data.o[index],
        h: data.h[index],
        l: data.l[index],
        c: data.c[index],
        v: data.v[index],
        date: `${year}-${month}-${day}`,
      };
    });

    return Response.json({
      symbol,
      resolution,
      data: candleData,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
