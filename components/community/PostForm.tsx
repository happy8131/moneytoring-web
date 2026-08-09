'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { createPost } from '@/app/actions/community';
import Link from 'next/link';
import type { Tables } from '@/types/database';

type Post = Tables<'posts'> & { profiles: Tables<'profiles'> | null };

interface User {
  id: string;
  username?: string;
  email?: string;
}

interface PostFormProps {
  onPostCreated?: (post: Post) => void;
}

export function PostForm({ onPostCreated }: PostFormProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [content, setContent] = useState('');

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
            email: authUser.email,
            username: profile?.username,
          });
        } else {
          setUser(null);
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
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      const newPost = await createPost(content);
      setContent('');

      if (onPostCreated && newPost) {
        const postWithProfile: Post = {
          ...newPost,
          profiles: user ? { ...user, bio: null, avatar_url: null, is_expert: false, expertise: [], followers_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } : null,
        };
        onPostCreated(postWithProfile);
      }
    } catch (error) {
      console.error('포스트 작성 실패:', error);
      alert('포스트 작성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 정보 로드 중에는 아무것도 표시하지 않음
  if (isLoadingUser) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 h-40 animate-pulse" />
    );
  }

  // 로그인하지 않은 사용자
  if (!user) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          포스트를 작성하려면 로그인이 필요합니다.
        </p>
        <div className="flex gap-2 justify-center">
          <Button asChild variant="outline" size="sm">
            <Link href="/login">로그인</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">회원가입</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex gap-4">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </div>
        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="무엇을 생각하고 계신가요?"
            className="w-full min-h-24 p-3 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <div className="flex justify-end gap-2 mt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setContent('')}
              disabled={isLoading || !content.trim()}
            >
              취소
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
              type="submit"
              size="sm"
              disabled={isLoading || !content.trim()}
            >
              {isLoading ? '작성 중...' : '포스트'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
