'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SUPPORTED_COUNTRIES,
  COUNTRY_LABELS,
  type SupportedCountry,
} from '@/lib/economicCalendarUtils';

export type CountryFilter = SupportedCountry;

interface EconomicCalendarFiltersProps {
  country: CountryFilter;
  onChange: (country: CountryFilter) => void;
}

export function EconomicCalendarFilters({ country, onChange }: EconomicCalendarFiltersProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="max-w-xs">
        <label className="text-xs text-muted-foreground mb-1 block">국가</label>
        <Select value={country} onValueChange={(v) => onChange(v as CountryFilter)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>
                {COUNTRY_LABELS[c]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
