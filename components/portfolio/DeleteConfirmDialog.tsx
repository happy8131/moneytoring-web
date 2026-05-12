'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  holdingSymbol: string;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  holdingSymbol,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>종목 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            {holdingSymbol} 종목을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수
            없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogCancel>취소</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          삭제
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
