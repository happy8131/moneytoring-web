/**
 * 한국 주요 지수 조회 API 라우트
 *
 * GET /api/korean-stocks/indices
 * GET /api/korean-stocks/indices?codes=kospi,kosdaq,kospi200
 *
 * - 키움 TR: ka20001 (업종 현재가 조회)
 * - 업종 코드: 001=코스피, 101=코스닥, 200=코스피200
 */

import { NextRequest, NextResponse } from 'next/server';
import { kiwoomRequest, kiwoomBatchRequest, KiwoomAPIError } from '@/lib/kiwoom-client';

// ────────────────────────────────────────────────────────────────────────────
// 지수 코드 매핑
// ────────────────────────────────────────────────────────────────────────────

const INDEX_CODE_MAP: Record<string, { upjongCode: string; name: string }> = {
  kospi: { upjongCode: '001', name: '코스피' },
  kosdaq: { upjongCode: '101', name: '코스닥' },
  kospi200: { upjongCode: '200', name: '코스피200' },
  kospi100: { upjongCode: '207', name: '코스피100' },
  kospi50: { upjongCode: '208', name: '코스피50' },
};

const DEFAULT_INDICES = ['kospi', 'kosdaq', 'kospi200'];

// ────────────────────────────────────────────────────────────────────────────
// 타입 정의
// ────────────────────────────────────────────────────────────────────────────

/**
 * 키움 업종 현재가 응답 (ka20001)
 */
interface KiwoomIndexRaw {
  upjong_cd: string;      // 업종코드
  upjong_nm: string;      // 업종명
  cur_prc: string;        // 현재가 (지수값)
  pred_pre_sig: string;   // 전일대비부호
  pred_pre: string;       // 전일대비
  flu_rt: string;         // 등락율
  acc_trde_qty: string;   // 누적거래량
  acc_trde_prc: string;   // 누적거래대금
  open_prc: string;       // 시가
  high_prc: string;       // 고가
  low_prc: string;        // 저가
}

export interface KoreanIndexQuote {
  code: string;           // 지수 코드 키 (kospi, kosdaq 등)
  indexCode: string;      // 업종코드 (001, 101 등)
  name: string;           // 지수명
  currentValue: number;   // 현재 지수값
  change: number;         // 전일대비
  percentChange: number;  // 등락율 (%)
  volume: number;         // 누적거래량
  tradingValue: number;   // 누적거래대금
  openValue: number;      // 시가
  highValue: number;      // 고가
  lowValue: number;       // 저가
  updatedAt: string;      // 조회 시각
}

// ────────────────────────────────────────────────────────────────────────────
// 조회 함수
// ────────────────────────────────────────────────────────────────────────────

function parseIndexValue(value: string): number {
  if (!value) return 0;
  return parseFloat(value.replace(/[+,]/g, '')) || 0;
}

async function fetchSingleIndex(
  code: string
): Promise<KoreanIndexQuote> {
  const indexInfo = INDEX_CODE_MAP[code];
  if (!indexInfo) {
    throw new Error(`알 수 없는 지수 코드: ${code}`);
  }

  const response = await kiwoomRequest<KiwoomIndexRaw>({
    trCode: 'ka20001',
    body: {
      upjong_tp: '0',             // 업종구분: 0=코스피, 1=코스닥
      upjong_cd: indexInfo.upjongCode,
    },
  });

  const raw = response.data;
  const change = parseIndexValue(raw.pred_pre);
  const signedChange =
    raw.pred_pre_sig === '4' || raw.pred_pre_sig === '5'
      ? -Math.abs(change)
      : Math.abs(change);

  return {
    code,
    indexCode: indexInfo.upjongCode,
    name: raw.upjong_nm || indexInfo.name,
    currentValue: parseIndexValue(raw.cur_prc),
    change: signedChange,
    percentChange: parseIndexValue(raw.flu_rt),
    volume: parseIndexValue(raw.acc_trde_qty),
    tradingValue: parseIndexValue(raw.acc_trde_prc),
    openValue: parseIndexValue(raw.open_prc),
    highValue: parseIndexValue(raw.high_prc),
    lowValue: parseIndexValue(raw.low_prc),
    updatedAt: new Date().toISOString(),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// GET /api/korean-stocks/indices
// ────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  if (!process.env.KIWOOM_APP_KEY || !process.env.KIWOOM_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Kiwoom API 키가 서버에 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const codesParam = searchParams.get('codes');

  // 요청된 지수 코드 파싱 (없으면 기본값 사용)
  const requestedCodes = codesParam
    ? codesParam
        .split(',')
        .map((c) => c.trim().toLowerCase())
        .filter((c) => c in INDEX_CODE_MAP)
    : DEFAULT_INDICES;

  if (requestedCodes.length === 0) {
    return NextResponse.json(
      {
        error: '유효한 지수 코드가 없습니다.',
        validCodes: Object.keys(INDEX_CODE_MAP),
      },
      { status: 400 }
    );
  }

  const batchResults = await kiwoomBatchRequest(
    requestedCodes,
    fetchSingleIndex,
    200
  );

  const data: KoreanIndexQuote[] = [];
  const errors: { code: string; message: string }[] = [];

  batchResults.forEach(({ item, result, error }) => {
    if (result) {
      data.push(result);
    } else {
      errors.push({ code: item, message: error ?? '알 수 없는 오류' });
    }
  });

  return NextResponse.json(
    { data, errors, fetchedAt: new Date().toISOString() },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    }
  );
}
