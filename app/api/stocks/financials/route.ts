import { FinancialPeriod } from '@/lib/stockUtils';

interface FinnhubReportItem {
  concept: string;
  label: string;
  unit: string;
  value: number;
}

interface FinnhubFinancialReport {
  period: string;
  quarter: number;
  year: number;
  report: {
    ic: FinnhubReportItem[];
    bs: FinnhubReportItem[];
    cf: FinnhubReportItem[];
  };
}

interface FinnhubFinancialsResponse {
  data: FinnhubFinancialReport[];
}

function findConceptValue(
  items: FinnhubReportItem[],
  ...concepts: string[]
): number | undefined {
  for (const concept of concepts) {
    const withPrefix = `us-gaap_${concept}`;
    const item = items.find((i) => i.concept === concept || i.concept === withPrefix);
    if (item?.value != null) return item.value;
  }
  return undefined;
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
      revenue: findConceptValue(
        report.report?.ic ?? [],
        'Revenues',
        'RevenueFromContractWithCustomerExcludingAssessedTax'
      ),
      netIncome: findConceptValue(report.report?.ic ?? [], 'NetIncomeLoss'),
      operatingIncome: findConceptValue(
        report.report?.ic ?? [],
        'OperatingIncomeLoss'
      ),
      totalAssets: findConceptValue(report.report?.bs ?? [], 'Assets'),
      totalLiabilities: findConceptValue(report.report?.bs ?? [], 'Liabilities'),
      freeCashFlow: findConceptValue(
        report.report?.cf ?? [],
        'NetCashProvidedByUsedInOperatingActivities'
      ),
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
