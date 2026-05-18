'use client';

import { useState, useRef, useEffect } from 'react';
import { useStockSearch } from '@/hooks/useStockSearch';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';

interface StockSearchItem {
  symbol: string;
  displaySymbol: string;
  description: string;
  type: string;
}

interface CryptoSearchResult {
  id: string;
  name: string;
  symbol: string;
  image: string;
  marketCapRank: number | null;
  isEtf: boolean;
}

interface KoreanStockSearchResult {
  symbol: string;
  name: string;
  market: string;
}

async function searchCrypto(query: string): Promise<CryptoSearchResult[]> {
  const res = await fetch(`/api/crypto/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error(`검색 실패: ${res.status}`);
  }
  const json = await res.json();
  return json.data || [];
}

async function searchKoreanStocks(query: string): Promise<KoreanStockSearchResult[]> {
  const res = await fetch(`/api/korean-stocks/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error(`검색 실패: ${res.status}`);
  }
  const json = await res.json();
  return json.data || [];
}

function isKoreanQuery(query: string): boolean {
  return /^[가-힣]{2,}/.test(query) || /^\d{6}$/.test(query);
}

export function UnifiedSearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  // 디바운스 (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // 주식 검색
  const { data: stockResults } = useStockSearch({
    query: debouncedQuery,
    enabled: debouncedQuery.length >= 2,
  });

  // 암호화폐 검색
  const { data: cryptoResults } = useQuery({
    queryKey: ['crypto', 'search', debouncedQuery],
    queryFn: () => searchCrypto(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60_000,
  });

  // 한국 주식 검색
  const { data: koreanStockResults } = useQuery({
    queryKey: ['kr-stocks', 'search', debouncedQuery],
    queryFn: () => searchKoreanStocks(debouncedQuery),
    enabled: isKoreanQuery(debouncedQuery),
    staleTime: 5 * 60_000,
  });

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectStock = (symbol: string) => {
    router.push(`/stocks/${symbol}`);
    setQuery('');
    setIsOpen(false);
  };

  const handleSelectCrypto = (id: string) => {
    router.push(`/crypto/${id}`);
    setQuery('');
    setIsOpen(false);
  };

  const handleSelectKoreanStock = (symbol: string) => {
    router.push(`/kr-stocks/${symbol}`);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
  };

  const hasResults =
    (stockResults?.data && stockResults.data.length > 0) ||
    (cryptoResults && cryptoResults.length > 0) ||
    (koreanStockResults && koreanStockResults.length > 0);

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="주식 · 암호화폐 검색 (예: Apple, BTC, DPI)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && debouncedQuery.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {hasResults ? (
            <div className="divide-y divide-border">
              {/* 주식 섹션 */}
              {stockResults?.data && stockResults.data.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground">
                    주식
                  </div>
                  <ul className="divide-y divide-border">
                    {stockResults.data.map((result: StockSearchItem) => (
                      <li key={result.symbol}>
                        <button
                          onClick={() => handleSelectStock(result.symbol)}
                          className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-start justify-between"
                        >
                          <div className="flex-1">
                            <p className="font-semibold">{result.displaySymbol}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {result.description}
                            </p>
                          </div>
                          <span
                            className={`ml-2 text-xs px-2 py-1 rounded flex-shrink-0 ${
                              result.type === 'ETP'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {result.type === 'ETP' ? 'ETF' : '주식'}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 한국 주식 섹션 */}
              {koreanStockResults && koreanStockResults.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground">
                    한국 주식
                  </div>
                  <ul className="divide-y divide-border">
                    {koreanStockResults.map((result: KoreanStockSearchResult) => (
                      <li key={result.symbol}>
                        <button
                          onClick={() => handleSelectKoreanStock(result.symbol)}
                          className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-start justify-between"
                        >
                          <div className="flex-1">
                            <p className="font-semibold">{result.symbol}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {result.name}
                            </p>
                          </div>
                          <span className="ml-2 text-xs px-2 py-1 rounded flex-shrink-0 bg-green-500/20 text-green-400">
                            {result.market}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 암호화폐 섹션 */}
              {cryptoResults && cryptoResults.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground">
                    암호화폐
                  </div>
                  <ul className="divide-y divide-border">
                    {cryptoResults.map((result: CryptoSearchResult) => (
                      <li key={result.id}>
                        <button
                          onClick={() => handleSelectCrypto(result.id)}
                          className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-start justify-between"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {result.image && (
                              <img
                                src={result.image}
                                alt={result.name}
                                className="w-5 h-5 flex-shrink-0 rounded-full"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold">{result.symbol}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {result.name}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`ml-2 text-xs px-2 py-1 rounded flex-shrink-0 ${
                              result.isEtf
                                ? 'bg-orange-500/20 text-orange-400'
                                : 'bg-purple-500/20 text-purple-400'
                            }`}
                          >
                            {result.isEtf ? '코인ETF' : '코인'}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : debouncedQuery.length < 2 ? (
            <div className="px-4 py-8 text-center text-muted-foreground">
              2글자 이상 입력하세요
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-muted-foreground">
              검색 결과가 없습니다
            </div>
          )}
        </div>
      )}
    </div>
  );
}
