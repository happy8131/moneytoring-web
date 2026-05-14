'use client';

import { useState, useRef, useEffect } from 'react';
import { useStockSearch } from '@/hooks/useStockSearch';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function StockSearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const { data: searchResults } = useStockSearch({
    query,
    enabled: query.length > 0,
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

  const handleSelect = (symbol: string) => {
    router.push(`/stocks/${symbol}`);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="종목 검색 (예: Apple, AAPL)"
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
      {isOpen && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {searchResults?.data && searchResults.data.length > 0 ? (
            <ul className="divide-y divide-border">
              {searchResults.data.map((result) => (
                <li key={result.symbol}>
                  <button
                    onClick={() => handleSelect(result.symbol)}
                    className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{result.displaySymbol}</p>
                      <p className="text-sm text-muted-foreground">{result.description}</p>
                    </div>
                    <span className="ml-2 text-xs text-muted-foreground">{result.type}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-muted-foreground">
              {query.length < 2
                ? '2글자 이상 입력하세요'
                : '검색 결과가 없습니다'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
