interface FinnhubETFSector {
  exposure: number;
  sector: string;
}

interface FinnhubETFSectorResponse {
  data?: FinnhubETFSector[];
}

export interface ETFSectorExposure {
  sector: string;
  exposure: number;
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

    if (!symbol) {
      return Response.json(
        { error: '필수 파라미터: symbol' },
        { status: 400 }
      );
    }

    const url = `https://finnhub.io/api/v1/etf/sector?symbol=${encodeURIComponent(
      symbol
    )}&token=${apiKey}`;

    const res = await fetch(url, {
      next: { revalidate: 86400 }, // 1일 캐시
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data: FinnhubETFSectorResponse = await res.json();

    const sectors: ETFSectorExposure[] = (data.data || []).map((item) => ({
      sector: item.sector,
      exposure: item.exposure,
    }));

    return Response.json({
      symbol,
      sectors,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
