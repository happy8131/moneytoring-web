export const metadata = {
  title: '뉴스 - Moneytoring',
  description: '주식 및 암호화폐 관련 뉴스 피드',
};

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">뉴스</h1>
        <p className="text-muted-foreground">
          금융 시장 관련 최신 뉴스를 확인하세요.
        </p>
      </div>

      {/* 뉴스 필터 및 리스트는 Task 1-5에서 추가 */}
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          Task 1-5에서 뉴스 목록, 필터, 읽음 표시가 추가됩니다.
        </p>
      </div>
    </div>
  );
}
