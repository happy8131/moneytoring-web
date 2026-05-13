export interface ExchangeRateResponse {
  usdToKrw: number;
  krwToUsd: number;
  updatedAt: string;
}

export async function GET(): Promise<Response> {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate');
    }

    const data = await response.json();
    const usdToKrw = data.rates?.KRW ?? 1350;
    const krwToUsd = 1 / usdToKrw;

    return Response.json(
      {
        usdToKrw,
        krwToUsd,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error) {
    const fallbackRate = 1350;
    return Response.json(
      {
        usdToKrw: fallbackRate,
        krwToUsd: 1 / fallbackRate,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 's-maxage=300',
        },
      }
    );
  }
}
