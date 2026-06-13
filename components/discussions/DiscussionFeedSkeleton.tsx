import { Card } from '@/components/ui/card';

export function DiscussionFeedSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="space-y-3">
            {/* 헤더 */}
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-12 rounded bg-muted" />
                  <div className="h-4 w-16 rounded bg-muted" />
                  <div className="h-4 w-20 rounded bg-muted" />
                </div>
                <div className="h-5 w-64 rounded bg-muted" />
              </div>
            </div>

            {/* 내용 */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-5/6 rounded bg-muted" />
            </div>

            {/* 하단 정보 */}
            <div className="flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
              <div className="h-4 w-16 rounded bg-muted" />
              <div className="h-4 w-16 rounded bg-muted" />
              <div className="h-4 w-16 rounded bg-muted" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
