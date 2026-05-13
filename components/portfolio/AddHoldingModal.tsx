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
import type { Holding } from '@/types';

interface AddHoldingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHolding: (holding: Omit<Holding, 'id'>) => void;
  onSuccess?: () => void;
}

export function AddHoldingModal({
  open,
  onOpenChange,
  onAddHolding,
  onSuccess,
}: AddHoldingModalProps) {

  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    quantity: '',
    buyPrice: '',
    buyDate: new Date().toISOString().split('T')[0],
    type: 'stock' as 'stock' | 'crypto' | 'korean-stock',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    field: string,
    value: string
  ) => {
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
    if (!formData.name.trim()) {
      newErrors.name = '종목명을 입력해주세요';
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = '수량은 0보다 커야 합니다';
    }
    if (!formData.buyPrice || parseFloat(formData.buyPrice) <= 0) {
      newErrors.buyPrice = '매입가는 0보다 커야 합니다';
    }
    if (!formData.buyDate) {
      newErrors.buyDate = '매입일을 선택해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const newHolding: Omit<Holding, 'id'> = {
      symbol: formData.type === 'korean-stock' ? formData.symbol : formData.symbol.toUpperCase(),
      name: formData.name,
      quantity: parseFloat(formData.quantity),
      buyPrice: parseFloat(formData.buyPrice),
      buyDate: formData.buyDate,
      type: formData.type as 'stock' | 'crypto' | 'korean-stock',
    };

    onAddHolding(newHolding);

    setFormData({
      symbol: '',
      name: '',
      quantity: '',
      buyPrice: '',
      buyDate: new Date().toISOString().split('T')[0],
      type: 'stock',
    });
    setErrors({});

    onOpenChange(false);
    onSuccess?.();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFormData({
        symbol: '',
        name: '',
        quantity: '',
        buyPrice: '',
        buyDate: new Date().toISOString().split('T')[0],
        type: 'stock',
      });
      setErrors({});
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>종목 추가</DialogTitle>
          <DialogDescription>
            새로운 주식 또는 암호화폐 종목을 포트폴리오에 추가합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">종목 코드 *</Label>
              <Input
                id="symbol"
                placeholder={formData.type === 'korean-stock' ? '005930' : 'AAPL'}
                value={formData.symbol}
                onChange={(e) => handleChange('symbol', e.target.value)}
                className={errors.symbol ? 'border-destructive' : ''}
              />
              {formData.type === 'korean-stock' && (
                <p className="text-xs text-muted-foreground">6자리 종목코드 입력 (예: 005930)</p>
              )}
              {errors.symbol && (
                <p className="text-xs text-destructive">{errors.symbol}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">유형 *</Label>
              <Select value={formData.type} onValueChange={(value) =>
                handleChange('type', value)
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock">주식</SelectItem>
                  <SelectItem value="crypto">암호화폐</SelectItem>
                  <SelectItem value="korean-stock">한국 주식</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">종목명 *</Label>
            <Input
              id="name"
              placeholder="Apple Inc."
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
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
              <Label htmlFor="buyPrice">
                매입가 {formData.type === 'korean-stock' ? '(KRW)' : ''} *
              </Label>
              <Input
                id="buyPrice"
                type="number"
                placeholder={formData.type === 'korean-stock' ? '50000' : '150.50'}
                step="0.01"
                value={formData.buyPrice}
                onChange={(e) => handleChange('buyPrice', e.target.value)}
                className={errors.buyPrice ? 'border-destructive' : ''}
              />
              {errors.buyPrice && (
                <p className="text-xs text-destructive">{errors.buyPrice}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyDate">매입일 *</Label>
            <Input
              id="buyDate"
              type="date"
              value={formData.buyDate}
              onChange={(e) => handleChange('buyDate', e.target.value)}
              className={errors.buyDate ? 'border-destructive' : ''}
            />
            {errors.buyDate && (
              <p className="text-xs text-destructive">{errors.buyDate}</p>
            )}
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
