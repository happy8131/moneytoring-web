'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  getHoldings,
  addHolding as addHoldingAction,
  removeHolding as removeHoldingAction,
  getTransactions,
  addTransaction as addTransactionAction,
  removeTransaction as removeTransactionAction,
} from '@/app/actions/portfolio';
import type { Holding, Favorite, NewsItem, PortfolioStore, Transaction } from '@/types';

const STORAGE_KEY = 'moneytoring_portfolio_local';

// localStorage 전용: favorites, readNews
type LocalStore = {
  favorites: Favorite[];
  readNews: string[];
};

const defaultLocalStore: LocalStore = {
  favorites: [],
  readNews: [],
};

function loadLocalStore(): LocalStore {
  if (typeof window === 'undefined') {
    return defaultLocalStore;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultLocalStore;

    const parsed = JSON.parse(raw);
    return {
      favorites: (parsed.favorites as Favorite[]) ?? [],
      readNews: (parsed.readNews as string[]) ?? [],
    };
  } catch (error) {
    return defaultLocalStore;
  }
}

export function usePortfolio() {
  const queryClient = useQueryClient();
  const [localStore, setLocalStore] = useState(() => loadLocalStore());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const saveLocalStore = useCallback(
    (newStore: { favorites: Favorite[]; readNews: string[] }) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
        setLocalStore(newStore);
      } catch (error) {
        console.error('Failed to save local portfolio:', error);
      }
    },
    []
  );

  // DB 기반: holdings 쿼리
  const {
    data: holdings = [],
    isLoading: holdingsLoading,
  } = useQuery({
    queryKey: ['portfolio', 'holdings'],
    queryFn: () => getHoldings(),
    enabled: isHydrated,
    retry: 1,
  });

  // DB 기반: transactions 쿼리
  const {
    data: transactions = [],
    isLoading: transactionsLoading,
  } = useQuery({
    queryKey: ['portfolio', 'transactions'],
    queryFn: () => getTransactions(),
    enabled: isHydrated,
    retry: 1,
  });

  // holdings 뮤테이션
  const addHoldingMutation = useMutation({
    mutationFn: (holding: Omit<Holding, 'id'>) => addHoldingAction(holding),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', 'holdings'] });
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
      queryClient.invalidateQueries({ queryKey: ['crypto'] });
    },
  });

  const removeHoldingMutation = useMutation({
    mutationFn: (id: string) => removeHoldingAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', 'holdings'] });
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
      queryClient.invalidateQueries({ queryKey: ['crypto'] });
    },
  });

  // transactions 뮤테이션
  const addTransactionMutation = useMutation({
    mutationFn: (tx: Omit<Transaction, 'id'>) => addTransactionAction(tx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', 'transactions'] });
    },
  });

  const removeTransactionMutation = useMutation({
    mutationFn: (id: string) => removeTransactionAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', 'transactions'] });
    },
  });

  const addHolding = useCallback(
    (holding: Omit<Holding, 'id'>) => {
      return addHoldingMutation.mutateAsync(holding);
    },
    [addHoldingMutation]
  );

  const removeHolding = useCallback(
    (id: string) => {
      return removeHoldingMutation.mutateAsync(id);
    },
    [removeHoldingMutation]
  );

  const updateHolding = useCallback((id: string, updates: Partial<Holding>) => {
    // 미사용이지만 인터페이스 유지
  }, []);

  const toggleFavorite = useCallback(
    (symbol: string, name: string, type: 'stock' | 'crypto') => {
      const isFavorited = localStore.favorites.some((f) => f.symbol === symbol);

      const newLocalStore = {
        ...localStore,
        favorites: isFavorited
          ? localStore.favorites.filter((f) => f.symbol !== symbol)
          : [
              ...localStore.favorites,
              {
                symbol,
                name,
                type,
                addedAt: new Date().toISOString(),
              },
            ],
      };

      saveLocalStore(newLocalStore);
      return !isFavorited;
    },
    [localStore, saveLocalStore]
  );

  const markNewsAsRead = useCallback(
    (newsId: string) => {
      if (localStore.readNews.includes(newsId)) return;

      const newLocalStore = {
        ...localStore,
        readNews: [...localStore.readNews, newsId],
      };

      saveLocalStore(newLocalStore);
    },
    [localStore, saveLocalStore]
  );

  const isFavorited = useCallback(
    (symbol: string) => localStore.favorites.some((f) => f.symbol === symbol),
    [localStore.favorites]
  );

  const isNewsRead = useCallback(
    (newsId: string) => localStore.readNews.includes(newsId),
    [localStore.readNews]
  );

  const addTransaction = useCallback(
    (tx: Omit<Transaction, 'id'>) => {
      return addTransactionMutation.mutateAsync(tx);
    },
    [addTransactionMutation]
  );

  const removeTransaction = useCallback(
    (id: string) => {
      return removeTransactionMutation.mutateAsync(id);
    },
    [removeTransactionMutation]
  );

  const getTransactionsBySymbol = useCallback(
    (symbol: string) => transactions.filter((t) => t.symbol === symbol),
    [transactions]
  );

  return {
    // 상태
    holdings,
    favorites: localStore.favorites,
    readNews: localStore.readNews,
    transactions,
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
