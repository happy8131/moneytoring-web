'use client';

import { useEffect, useRef } from 'react';

interface DiscussionViewCounterProps {
  discussionId: string;
}

export function DiscussionViewCounter({ discussionId }: DiscussionViewCounterProps) {
  const hasCountedRef = useRef(false);

  useEffect(() => {
    if (hasCountedRef.current) {
      return;
    }

    (async () => {
      hasCountedRef.current = true;
      try {
        await fetch('/api/discussions/views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: discussionId }),
        });
      } catch (error) {
        // 오류는 무시 (조회수는 선택적 기능)
      }
    })();
  }, [discussionId]);

  return null;
}
