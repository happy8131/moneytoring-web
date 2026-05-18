import { NextRequest } from 'next/server';
import { KOREAN_STOCKS } from '@/data/korean-stocks';

interface KoreanStockSearchResult {
  symbol: string;
  name: string;
  market: string;
  type: 'stock' | 'etf';
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');

  if (!query) {
    return Response.json({
      data: [],
      message: '검색어를 입력하세요',
    });
  }

  const trimmedQuery = query.trim();

  // 2자 이상 검색 허용 (한글, 영어, 숫자 모두 가능)
  if (trimmedQuery.length < 2) {
    return Response.json({
      data: [],
      message: '2글자 이상 입력하세요',
    });
  }

  const lowerQuery = trimmedQuery.toLowerCase();

  // 종목 검색
  const results: KoreanStockSearchResult[] = KOREAN_STOCKS.filter((stock) => {
    // 한글 이름 검색
    if (stock.name.includes(trimmedQuery)) return true;

    // 영어 이름 검색 (대소문자 무시)
    if (stock.nameEn.toLowerCase().includes(lowerQuery)) return true;

    // 종목코드 검색 (시작 일치)
    if (stock.symbol.startsWith(trimmedQuery)) return true;

    return false;
  })
    .sort((a, b) => {
      // 종목을 ETF보다 먼저 표시
      if (a.type !== b.type) {
        return a.type === 'stock' ? -1 : 1;
      }
      return 0;
    })
    .slice(0, 10) // 최대 10개
    .map((stock) => ({
      symbol: stock.symbol,
      name: stock.name,
      market: stock.market,
      type: stock.type,
    }));

  return Response.json({
    data: results,
    count: results.length,
  });
}
