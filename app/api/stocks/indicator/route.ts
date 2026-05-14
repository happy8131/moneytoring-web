import { IndicatorData } from '@/lib/stockUtils';

interface FinnhubIndicatorResponse {
  s: string; // ok or no_data
  t: number[];
  values: Array<{ value: number | null }>;
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
    const indicator = searchParams.get('indicator') || 'rsi'; // rsi 또는 sma
    const timeperiod = searchParams.get('timeperiod');

    if (!symbol || !from || !to) {
      return Response.json(
        { error: '필수 파라미터: symbol, from, to' },
        { status: 400 }
      );
    }

    // 기본값: RSI는 14, SMA는 20
    const defaultPeriod = indicator === 'rsi' ? '14' : '20';
    const period = timeperiod || defaultPeriod;

    const url = `https://finnhub.io/api/v1/indicator?symbol=${encodeURIComponent(
      symbol
    )}&resolution=${resolution}&from=${from}&to=${to}&indicator=${indicator}&timeperiod=${period}&token=${apiKey}`;

    const res = await fetch(url, {
      next: { revalidate: 300 }, // 5분 캐시
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data: FinnhubIndicatorResponse = await res.json();

    if (data.s !== 'ok' || !data.t || !data.values) {
      const indicatorData: IndicatorData = {
        t: [],
        values: [],
        indicator: indicator as 'rsi' | 'sma',
        timeperiod: parseInt(period),
      };
      return Response.json(indicatorData);
    }

    // values 배열에서 실제 값 추출 (null 값 제거)
    const values = data.values.map((v) => v.value ?? 0).filter((v) => v !== null);

    const indicatorData: IndicatorData = {
      t: data.t,
      values,
      indicator: indicator as 'rsi' | 'sma',
      timeperiod: parseInt(period),
    };

    return Response.json(indicatorData);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
