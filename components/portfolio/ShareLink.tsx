'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check } from 'lucide-react';

interface ShareLinkProps {
  shareLink: string;
}

export function ShareLink({ shareLink }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/portfolios/${shareLink}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">공유 링크</label>
      <div className="flex gap-2">
        <Input value={fullUrl} readOnly className="text-sm" />
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopy}
          title={copied ? '복사됨' : '복사'}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
