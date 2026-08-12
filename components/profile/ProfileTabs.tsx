'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Heart, MessageCircle, FileText } from 'lucide-react';
import Link from 'next/link';
import type { PortfolioShare } from '@/types';
import { PublicPortfolioCard } from '@/components/portfolio/PublicPortfolioCard';

interface ProfileTabsProps {
  portfolioShare: PortfolioShare | null;
  followingPortfolios: PortfolioShare[];
  myPosts: any[];
  myDiscussions: any[];
}

export function ProfileTabs({
  portfolioShare,
  followingPortfolios,
  myPosts,
  myDiscussions,
}: ProfileTabsProps) {
  return (
    <Tabs defaultValue="portfolio" className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
        <TabsTrigger value="portfolio" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary cursor-pointer">
          포트폴리오
        </TabsTrigger>
        <TabsTrigger value="following" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary cursor-pointer">
          팔로우한 포트폴리오
        </TabsTrigger>
        <TabsTrigger value="community" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary cursor-pointer">
          커뮤니티
        </TabsTrigger>
        <TabsTrigger value="discussions" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary cursor-pointer">
          토론
        </TabsTrigger>
      </TabsList>

      {/* 포트폴리오 탭 */}
      <TabsContent value="portfolio" className="space-y-4">
        {portfolioShare ? (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{portfolioShare.title}</h3>
                  {portfolioShare.description && (
                    <p className="text-sm text-muted-foreground mt-1">{portfolioShare.description}</p>
                  )}
                </div>
                <Badge variant={portfolioShare.isPublic ? 'default' : 'secondary'}>
                  {portfolioShare.isPublic ? '공개' : '비공개'}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">조회수</p>
                  <p className="text-lg font-semibold">{portfolioShare.viewsCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">팔로워</p>
                  <p className="text-lg font-semibold">{portfolioShare.followersCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">종목 수</p>
                  <p className="text-lg font-semibold">{portfolioShare.holdingsSnapshot.length}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/portfolios/${portfolioShare.shareLink}`} className="flex-1">
                  <Button variant="outline" className="w-full cursor-pointer">
                    공개 포트폴리오 보기
                  </Button>
                </Link>
                <Link href="/portfolio" className="flex-1">
                  <Button className="w-full cursor-pointer">공유 설정 변경</Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">아직 공유한 포트폴리오가 없습니다.</p>
            <Link href="/portfolio cursor-pointer">
              <Button>포트폴리오 공유하기</Button>
            </Link>
          </Card>
        )}
      </TabsContent>

      {/* 팔로우한 포트폴리오 탭 */}
      <TabsContent value="following" className="space-y-4">
        {followingPortfolios.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">팔로우한 포트폴리오가 없습니다.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {followingPortfolios.map((portfolio) => (
              <PublicPortfolioCard key={portfolio.id} portfolio={portfolio} />
            ))}
          </div>
        )}
      </TabsContent>

      {/* 커뮤니티 탭 */}
      <TabsContent value="community" className="space-y-4">
        {myPosts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">아직 작성한 포스트가 없습니다.</p>
          </Card>
        ) : (
          myPosts.map((post) => (
            <Link key={post.id} href={`/community/${post.id}`}>
              <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString('ko-KR')}
                      </p>
                      <p className="mt-1 line-clamp-2">{post.content}</p>
                    </div>
                    {post.image_url && (
                      <img src={post.image_url} alt="" className="w-16 h-16 rounded object-cover ml-2" />
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.likesCount || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {post.commentsCount || 0}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </TabsContent>

      {/* 토론 탭 */}
      <TabsContent value="discussions" className="space-y-4">
        {myDiscussions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">아직 작성한 토론이 없습니다.</p>
          </Card>
        ) : (
          myDiscussions.map((discussion) => (
            <Link key={discussion.id} href={`/discussions/${discussion.id}`}>
              <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {discussion.symbol}
                        </Badge>
                        {discussion.is_hot && (
                          <Badge className="text-xs bg-red-500">HOT</Badge>
                        )}
                      </div>
                      <h4 className="font-semibold mt-2">{discussion.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {discussion.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2 border-t text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <p>{new Date(discussion.created_at).toLocaleDateString('ko-KR')}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {discussion.views_count || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {discussion.commentsCount || 0}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </TabsContent>
    </Tabs>
  );
}
