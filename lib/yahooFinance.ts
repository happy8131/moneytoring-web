import { CandleData } from './stockUtils';

type YahooInterval = '1d' | '1wk' | '1mo';

interface YahooChartResponse {
  chart: {
    result: Array<{
      timestamp: number[];
      indicators: {
        quote: Array<{
          open: (number | null)[];
          high: (number | null)[];
          low: (number | null)[];
          close: (number | null)[];
          volume: (number | null)[];
        }>;
      };
    }> | null;
    error: { code: string; description: string } | null;
  };
}

export function resolutionToInterval(resolution: string): YahooInterval {
  switch (resolution) {
    case 'D':
      return '1d';
    case 'W':
      return '1wk';
    case 'M':
      return '1mo';
    default:
      throw new Error(`Unsupported resolution: ${resolution}`);
  }
}

export async function fetchYahooCandles(
  symbol: string,
  from: number,
  to: number,
  resolution: string
): Promise<CandleData[]> {
  try {
    const interval = resolutionToInterval(resolution);
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      symbol
    )}?period1=${from}&period2=${to}&interval=${interval}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 300 }, // 5분 ISR 캐시
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(`HTTP 429 - Rate limited`);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data: YahooChartResponse = await response.json();

    if (!data.chart.result || data.chart.result.length === 0 || data.chart.error) {
      return [];
    }

    const result = data.chart.result[0];
    const { timestamp, indicators } = result;

    if (!indicators || !indicators.quote || indicators.quote.length === 0) {
      return [];
    }

    const quotes = indicators.quote[0];
    const candleData: CandleData[] = [];

    // 타임스탬프와 OHLCV 데이터를 순회하며 유효한 봉 생성
    for (let i = 0; i < timestamp.length; i++) {
      const close = quotes.close?.[i];

      // close가 null이면 미완성 봉 (보통 현재 진행 중인 봉), 건너뜀
      if (close === null || close === undefined) {
        continue;
      }

      const t = timestamp[i];
      const date = new Date(t * 1000);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');

      candleData.push({
        t,
        o: quotes.open?.[i] || 0,
        h: quotes.high?.[i] || 0,
        l: quotes.low?.[i] || 0,
        c: close,
        v: quotes.volume?.[i] || 0,
        date: `${year}-${month}-${day}`,
      });
    }

    return candleData;
  } catch (error) {
    console.error(`Yahoo Finance fetch error for ${symbol}:`, error);
    throw error;
  }
}
