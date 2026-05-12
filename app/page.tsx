import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

export const metadata = {
  title: 'Moneytoring - 자산 관리 서비스',
  description: '실시간 주식 및 암호화폐 포트폴리오 관리 플랫폼',
};

export default function Home() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Moneytoring</h1>
              <p className="text-muted-foreground mt-2">
                실시간 주식 및 암호화폐 포트폴리오 관리 플랫폼
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7H5v12h12V9m0-2l6.894-6.894a2 2 0 012.828 0l2.828 2.828A2 2 0 0120.894 5M9 9h.01M9 12h4m4 0h.01M9 15h4m4 0h.01"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">대시보드</h3>
                    <p className="text-sm text-muted-foreground">
                      실시간 가격 조회
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">포트폴리오</h3>
                    <p className="text-sm text-muted-foreground">
                      자산 관리 및 분석
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v4m0 0V5m0 4h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">뉴스</h3>
                    <p className="text-sm text-muted-foreground">
                      시장 정보 & 뉴스
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/50 p-6">
              <h2 className="font-semibold mb-2">시작하기</h2>
              <p className="text-sm text-muted-foreground">
                상단 네비게이션을 통해 대시보드, 포트폴리오, 뉴스 페이지에 접근할 수 있습니다.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
