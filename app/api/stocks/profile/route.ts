import { StockProfile } from '@/lib/stockUtils';

interface FinnhubProfileResponse {
  country: string;
  currency: string;
  exchange: string;
  finnhubIndustry: string;
  ipo: string;
  logo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
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

    const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(
      symbol
    )}&token=${apiKey}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data: FinnhubProfileResponse = await res.json();

    const profile: StockProfile = {
      name: data.name || '',
      ticker: data.ticker || '',
      exchange: data.exchange || '',
      currency: data.currency || '',
      country: data.country || '',
      logo: data.logo || '',
      weburl: data.weburl || '',
      marketCapitalization: data.marketCapitalization || 0,
      shareOutstanding: data.shareOutstanding || 0,
      finnhubIndustry: data.finnhubIndustry || '',
    };

    return Response.json(profile);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
