import Anthropic from '@anthropic-ai/sdk';
import type { Holding, PortfolioSummary } from '@/types';

if (!process.env.CLAUDE_API_KEY) {
  throw new Error('CLAUDE_API_KEY is not set in environment variables');
}

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export interface RecommendationRequest {
  holdings: Holding[];
  summary: PortfolioSummary;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'diversification' | 'risk' | 'opportunity' | 'rebalancing';
  action: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RecommendationRequest;

    if (!body.holdings || !body.summary) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    const portfolioAnalysis = formatPortfolioData(body.holdings, body.summary);

    const message = await client.messages.create({
      model: 'claude-opus-4-1',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `당신은 전문 투자 자문가입니다. 다음 포트폴리오를 분석하고 구체적인 투자 추천을 제공해주세요.

${portfolioAnalysis}

다음 JSON 형식으로 3-5개의 추천을 제공해주세요:
[
  {
    "title": "추천 제목",
    "description": "상세 설명",
    "priority": "high|medium|low",
    "category": "diversification|risk|opportunity|rebalancing",
    "action": "구체적인 행동"
  }
]

JSON만 반환해주세요. 마크다운 형식이나 추가 설명은 제외해주세요.`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const recommendations = JSON.parse(content.text) as Array<Omit<AIRecommendation, 'id'>>;

    const withIds = recommendations.map((rec, index) => ({
      id: `rec-${Date.now()}-${index}`,
      ...rec,
    }));

    return Response.json({ recommendations: withIds });
  } catch (error) {
    console.error('Recommendation generation error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to generate recommendations',
      }),
      { status: 500 }
    );
  }
}

function formatPortfolioData(holdings: Holding[], summary: PortfolioSummary): string {
  const holdingsText = holdings
    .map(
      (h) =>
        `- ${h.symbol} (${h.name}): ${h.quantity}주, 매수가 $${h.buyPrice}, 현재가 $${h.currentPrice}, 수익률 ${h.gainPercent?.toFixed(2)}%`
    )
    .join('\n');

  return `포트폴리오 요약:
- 총 자산: $${summary.totalValue.toFixed(2)}
- 투자액: $${summary.totalInvested.toFixed(2)}
- 손익: $${summary.totalGain.toFixed(2)} (${summary.totalGainPercent.toFixed(2)}%)
- 보유 종목 수: ${summary.holdingsCount}

보유 종목:
${holdingsText}`;
}
