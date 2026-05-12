import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import type { NewsItem } from '@/types';

interface NewsCardProps {
  item: NewsItem;
  isRead: boolean;
  onRead?: (itemId: string) => void;
}

export function NewsCard({ item, isRead, onRead }: NewsCardProps) {
  const handleClick = () => {
    onRead?.(item.id);
  };

  return (
    <Card
      className={`overflow-hidden cursor-pointer transition-all ${
        isRead ? 'opacity-75' : 'hover:shadow-lg'
      }`}
      onClick={handleClick}
    >
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 sm:p-6"
      >
        <div className="flex gap-4">
          {item.image && (
            <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-muted hidden sm:block">
              <img
                src={item.image}
                alt={item.headline}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3
                  className={`text-sm sm:text-base font-semibold line-clamp-2 ${
                    isRead
                      ? 'text-muted-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {item.headline}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                  {item.summary}
                </p>
              </div>

              <ExternalLink className="w-4 h-4 flex-shrink-0 text-muted-foreground mt-1" />
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <span className="px-2 py-1 bg-muted rounded text-muted-foreground">
                {item.source}
              </span>

              {item.related && (
                <span className="px-2 py-1 bg-muted rounded text-muted-foreground">
                  {item.related}
                </span>
              )}

              <span className="text-muted-foreground ml-auto">
                {new Date(item.datetime * 1000).toLocaleDateString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>
      </a>
    </Card>
  );
}
