import { NextRequest, NextResponse } from 'next/server';
import type { CryptoDetail, CryptoDetailResponse, CryptoDeveloperData } from '@/lib/cryptoUtils';

interface CoinGeckoDetailResponse {
  id: string;
  symbol: string;
  name: string;
  image: { thumb: string; small: string; large: string };
  description: { en: string };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    subreddit_url: string;
    repos_url: { github: string[] };
  };
  market_data: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    market_cap_rank: number;
    total_volume: Record<string, number>;
    high_24h: Record<string, number>;
    low_24h: Record<string, number>;
    price_change_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
    ath: Record<string, number>;
    ath_change_percentage: Record<string, number>;
    ath_date: Record<string, string>;
    atl: Record<string, number>;
    atl_change_percentage: Record<string, number>;
    atl_date: Record<string, string>;
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
  };
  community_data: {
    facebook_likes: number | null;
    twitter_followers: number | null;
    reddit_average_posts_48h: number;
    reddit_average_comments_48h: number;
    reddit_subscribers: number | null;
    reddit_accounts_active_48h: number | null;
    telegram_channel_user_count: number | null;
  };
  developer_data: {
    forks: number;
    stars: number;
    subscribers: number;
    total_issues: number;
    closed_issues: number;
    pull_requests_merged: number;
    pull_request_contributors: number;
    code_additions_deletions_4_weeks: { additions: number; deletions: number };
    commit_count_4_weeks: number;
  };
  last_updated: string;
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.COINGECKO_API_KEY;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: '코인 ID가 필요합니다.', data: null, fetchedAt: new Date().toISOString() },
      { status: 400 }
    );
  }

  try {
    const url = new URL('https://api.coingecko.com/api/v3/coins/' + encodeURIComponent(id));
    url.searchParams.append('localization', 'false');
    url.searchParams.append('tickers', 'false');
    url.searchParams.append('market_data', 'true');
    url.searchParams.append('community_data', 'true');
    url.searchParams.append('developer_data', 'true');
    url.searchParams.append('sparkline', 'false');

    const headers: Record<string, string> = {};
    if (apiKey) {
      headers['x-cg-demo-api-key'] = apiKey;
    }

    const response = await fetch(url.toString(), {
      headers,
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: '코인을 찾을 수 없습니다.', data: null, fetchedAt: new Date().toISOString() },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: `CoinGecko API 오류: ${response.status}`, data: null, fetchedAt: new Date().toISOString() },
        { status: response.status }
      );
    }

    const raw: CoinGeckoDetailResponse = await response.json();

    // developer_data 처리: 모든 값이 0이면 null 반환
    let developerData: CryptoDeveloperData | null = null;
    if (raw.developer_data) {
      const isDeveloperDataEmpty =
        raw.developer_data.forks === 0 &&
        raw.developer_data.stars === 0 &&
        raw.developer_data.total_issues === 0 &&
        raw.developer_data.closed_issues === 0 &&
        raw.developer_data.pull_requests_merged === 0 &&
        raw.developer_data.commit_count_4_weeks === 0;

      if (!isDeveloperDataEmpty) {
        developerData = {
          forks: raw.developer_data.forks,
          stars: raw.developer_data.stars,
          totalIssues: raw.developer_data.total_issues,
          closedIssues: raw.developer_data.closed_issues,
          pullRequestsMerged: raw.developer_data.pull_requests_merged,
          commitCount4Weeks: raw.developer_data.commit_count_4_weeks,
          codeAdditions4Weeks: raw.developer_data.code_additions_deletions_4_weeks.additions,
          codeDeletions4Weeks: raw.developer_data.code_additions_deletions_4_weeks.deletions,
        };
      }
    }

    const data: CryptoDetail = {
      id: raw.id,
      symbol: raw.symbol.toUpperCase(),
      name: raw.name,
      image: raw.image.large,
      description: raw.description.en || '',
      links: {
        homepage: raw.links.homepage?.[0] || '',
        subreddit: raw.links.subreddit_url || '',
        github: raw.links.repos_url?.github?.[0] || '',
      },
      marketData: {
        currentPrice: raw.market_data.current_price.usd || 0,
        marketCap: raw.market_data.market_cap.usd || 0,
        marketCapRank: raw.market_data.market_cap_rank || 0,
        totalVolume24h: raw.market_data.total_volume.usd || 0,
        high24h: raw.market_data.high_24h.usd || 0,
        low24h: raw.market_data.low_24h.usd || 0,
        priceChange24h: raw.market_data.price_change_24h || 0,
        priceChangePercent24h: raw.market_data.price_change_percentage_24h || 0,
        priceChangePercent7d: raw.market_data.price_change_percentage_7d || 0,
        priceChangePercent30d: raw.market_data.price_change_percentage_30d || 0,
        priceChangePercent1y: raw.market_data.price_change_percentage_1y || 0,
        ath: raw.market_data.ath.usd || 0,
        athChangePercent: raw.market_data.ath_change_percentage.usd || 0,
        athDate: raw.market_data.ath_date.usd || '',
        atl: raw.market_data.atl.usd || 0,
        atlChangePercent: raw.market_data.atl_change_percentage.usd || 0,
        atlDate: raw.market_data.atl_date.usd || '',
        circulatingSupply: raw.market_data.circulating_supply || 0,
        totalSupply: raw.market_data.total_supply,
        maxSupply: raw.market_data.max_supply,
      },
      communityData: {
        twitterFollowers: raw.community_data.twitter_followers,
        redditSubscribers: raw.community_data.reddit_subscribers,
        redditAvgPosts48h: raw.community_data.reddit_average_posts_48h || 0,
        redditAvgComments48h: raw.community_data.reddit_average_comments_48h || 0,
        redditAccountsActive48h: raw.community_data.reddit_accounts_active_48h,
        telegramUsers: raw.community_data.telegram_channel_user_count,
      },
      developerData,
      fetchedAt: new Date().toISOString(),
    };

    const result: CryptoDetailResponse = {
      data,
      error: null,
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json(
      { error: errorMsg, data: null, fetchedAt: new Date().toISOString() },
      { status: 500 }
    );
  }
}
