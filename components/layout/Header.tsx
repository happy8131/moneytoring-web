'use client';

import Link from 'next/link';
import { TrendingUp, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

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
        <Link href="/" className="flex items-center gap-2 font-bold">
          <TrendingUp className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">Moneytoring</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6 text-sm">
            <Link
              href="/dashboard"
              className="transition-colors hover:text-primary"
            >
              대시보드
            </Link>
            <Link
              href="/portfolio"
              className="transition-colors hover:text-primary"
            >
              포트폴리오
            </Link>
            <Link
              href="/news"
              className="transition-colors hover:text-primary"
            >
              뉴스
            </Link>
          </nav>

          {mounted && (
            <Button
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
