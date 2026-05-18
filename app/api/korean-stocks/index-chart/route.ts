/**
 * 한국 증시 지수 차트 데이터 API
 *
 * GET /api/korean-stocks/index-chart?code=kospi&period=1M
 *
 * - 지수별 차트 데이터 제공 (실제 indices API 데이터 기반)
 * - 현재 지수값을 기반으로 현실적인 candle 데이터 생성
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

const INDEX_MAP: Record<string, { name: string; code: string }> = {
  kospi: { name: '코스피', code: 'kospi' },
  kosdaq: { name: '코스닥', code: 'kosdaq' },
  kospi200: { name: '코스피200', code: 'kospi200' },
  kospi100: { name: '코스피100', code: 'kospi100' },
  kospi50: { name: '코스피50', code: 'kospi50' },
};

// ────────────────────────────────────────────────────────────────────────────
// 실제 지수 데이터 기반 candle 생성 함수
// ────────────────────────────────────────────────────────────────────────────

/**
 * 실제 현재 지수값을 조회하고, 이를 기반으로 현실적인 candle 데이터를 생성합니다.
 * (주식의 generateCandlesFromQuotes와 유사한 방식)
 */
async function generateCandlesFromCurrentIndex(code: string, period: Period): Promise<CandleData[]> {
  try {
    // 현재 지수값 조회
    const indicesResponse = await fetch(
      `${process.env.KIWOOM_BASE_URL || 'http://localhost:3000'}/api/korean-stocks/indices?codes=${code}`,
      { cache: 'no-store' }
    );

    if (!indicesResponse.ok) {
      console.error(`[KrIndexChart] indices API 오류: ${indicesResponse.status}`);
      return [];
    }

    const indicesData = await indicesResponse.json();
    const index = indicesData.data?.[0];

    if (!index) {
      console.warn(`[KrIndexChart] ${code} 지수 데이터를 찾을 수 없음`);
      return [];
    }

    // 현재 지수값 기반 candle 생성
    const currentValue = index.currentValue;
    const volume = index.volume;
    const openValue = index.openValue;
    const candles: CandleData[] = [];
    const now = Date.now();

    // Period에 따라 시간 간격 결정
    let intervalMs = 24 * 60 * 60 * 1000; // 기본 일봉
    const dataPoints = MOCK_DATA_POINTS[period];

    if (['2Y', '5Y'].includes(period)) {
      intervalMs = 7 * 24 * 60 * 60 * 1000; // 주봉
    } else if (['10Y', 'All'].includes(period)) {
      intervalMs = 30 * 24 * 60 * 60 * 1000; // 월봉
    }

    // 변동성 (지수는 개별 종목보다 낮음, 현재값 기준 ±2%)
    const volatility = currentValue * 0.02;

    // 현재값을 종가로 보장하는 candle 생성
    let lastCloseValue = currentValue; // 현재값부터 시작

    for (let i = dataPoints - 1; i >= 0; i--) {
      const timestamp = now - i * intervalMs;
      const date = new Date(timestamp);
      const dateStr = date.toISOString().split('T')[0];

      // 가장 최근 candle (i=0)은 현재값을 종가로 사용
      let close: number;
      if (i === 0) {
        close = currentValue; // 현재값으로 고정
      } else {
        // 이전(더 최근) candle의 종가를 기반으로 역순 변동 생성
        const change = (Math.random() - 0.5) * volatility * 2;
        close = Math.max(currentValue * 0.8, lastCloseValue + change);
      }

      const open = close + (Math.random() - 0.5) * volatility * 0.5;
      const high = Math.max(open, close) + Math.random() * volatility * 0.3;
      const low = Math.min(open, close) - Math.random() * volatility * 0.3;
      const periodVolume = Math.floor(volume * (0.3 + Math.random() * 0.7)); // volume의 30-100%

      candles.push({
        t: timestamp,
        o: open,
        h: high,
        l: low,
        c: close,
        v: periodVolume,
        date: dateStr,
      });

      lastCloseValue = close;
    }

    return candles;
  } catch (err) {
    console.error('[KrIndexChart] 실제 지수 데이터 조회 실패:', err);
    return [];
  }
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

  // 실제 현재 지수값 기반 candle 데이터 생성
  const candles = await generateCandlesFromCurrentIndex(code, period);
  const indexInfo = INDEX_MAP[code];

  if (candles.length === 0) {
    return NextResponse.json(
      {
        error: `${code}의 차트 데이터를 조회할 수 없습니다.`,
        data: [],
      },
      { status: 503 }
    );
  }

  const response: KrIndexChartResponse = {
    code,
    name: indexInfo.name,
    period,
    data: candles,
    fetchedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
