import { KrIndexDetailHeader } from '@/components/kr-indices/KrIndexDetailHeader';
import { KrIndexPriceChart } from '@/components/kr-indices/KrIndexPriceChart';

interface KrIndexDetailPageProps {
  params: {
    code: string;
  };
}

export async function generateMetadata({ params }: KrIndexDetailPageProps) {
  const { code } = await params;
  const codeLabel = code === 'kospi' ? '코스피' : code === 'kosdaq' ? '코스닥' : '코스피200';
  return {
    title: `${codeLabel} - 한국 증시 지수`,
    description: `${codeLabel}의 실시간 지수, 차트, 거래량 정보`,
  };
}

export default async function KrIndexDetailPage({ params }: KrIndexDetailPageProps) {
  const { code } = await params;

  return (
    <div className="space-y-6 pb-12">
      {/* 헤더 */}
      <KrIndexDetailHeader code={code} />

      {/* 차트 & 거래량 */}
      <KrIndexPriceChart code={code} />
    </div>
  );
}
