export const metadata = {
  title: '포트폴리오 - Moneytoring',
  description: '보유 중인 주식 및 암호화폐 포트폴리오 관리',
};

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">포트폴리오</h1>
        <p className="text-muted-foreground">
          보유 중인 자산을 관리하고 수익률을 분석하세요.
        </p>
      </div>

      {/* 포트폴리오 테이블 및 차트는 Task 1-4에서 추가 */}
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          Task 1-4에서 종목 추가, 테이블, PieChart가 추가됩니다.
        </p>
      </div>
    </div>
  );
}
