'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { getMyFollowing, getMyFollowers } from '@/app/actions/profile';

interface FollowUser {
  userId: string;
  username: string;
  avatarUrl?: string;
  portfolioShareLink?: string;
  portfolioTitle?: string;
}

interface FollowListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'following' | 'followers';
}

export function FollowListModal({
  open,
  onOpenChange,
  defaultTab = 'following',
}: FollowListModalProps) {
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>(defaultTab);

  useEffect(() => {
    if (!open) return;

    Promise.all([getMyFollowing(), getMyFollowers()])
      .then(([followingData, followersData]) => {
        setFollowing(followingData);
        setFollowers(followersData);
      })
      .catch((error) => {
        console.error('Failed to load follow list:', error);
      });
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>팔로우/팔로워</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'following' | 'followers')} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="following" className="flex-1">
              팔로잉 ({following.length})
            </TabsTrigger>
            <TabsTrigger value="followers" className="flex-1">
              팔로워 ({followers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="following" className="space-y-3">
            {following.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">팔로우하는 사람이 없습니다.</div>
            ) : (
              following.map((user) => (
                <div key={user.userId} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-8 w-8">
                      {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.username}</p>
                      {user.portfolioTitle && (
                        <p className="text-xs text-muted-foreground truncate">{user.portfolioTitle}</p>
                      )}
                    </div>
                  </div>
                  {user.portfolioShareLink && (
                    <Link href={`/portfolios/${user.portfolioShareLink}`}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <ArrowRight className="h-3 w-3 cursor-pointer" />
                      </Button>
                    </Link>
                  )}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="followers" className="space-y-3">
            {followers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">팔로워가 없습니다.</div>
            ) : (
              followers.map((user) => (
                <div key={user.userId} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-8 w-8">
                      {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.username}</p>
                      {user.portfolioTitle && (
                        <p className="text-xs text-muted-foreground truncate">{user.portfolioTitle}</p>
                      )}
                    </div>
                  </div>
                  {user.portfolioShareLink && (
                    <Link href={`/portfolios/${user.portfolioShareLink}`}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  )}
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
