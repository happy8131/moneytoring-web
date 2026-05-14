interface FinnhubNews {
  category?: string;
  datetime?: number;
  headline?: string;
  id?: number;
  image?: string;
  related?: string;
  source?: string;
  summary?: string;
  url?: string;
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

    // 기본값: 30일 전부터 오늘까지
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const from = searchParams.get('from') || getDateString(thirtyDaysAgo);
    const to = searchParams.get('to') || getDateString(now);

    if (!symbol) {
      return Response.json(
        { error: '필수 파라미터: symbol' },
        { status: 400 }
      );
    }

    const url = `https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(
      symbol
    )}&from=${from}&to=${to}&token=${apiKey}`;

    const res = await fetch(url, {
      next: { revalidate: 600 }, // 10분 캐시
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const newsItems: FinnhubNews[] = await res.json();

    const formattedNews = (Array.isArray(newsItems) ? newsItems : []).map((item: FinnhubNews) => ({
      id: String(item.id || ''),
      headline: item.headline || '',
      summary: item.summary || '',
      source: item.source || '',
      url: item.url || '',
      image: item.image || '',
      datetime: item.datetime || 0,
      category: item.category || '',
      related: item.related || '',
    }));

    return Response.json(formattedNews);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function getDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
