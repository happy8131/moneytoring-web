'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NewsFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CATEGORIES = [
  { value: 'general', label: '일반' },
  { value: 'forex', label: '외환' },
  { value: 'crypto', label: '암호화폐' },
  { value: 'merger', label: '인수합병' },
  { value: 'korea', label: '한국 뉴스' },
] as const;

export function NewsFilter({
  selectedCategory,
  onCategoryChange,
}: NewsFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-muted-foreground">
        카테고리:
      </label>
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
