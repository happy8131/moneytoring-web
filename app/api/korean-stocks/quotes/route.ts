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
  pred_cls_prc: string;   // 전일종가
  pred_pre_sig: string;   // 전일대비부호 ("1":상한, "2":상승, "3":보합, "4":하락, "5":하한)
  pred_pre: string;       // 전일대비
  flu_rt: string;         // 등락율 (예: "+1.23")
  trde_qty: string;       // 거래량
  trde_prc: string;       // 거래대금
  open_prc: string;       // 시가
  high_prc: string;       // 고가
  low_prc: string;        // 저가
  up_lmt_prc: string;     // 상한가
  dn_lmt_prc: string;     // 하한가
  mrkt_cls_nm: string;    // 시장구분 (코스피/코스닥)
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
 * 키움 가격 문자열을 숫자로 변환
 * "+82000", "-1500", "82000" 모두 처리
 */
function parseKiwoomPrice(value: string): number {
  if (!value) return 0;
  // 부호와 쉼표 제거 후 파싱
  return parseFloat(value.replace(/[+,]/g, '')) || 0;
}

/**
 * 시장구분명을 표준화
 */
function normalizeMarket(mrktClsNm: string): string {
  if (mrktClsNm.includes('코스피') || mrktClsNm.toUpperCase().includes('KOSPI')) {
    return 'KOSPI';
  }
  if (mrktClsNm.includes('코스닥') || mrktClsNm.toUpperCase().includes('KOSDAQ')) {
    return 'KOSDAQ';
  }
  return mrktClsNm;
}

function transformQuote(symbol: string, raw: KiwoomStockPriceRaw): KoreanStockQuote {
  const currentPrice = parseKiwoomPrice(raw.cur_prc);
  const previousClose = parseKiwoomPrice(raw.pred_cls_prc);
  const change = parseKiwoomPrice(raw.pred_pre);
  // 부호 적용: "2"=상승, "4"=하락, "3"=보합
  const signedChange = raw.pred_pre_sig === '4' || raw.pred_pre_sig === '5'
    ? -Math.abs(change)
    : Math.abs(change);

  return {
    symbol,
    name: raw.stk_nm ?? '',
    currentPrice,
    previousClose,
    change: signedChange,
    percentChange: parseKiwoomPrice(raw.flu_rt),
    volume: parseKiwoomPrice(raw.trde_qty),
    tradingValue: parseKiwoomPrice(raw.trde_prc),
    openPrice: parseKiwoomPrice(raw.open_prc),
    highPrice: parseKiwoomPrice(raw.high_prc),
    lowPrice: parseKiwoomPrice(raw.low_prc),
    upperLimit: parseKiwoomPrice(raw.up_lmt_prc),
    lowerLimit: parseKiwoomPrice(raw.dn_lmt_prc),
    market: normalizeMarket(raw.mrkt_cls_nm ?? ''),
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

// 더미 데이터 생성 함수 (테스트 목적)
function generateMockQuote(symbol: string, name: string): KoreanStockQuote {
  const basePrice = Math.floor(Math.random() * 100000) + 10000;
  const change = Math.floor((Math.random() - 0.5) * 5000);
  const percentChange = parseFloat((change / basePrice * 100).toFixed(2));

  return {
    symbol,
    name,
    currentPrice: basePrice,
    previousClose: basePrice - change,
    change,
    percentChange,
    volume: Math.floor(Math.random() * 10000000),
    tradingValue: Math.floor(basePrice * Math.random() * 10000000),
    openPrice: basePrice + Math.floor((Math.random() - 0.5) * 2000),
    highPrice: basePrice + Math.floor(Math.random() * 5000),
    lowPrice: basePrice - Math.floor(Math.random() * 5000),
    upperLimit: basePrice + Math.floor(basePrice * 0.3),
    lowerLimit: basePrice - Math.floor(basePrice * 0.3),
    market: symbol.startsWith('0') ? 'KOSPI' : 'KOSDAQ',
    updatedAt: new Date().toISOString(),
  };
}

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

  // Mock 모드: Kiwoom API 키 없이도 작동
  const isMock = process.env.KIWOOM_USE_MOCK === 'true';

  if (isMock) {
    // Mock 데이터 반환
    const mockStockNames: Record<string, string> = {
      '005930': '삼성전자',
      '000660': 'SK하이닉스',
      '005380': '현대차',
      '051910': 'LG화학',
      '035720': '카카오',
    };

    const data = symbols.map((symbol) =>
      generateMockQuote(symbol, mockStockNames[symbol] || `종목${symbol}`)
    );

    const responseBody: KoreanStockQuotesResponse = {
      data,
      errors: [],
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(responseBody, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  }

  // 환경 변수 사전 검증 (실제 API 사용 시)
  if (!process.env.KIWOOM_APP_KEY || !process.env.KIWOOM_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Kiwoom API 키가 서버에 설정되지 않았습니다.' },
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
