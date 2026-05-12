export const metadata = {
  title: '대시보드 - Moneytoring',
  description: '실시간 주식 및 암호화폐 가격 조회',
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground">
          실시간 주식 및 암호화폐 가격을 확인하세요.
        </p>
      </div>

      {/* 검색 바 및 컴포넌트는 Task 1-3에서 추가 */}
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          Task 1-3에서 검색 및 가격 표시 기능이 추가됩니다.
        </p>
      </div>
    </div>
  );
}
