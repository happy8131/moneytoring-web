import { CandleData } from '@/lib/stockUtils';
import { fetchYahooCandles } from '@/lib/yahooFinance';

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

    const fromNum = parseInt(from, 10);
    const toNum = parseInt(to, 10);

    if (isNaN(fromNum) || isNaN(toNum)) {
      return Response.json(
        { error: 'from과 to는 UNIX 타임스탬프여야 합니다.' },
        { status: 400 }
      );
    }

    const candleData = await fetchYahooCandles(symbol, fromNum, toNum, resolution);

    return Response.json({
      symbol,
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
