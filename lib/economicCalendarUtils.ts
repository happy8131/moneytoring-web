export type SupportedCountry = 'US' | 'EU' | 'KR';

export const SUPPORTED_COUNTRIES: SupportedCountry[] = ['US', 'EU', 'KR'];

export const COUNTRY_LABELS: Record<SupportedCountry, string> = {
  US: '미국',
  EU: '유로존',
  KR: '한국',
};

export interface EconomicIndicator {
  name: string;           // FMP name
  label: string;          // 한국어 라벨
  country: SupportedCountry;
  latest: { date: string; value: number };
  previous: { date: string; value: number } | null;
  changePercent: number | null;
  unit: string;           // '%' 또는 '' 또는 'K' 등
  decimals: number;       // 소수점 자릿수
}

export interface EconomicIndicatorsResponse {
  indicators: EconomicIndicator[];
  errors: { source: string; message: string }[];
  fetchedAt: string;
}

// FMP /stable/economic-indicators?name=<NAME> — 검증된 가능 이름
// 주의: FMP가 반환하는 date는 발표일이 아닌 "기준월 시작일"입니다.
//       예) CPI 4월분은 5월 중순에 발표되지만 FMP는 date=2026-04-01로 표기.
// label에 (월/분기/주) 등 데이터 주기를 명시해 모호함 제거.
export const US_INDICATOR_CONFIGS = [
  { name: 'CPI',                  label: '소비자물가지수 (CPI, 월간)',         unit: '',  decimals: 2 },
  { name: 'inflationRate',        label: '소비자물가 상승률 (전년동월대비)',   unit: '%', decimals: 2 },
  { name: 'totalNonfarmPayroll',  label: '비농업 고용 인원 (NFP, 월간)',       unit: 'K', decimals: 0 },
  { name: 'unemploymentRate',     label: '실업률 (월간)',                      unit: '%', decimals: 1 },
  { name: 'federalFunds',         label: '연방기금 실효금리 (월평균)',         unit: '%', decimals: 2 },
  { name: 'GDP',                  label: 'GDP (분기, 10억 달러)',              unit: 'B', decimals: 2 },
  { name: 'retailSales',          label: '소매판매 (월간, 백만 달러)',         unit: 'M', decimals: 0 },
  { name: 'consumerSentiment',    label: '미시간대 소비자 신뢰지수 (월간)',    unit: '',  decimals: 1 },
  { name: 'initialClaims',        label: '주간 실업수당 청구건수',             unit: '',  decimals: 0 },
] as const;

// FRED API 시리즈 — FOMC 정책금리(US) + 유로존·한국 매크로 지표.
// FRED API: https://api.stlouisfed.org/fred/series/observations?series_id=<ID>&api_key=<KEY>
// 각 시리즈의 최신성은 사용자 키로 검증 완료 (2026-05 시점).
// 주의: 한국 CPI / 유로존 실업률은 FRED OECD 시리즈가 2023년에 멈춰서 제외함.
export const FRED_INDICATOR_CONFIGS: ReadonlyArray<{
  seriesId: string;
  country: SupportedCountry;
  label: string;
  unit: string;
  decimals: number;
}> = [
  // US — FOMC 정책금리 (target rate). 일별 갱신.
  { seriesId: 'DFEDTARU',           country: 'US', label: 'FOMC 정책금리 상단 (target upper)',          unit: '%', decimals: 2 },
  { seriesId: 'DFEDTARL',           country: 'US', label: 'FOMC 정책금리 하단 (target lower)',          unit: '%', decimals: 2 },

  // EU — ECB 금리(일별) + 유로존 매크로 지표(월간/분기).
  { seriesId: 'CP0000EZ19M086NEST', country: 'EU', label: '유로존 HICP 소비자물가지수 (월간)',          unit: '',  decimals: 2 },
  { seriesId: 'ECBMRRFR',           country: 'EU', label: 'ECB 기준금리 (Main Refi, 일별)',             unit: '%', decimals: 2 },
  { seriesId: 'ECBDFR',             country: 'EU', label: 'ECB 예치금리 (Deposit Facility, 일별)',     unit: '%', decimals: 2 },
  { seriesId: 'IRLTLT01EZM156N',    country: 'EU', label: '유로존 10년물 국채 수익률 (월간)',          unit: '%', decimals: 2 },
  { seriesId: 'CLVMNACSCAB1GQEA19', country: 'EU', label: '유로존 실질 GDP (분기, 백만 EUR chain)',    unit: '',  decimals: 0 },

  // KR — BOK 정책금리는 FRED에 직접 시리즈가 없어 OECD 단기금리(IRSTCI01)로 근사.
  { seriesId: 'IRSTCI01KRM156N',    country: 'KR', label: '한국 단기금리 (OECD, 정책금리 근사, 월간)', unit: '%', decimals: 2 },
  { seriesId: 'LRHUTTTTKRM156S',    country: 'KR', label: '한국 실업률 (월간)',                         unit: '%', decimals: 1 },
  { seriesId: 'IRLTLT01KRM156N',    country: 'KR', label: '한국 10년물 국채 수익률 (월간)',            unit: '%', decimals: 2 },
  { seriesId: 'IR3TIB01KRM156N',    country: 'KR', label: '한국 91일 CD 금리 (월간)',                   unit: '%', decimals: 2 },
  { seriesId: 'NGDPRSAXDCKRQ',      country: 'KR', label: '한국 실질 GDP (분기, 백만 원)',              unit: '',  decimals: 0 },
];

export function changeColorClass(change: number | null): string {
  if (change === null) return 'text-muted-foreground';
  if (change > 0) return 'text-green-600';
  if (change < 0) return 'text-red-600';
  return 'text-muted-foreground';
}

export function formatValue(value: number, unit: string, decimals: number): string {
  const formatted = value.toLocaleString('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  if (!unit) return formatted;
  return `${formatted}${unit}`;
}

export function formatChange(change: number | null): string {
  if (change === null) return '-';
  if (change === 0) return '0.00%';
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return iso;
  }
}
