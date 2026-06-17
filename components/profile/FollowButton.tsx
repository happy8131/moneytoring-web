'use client';

import { useState } from 'react';
import { FollowListModal } from './FollowListModal';

interface FollowButtonProps {
  count: number;
  label: string;
  defaultTab: 'followers' | 'following';
}

export function FollowButton({ count, label, defaultTab }: FollowButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="hover:opacity-70 transition-opacity text-left"
      >
        <div className="text-2xl font-bold">{count}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </button>
      <FollowListModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        defaultTab={defaultTab}
      />
    </>
  );
}
