'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  BarChart3,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import type { AIRecommendation } from '@/types';

interface RecommendationCardProps {
  recommendation: AIRecommendation;
}

export function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const getCategoryIcon = () => {
    switch (recommendation.category) {
      case 'diversification':
        return <BarChart3 className="w-5 h-5" />;
      case 'opportunity':
        return <TrendingUp className="w-5 h-5" />;
      case 'risk':
        return <AlertCircle className="w-5 h-5" />;
      case 'rebalancing':
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = () => {
    switch (recommendation.category) {
      case 'diversification':
        return '분산';
      case 'opportunity':
        return '기회';
      case 'risk':
        return '위험';
      case 'rebalancing':
        return '리밸런싱';
      default:
        return '기타';
    }
  };

  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = () => {
    switch (recommendation.priority) {
      case 'high':
        return '높음';
      case 'medium':
        return '중간';
      case 'low':
        return '낮음';
      default:
        return '기타';
    }
  };

  return (
    <Card className="p-4 border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1 text-primary">
          {getCategoryIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">
              {recommendation.title}
            </h3>
            <Badge variant="outline" className="text-xs flex-shrink-0">
              {getCategoryLabel()}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-3">
            {recommendation.description}
          </p>

          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              {recommendation.action}
            </p>
            <Badge className={getPriorityColor()}>
              {getPriorityLabel()}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
