'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatPercent } from '@/lib/calculations';
import { Trash2, Edit2 } from 'lucide-react';
import type { Holding } from '@/types';

interface PortfolioTableProps {
  holdings: Holding[];
  onEdit?: (holding: Holding) => void;
  onDelete?: (holdingId: string) => void;
}

export function PortfolioTable({
  holdings,
  onEdit,
  onDelete,
}: PortfolioTableProps) {
  if (holdings.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          보유한 종목이 없습니다. 종목을 추가해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">종목</TableHead>
            <TableHead className="text-right">수량</TableHead>
            <TableHead className="text-right">매입가</TableHead>
            <TableHead className="text-right">현재가</TableHead>
            <TableHead className="text-right">손익</TableHead>
            <TableHead className="text-right">수익률</TableHead>
            <TableHead className="text-right">총가치</TableHead>
            <TableHead className="w-16">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings.map((holding) => (
            <TableRow key={holding.id}>
              <TableCell className="font-semibold">
                <div>
                  <p>{holding.symbol}</p>
                  <p className="text-xs text-muted-foreground">
                    {holding.name}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-right">{holding.quantity}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(holding.buyPrice)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(holding.currentPrice || 0)}
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={
                    (holding.gain || 0) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {(holding.gain || 0) >= 0 ? '+' : ''}
                  {formatCurrency(holding.gain || 0)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={
                    (holding.gainPercent || 0) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {formatPercent(holding.gainPercent || 0)}
                </span>
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(holding.totalValue || 0)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(holding)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(holding.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
