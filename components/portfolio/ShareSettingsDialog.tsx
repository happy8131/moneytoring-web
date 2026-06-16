'use client';

import { useState, useTransition, useEffect } from 'react';
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
import { Label } from '@/components/ui/label';
import { ShareLink } from '@/components/portfolio/ShareLink';
import {
  createPortfolioShare,
  updatePortfolioShare,
  deletePortfolioShare,
} from '@/app/actions/portfolioShares';
import type { Holding, PortfolioShare } from '@/types';
import { Loader2, Trash2 } from 'lucide-react';

interface ShareSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentHoldings: Holding[];
  initialPortfolioShare: PortfolioShare | null;
  initialTitle: string;
  initialDescription: string;
  initialIsPublic: boolean;
  isLoading?: boolean;
}

export function ShareSettingsDialog({
  open,
  onOpenChange,
  currentHoldings,
  initialPortfolioShare,
  initialTitle,
  initialDescription,
  initialIsPublic,
  isLoading = false,
}: ShareSettingsDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [portfolioShare, setPortfolioShare] = useState<PortfolioShare | null>(
    initialPortfolioShare
  );
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [isPublic, setIsPublic] = useState(initialIsPublic);

  // 초기값 변경 시 상태 업데이트
  useEffect(() => {
    setPortfolioShare(initialPortfolioShare);
    setTitle(initialTitle);
    setDescription(initialDescription);
    setIsPublic(initialIsPublic);
  }, [initialPortfolioShare, initialTitle, initialDescription, initialIsPublic]);

  const handleCreateOrUpdate = () => {
    startTransition(async () => {
      try {
        if (portfolioShare) {
          const updated = await updatePortfolioShare(portfolioShare.id, {
            title,
            description: description || undefined,
            isPublic,
            holdingsSnapshot: currentHoldings,
          });
          setPortfolioShare(updated);
        } else {
          const created = await createPortfolioShare({
            title,
            description: description || undefined,
            isPublic,
            holdingsSnapshot: currentHoldings,
          });
          setPortfolioShare(created);
        }
      } catch (error) {
        console.error('Failed to save portfolio share:', error);
      }
    });
  };

  const handleDelete = () => {
    if (!portfolioShare) return;
    if (!confirm('공유 포트폴리오를 삭제하시겠습니까?')) return;

    startTransition(async () => {
      try {
        await deletePortfolioShare(portfolioShare.id);
        setPortfolioShare(null);
        setTitle('내 포트폴리오');
        setDescription('');
        setIsPublic(false);
      } catch (error) {
        console.error('Failed to delete portfolio share:', error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>포트폴리오 공유 설정</DialogTitle>
          <DialogDescription>
            포트폴리오를 공개하여 다른 사용자와 공유할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">공유 제목 *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="내 포트폴리오"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="포트폴리오에 대한 설명을 입력하세요"
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label htmlFor="public">공개</Label>
            <input
              id="public"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
          </div>

          {portfolioShare && portfolioShare.shareLink && (
            <ShareLink shareLink={portfolioShare.shareLink} />
          )}

          <div className="text-xs text-muted-foreground">
            {portfolioShare
              ? '보유종목은 변경될 때마다 자동으로 업데이트됩니다.'
              : '공유를 시작하면 공유 링크가 생성됩니다.'}
          </div>
        </div>

        <DialogFooter className="gap-2">
          {portfolioShare && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              삭제
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
          <Button onClick={handleCreateOrUpdate} disabled={isPending || !title.trim()}>
            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {portfolioShare ? '업데이트' : '공유 시작'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
