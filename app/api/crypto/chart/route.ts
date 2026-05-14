import { CandleData } from '@/lib/stockUtils';
import { symbolToCoinGeckoId } from '@/lib/crypto-symbols';

type CoinGeckoOHLC = [number, number, number, number, number];

interface CoinGeckoOHLCResponse {
  [key: string]: CoinGeckoOHLC[];
}

function roundToDays(days: number): number {
  const supportedValues = [1, 7, 14, 30, 90, 180, 365];
  for (const value of supportedValues) {
    if (days <= value) {
      return value;
    }
  }
  return 365; // max 값은 API에서 처리
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!symbol || !from || !to) {
      return Response.json(
        { error: '필수 파라미터: symbol, from, to' },
        { status: 400 }
      );
    }

    const fromNum = parseInt(from, 10);
    const toNum = parseInt(to, 10);

    if (isNaN(fromNum) || isNaN(toNum)) {
      return Response.json(
        { error: 'from과 to는 UNIX 타임스탬프여야 합니다.' },
        { status: 400 }
      );
    }

    const coinGeckoId = symbolToCoinGeckoId(symbol);
    const days = roundToDays(Math.ceil((toNum - fromNum) / 86400));

    const apiKey = process.env.COINGECKO_API_KEY;
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    };

    if (apiKey) {
      headers['x-cg-demo-api-key'] = apiKey;
    }

    const url = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
      coinGeckoId
    )}/ohlc?vs_currency=usd&days=${days}`;

    const res = await fetch(url, {
      headers,
      next: { revalidate: 300 }, // 5분 캐시
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data: CoinGeckoOHLC[] = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return Response.json({
        symbol,
        resolution: 'D',
        data: [],
        fetchedAt: new Date().toISOString(),
      });
    }

    // from/to 범위로 필터링하고 CandleData 형식으로 변환
    const candleData: CandleData[] = data
      .map((ohlc) => {
        const timestamp = ohlc[0] / 1000; // ms to seconds
        if (timestamp < fromNum || timestamp > toNum) {
          return null;
        }

        const date = new Date(ohlc[0]);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');

        return {
          t: timestamp,
          o: ohlc[1],
          h: ohlc[2],
          l: ohlc[3],
          c: ohlc[4],
          v: 0, // CoinGecko OHLC endpoint에서는 거래량 미제공
          date: `${year}-${month}-${day}`,
        };
      })
      .filter((item) => item !== null) as CandleData[];

    return Response.json({
      symbol,
      resolution: 'D',
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
