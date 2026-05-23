import { NextResponse } from 'next/server';
import {
  FOREX_SYMBOLS,
  COMMODITY_SYMBOLS,
  FOREX_LABELS,
  COMMODITY_LABELS,
  type ForexRate,
  type CommodityQuote,
  type ForexCommoditiesResponse,
  type ForexCurrency,
  type CommoditySymbol,
} from '@/lib/forexCommoditiesUtils';

// Finnhub Free Tier는 forex 엔드포인트(/forex/rates, OANDA 심볼)가 모두 403 차단됨.
// open.er-api.com 무료 환율 API로 대체 (API 키 불필요, 무제한)
interface ExchangeRateApiResponse {
  result: 'success' | 'error';
  base_code: string;
  rates: Record<string, number>;
  time_last_update_utc: string;
  'error-type'?: string;
}

interface FinnhubQuote {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

async function fetchForexRates(): Promise<{
  rates: ForexRate[];
  errors: { symbol: string; message: string }[];
}> {
  const errors: { symbol: string; message: string }[] = [];
  try {
    const url = 'https://open.er-api.com/v6/latest/USD';
    const res = await fetch(url, { next: { revalidate: 30 } });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const raw: ExchangeRateApiResponse = await res.json();

    if (raw.result !== 'success' || !raw.rates) {
      throw new Error(raw['error-type'] ?? '환율 응답 형식이 올바르지 않습니다');
    }

    const rates: ForexRate[] = [];
    for (const currency of FOREX_SYMBOLS) {
      const rate = raw.rates[currency];
      if (typeof rate !== 'number' || rate <= 0) {
        errors.push({ symbol: currency, message: '환율 데이터 없음' });
        continue;
      }

      const label = FOREX_LABELS[currency];
      rates.push({
        kind: 'forex',
        symbol: currency,
        pair: label.pair,
        name: label.name,
        rate,
        // 일일 변동률은 제공하지 않으므로 null
        change: null,
        percentChange: null,
      });
    }

    return { rates, errors };
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류';
    return {
      rates: [],
      errors: [{ symbol: 'forex/rates', message }],
    };
  }
}

async function fetchSingleCommodity(
  symbol: CommoditySymbol,
  apiKey: string
): Promise<CommodityQuote> {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
  const res = await fetch(url, { next: { revalidate: 30 } });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const raw: FinnhubQuote = await res.json();

  if (raw.c === 0 && raw.t === 0) {
    throw new Error(`심볼 없음: ${symbol}`);
  }

  const label = COMMODITY_LABELS[symbol];
  return {
    kind: 'commodity',
    symbol,
    name: label.name,
    underlying: label.underlying,
    currentPrice: raw.c,
    change: raw.d,
    percentChange: raw.dp,
  };
}

async function fetchCommodityQuotes(
  apiKey: string
): Promise<{ quotes: CommodityQuote[]; errors: { symbol: string; message: string }[] }> {
  const quotes: CommodityQuote[] = [];
  const errors: { symbol: string; message: string }[] = [];

  const results = await Promise.allSettled(
    COMMODITY_SYMBOLS.map((symbol) => fetchSingleCommodity(symbol, apiKey))
  );

  results.forEach((result, idx) => {
    if (result.status === 'fulfilled') {
      quotes.push(result.value);
    } else {
      errors.push({
        symbol: COMMODITY_SYMBOLS[idx],
        message: result.reason?.message ?? '알 수 없는 오류',
      });
    }
  });

  return { quotes, errors };
}

export async function GET() {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  // 환율과 원자재를 병렬로 호출 (한쪽 실패해도 다른 쪽은 정상 반환)
  // 환율은 open.er-api.com 사용 (Finnhub Free Tier forex 차단됨)
  const [forexResult, commoditiesResult] = await Promise.all([
    fetchForexRates(),
    fetchCommodityQuotes(apiKey),
  ]);

  const response: ForexCommoditiesResponse = {
    forex: forexResult.rates,
    commodities: commoditiesResult.quotes,
    errors: [...forexResult.errors, ...commoditiesResult.errors],
    fetchedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    },
  });
}
