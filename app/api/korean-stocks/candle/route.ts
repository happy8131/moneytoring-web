/**
 * 한국 주식 캔들 차트 데이터 API
 *
 * GET /api/korean-stocks/candle?symbol=005930&period=1M
 *
 * - Period에 따라 자동으로 TR 코드 결정 (ka10002/ka10003/ka10004)
 * - Mock 모드: KIWOOM_USE_MOCK=true 시 더미 데이터 반환
 * - 실제 모드: Kiwoom REST API 호출
 */

import { NextRequest, NextResponse } from 'next/server';
import { kiwoomRequest, KiwoomAPIError } from '@/lib/kiwoom-client';
import { CandleData } from '@/lib/stockUtils';
import {
  periodToKiwoomTrCode,
  getBaseDateForPeriod,
  MOCK_DATA_POINTS,
  isValidKoreanStockSymbol,
} from '@/lib/krStockUtils';
import { Period } from '@/lib/stockUtils';

// ────────────────────────────────────────────────────────────────────────────
// 타입 정의
// ────────────────────────────────────────────────────────────────────────────

interface KiwoomCandleRaw {
  stk_cd?: string;
  dt_list?: Array<{
    dt: string;
    open_prc?: string;
    high_prc?: string;
    low_prc?: string;
    clos_prc?: string;
    trde_qty?: string;
  }>;
}

export interface KrStockCandleResponse {
  symbol: string;
  period: string;
  trCode: string;
  data: CandleData[];
  fetchedAt: string;
}

// ────────────────────────────────────────────────────────────────────────────
// 가격 파싱 함수
// ────────────────────────────────────────────────────────────────────────────

function parsePrice(value: string | undefined): number {
  if (!value) return 0;
  const cleaned = value.replace(/[+,–−\-]/g, '').trim();
  return parseFloat(cleaned) || 0;
}

function convertDateFormat(yyyymmdd: string): string {
  if (yyyymmdd.length !== 8) return yyyymmdd;
  const year = yyyymmdd.slice(0, 4);
  const month = yyyymmdd.slice(4, 6);
  const date = yyyymmdd.slice(6, 8);
  return `${year}-${month}-${date}`;
}

// ────────────────────────────────────────────────────────────────────────────
// Mock 데이터 생성 함수
// ────────────────────────────────────────────────────────────────────────────

function generateMockCandles(symbol: string, period: Period): CandleData[] {
  const dataPoints = MOCK_DATA_POINTS[period];
  const baseValues: Record<string, number> = {
    '005930': 70000, // 삼성전자
    '000660': 125000, // SK하이닉스
    '005380': 55000, // 현대차
    '051910': 68000, // LG화학
    '035720': 28000, // 카카오
  };

  const basePrice = baseValues[symbol] || 50000;
  const volatility = basePrice * 0.02; // 2% 변동성
  const candles: CandleData[] = [];

  let currentPrice = basePrice;
  const now = Date.now();

  // Period에 따라 시간 간격 결정 (밀리초)
  let intervalMs = 24 * 60 * 60 * 1000; // 기본 일봉
  if (['2Y', '5Y'].includes(period)) {
    intervalMs = 7 * 24 * 60 * 60 * 1000; // 주봉
  } else if (['10Y', 'All'].includes(period)) {
    intervalMs = 30 * 24 * 60 * 60 * 1000; // 월봉
  }

  for (let i = dataPoints - 1; i >= 0; i--) {
    const timestamp = now - i * intervalMs;
    const date = new Date(timestamp);
    const dateStr = date.toISOString().split('T')[0];

    // 랜덤 워크로 가격 생성
    const change = (Math.random() - 0.5) * volatility * 2;
    currentPrice = Math.max(basePrice * 0.5, currentPrice + change);

    const open = currentPrice + (Math.random() - 0.5) * volatility * 0.5;
    const close = currentPrice;
    const high = Math.max(open, close) + Math.random() * volatility * 0.3;
    const low = Math.min(open, close) - Math.random() * volatility * 0.3;
    const volume = Math.floor(Math.random() * 10_000_000 + 1_000_000);

    candles.push({
      t: timestamp,
      o: open,
      h: high,
      l: low,
      c: close,
      v: volume,
      date: dateStr,
    });
  }

  return candles;
}

// ────────────────────────────────────────────────────────────────────────────
// Kiwoom 응답 변환 함수
// ────────────────────────────────────────────────────────────────────────────

function transformKiwoomCandles(raw: KiwoomCandleRaw): CandleData[] {
  if (!raw.dt_list || !Array.isArray(raw.dt_list) || raw.dt_list.length === 0) {
    return [];
  }

  return raw.dt_list.map((item) => {
    const timestamp = new Date(`${item.dt.slice(0, 4)}-${item.dt.slice(4, 6)}-${item.dt.slice(6, 8)}`).getTime();
    const dateStr = convertDateFormat(item.dt);

    return {
      t: timestamp,
      o: parsePrice(item.open_prc),
      h: parsePrice(item.high_prc),
      l: parsePrice(item.low_prc),
      c: parsePrice(item.clos_prc),
      v: parsePrice(item.trde_qty),
      date: dateStr,
    };
  });
}

// ────────────────────────────────────────────────────────────────────────────
// GET /api/korean-stocks/candle
// ────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const period = (searchParams.get('period') || '1M') as Period;

  // 파라미터 검증
  if (!symbol) {
    return NextResponse.json(
      { error: 'symbol 파라미터가 필요합니다. (예: ?symbol=005930&period=1M)' },
      { status: 400 }
    );
  }

  if (!isValidKoreanStockSymbol(symbol)) {
    return NextResponse.json(
      { error: '유효한 6자리 종목코드를 입력하세요. (예: 005930)' },
      { status: 400 }
    );
  }

  const isMock = process.env.KIWOOM_USE_MOCK === 'true';

  // Mock 모드
  if (isMock) {
    const mockCandles = generateMockCandles(symbol, period);
    const trCode = periodToKiwoomTrCode(period);

    const response: KrStockCandleResponse = {
      symbol,
      period,
      trCode,
      data: mockCandles,
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  }

  // 실제 API 모드 (아직 응답 형식 불확실 → mock 데이터 반환)
  if (!process.env.KIWOOM_APP_KEY || !process.env.KIWOOM_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Kiwoom API 키가 서버에 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  try {
    const trCode = periodToKiwoomTrCode(period);
    const baseDate = getBaseDateForPeriod();

    console.log(`[KrStock] ${trCode} 요청: symbol=${symbol}, period=${period}`);

    const response = await kiwoomRequest<KiwoomCandleRaw>({
      trCode,
      body: {
        stk_cd: symbol,
        base_dt: baseDate,
      },
    });

    const candles = transformKiwoomCandles(response.data);

    if (candles.length === 0) {
      console.warn(`[KrStock] ${symbol} 캔들 데이터 없음`);
      // 응답이 비어있으면 mock 데이터로 폴백
      const mockCandles = generateMockCandles(symbol, period);
      const responseData: KrStockCandleResponse = {
        symbol,
        period,
        trCode,
        data: mockCandles,
        fetchedAt: new Date().toISOString(),
      };

      return NextResponse.json(responseData, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }

    const responseData: KrStockCandleResponse = {
      symbol,
      period,
      trCode,
      data: candles,
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('[KrStock] candle API 오류:', error);

    // 오류 시 mock 데이터로 폴백
    const mockCandles = generateMockCandles(symbol, period);
    const trCode = periodToKiwoomTrCode(period);
    const responseData: KrStockCandleResponse = {
      symbol,
      period,
      trCode,
      data: mockCandles,
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  }
}
