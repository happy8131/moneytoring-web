'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, Moon, Sun, Menu, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/dashboard', label: '대시보드' },
  { href: '/portfolio', label: '포트폴리오' },
  { href: '/news', label: '뉴스' },
  { href: '/community', label: '커뮤니티' },
  { href: '/discussions', label: '토론' },
  { href: '/economic-calendar', label: '경제지표' },
] as const;

export function Header() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; username?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);

    // 현재 사용자 조회 (프로필 조회 제거 - 클라이언트 에러 방지)
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (authUser) {
          setUser({
            email: authUser.email,
            username: authUser.email?.split('@')[0], // 이메일에서 사용자명 추출
          });
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 라우트 변경 시 모바일 메뉴 자동 닫기 (Link onClick + Sheet close의 타이밍 충돌 회피)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setIsDark(false);
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.add('dark');
      setIsDark(true);
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {/* 모바일 햄버거 메뉴 */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 md:hidden cursor-pointer"
                aria-label="메뉴 열기"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              {/* Radix Dialog a11y 요구사항 (시각적으로는 숨김) */}
              <SheetTitle className="sr-only">메뉴</SheetTitle>
              <SheetDescription className="sr-only">
                사이트 페이지로 이동하는 네비게이션 메뉴
              </SheetDescription>
              <nav className="flex flex-col gap-1 p-4 pt-12">
                {navItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'rounded-md px-3 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2 font-bold">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">Moneytoring</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* 데스크탑 네비게이션 */}
          <nav className="hidden md:flex gap-6 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {mounted && (
            <Button
              className="hover:text-primary cursor-pointer"
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              aria-label="다크 모드 토글"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          {/* 사용자 메뉴 */}
          {!isLoading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                        {user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                      </div>
                      <span className="hidden sm:inline text-sm">
                        {user.username || user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        <span>마이페이지</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <form
                        action={async () => {
                          const { logout } = await import('@/app/actions/auth');
                          await logout();
                        }}
                      >
                        <button className="flex w-full items-center gap-2 text-red-600 dark:text-red-400 cursor-pointer">
                          <LogOut className="h-4 w-4" />
                          <span>로그아웃</span>
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">로그인</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/register">회원가입</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
