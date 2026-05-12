'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { Transaction } from '@/types';

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete?: (transactionId: string) => void;
}

export function TransactionTable({
  transactions,
  onDelete,
}: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">거래 기록이 없습니다.</p>
      </div>
    );
  }

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>날짜</TableHead>
            <TableHead>종목</TableHead>
            <TableHead>종류</TableHead>
            <TableHead className="text-right">수량</TableHead>
            <TableHead className="text-right">가격</TableHead>
            <TableHead className="text-right">총액</TableHead>
            <TableHead className="w-12">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-medium">
                {new Date(tx.date).toLocaleDateString('ko-KR')}
              </TableCell>
              <TableCell>{tx.symbol}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    tx.type === 'buy'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {tx.type === 'buy' ? '매수' : '매도'}
                </span>
              </TableCell>
              <TableCell className="text-right">{tx.quantity}</TableCell>
              <TableCell className="text-right">
                ${tx.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell className="text-right font-semibold">
                ${(tx.quantity * tx.price).toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(tx.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
