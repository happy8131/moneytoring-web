/**
 * 한국 주식 종목 검색 API 라우트
 *
 * GET /api/korean-stocks/search?q=삼성전자
 * GET /api/korean-stocks/search?q=005930
 *
 * - 키움 TR: ka10099 (종목 검색)
 * - 종목명 또는 종목코드로 검색 가능
 * - 결과 최대 20건
 */

import { NextRequest, NextResponse } from 'next/server';
import { kiwoomRequest, KiwoomAPIError } from '@/lib/kiwoom-client';

// ────────────────────────────────────────────────────────────────────────────
// 타입 정의
// ────────────────────────────────────────────────────────────────────────────

/**
 * 키움 종목 검색 응답 (ka10099)
 */
interface KiwoomSearchResultItem {
  stk_cd: string;       // 종목코드
  stk_nm: string;       // 종목명
  mrkt_cls: string;     // 시장구분 코드 ("0":코스피, "10":코스닥)
  mrkt_cls_nm: string;  // 시장구분명
  lst_stk_qty: string;  // 상장주식수
  face_prc: string;     // 액면가
}

interface KiwoomSearchResponse {
  stk_info_list: KiwoomSearchResultItem[];
  return_code: string;
  return_msg: string;
}

export interface KoreanStockSearchResult {
  symbol: string;       // 종목코드
  name: string;         // 종목명
  market: string;       // KOSPI | KOSDAQ
  listedShares: number; // 상장주식수
  faceValue: number;    // 액면가
}

// ────────────────────────────────────────────────────────────────────────────
// 변환 함수
// ────────────────────────────────────────────────────────────────────────────

function normalizeMarketCode(mrktCls: string, mrktClsNm: string): string {
  if (mrktCls === '0' || mrktClsNm.includes('코스피')) return 'KOSPI';
  if (mrktCls === '10' || mrktClsNm.includes('코스닥')) return 'KOSDAQ';
  return mrktClsNm;
}

function transformSearchResult(item: KiwoomSearchResultItem): KoreanStockSearchResult {
  return {
    symbol: item.stk_cd,
    name: item.stk_nm,
    market: normalizeMarketCode(item.mrkt_cls, item.mrkt_cls_nm ?? ''),
    listedShares: parseInt(item.lst_stk_qty?.replace(/,/g, '') ?? '0', 10),
    faceValue: parseInt(item.face_prc?.replace(/,/g, '') ?? '0', 10),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// GET /api/korean-stocks/search
// ────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query || query.length < 1) {
    return NextResponse.json(
      { error: '검색어(q)가 필요합니다. 예: ?q=삼성전자 또는 ?q=005930' },
      { status: 400 }
    );
  }

  // 너무 짧은 검색어는 빈 결과 반환 (불필요한 API 호출 방지)
  if (query.length < 2) {
    return NextResponse.json({ data: [], total: 0 });
  }

  if (!process.env.KIWOOM_APP_KEY || !process.env.KIWOOM_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Kiwoom API 키가 서버에 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  try {
    const response = await kiwoomRequest<KiwoomSearchResponse>({
      trCode: 'ka10099',
      body: {
        stk_nm: query, // 종목명 또는 종목코드
      },
    });

    const items = response.data.stk_info_list ?? [];
    const results = items
      .slice(0, 20)
      .map(transformSearchResult);

    return NextResponse.json(
      { data: results, total: results.length },
      {
        headers: {
          // 검색 결과는 1분 캐시
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (err) {
    if (err instanceof KiwoomAPIError) {
      console.error(`[Kiwoom 검색 오류] ${err.code}: ${err.message}`);
      return NextResponse.json(
        { error: `검색 실패: ${err.message}`, code: err.code },
        { status: err.httpStatus ?? 502 }
      );
    }
    throw err;
  }
}
