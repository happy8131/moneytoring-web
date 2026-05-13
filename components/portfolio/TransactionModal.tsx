'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Transaction } from '@/types';

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  availableSymbols?: string[];
}

export function TransactionModal({
  open,
  onOpenChange,
  onAddTransaction,
  availableSymbols = [],
}: TransactionModalProps) {
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'buy' as const,
    quantity: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
    memo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.symbol.trim()) {
      newErrors.symbol = '종목 코드를 입력해주세요';
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = '수량은 0보다 커야 합니다';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = '가격은 0보다 커야 합니다';
    }
    if (!formData.date) {
      newErrors.date = '날짜를 선택해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onAddTransaction({
      symbol: formData.symbol.toUpperCase(),
      type: formData.type,
      quantity: parseFloat(formData.quantity),
      price: parseFloat(formData.price),
      date: formData.date,
      memo: formData.memo || undefined,
    });

    setFormData({
      symbol: '',
      type: 'buy',
      quantity: '',
      price: '',
      date: new Date().toISOString().split('T')[0],
      memo: '',
    });
    setErrors({});

    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFormData({
        symbol: '',
        type: 'buy',
        quantity: '',
        price: '',
        date: new Date().toISOString().split('T')[0],
        memo: '',
      });
      setErrors({});
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>거래 기록 추가</DialogTitle>
          <DialogDescription>
            매수 또는 매도 거래 기록을 포트폴리오에 추가합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">종목 코드 *</Label>
              <Input
                id="symbol"
                placeholder="AAPL"
                value={formData.symbol}
                onChange={(e) => handleChange('symbol', e.target.value)}
                className={errors.symbol ? 'border-destructive' : ''}
              />
              {errors.symbol && (
                <p className="text-xs text-destructive">{errors.symbol}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">종류 *</Label>
              <Select value={formData.type} onValueChange={(value) =>
                handleChange('type', value)
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">매수</SelectItem>
                  <SelectItem value="sell">매도</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">수량 *</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="10"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                className={errors.quantity ? 'border-destructive' : ''}
              />
              {errors.quantity && (
                <p className="text-xs text-destructive">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">가격 *</Label>
              <Input
                id="price"
                type="number"
                placeholder="150.50"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className={errors.price ? 'border-destructive' : ''}
              />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">날짜 *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={errors.date ? 'border-destructive' : ''}
            />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo">메모</Label>
            <Input
              id="memo"
              placeholder="거래 메모 (선택)"
              value={formData.memo}
              onChange={(e) => handleChange('memo', e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit}>추가</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
