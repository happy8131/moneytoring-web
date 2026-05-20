import { NextRequest, NextResponse } from 'next/server';
import { SP500_SECTORS, SectorHeatmapData, getSectorOrder } from '@/lib/sectorHeatmapUtils';
import { env } from '@/lib/env';

interface FinnhubQuote {
  o: number;      // Open price
  h: number;      // High price
  l: number;      // Low price
  c: number;      // Close price
  pc: number;     // Previous close price
  t: number;      // Timestamp
}

interface StockCompanyProfile {
  name: string;
  ticker: string;
  exchange: string;
  currency: string;
  country: string;
  logo: string;
  weburl: string;
  marketCapitalization: number;
  shareOutstanding: number;
  finnhubIndustry: string;
}

async function fetchQuote(symbol: string): Promise<FinnhubQuote | null> {
  try {
    if (!env.finnhubApiKey) {
      return null;
    }

    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${env.finnhubApiKey}`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    return {
      o: data.o || 0,
      h: data.h || 0,
      l: data.l || 0,
      c: data.c || 0,
      pc: data.pc || 0,
      t: data.t || 0,
    };
  } catch (error) {
    return null;
  }
}

async function fetchCompanyProfile(symbol: string): Promise<StockCompanyProfile | null> {
  try {
    if (!env.finnhubApiKey) {
      return null;
    }

    const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${env.finnhubApiKey}`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    return data as StockCompanyProfile;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const result: SectorHeatmapData[] = [];
    const sectorOrder = getSectorOrder();

    for (const sector of sectorOrder) {
      const symbols = SP500_SECTORS[sector];
      if (!symbols) continue;

      const stocks = [];

      for (const symbol of symbols) {
        const quote = await fetchQuote(symbol);
        const profile = await fetchCompanyProfile(symbol);

        if (quote && profile) {
          const change = quote.c - quote.pc;
          const percentChange = quote.pc !== 0 ? (change / quote.pc) * 100 : 0;

          stocks.push({
            symbol,
            name: profile.name,
            currentPrice: quote.c,
            change,
            percentChange,
          });
        }
      }

      if (stocks.length > 0) {
        result.push({
          sector,
          count: stocks.length,
          stocks,
        });
      }
    }

    return NextResponse.json(
      { data: result, fetchedAt: new Date().toISOString() },
      {
        headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300' },
      }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json(
      { error: errorMsg, data: [] },
      { status: 500 }
    );
  }
}
