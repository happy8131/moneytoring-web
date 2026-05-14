import { StockMetric } from '@/lib/stockUtils';

interface FinnhubMetricResponse {
  metric: {
    peBasicExclExtraTTM?: number;
    epsBasicExclExtraTTM?: number;
    high52Week?: number;
    low52Week?: number;
    averageVolume10D?: number;
    dividendYieldIndicatedAnnual?: number;
    marketCapitalization?: number;
    [key: string]: number | undefined;
  };
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

    const url = `https://finnhub.io/api/v1/stock/metric?symbol=${encodeURIComponent(
      symbol
    )}&metric=all&token=${apiKey}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data: FinnhubMetricResponse = await res.json();

    const metric: StockMetric = {
      peBasicExclExtraTTM: data.metric?.peBasicExclExtraTTM,
      epsBasicExclExtraTTM: data.metric?.epsBasicExclExtraTTM,
      high52Week: data.metric?.high52Week,
      low52Week: data.metric?.low52Week,
      averageVolume10D: data.metric?.averageVolume10D,
      dividendYieldIndicatedAnnual: data.metric?.dividendYieldIndicatedAnnual,
      marketCapitalization: data.metric?.marketCapitalization,
    };

    return Response.json(metric);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
