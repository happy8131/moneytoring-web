'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { MessageCircle, Flame } from 'lucide-react';
import { getHotTopics } from '@/app/actions/discussions';
import type { Tables } from '@/types/database';

type Discussion = Tables<'discussions'> & { profiles: Tables<'profiles'> | null };

export function HotTopicsBanner() {
  const [hotTopics, setHotTopics] = useState<Discussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHotTopics = async () => {
      try {
        const topics = await getHotTopics();
        setHotTopics(topics);
      } catch (error) {
        console.error('핫 토픽 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHotTopics();
  }, []);

  if (isLoading || hotTopics.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800">
      <div className="flex items-center gap-2 mb-3">
        <Flame className="h-4 w-4 text-orange-500" />
        <h3 className="font-semibold text-sm text-orange-700 dark:text-orange-200">
          🔥 핫 토픽 (24시간)
        </h3>
      </div>

      <div className="space-y-2">
        {hotTopics.map((topic, index) => (
          <Link
            key={topic.id}
            href={`/discussions/${topic.id}`}
            className="block p-2 rounded hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-orange-900 dark:text-orange-100 line-clamp-1">
                  {index + 1}. {topic.title}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 rounded dark:bg-blue-900 dark:text-blue-200">
                    {topic.symbol}
                  </span>
                  <span className="text-xs text-orange-700 dark:text-orange-300 flex items-center gap-0.5">
                    <MessageCircle className="h-3 w-3" />
                    {topic.comments_count || 0}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
