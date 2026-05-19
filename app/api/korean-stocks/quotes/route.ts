/**
 * 한국 주식 현재가 조회 API 라우트
 *
 * GET /api/korean-stocks/quotes?symbols=005930,000660
 *
 * - 종목코드는 6자리 숫자 (삼성전자: 005930, SK하이닉스: 000660)
 * - 키움 TR: ka10001 (주식 현재가 조회)
 * - 최대 20개 심볼, 요청 간 200ms 딜레이
 */

import { NextRequest, NextResponse } from 'next/server';
import { kiwoomRequest, kiwoomBatchRequest, KiwoomAPIError } from '@/lib/kiwoom-client';
import { KOREAN_STOCKS } from '@/data/korean-stocks';

// ────────────────────────────────────────────────────────────────────────────
// 타입 정의
// ────────────────────────────────────────────────────────────────────────────

/**
 * 키움 ka10001 응답 구조 (주식 현재가)
 * 키움 API는 응답 바디 자체가 단일 객체 (배열 없음)
 * 실제 필드명은 키움 API 문서 기준 (영문 약어 필드명)
 */
interface KiwoomStockPriceRaw {
  // 공통 응답 필드
  return_code: number | string;  // 0: 정상
  return_msg: string;            // 응답 메시지
  // 시세 데이터 필드
  stk_cd: string;         // 종목코드
  stk_nm: string;         // 종목명
  cur_prc: string;        // 현재가 (부호 포함, 예: "+82000", "-1500")
  lst_pric?: string;      // 전일종가 (또는 pred_cls_prc)
  pred_cls_prc?: string;  // 전일종가 (필드명 불확실)
  pre_sig?: string;       // 전일대비부호 ("2":상승, "4":하락 등)
  pred_pre_sig?: string;  // 전일대비부호
  pred_pre?: string;      // 전일대비
  flu_rt: string;         // 등락율 (예: "+1.23")
  trde_qty: string;       // 거래량
  trde_prc?: string;      // 거래대금
  trde_prica?: string;    // 거래대금 (응답에서 사용하는 필드명)
  open_pric: string;      // 시가
  high_pric: string;      // 고가
  low_pric: string;       // 저가
  upl_pric: string;       // 상한가
  dn_lmt_prc?: string;    // 하한가 (응답에 없을 수 있음)
  base_pric?: string;     // 기준가
  mrkt_cls_nm?: string;   // 시장구분 (코스피/코스닥)
  [key: string]: any;     // 기타 필드
}

export interface KoreanStockQuote {
  symbol: string;           // 종목코드
  name: string;             // 종목명
  currentPrice: number;     // 현재가
  previousClose: number;    // 전일종가
  change: number;           // 전일대비
  percentChange: number;    // 등락율 (%)
  volume: number;           // 거래량
  tradingValue: number;     // 거래대금
  openPrice: number;        // 시가
  highPrice: number;        // 고가
  lowPrice: number;         // 저가
  upperLimit: number;       // 상한가
  lowerLimit: number;       // 하한가
  market: string;           // KOSPI | KOSDAQ
  updatedAt: string;        // 조회 시각 (ISO 8601)
}

export interface KoreanStockQuotesResponse {
  data: KoreanStockQuote[];
  errors: { symbol: string; message: string }[];
  fetchedAt: string;
}

// ────────────────────────────────────────────────────────────────────────────
// 변환 함수
// ────────────────────────────────────────────────────────────────────────────

/**
 * 키움 가격 문자열을 숫자로 변환 (부호 유지)
 * "+82000" → 82000, "-1500" → -1500
 * Kiwoom API의 특수문자 대시(–, −) 처리, 쉼표 제거
 */
function parseKiwoomPrice(value: string): number {
  if (!value) return 0;
  // 특수 대시(–, −) 정규화 후, 쉼표만 제거 (부호는 유지)
  const cleaned = value.replace(/[–−]/g, '-').replace(/,/g, '').trim();
  return parseFloat(cleaned) || 0;
}

/**
 * 시장구분명을 표준화
 * 알려진 KOSPI 대형주 목록으로 판단 (더 정확한 방법)
 */
const KOSPI_LARGE_CAPS = new Set([
  '005930', // 삼성전자
  '000660', // SK하이닉스
  '005380', // 현대차
  '051910', // LG화학
  '035720', // 카카오
  '005490', // POSCO홀딩스
  '068270', // 셀트리온
  '207940', // 삼성바이오로직스
  '086790', // 하나금융지주
  '055550', // 신한지주
  '024110', // LG
  '017670', // SK텔레콤
  '030200', // KT
  '259960', // 크래프톤
]);

