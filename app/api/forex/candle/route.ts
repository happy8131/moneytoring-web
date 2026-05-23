import { fetchYahooCandles } from '@/lib/yahooFinance';
import { FOREX_SYMBOLS, type ForexCurrency } from '@/lib/forexCommoditiesUtils';

// 환율 historical 데이터는 Yahoo Finance에서 `{quote}=X` 심볼로 조회
// (예: KRW=X → 1 USD = X KRW)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const resolution = searchParams.get('resolution') || 'D';
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!symbol || !from || !to) {
      return Response.json(
        { error: '필수 파라미터: symbol, from, to' },
        { status: 400 }
      );
    }

    // 화이트리스트 검증
    if (!FOREX_SYMBOLS.includes(symbol.toUpperCase() as ForexCurrency)) {
      return Response.json(
        { error: `지원하지 않는 통화: ${symbol}` },
        { status: 400 }
      );
    }

    const fromNum = parseInt(from, 10);
    const toNum = parseInt(to, 10);

    if (isNaN(fromNum) || isNaN(toNum)) {
      return Response.json(
        { error: 'from과 to는 UNIX 타임스탬프여야 합니다.' },
        { status: 400 }
      );
    }

    const yahooSymbol = `${symbol.toUpperCase()}=X`;
    const candleData = await fetchYahooCandles(yahooSymbol, fromNum, toNum, resolution);

    return Response.json({
      symbol: symbol.toUpperCase(),
      yahooSymbol,
      resolution,
      data: candleData,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
