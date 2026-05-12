'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';

interface RebalancingSuggestion {
  symbol: string;
  currentPercent: number;
  targetPercent: number;
  diff: number;
}

interface RebalancingWidgetProps {
  suggestions: RebalancingSuggestion[];
}

export function RebalancingWidget({ suggestions }: RebalancingWidgetProps) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">리밸런싱 제안</h3>
        <p className="text-muted-foreground">
          리밸런싱 데이터가 없습니다.
        </p>
      </Card>
    );
  }

  const sortedSuggestions = [...suggestions].sort(
    (a, b) => Math.abs(b.diff) - Math.abs(a.diff)
  );

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">리밸런싱 제안</h3>
      <p className="text-sm text-muted-foreground mb-4">
        균등 분배 기준으로 현재 비중과 목표 비중의 차이를 표시합니다.
      </p>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>종목</TableHead>
              <TableHead className="text-right">현재 비중</TableHead>
              <TableHead className="text-right">목표 비중</TableHead>
              <TableHead className="text-right">차이</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSuggestions.map((item) => (
              <TableRow key={item.symbol}>
                <TableCell className="font-semibold">
                  {item.symbol}
                </TableCell>
                <TableCell className="text-right">
                  {item.currentPercent.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">
                  {item.targetPercent.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={
                      item.diff > 0
                        ? 'text-red-600 font-medium'
                        : item.diff < 0
                          ? 'text-blue-600 font-medium'
                          : ''
                    }
                  >
                    {item.diff > 0 ? '+' : ''}
                    {item.diff.toFixed(1)}%
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.diff > 0
                      ? `${Math.abs(item.diff).toFixed(1)}% 초과`
                      : item.diff < 0
                        ? `${Math.abs(item.diff).toFixed(1)}% 부족`
                        : '정상'}
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
        <p className="font-medium mb-1">💡 리밸런싱 팁</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs">
          <li>
            <span className="text-red-600">빨강(초과)</span>: 비중이 높으니 일부
            매도 고려
          </li>
          <li>
            <span className="text-blue-600">파랑(부족)</span>: 비중이 낮으니 추가
            매수 고려
          </li>
        </ul>
      </div>
    </Card>
  );
}
