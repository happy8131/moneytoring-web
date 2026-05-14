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

// 한국 주식 회사명 (Finnhub Company News API용)
const KOREAN_COMPANIES = [
  'Samsung',
  'SK Hynix',
  'LG Electronics',
  'Hyundai',
  'Celltrion',
  'Naver',
  'Kakao',
  'ASML',  // 한국 기업은 아니지만 한국 IT 산업과 관련
];

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

async function fetchCompanyNews(
  symbol: string,
  apiKey: string
): Promise<FinnhubNews[]> {
  const url = `https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(
    symbol
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

async function fetchKoreanNews(
  apiKey: string
): Promise<FinnhubNews[]> {
  try {
    const newsPromises = KOREAN_COMPANIES.map(company =>
      fetchCompanyNews(company, apiKey).catch(() => [])
    );

    const allNews = await Promise.all(newsPromises);
    const mergedNews = allNews.flat();

    // 중복 제거 및 최신순 정렬
    const uniqueNews = Array.from(
      new Map(mergedNews.map(item => [item.id, item])).values()
    );

    return uniqueNews.sort(
      (a, b) => (b.datetime || 0) - (a.datetime || 0)
    );
  } catch (error) {
    console.error('한국 뉴스 조회 실패:', error);
    return [];
  }
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

    let newsItems: FinnhubNews[] = [];

    // 한국 뉴스: 한국 주식 심볼로 조회
    if (category === 'korea') {
      newsItems = await fetchKoreanNews(apiKey);
    } else {
      // 기타 카테고리: Finnhub 일반 뉴스 API 사용
      newsItems = await fetchMarketNews(category, apiKey);
    }

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
