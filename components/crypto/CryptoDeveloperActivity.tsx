'use client';

import { useCryptoDetail } from '@/hooks/useCryptoDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, GitFork, AlertCircle, CheckCircle, GitPullRequest, Code } from 'lucide-react';

interface CryptoDeveloperActivityProps {
  id: string;
}

function DeveloperMetric({ icon: Icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-shrink-0">{Icon}</div>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-lg font-semibold text-foreground">{value.toLocaleString()}</p>
    </div>
  );
}

export function CryptoDeveloperActivity({ id }: CryptoDeveloperActivityProps) {
  const { data: response, isLoading } = useCryptoDetail({ id });
  const detail = response?.data;

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (!detail || !detail.developerData) {
    return null;
  }

  const { developerData } = detail;

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <h3 className="text-lg font-semibold">개발 활동 (GitHub)</h3>
      <div className="grid grid-cols-2 gap-4">
        <DeveloperMetric
          icon={<Star className="w-5 h-5 text-yellow-500" />}
          label="GitHub Stars"
          value={developerData.stars}
        />
        <DeveloperMetric
          icon={<GitFork className="w-5 h-5 text-blue-500" />}
          label="Forks"
          value={developerData.forks}
        />
        <DeveloperMetric
          icon={<AlertCircle className="w-5 h-5 text-orange-500" />}
          label="총 이슈"
          value={developerData.totalIssues}
        />
        <DeveloperMetric
          icon={<CheckCircle className="w-5 h-5 text-green-500" />}
          label="닫힌 이슈"
          value={developerData.closedIssues}
        />
        <DeveloperMetric
          icon={<GitPullRequest className="w-5 h-5 text-purple-500" />}
          label="병합된 PR"
          value={developerData.pullRequestsMerged}
        />
        <DeveloperMetric
          icon={<Code className="w-5 h-5 text-cyan-500" />}
          label="4주 커밋 수"
          value={developerData.commitCount4Weeks}
        />
      </div>
      <div className="border-t border-border pt-4 space-y-2 text-xs text-muted-foreground">
        <p>
          <span className="font-medium">코드 추가:</span> {developerData.codeAdditions4Weeks.toLocaleString()} 줄
        </p>
        <p>
          <span className="font-medium">코드 삭제:</span> {developerData.codeDeletions4Weeks.toLocaleString()} 줄
        </p>
      </div>
    </div>
  );
}
