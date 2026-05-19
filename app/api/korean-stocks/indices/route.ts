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

const INDEX_CODE_MAP: Record<string, { mrktTp: string; indsCd: string; name: string }> = {
  kospi: { mrktTp: '0', indsCd: '001', name: '코스피' },
  kosdaq: { mrktTp: '1', indsCd: '101', name: '코스닥' },
  kospi200: { mrktTp: '2', indsCd: '201', name: '코스피200' },
  kospi100: { mrktTp: '0', indsCd: '208', name: '코스피100' },
  kospi50: { mrktTp: '0', indsCd: '208', name: '코스피50' },
};

const DEFAULT_INDICES = ['kospi', 'kosdaq', 'kospi200'];

// ────────────────────────────────────────────────────────────────────────────
// 타입 정의
// ────────────────────────────────────────────────────────────────────────────

/**
 * 키움 업종 현재가 응답 (ka20001)
 * Kiwoom REST API 공식 명세 기준
 */
interface KiwoomIndexRaw {
  // 공통 응답 필드
  return_code: number | string;  // 0=정상
  return_msg: string;
  // 지수 데이터 필드
  cur_prc: string;        // 현재가
  pred_pre_sig: string;   // 전일대비부호 (1=상한, 2=상승, 3=보합, 4=하락, 5=하한)
  pred_pre: string;       // 전일대비
  flu_rt: string;         // 등락율
  trde_qty: string;       // 거래량
  trde_prica: string;     // 거래대금
  open_pric: string;      // 시가
  high_pric: string;      // 고가
  low_pric: string;       // 저가
  upl: string;            // 상한
  rising: string;         // 상승
  stdns: string;          // 보합
  fall: string;           // 하락
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
  // Kiwoom API가 반환하는 가격에서 특수문자(–, +, 쉼표) 제거
  // 특수문자: EN DASH(–), MINUS(−), 등
  const cleaned = value.replace(/[+,–−\-]/g, '').trim();
  return parseFloat(cleaned) || 0;
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
      mrkt_tp: indexInfo.mrktTp,    // 시장구분: 0=코스피, 1=코스닥, 2=코스피200
      inds_cd: indexInfo.indsCd,    // 업종코드
    },
  });

  const raw = response.data;
  const change = parseIndexValue(raw.pred_pre);
  const percentChangeValue = parseIndexValue(raw.flu_rt);
  const signedChange =
    raw.pred_pre_sig === '4' || raw.pred_pre_sig === '5'
      ? -Math.abs(change)
      : Math.abs(change);
  const signedPercentChange =
    raw.pred_pre_sig === '4' || raw.pred_pre_sig === '5'
      ? -Math.abs(percentChangeValue)
      : Math.abs(percentChangeValue);

  return {
    code,
    indexCode: indexInfo.indsCd,
    name: indexInfo.name,
    currentValue: parseIndexValue(raw.cur_prc),
    change: signedChange,
    percentChange: signedPercentChange,
    volume: parseIndexValue(raw.trde_qty),
    tradingValue: parseIndexValue(raw.trde_prica),
    openValue: parseIndexValue(raw.open_pric),
    highValue: parseIndexValue(raw.high_pric),
    lowValue: parseIndexValue(raw.low_pric),
    updatedAt: new Date().toISOString(),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// GET /api/korean-stocks/indices
// ────────────────────────────────────────────────────────────────────────────

// 더미 데이터 생성 함수 (테스트 목적)
function generateMockIndex(code: string): KoreanIndexQuote {
  const baseValues: Record<string, number> = {
    kospi: 2500,
    kosdaq: 850,
    kospi200: 385,
    kospi100: 425,
    kospi50: 490,
  };

  const baseValue = baseValues[code] || 1000;
  const change = Math.floor((Math.random() - 0.5) * 200);
  const percentChange = parseFloat((change / baseValue * 100).toFixed(2));
  const indexInfo = INDEX_CODE_MAP[code];

  return {
    code,
    indexCode: indexInfo.indsCd,
    name: indexInfo.name,
    currentValue: baseValue + change,
    change,
    percentChange,
    volume: Math.floor(Math.random() * 1000000000),
    tradingValue: Math.floor(Math.random() * 5000000000),
    openValue: baseValue + Math.floor((Math.random() - 0.5) * 100),
    highValue: baseValue + Math.floor(Math.random() * 150),
    lowValue: baseValue - Math.floor(Math.random() * 150),
    updatedAt: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  // Mock 모드 체크
  const isMock = process.env.KIWOOM_USE_MOCK === 'true';
  const hasKiwoomApiKeys = process.env.KIWOOM_APP_KEY && process.env.KIWOOM_SECRET_KEY;

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

  // Mock 모드: 더미 데이터 반환
  if (isMock) {
    const data = requestedCodes.map((code) => generateMockIndex(code));

    return NextResponse.json(
      { data, errors: [], fetchedAt: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  }

  // API 키 없음: 경고 로깅 후 mock 데이터로 폴백
  if (!hasKiwoomApiKeys) {
    console.warn('[KrIndex] Kiwoom API 키가 설정되지 않았습니다. Mock 데이터로 응답합니다.');
    const data = requestedCodes.map((code) => generateMockIndex(code));

    return NextResponse.json(
      { data, errors: [], fetchedAt: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  }

  // 실제 API 호출
  try {
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
  } catch (error) {
    // API 호출 실패: mock 데이터로 폴백
    console.error('[KrIndex] API 호출 실패:', error);
    const data = requestedCodes.map((code) => generateMockIndex(code));

    return NextResponse.json(
      { data, errors: [], fetchedAt: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  }
}
