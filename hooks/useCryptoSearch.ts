/**
 * useCryptoSearch
 * 암호화폐 검색 React Query 훅 (디바운스 포함)
 *
 * 사용 예:
 *   const { results, isLoading } = useCryptoSearch('bit');
 */

'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SearchResultItem, ApiResponse } from '@/types/market';
import { QUERY_KEYS } from '@/types/market';

// ─── API 클라이언트 함수 ────────────────────────────────────────────────────

async function searchCrypto(query: string): Promise<SearchResultItem[]> {
  const response = await fetch(
    `/api/crypto/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error(`검색 실패: ${response.status}`);
  }

  const result: ApiResponse<SearchResultItem[]> = await response.json();

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}

// ─── 훅 ────────────────────────────────────────────────────────────────────

interface UseCryptoSearchReturn {
  results: SearchResultItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * 암호화폐 검색 훅
 * - 300ms 디바운스로 과도한 API 호출 방지
 * - 2글자 미만 입력 시 쿼리 비활성화
 * - 검색 결과 5분 캐싱 (코인 목록은 자주 변경되지 않음)
 */
export function useCryptoSearch(
  query: string,
  debounceMs = 300
): UseCryptoSearchReturn {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // 디바운스 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const isQueryValid = debouncedQuery.length >= 2;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.cryptoSearch(debouncedQuery),
    queryFn: () => searchCrypto(debouncedQuery),
    staleTime: 5 * 60_000,   // 5분: 코인 목록은 자주 바뀌지 않음
    gcTime: 10 * 60_000,
    enabled: isQueryValid,
    retry: 1,
  });

  return {
    results: data ?? [],
    isLoading: isQueryValid && isLoading,
    isError,
    error: error as Error | null,
  };
}
