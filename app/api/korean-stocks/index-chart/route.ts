/**
 * 한국 증시 지수 차트 데이터 API
 *
 * GET /api/korean-stocks/index-chart?code=kospi&period=1M
 *
 * - 지수별 차트 데이터 제공
 * - 현재: mock 모드만 지원 (업종 일봉 TR ka20002 실제 응답 미확인)
 * - 차트 구조: CandleData 동일 형식
 */

import { NextRequest, NextResponse } from 'next/server';
import { CandleData } from '@/lib/stockUtils';
import { MOCK_DATA_POINTS, isValidIndexCode } from '@/lib/krStockUtils';
import { Period } from '@/lib/stockUtils';

// ────────────────────────────────────────────────────────────────────────────
// 타입 정의
// ────────────────────────────────────────────────────────────────────────────

export interface KrIndexChartResponse {
  code: string;
  name: string;
  period: string;
  data: CandleData[];
  fetchedAt: string;
}

// ────────────────────────────────────────────────────────────────────────────
// 지수 정보 매핑
// ────────────────────────────────────────────────────────────────────────────

const INDEX_MAP: Record<string, { name: string; baseValue: number }> = {
  kospi: { name: '코스피', baseValue: 2500 },
  kosdaq: { name: '코스닥', baseValue: 850 },
  kospi200: { name: '코스피200', baseValue: 385 },
  kospi100: { name: '코스피100', baseValue: 425 },
  kospi50: { name: '코스피50', baseValue: 490 },
};

// ────────────────────────────────────────────────────────────────────────────
// Mock 데이터 생성 함수
// ────────────────────────────────────────────────────────────────────────────

function generateMockIndexCandles(code: string, period: Period): CandleData[] {
  const indexInfo = INDEX_MAP[code.toLowerCase()];
  if (!indexInfo) {
    return [];
  }

  const dataPoints = MOCK_DATA_POINTS[period];
  const baseValue = indexInfo.baseValue;
  const volatility = baseValue * 0.015; // 1.5% 변동성 (지수는 개별 종목보다 낮음)
  const candles: CandleData[] = [];

  let currentValue = baseValue;
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

    // 랜덤 워크로 지수 생성
    const change = (Math.random() - 0.5) * volatility * 2;
    currentValue = Math.max(baseValue * 0.7, currentValue + change);

    const open = currentValue + (Math.random() - 0.5) * volatility * 0.5;
    const close = currentValue;
    const high = Math.max(open, close) + Math.random() * volatility * 0.3;
    const low = Math.min(open, close) - Math.random() * volatility * 0.3;
    const volume = Math.floor(Math.random() * 100_000_000 + 50_000_000); // 거래량 (더 크게)

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
// GET /api/korean-stocks/index-chart
// ────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = (searchParams.get('code') || 'kospi').toLowerCase();
  const period = (searchParams.get('period') || '1M') as Period;

  // 코드 검증
  if (!isValidIndexCode(code)) {
    return NextResponse.json(
      {
        error: '유효한 지수 코드를 입력하세요.',
        validCodes: Object.keys(INDEX_MAP),
      },
      { status: 400 }
    );
  }

  // 현재는 mock 모드만 지원 (업종 일봉 TR ka20002 미확인)
  const mockCandles = generateMockIndexCandles(code, period);
  const indexInfo = INDEX_MAP[code];

  const response: KrIndexChartResponse = {
    code,
    name: indexInfo.name,
    period,
    data: mockCandles,
    fetchedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
