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

interface NewsResponse {
  data: FinnhubNews[];
}

async function fetchMarketNews(
  category: string,
  apiKey: string
): Promise<FinnhubNews[]> {
  const url = `https://finnhub.io/api/v1/news?category=${encodeURIComponent(
    category
  )}&token=${apiKey}`;

  const res = await fetch(url, {
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
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
    const category = searchParams.get('category') || 'general';

    const newsItems = await fetchMarketNews(category, apiKey);

    const formattedNews = newsItems.map((item: FinnhubNews) => ({
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
