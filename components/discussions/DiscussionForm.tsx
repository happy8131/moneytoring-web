'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { createDiscussion } from '@/app/actions/discussions';

interface DiscussionFormProps {
  onDiscussionCreated?: (discussion: any) => void;
}

export function DiscussionForm({ onDiscussionCreated }: DiscussionFormProps) {
  const [user, setUser] = useState<{ id: string; username?: string } | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [symbol, setSymbol] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (authUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', authUser.id)
            .single();

          setUser({
            id: authUser.id,
            username: profile?.username,
          });
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim() || !title.trim() || !content.trim() || !user) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const discussion = await createDiscussion(symbol, title, content);
      setSymbol('');
      setTitle('');
      setContent('');
      if (onDiscussionCreated) {
        onDiscussionCreated(discussion);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '토론 작성 중 오류가 발생했습니다';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser) {
    return (
      <Card className="p-4 space-y-3">
        <div className="h-8 w-full rounded bg-muted" />
        <div className="h-12 w-full rounded bg-muted" />
        <div className="h-24 w-full rounded bg-muted" />
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="p-4 text-center">
        <p className="text-sm text-muted-foreground mb-3">토론을 작성하려면 로그인이 필요합니다</p>
        <Button asChild size="sm">
          <a href="/login">로그인</a>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="p-3 rounded-md bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* 심볼 입력 */}
        <Input
          type="text"
          placeholder="종목 코드 (예: AAPL, GOOGL, BTC)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          disabled={isSubmitting}
          className="text-sm"
        />

        {/* 제목 입력 */}
        <Input
          type="text"
          placeholder="토론 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          className="text-sm"
        />

        {/* 내용 입력 */}
        <textarea
          placeholder="토론 내용을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          className="w-full text-sm px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={4}
        />

        <Button
          type="submit"
          disabled={isSubmitting || !symbol.trim() || !title.trim() || !content.trim()}
          className="w-full"
        >
          {isSubmitting ? '작성 중...' : '토론 작성'}
        </Button>
      </form>
    </Card>
  );
}
