'use client';

import { useState } from 'react';
import { useEconomicCalendar } from '@/hooks/useEconomicCalendar';
import {
  EconomicCalendarFilters,
  type CountryFilter,
} from './EconomicCalendarFilters';
import { EconomicCalendarTable } from './EconomicCalendarTable';

export function EconomicCalendarClient() {
  const [country, setCountry] = useState<CountryFilter>('US');

  const { data, isLoading, isError, error, dataUpdatedAt } = useEconomicCalendar({
    countries: country,
  });

  const errors = data?.errors ?? [];
  const hasFmpKeyError = errors.some((e) => e.message.includes('FMP_API_KEY'));
  const hasFredKeyError = errors.some((e) => e.message.includes('FRED_API_KEY'));

  return (
    <div className="space-y-4">
      <EconomicCalendarFilters country={country} onChange={setCountry} />

      {/* 데이터 해석 안내 */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
        <strong>기준일</strong>은 데이터의 관측 기준 시점입니다 (실제 발표일과 다를 수 있음). 예: CPI 4월분(기준일 2026-04-01)은 5월 중순에 BLS가 공식 발표.
        &quot;연방기금 실효금리&quot;는 월평균 실효금리이며, FOMC 정책금리(target rate)와 다릅니다.
        유로존·한국 데이터는 FRED 경유 OECD/ECB 시리즈이며 BOK 정책금리는 직접 시리즈가 없어 OECD 단기금리로 근사합니다.
      </div>

      {hasFmpKeyError && (
        <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-sm">
          <p className="font-semibold text-yellow-700 dark:text-yellow-400">
            FMP API 키가 필요합니다
          </p>
          <p className="text-yellow-700/80 dark:text-yellow-400/80 mt-1">
            미국 지표(CPI/NFP/실업률 등)를 갱신하려면 <code className="font-mono">.env.local</code>에{' '}
            <code className="font-mono">FMP_API_KEY</code>가 필요합니다.
          </p>
        </div>
      )}

      {hasFredKeyError && (
        <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-sm">
          <p className="font-semibold text-yellow-700 dark:text-yellow-400">
            FRED API 키가 필요합니다 (FOMC 정책금리·유로존·한국 지표 표시용)
          </p>
          <p className="text-yellow-700/80 dark:text-yellow-400/80 mt-1">
            <a
              href="https://fredaccount.stlouisfed.org/apikeys"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              fredaccount.stlouisfed.org/apikeys
            </a>
            에서 무료 발급 후 <code className="font-mono">.env.local</code>에{' '}
            <code className="font-mono">FRED_API_KEY=발급키</code>를 추가하고 개발 서버를 재시작하세요.
          </p>
        </div>
      )}

      {!hasFmpKeyError && !hasFredKeyError && errors.length > 0 && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3 text-xs text-yellow-700 dark:text-yellow-400">
          일부 지표 로드 실패: {errors.map((e) => e.source).join(', ')}
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          데이터 로드 실패: {error?.message}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded" />
          ))}
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            마지막 업데이트:{' '}
            {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString('ko-KR') : '-'}
            {data && data.indicators.length > 0 && ` · 총 ${data.indicators.length}건`}
          </p>
          <EconomicCalendarTable indicators={data?.indicators ?? []} />
        </>
      )}
    </div>
  );
}
