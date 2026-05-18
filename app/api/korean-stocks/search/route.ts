import { NextRequest } from 'next/server';

// 한국 주식 목록 (기본 종목들)
const KOREAN_STOCKS_LIST = [
  { symbol: '005930', name: '삼성전자', market: 'KOSPI' },
  { symbol: '000660', name: 'SK하이닉스', market: 'KOSPI' },
  { symbol: '005380', name: '현대차', market: 'KOSPI' },
  { symbol: '051910', name: 'LG화학', market: 'KOSPI' },
  { symbol: '035720', name: '카카오', market: 'KOSPI' },
  { symbol: '005490', name: 'POSCO홀딩스', market: 'KOSPI' },
  { symbol: '068270', name: '셀트리온', market: 'KOSPI' },
  { symbol: '207940', name: '삼성바이오로직스', market: 'KOSPI' },
  { symbol: '006800', name: '미래에셋증권', market: 'KOSPI' },
  { symbol: '035250', name: 'CJ', market: 'KOSPI' },
  { symbol: '003670', name: '포스코ICT', market: 'KOSPI' },
  { symbol: '096770', name: 'SK이노베이션', market: 'KOSPI' },
  { symbol: '247540', name: '한국과학기술원', market: 'KOSPI' },
  { symbol: '017670', name: 'SK텔레콤', market: 'KOSPI' },
  { symbol: '030200', name: 'KT', market: 'KOSPI' },
  { symbol: '259960', name: '크래프톤', market: 'KOSPI' },
  { symbol: '251270', name: 'NE능률', market: 'KOSDAQ' },
  { symbol: '086790', name: '하나금융지주', market: 'KOSPI' },
  { symbol: '055550', name: '신한지주', market: 'KOSPI' },
  { symbol: '024110', name: 'LG', market: 'KOSPI' },
];

interface KoreanStockSearchResult {
  symbol: string;
  name: string;
  market: string;
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

  // 한글 2자 이상 또는 6자리 숫자 확인
  const hasKorean = /[가-힣]/.test(trimmedQuery);
  const isValidLength = trimmedQuery.length >= 2;
  const isStockSymbol = /^\d{6}$/.test(trimmedQuery);

  if (!isStockSymbol && (!hasKorean || !isValidLength)) {
    return Response.json({
      data: [],
      message: '한글 2자 이상 또는 6자리 숫자로 검색하세요',
    });
  }

  // 종목 검색
  const results: KoreanStockSearchResult[] = KOREAN_STOCKS_LIST.filter((stock) => {
    const nameMatch = stock.name.includes(trimmedQuery);
    const symbolMatch = stock.symbol.includes(trimmedQuery);
    return nameMatch || symbolMatch;
  }).map((stock) => ({
    symbol: stock.symbol,
    name: stock.name,
    market: stock.market,
  }));

  return Response.json({
    data: results,
    count: results.length,
  });
}
