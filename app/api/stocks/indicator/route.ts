import { IndicatorData } from '@/lib/stockUtils';
import { fetchYahooCandles } from '@/lib/yahooFinance';
import { computeRSI, computeSMA } from '@/lib/technicalIndicators';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const resolution = searchParams.get('resolution') || 'D';
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const indicator = searchParams.get('indicator') || 'rsi';
    const timeperiod = searchParams.get('timeperiod');

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

    const defaultPeriod = indicator === 'rsi' ? 14 : 20;
    const period = timeperiod ? parseInt(timeperiod, 10) : defaultPeriod;

    if (isNaN(period) || period < 1) {
      return Response.json(
        { error: 'timeperiod은 1 이상의 정수여야 합니다.' },
        { status: 400 }
      );
    }

    const candleData = await fetchYahooCandles(symbol, fromNum, toNum, resolution);

    if (candleData.length === 0) {
      return Response.json({
        t: [],
        values: [],
        indicator: indicator as 'rsi' | 'sma',
        timeperiod: period,
      });
    }

    const closes = candleData.map((c) => c.c);
    const timestamps = candleData.map((c) => c.t);

    let result;
    if (indicator === 'rsi') {
      result = computeRSI(closes, timestamps, period);
    } else if (indicator === 'sma') {
      result = computeSMA(closes, timestamps, period);
    } else {
      return Response.json(
        { error: '지원되지 않는 지표: ' + indicator },
        { status: 400 }
      );
    }

    return Response.json({
      t: result.t,
      values: result.values,
      indicator: indicator as 'rsi' | 'sma',
      timeperiod: period,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
