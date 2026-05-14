import { FinancialPeriod } from '@/lib/stockUtils';

interface FinnhubFinancialReport {
  period: string; // 2024-01-01 형식
  quarter: number;
  year: number;
  revenue?: number;
  netIncome?: number;
  operatingIncome?: number;
  totalAssets?: number;
  totalLiabilities?: number;
  freeCashFlow?: number;
}

interface FinnhubFinancialsResponse {
  data: FinnhubFinancialReport[];
}

export async function GET(request: Request) {
  try {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const freq = searchParams.get('freq') || 'annual'; // annual 또는 quarterly

    if (!symbol) {
      return Response.json(
        { error: '필수 파라미터: symbol' },
        { status: 400 }
      );
    }

    const url = `https://finnhub.io/api/v1/stock/financials-reported?symbol=${encodeURIComponent(
      symbol
    )}&freq=${freq}&token=${apiKey}`;

    const res = await fetch(url, {
      next: { revalidate: 86400 }, // 1일 캐시
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data: FinnhubFinancialsResponse = await res.json();

    const financials: FinancialPeriod[] = (data.data || []).map((report) => ({
      year: report.year,
      quarter: report.quarter,
      revenue: report.revenue,
      netIncome: report.netIncome,
      operatingIncome: report.operatingIncome,
      totalAssets: report.totalAssets,
      totalLiabilities: report.totalLiabilities,
      freeCashFlow: report.freeCashFlow,
    }));

    return Response.json({
      symbol,
      freq,
      data: financials,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
