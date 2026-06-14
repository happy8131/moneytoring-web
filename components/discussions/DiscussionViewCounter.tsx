'use client';

import { useEffect, useRef } from 'react';

interface DiscussionViewCounterProps {
  discussionId: string;
}

export function DiscussionViewCounter({ discussionId }: DiscussionViewCounterProps) {
  const hasCountedRef = useRef(false);

  useEffect(() => {
    console.log('[조회수] useEffect 시작, discussionId:', discussionId);

    if (hasCountedRef.current) {
      console.log('[조회수] 이미 요청함, 스킵');
      return;
    }

    // 즉시 함수 호출
    (async () => {
      hasCountedRef.current = true;
      try {
        console.log('[조회수] API 요청 시작:', discussionId);
        const response = await fetch('/api/discussions/views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: discussionId }),
        });

        console.log('[조회수] API 응답:', response.status, response.statusText);

        const data = await response.json();
        console.log('[조회수] API 응답 데이터:', data);

        if (!response.ok) {
          console.error('[조회수] API 오류:', response.status, data);
        } else {
          console.log('[조회수] 성공!');
        }
      } catch (error) {
        console.error('[조회수] 요청 예외:', error);
      }
    })();
  }, [discussionId]);

  return null;
}