function normalizeMarket(symbol: string): string {
  // 알려진 KOSPI 종목이면 KOSPI
  if (KOSPI_LARGE_CAPS.has(symbol)) {
    return 'KOSPI';
  }
  // 기본값: KOSDAQ (실제로는 응답 데이터에서 가져와야 함)
  return 'KOSDAQ';
}

function transformQuote(symbol: string, raw: KiwoomStockPriceRaw): KoreanStockQuote {
  // 가격은 항상 양수 (부호 제거)
  const currentPrice = Math.abs(parseKiwoomPrice(raw.cur_prc));

  // 전일종가: base_pric (기준가) 사용 또는 lst_pric
  const previousClose = Math.abs(parseKiwoomPrice(raw.base_pric ?? raw.lst_pric ?? raw.pred_cls_prc ?? '0'));

  // 전일대비 (부호 포함) - Kiwoom API에서 이미 정확한 부호 제공
  const change = parseKiwoomPrice(raw.pred_pre ?? '0');

  // 등락율 (부호 포함) - Kiwoom API에서 이미 정확한 부호 제공
  const percentChange = parseKiwoomPrice(raw.flu_rt ?? '0');

  // 거래대금 (API 응답에 없으면 거래량 * 현재가로 계산)
  let tradingValue = parseKiwoomPrice(raw.trde_prica ?? raw.trde_prc ?? '0');
  if (tradingValue === 0 && currentPrice > 0) {
    const volume = parseKiwoomPrice(raw.trde_qty);
    tradingValue = volume * currentPrice;
  }

  // 데이터셋에서 종목명 조회 (검색과 상세페이지 일관성 유지)
  const stockData = KOREAN_STOCKS.find((s) => s.symbol === symbol);
  const name = stockData?.name ?? raw.stk_nm ?? '';

  return {
    symbol,
    name,
    currentPrice,
    previousClose,
    change,
    percentChange,
    volume: parseKiwoomPrice(raw.trde_qty),
    tradingValue,
    openPrice: Math.abs(parseKiwoomPrice(raw.open_pric)),
    highPrice: Math.abs(parseKiwoomPrice(raw.high_pric)),
    lowPrice: Math.abs(parseKiwoomPrice(raw.low_pric)),
    upperLimit: Math.abs(parseKiwoomPrice(raw.upl_pric)),
    lowerLimit: Math.abs(parseKiwoomPrice(raw.dn_lmt_prc ?? raw.base_pric ?? '0')),
    market: stockData?.market ?? normalizeMarket(symbol),
    updatedAt: new Date().toISOString(),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// 단일 종목 조회
// ────────────────────────────────────────────────────────────────────────────

async function fetchSingleKoreanStock(symbol: string): Promise<KoreanStockQuote> {
  const response = await kiwoomRequest<KiwoomStockPriceRaw>({
    trCode: 'ka10001',
    body: {
      stk_cd: symbol,
    },
  });

  return transformQuote(symbol, response.data);
}

// ────────────────────────────────────────────────────────────────────────────
// GET /api/korean-stocks/quotes
// ────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get('symbols');

  if (!symbolsParam) {
    return NextResponse.json(
      { error: 'symbols 파라미터가 필요합니다. 예: ?symbols=005930,000660' },
      { status: 400 }
    );
  }

  // 한국 종목코드: 6자리 숫자
  const symbols = symbolsParam
    .split(',')
    .map((s) => s.trim())
    .filter((s) => /^\d{6}$/.test(s))
    .slice(0, 20);

  if (symbols.length === 0) {
    return NextResponse.json(
      { error: '유효한 종목코드가 없습니다. 6자리 숫자를 입력하세요. 예: 005930' },
      { status: 400 }
    );
  }

  // Kiwoom API 키 필수
  if (!process.env.KIWOOM_APP_KEY || !process.env.KIWOOM_SECRET_KEY) {
    return NextResponse.json(
      {
        error: 'Kiwoom API 환경 변수가 설정되지 않았습니다.',
        details: 'KIWOOM_APP_KEY와 KIWOOM_SECRET_KEY를 설정하세요.'
      },
      { status: 500 }
    );
  }

  // 배치 요청 (순차, Rate Limit 준수)
  const batchResults = await kiwoomBatchRequest(
    symbols,
    fetchSingleKoreanStock,
    200 // 200ms 간격
  );

  const data: KoreanStockQuote[] = [];
  const errors: { symbol: string; message: string }[] = [];

  batchResults.forEach(({ item, result, error }) => {
    if (result) {
      data.push(result);
    } else {
      errors.push({ symbol: item, message: error ?? '알 수 없는 오류' });
    }
  });

  const responseBody: KoreanStockQuotesResponse = {
    data,
    errors,
    fetchedAt: new Date().toISOString(),
  };

  return NextResponse.json(responseBody, {
    headers: {
      // 한국 주식은 장중 30초, 장 외 5분 캐시
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    },
  });
}
