'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  COUNTRY_LABELS,
  changeColorClass,
  formatChange,
  formatDate,
  formatValue,
  type EconomicIndicator,
} from '@/lib/economicCalendarUtils';

interface EconomicCalendarTableProps {
  indicators: EconomicIndicator[];
}

export function EconomicCalendarTable({ indicators }: EconomicCalendarTableProps) {
  if (indicators.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">표시할 경제지표가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>지표</TableHead>
            <TableHead className="w-[100px]">국가</TableHead>
            <TableHead className="text-right w-[140px]">최신 값</TableHead>
            <TableHead className="text-right w-[140px]">이전 값</TableHead>
            <TableHead className="text-right w-[110px]">변화</TableHead>
            <TableHead className="w-[140px]">기준일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {indicators.map((ind, idx) => (
            <TableRow key={`${ind.country}-${ind.name}-${idx}`}>
              <TableCell>
                <span className="text-sm font-medium" title={ind.name}>
                  {ind.label}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{COUNTRY_LABELS[ind.country]}</span>
              </TableCell>
              <TableCell className="text-right font-mono text-sm font-semibold">
                {formatValue(ind.latest.value, ind.unit, ind.decimals)}
              </TableCell>
              <TableCell className="text-right font-mono text-sm text-muted-foreground">
                {ind.previous
                  ? formatValue(ind.previous.value, ind.unit, ind.decimals)
                  : '-'}
              </TableCell>
              <TableCell
                className={`text-right font-mono text-sm font-medium ${changeColorClass(ind.changePercent)}`}
              >
                {formatChange(ind.changePercent)}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(ind.latest.date)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
