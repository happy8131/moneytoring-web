/**
 * 한국 주식 전용 유틸리티
 * - 원화 포맷팅
 * - RSI/SMA 계산 래퍼
 * - Period → TR 코드 변환
 */

import { Period } from './stockUtils';
import { CandleData } from './stockUtils';
import { computeRSI, computeSMA } from './technicalIndicators';

// ────────────────────────────────────────────────────────────────────────────
// Period → TR 코드 매핑
// ────────────────────────────────────────────────────────────────────────────

export function periodToKiwoomTrCode(period: Period): 'ka10002' | 'ka10003' | 'ka10004' {
  // 1W, 1M, 3M, 6M, YTD, 1Y → 일봉 (ka10002)
  // 2Y, 5Y → 주봉 (ka10003)
  // 10Y, All → 월봉 (ka10004)

  if (['1W', '1M', '3M', '6M', 'YTD', '1Y'].includes(period)) {
    return 'ka10002';
  }

  if (['2Y', '5Y'].includes(period)) {
    return 'ka10003';
  }

  return 'ka10004';
}

// ────────────────────────────────────────────────────────────────────────────
// 기준일 계산 (YYYYMMDD 형식)
// ────────────────────────────────────────────────────────────────────────────

export function getBaseDateForPeriod(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = String(today.getDate()).padStart(2, '0');
  return `${year}${month}${date}`;
}

// ────────────────────────────────────────────────────────────────────────────
// Period별 데이터 포인트 수 (Mock 데이터 생성용)
// ────────────────────────────────────────────────────────────────────────────

export const MOCK_DATA_POINTS: Record<Period, number> = {
  '1W': 5,
  '1M': 22,
  '3M': 66,
  '6M': 130,
  'YTD': 120,
  '1Y': 252,
  '2Y': 104,
  '5Y': 260,
  '10Y': 120,
  'All': 240,
};

// ────────────────────────────────────────────────────────────────────────────
// 원화 포맷팅
// ────────────────────────────────────────────────────────────────────────────

export function formatKoreanPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  return `₩${value.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}`;
}

export function formatKoreanVolume(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';

  if (value >= 100_000_000) {
    return `${(value / 100_000_000).toLocaleString('ko-KR', { maximumFractionDigits: 1 })}억`;
  }

  if (value >= 10_000) {
    return `${(value / 10_000).toLocaleString('ko-KR', { maximumFractionDigits: 1 })}만`;
  }

  return value.toLocaleString('ko-KR', { maximumFractionDigits: 0 });
}

export function formatKoreanTradingValue(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';

  // 원 단위
  if (value >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toLocaleString('ko-KR', { maximumFractionDigits: 1 })}조`;
  }

  if (value >= 100_000_000) {
    return `${(value / 100_000_000).toLocaleString('ko-KR', { maximumFractionDigits: 1 })}억`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}천`;
  }

  return value.toLocaleString('ko-KR', { maximumFractionDigits: 0 });
}

// ────────────────────────────────────────────────────────────────────────────
// RSI/SMA 계산 래퍼
// ────────────────────────────────────────────────────────────────────────────

interface IndicatorResult {
  timestamp: number;
  value: number | null;
}

export function calcIndicatorsFromCandles(candles: CandleData[]) {
  const closes = candles.map((c) => c.c);
  const timestamps = candles.map((c) => c.t);

  const rsi14 = computeRSI(closes, timestamps, 14);
  const sma5 = computeSMA(closes, timestamps, 5);
  const sma20 = computeSMA(closes, timestamps, 20);
  const sma60 = computeSMA(closes, timestamps, 60);
  const sma120 = computeSMA(closes, timestamps, 120);

  return {
    rsi14,
    sma5,
    sma20,
    sma60,
    sma120,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// 차트 데이터 포맷팅
// ────────────────────────────────────────────────────────────────────────────

interface ChartDataPoint {
  date: string;
  price: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  rsi14?: number | null;
  sma5?: number | null;
  sma20?: number | null;
  sma60?: number | null;
  sma120?: number | null;
}

export function buildCandleChartData(candles: CandleData[]): ChartDataPoint[] {
  return candles.map((candle) => ({
    date: candle.date,
    price: candle.c,
    volume: candle.v,
    high: candle.h,
    low: candle.l,
    open: candle.o,
  }));
}

export function buildIndicatorChartData(
  candles: CandleData[],
  indicators: ReturnType<typeof calcIndicatorsFromCandles>,
  period: Period
): ChartDataPoint[] {
  const isMediumPeriod = ['6M', 'YTD', '1Y', '2Y'].includes(period);

  // Create timestamp to value mappings
  const rsi14Map = new Map(indicators.rsi14.t.map((ts, i) => [ts, indicators.rsi14.values[i]]));
  const sma5Map = new Map(indicators.sma5.t.map((ts, i) => [ts, indicators.sma5.values[i]]));
  const sma20Map = new Map(indicators.sma20.t.map((ts, i) => [ts, indicators.sma20.values[i]]));
  const sma60Map = new Map(indicators.sma60.t.map((ts, i) => [ts, indicators.sma60.values[i]]));
  const sma120Map = new Map(indicators.sma120.t.map((ts, i) => [ts, indicators.sma120.values[i]]));

  return candles.map((candle) => ({
    date: candle.date,
    price: candle.c,
    volume: candle.v,
    high: candle.h,
    low: candle.l,
    open: candle.o,
    rsi14: rsi14Map.get(candle.t) ?? null,
    sma5: sma5Map.get(candle.t) ?? null,
    sma20: sma20Map.get(candle.t) ?? null,
    sma60: isMediumPeriod ? (sma60Map.get(candle.t) ?? null) : undefined,
    sma120: isMediumPeriod ? (sma120Map.get(candle.t) ?? null) : undefined,
  }));
}

// ────────────────────────────────────────────────────────────────────────────
// 종목코드 검증
// ────────────────────────────────────────────────────────────────────────────

export function isValidKoreanStockSymbol(symbol: string): boolean {
  return /^\d{6}$/.test(symbol);
}

export function isValidIndexCode(code: string): boolean {
  return ['kospi', 'kosdaq', 'kospi200', 'kospi100', 'kospi50'].includes(code.toLowerCase());
}
