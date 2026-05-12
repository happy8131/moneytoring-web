import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

export function Header() {
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
        </div>
      </div>
    </header>
  );
}
