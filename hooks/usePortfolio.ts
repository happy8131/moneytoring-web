'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Holding, Favorite, NewsItem, PortfolioStore, Transaction } from '@/types';

const STORAGE_KEY = 'moneytoring_portfolio';

// 기본 포트폴리오 상태
const defaultStore: PortfolioStore = {
  holdings: [],
  favorites: [],
  readNews: [],
  transactions: [],
  lastUpdated: new Date().toISOString(),
};

// localStorage에서 데이터 로드 (SSR 안전)
function loadStore(): PortfolioStore {
  if (typeof window === 'undefined') {
    return defaultStore;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStore;

    const parsed = JSON.parse(raw);

    // 데이터 마이그레이션: 이전 버전의 데이터에 누락된 필드 추가
    return {
      holdings: parsed.holdings ?? [],
      favorites: parsed.favorites ?? [],
      readNews: parsed.readNews ?? [],
      transactions: parsed.transactions ?? [],
      lastUpdated: parsed.lastUpdated ?? new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to load portfolio:', error);
    return defaultStore;
  }
}

export function usePortfolio() {
  const [store, setStore] = useState<PortfolioStore>(() => loadStore());
  const [isHydrated, setIsHydrated] = useState(false);

  // 클라이언트 마운트 후 hydration 완료
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // localStorage에 저장
  const saveStore = useCallback((newStore: PortfolioStore) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
      setStore(newStore);
    } catch (error) {
      console.error('Failed to save portfolio:', error);
    }
  }, []);

  // 보유 종목 추가
  const addHolding = useCallback(
    (holding: Omit<Holding, 'id'>) => {
      const newHolding: Holding = {
        ...holding,
        id: `${holding.symbol}-${Date.now()}`,
      };

      const newStore: PortfolioStore = {
        ...store,
        holdings: [...store.holdings, newHolding],
        lastUpdated: new Date().toISOString(),
      };

      saveStore(newStore);
      return newHolding;
    },
    [store, saveStore]
  );

  // 보유 종목 제거
  const removeHolding = useCallback(
    (id: string) => {
      const newStore: PortfolioStore = {
        ...store,
        holdings: store.holdings.filter((h) => h.id !== id),
        lastUpdated: new Date().toISOString(),
      };

      saveStore(newStore);
    },
    [store, saveStore]
  );

  // 보유 종목 수정
  const updateHolding = useCallback(
    (id: string, updates: Partial<Holding>) => {
      const newStore: PortfolioStore = {
        ...store,
        holdings: store.holdings.map((h) =>
          h.id === id ? { ...h, ...updates } : h
        ),
        lastUpdated: new Date().toISOString(),
      };

      saveStore(newStore);
    },
    [store, saveStore]
  );

  // 즐겨찾기 토글
  const toggleFavorite = useCallback(
    (symbol: string, name: string, type: 'stock' | 'crypto') => {
      const isFavorited = store.favorites.some((f) => f.symbol === symbol);

      const newStore: PortfolioStore = {
        ...store,
        favorites: isFavorited
          ? store.favorites.filter((f) => f.symbol !== symbol)
          : [
              ...store.favorites,
              {
                symbol,
                name,
                type,
                addedAt: new Date().toISOString(),
              },
            ],
        lastUpdated: new Date().toISOString(),
      };

      saveStore(newStore);
      return !isFavorited;
    },
    [store, saveStore]
  );

  // 뉴스 읽음 표시
  const markNewsAsRead = useCallback(
    (newsId: string) => {
      if (store.readNews.includes(newsId)) return;

      const newStore: PortfolioStore = {
        ...store,
        readNews: [...store.readNews, newsId],
        lastUpdated: new Date().toISOString(),
      };

      saveStore(newStore);
    },
    [store, saveStore]
  );

  // 즐겨찾기 여부 확인
  const isFavorited = useCallback(
    (symbol: string) => store.favorites.some((f) => f.symbol === symbol),
    [store.favorites]
  );

  // 뉴스 읽음 여부 확인
  const isNewsRead = useCallback(
    (newsId: string) => store.readNews.includes(newsId),
    [store.readNews]
  );

  // 거래 기록 추가
  const addTransaction = useCallback(
    (tx: Omit<Transaction, 'id'>) => {
      const newTransaction: Transaction = {
        ...tx,
        id: `${tx.symbol}-${tx.type}-${Date.now()}`,
      };

      const newStore: PortfolioStore = {
        ...store,
        transactions: [...store.transactions, newTransaction],
        lastUpdated: new Date().toISOString(),
      };

      saveStore(newStore);
      return newTransaction;
    },
    [store, saveStore]
  );

  // 거래 기록 삭제
  const removeTransaction = useCallback(
    (id: string) => {
      const newStore: PortfolioStore = {
        ...store,
        transactions: store.transactions.filter((t) => t.id !== id),
        lastUpdated: new Date().toISOString(),
      };

      saveStore(newStore);
    },
    [store, saveStore]
  );

  // 특정 심볼의 거래 기록 조회
  const getTransactionsBySymbol = useCallback(
    (symbol: string) =>
      store.transactions.filter((t) => t.symbol === symbol),
    [store.transactions]
  );

  return {
    // 상태
    holdings: store.holdings,
    favorites: store.favorites,
    readNews: store.readNews,
    transactions: store.transactions,
    isHydrated,

    // 메서드
    addHolding,
    removeHolding,
    updateHolding,
    toggleFavorite,
    markNewsAsRead,
    isFavorited,
    isNewsRead,
    addTransaction,
    removeTransaction,
    getTransactionsBySymbol,
  };
}
