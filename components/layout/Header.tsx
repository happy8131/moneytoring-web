'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, Moon, Sun, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: '대시보드' },
  { href: '/portfolio', label: '포트폴리오' },
  { href: '/news', label: '뉴스' },
  { href: '/economic-calendar', label: '경제지표' },
] as const;

export function Header() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
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
                className="h-9 w-9 md:hidden"
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
        </div>
      </div>
    </header>
  );
}
