'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Holding, Transaction } from '@/types';
import type { Tables } from '@/types/database';

type DBHolding = Tables<'holdings'>;
type DBTransaction = Tables<'transactions'>;

const convertHoldingFromDB = (row: DBHolding): Holding => ({
  id: row.id,
  symbol: row.symbol,
  name: row.name,
  quantity: row.quantity,
  buyPrice: row.buy_price,
  buyDate: row.buy_date,
  type: row.type as 'stock' | 'crypto' | 'korean-stock',
});

const convertTransactionFromDB = (row: DBTransaction): Transaction => ({
  id: row.id,
  symbol: row.symbol,
  type: row.type as 'buy' | 'sell',
  quantity: row.quantity,
  price: row.price,
  date: row.date,
  memo: row.memo || undefined,
});

export async function getHoldings(): Promise<Holding[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('인증이 필요합니다');
  }

  const { data, error } = await supabase
    .from('holdings')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);

  return (data || []).map(convertHoldingFromDB);
}

export async function addHolding(holding: Omit<Holding, 'id'>): Promise<Holding> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('인증이 필요합니다');
  }

  const { data, error } = await supabase
    .from('holdings')
    .insert({
      user_id: user.id,
      symbol: holding.symbol,
      name: holding.name,
      quantity: holding.quantity,
      buy_price: holding.buyPrice,
      buy_date: holding.buyDate,
      type: holding.type,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/portfolio');
  return convertHoldingFromDB(data);
}

export async function removeHolding(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('인증이 필요합니다');
  }

  // 본인 소유 검증
  const { data: holding, error: fetchError } = await supabase
    .from('holdings')
    .select('user_id')
    .eq('id', id)
    .single();

  if (fetchError || !holding || holding.user_id !== user.id) {
    throw new Error('권한이 없습니다');
  }

  const { error } = await supabase
    .from('holdings')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/portfolio');
}

export async function getTransactions(): Promise<Transaction[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('인증이 필요합니다');
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);

  return (data || []).map(convertTransactionFromDB);
}

export async function addTransaction(tx: Omit<Transaction, 'id'>): Promise<Transaction> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('인증이 필요합니다');
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      symbol: tx.symbol,
      type: tx.type,
      quantity: tx.quantity,
      price: tx.price,
      date: tx.date,
      memo: tx.memo || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/portfolio');
  return convertTransactionFromDB(data);
}

export async function removeTransaction(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('인증이 필요합니다');
  }

  // 본인 소유 검증
  const { data: transaction, error: fetchError } = await supabase
    .from('transactions')
    .select('user_id')
    .eq('id', id)
    .single();

  if (fetchError || !transaction || transaction.user_id !== user.id) {
    throw new Error('권한이 없습니다');
  }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/portfolio');
}
