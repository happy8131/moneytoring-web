import { NextRequest, NextResponse } from 'next/server';
import {
  SUPPORTED_COUNTRIES,
  US_INDICATOR_CONFIGS,
  FRED_INDICATOR_CONFIGS,
  type EconomicIndicator,
  type EconomicIndicatorsResponse,
  type SupportedCountry,
} from '@/lib/economicCalendarUtils';

interface FmpIndicatorItem {
  name: string;
  date: string;
  value: number;
}

interface FredObservation {
  date: string;
  value: string;  // FRED는 string으로 반환, "." = 결측치
}

interface FredResponse {
  observations: FredObservation[];
}

async function fetchFredIndicator(
  config: (typeof FRED_INDICATOR_CONFIGS)[number],
  apiKey: string
): Promise<EconomicIndicator | null> {
  // sort_order=desc로 최신순 정렬 후 [0]=latest, [1]=직전 관측치
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${config.seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=10`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json: FredResponse = await res.json();
  const valid = (json.observations ?? [])
    .map((o) => ({ date: o.date, value: parseFloat(o.value) }))
    .filter((o) => Number.isFinite(o.value));

  if (valid.length === 0) return null;

  // 최신 + 직전 관측치 (다른 FMP 지표와 동일한 패턴)
  const latest = valid[0];
  const previous = valid[1] ?? null;

  let changePercent: number | null = null;
  if (previous && previous.value !== 0) {
    changePercent = ((latest.value - previous.value) / previous.value) * 100;
  } else if (previous) {
    changePercent = 0;
  }

  return {
    name: config.seriesId,
    label: config.label,
    country: config.country,
    latest: { date: latest.date, value: latest.value },
    previous: previous ? { date: previous.date, value: previous.value } : null,
    changePercent,
    unit: config.unit,
    decimals: config.decimals,
  };
}

async function fetchUsIndicator(
  config: (typeof US_INDICATOR_CONFIGS)[number],
  apiKey: string
): Promise<EconomicIndicator | null> {
  const url = `https://financialmodelingprep.com/stable/economic-indicators?name=${config.name}&apikey=${apiKey}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  // FMP가 잘못된 이름에 대해 JSON이 아닌 plain "Invalid name" 텍스트를 반환할 수 있음
  const text = await res.text();
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error(`잘못된 응답: ${text.slice(0, 60)}`);
  }

  if (typeof raw === 'string' || !Array.isArray(raw)) {
    throw new Error(typeof raw === 'string' ? raw : 'FMP 응답이 배열이 아님');
  }

  const items = (raw as FmpIndicatorItem[]).filter(
    (i) => typeof i.value === 'number' && i.date
  );
  if (items.length === 0) return null;

  // 최신 → 이전 순서로 정렬 (date 내림차순)
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const latest = items[0];
  const previous = items[1] ?? null;

  let changePercent: number | null = null;
  if (previous && previous.value !== 0) {
    changePercent = ((latest.value - previous.value) / previous.value) * 100;
  }

  return {
    name: config.name,
    label: config.label,
    country: 'US',
    latest: { date: latest.date, value: latest.value },
    previous: previous ? { date: previous.date, value: previous.value } : null,
    changePercent,
    unit: config.unit,
    decimals: config.decimals,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const countriesParam = searchParams.get('countries') || 'US,EU,KR';

  const requestedCountries = countriesParam
    .split(',')
    .map((c) => c.trim().toUpperCase())
    .filter((c): c is SupportedCountry =>
      SUPPORTED_COUNTRIES.includes(c as SupportedCountry)
    );

  const indicators: EconomicIndicator[] = [];
  const errors: { source: string; message: string }[] = [];

  const fmpKey = process.env.FMP_API_KEY;
  const fredKey = process.env.FRED_API_KEY;

  const tasks: Promise<{ source: string; result: PromiseSettledResult<EconomicIndicator | null> }>[] = [];

  // FMP — US 매크로 지표 (FMP는 EU/KR 미지원)
  if (requestedCountries.includes('US')) {
    if (!fmpKey) {
      errors.push({
        source: 'fmp',
        message: 'FMP_API_KEY가 설정되지 않았습니다. .env.local에 FMP_API_KEY를 추가하세요.',
      });
    } else {
      US_INDICATOR_CONFIGS.forEach((cfg) => {
        tasks.push(
          fetchUsIndicator(cfg, fmpKey)
            .then((value) => ({ source: `fmp:${cfg.name}`, result: { status: 'fulfilled', value } as PromiseSettledResult<EconomicIndicator | null> }))
            .catch((reason) => ({ source: `fmp:${cfg.name}`, result: { status: 'rejected', reason } as PromiseSettledResult<EconomicIndicator | null> }))
        );
      });
    }
  }

  // FRED — US/EU/KR 매크로 지표 (요청 국가에 해당하는 시리즈만 호출)
  const fredTargets = FRED_INDICATOR_CONFIGS.filter((cfg) =>
    requestedCountries.includes(cfg.country)
  );

  if (fredTargets.length > 0) {
    if (!fredKey) {
      errors.push({
        source: 'fred',
        message: 'FRED_API_KEY가 설정되지 않아 FOMC 정책금리·유로존·한국 지표를 가져올 수 없습니다. https://fredaccount.stlouisfed.org/apikeys 에서 무료 발급 후 .env.local에 FRED_API_KEY를 추가하세요.',
      });
    } else {
      fredTargets.forEach((cfg) => {
        tasks.push(
          fetchFredIndicator(cfg, fredKey)
            .then((value) => ({ source: `fred:${cfg.seriesId}`, result: { status: 'fulfilled', value } as PromiseSettledResult<EconomicIndicator | null> }))
            .catch((reason) => ({ source: `fred:${cfg.seriesId}`, result: { status: 'rejected', reason } as PromiseSettledResult<EconomicIndicator | null> }))
        );
      });
    }
  }

  const settled = await Promise.all(tasks);
  settled.forEach(({ source, result }) => {
    if (result.status === 'fulfilled' && result.value !== null) {
      indicators.push(result.value);
    } else if (result.status === 'rejected') {
      errors.push({
        source,
        message: result.reason?.message ?? '알 수 없는 오류',
      });
    }
  });

  // 라벨 순 정렬
  indicators.sort((a, b) => a.label.localeCompare(b.label, 'ko'));

  const response: EconomicIndicatorsResponse = {
    indicators,
    errors,
    fetchedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
