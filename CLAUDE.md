# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**프로젝트명**: Moneytoring Web
**프레임워크**: Next.js 16.2.4 (App Router)
**언어**: TypeScript 5 + React 19.2.4
**스타일링**: Tailwind CSS 4 + shadcn/ui

## 개발 환경 설정

### 의존성 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```
개발 서버는 `http://localhost:3000`에서 실행됩니다.

### 프로덕션 빌드
```bash
npm run build
npm start
```

### 코드 린팅
```bash
npm run lint
```

## 프로젝트 구조

### 주요 디렉토리
- **app/**: Next.js App Router 디렉토리 (페이지, 레이아웃, API 라우트)
  - `layout.tsx`: 루트 레이아웃 (Geist 폰트, Tailwind 클래스 설정)
  - `page.tsx`: 홈페이지
  - `globals.css`: 전역 스타일 및 Tailwind 임포트

### 설정 파일
- `tsconfig.json`: TypeScript 설정 (strict 모드 활성화, path alias `@/*` 설정)
- `next.config.ts`: Next.js 설정
- `eslint.config.mjs`: ESLint 설정 (Next.js Core Web Vitals + TypeScript)
- `postcss.config.mjs`: PostCSS 설정 (@tailwindcss/postcss 플러그인)
- `package.json`: 의존성 및 스크립트

## 기술 스택 상세

### Next.js 16.2.4
- **App Router 사용**: 모든 페이지와 API 라우트는 `app/` 디렉토리 기반
- **서버 컴포넌트**: 기본적으로 서버 컴포넌트 사용 (필요 시 `use client` 추가)
- **경로 별칭**: `@/*`는 프로젝트 루트를 가리킴

### TypeScript
- **strict 모드**: 활성화됨
- **JSX**: react-jsx로 설정
- **moduleResolution**: bundler 설정 (Node 라이브러리와 우선순위 처리)

### Tailwind CSS 4
- **새로운 PostCSS 문법**: `@import "tailwindcss"` 사용
- **Inline 테마**: globals.css에서 `@theme inline` 사용
- **CSS 변수**: `--background`, `--foreground` 등 CSS 변수로 테마 관리
- **다크 모드**: `@media (prefers-color-scheme: dark)` 지원

### UI 라이브러리
- **shadcn/ui**: Radix UI 기반의 재사용 가능한 컴포넌트
  - `globals.css`에 `@import "shadcn/tailwind.css"` 포함
  - `npx shadcn@latest add <component>`로 컴포넌트 추가
  - 권장 컴포넌트: button, input, card, dialog, dropdown-menu, tabs 등
- **lucide-react**: 1300개 이상의 아이콘 라이브러리
  - `import { IconName } from 'lucide-react'`로 사용
- **Radix UI**: 접근성 있는 컴포넌트 기본 라이브러리 (shadcn에 포함)

### 스타일링 유틸리티
- **class-variance-authority**: 컴포넌트 스타일 변형(variant) 관리
  - 조건부 스타일을 타입 안전하게 관리
- **clsx**: 조건부 CSS 클래스 이름 병합
  - Tailwind 클래스와 조건 로직 함께 사용
- **tailwind-merge**: Tailwind 클래스 충돌 자동 해결
  - 동일한 유틸리티의 충돌하는 클래스 병합

### 애니메이션
- **tw-animate-css**: Tailwind CSS용 애니메이션 라이브러리
  - `globals.css`에 `@import "tw-animate-css"` 포함

### 폰트
- **Geist 폰트**: Google Fonts에서 로드 (next/font 최적화)
  - `Geist`: 일반 폰트 (`--font-geist-sans`)
  - `Geist_Mono`: 고정폭 폰트 (`--font-geist-mono`)

### 데이터 페칭 및 상태 관리
- **React Query (@tanstack/react-query)**: 서버 상태 관리 및 데이터 캐싱
  - 자동 캐싱, 백그라운드 동기화, 리트라이 로직 포함
  - 복잡한 데이터 페칭은 React Query 사용 권장
- **클라이언트 상태**: `useState`, `useReducer` 사용

### 외부 API 통합
- **Finnhub**: 주식 시장 데이터 API
  - `finnhub` 패키지로 API 호출
  - 환경변수 `NEXT_PUBLIC_FINNHUB_API_KEY` 설정 필요
- **CoinGecko**: 암호화폐 데이터 API (에이전트 가이드 참고)
- **Kiwoom Securities**: 한국 증권 API (에이전트 가이드 참고)

## 개발 가이드

### 페이지 추가
`app/` 디렉토리 내에 폴더를 생성하고 `page.tsx` 파일 추가:
```typescript
// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">대시보드</h1>
    </div>
  );
}
```

### 서버 컴포넌트 (권장)
기본적으로 모든 컴포넌트는 서버 컴포넌트:
```typescript
// 데이터베이스 접근, 서버 전용 환경 변수 사용 가능
export default function ServerComponent() {
  return <div>서버 컴포넌트</div>;
}
```

### 클라이언트 컴포넌트
상태, 이벤트 리스너, 브라우저 API 필요 시 `'use client'` 추가:
```typescript
'use client';

import { useState } from 'react';

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      클릭 횟수: {count}
    </button>
  );
}
```

### shadcn/ui 컴포넌트 사용
1. **컴포넌트 추가**:
   ```bash
   npx shadcn@latest add button
   npx shadcn@latest add input
   npx shadcn@latest add card
   ```

2. **컴포넌트 사용**:
   ```typescript
   import { Button } from '@/components/ui/button';
   import { Input } from '@/components/ui/input';

   export default function Form() {
     return (
       <div>
         <Input placeholder="이름 입력" />
         <Button>제출</Button>
       </div>
     );
   }
   ```

### 아이콘 사용 (lucide-react)
```typescript
'use client';

import { Heart, Share2, MessageCircle } from 'lucide-react';

export default function IconExample() {
  return (
    <div className="flex gap-4">
      <Heart size={24} />
      <Share2 size={24} />
      <MessageCircle size={24} />
    </div>
  );
}
```

### 컴포넌트 구조화
향후 컴포넌트 디렉토리를 다음과 같이 구성하는 것을 권장:
```
app/
  components/
    ui/                    # shadcn 컴포넌트
      button.tsx
      input.tsx
      card.tsx
    common/                # 재사용 가능한 컴포넌트
      Header.tsx
      Sidebar.tsx
    (feature-name)/        # 기능별 컴포넌트
      DashboardWidget.tsx
```

### 스타일링 패턴
**Tailwind CSS 유틸리티 클래스 사용 (권장)**:
```typescript
export default function Card() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">제목</h2>
    </div>
  );
}
```

**class-variance-authority로 컴포넌트 스타일 관리**:
```typescript
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
      },
      size: {
        default: 'h-9 px-4 py-2',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps {
  variant?: 'default' | 'outline';
  size?: 'default' | 'lg';
}

export function CustomButton({ variant, size, ...props }: ButtonProps) {
  return <button className={buttonVariants({ variant, size })} {...props} />;
}
```

**CSS 변수 활용**:
```typescript
// 테마 색상은 globals.css에 정의된 CSS 변수 사용
export default function ThemedComponent() {
  return (
    <div className="bg-background text-foreground">
      배경과 텍스트 색상이 테마에 따라 자동으로 변함
    </div>
  );
}
```

### 레이아웃 구조
- 루트 레이아웃은 `app/layout.tsx`에서 정의
- `<html>`, `<body>` 태그 포함
- 모든 페이지는 루트 레이아웃으로 래핑됨
- 중첩 레이아웃은 각 디렉토리 내에 `layout.tsx` 추가

### API 라우트 패턴
API 라우트는 `app/api/` 디렉토리에 생성:
```typescript
// app/api/stocks/route.ts
export async function GET(request: Request) {
  try {
    // 외부 API 호출 또는 데이터 처리
    const data = await fetchStockData();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
```

### React Query 사용 예시
클라이언트에서 데이터 페칭:
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

export default function StockChart() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['stocks'],
    queryFn: async () => {
      const response = await fetch('/api/stocks');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류 발생: {error.message}</div>;

  return <div>{/* 데이터 렌더링 */}</div>;
}
```

**React Query 초기화**: 이미 `app/providers.tsx`에서 설정 완료
- QueryClient 기본값: staleTime 5분, gcTime 10분, retry 1회
- `TooltipProvider` 함께 래핑
- `app/layout.tsx`에서 `<Providers>` 컴포넌트로 감싸짐

## 에이전트 및 MCP 시스템

이 프로젝트는 다음 Claude Code 에이전트를 포함합니다:

### API 가이드 에이전트
- **coingecko-api-guide**: CoinGecko API 통합 및 암호화폐 데이터 처리
- **finnhub-api-guide**: Finnhub API를 통한 주식 데이터 실시간 처리
- **kiwoom-api-guide**: 한국 증권 API (Kiwoom) OAuth 및 REST 엔드포인트 가이드

외부 API를 구현할 때 해당 에이전트를 활용하면 최신 문서와 모범 사례를 참고할 수 있습니다.

## ESLint 설정

ESLint는 다음 설정을 포함:
- **Next.js Core Web Vitals**: 성능 관련 린팅
- **TypeScript**: 타입 관련 린팅

ESLint 무시 대상:
- `.next/`
- `out/`
- `build/`
- `next-env.d.ts`

## 자주 사용하는 명령어

### 개발 & 빌드
```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start

# 코드 린팅 및 검사
npm run lint
```

### UI 컴포넌트
```bash
# 새로운 shadcn 컴포넌트 추가
npx shadcn@latest add <component-name>

# 특정 shadcn 컴포넌트 제거
npx shadcn@latest remove <component-name>

# 모든 설치된 컴포넌트 확인
ls components/ui
```

### 의존성 관리
```bash
# 새 패키지 추가
npm install <package-name>

# 의존성 업데이트
npm update

# 의존성 체크
npm ls
```

## 메타데이터 및 SEO

`app/layout.tsx`에서 프로젝트 메타데이터를 업데이트:
```typescript
export const metadata: Metadata = {
  title: 'Moneytoring - 가계부 관리 서비스',
  description: '효율적인 자산 관리와 재무 모니터링 서비스',
};
```

각 페이지별 메타데이터도 설정 가능:
```typescript
// app/dashboard/page.tsx
export const metadata: Metadata = {
  title: '대시보드 - Moneytoring',
  description: '당신의 자산 현황을 한눈에 확인하세요',
};

export default function DashboardPage() {
  // ...
}
```

## 주의사항

1. **Next.js 16.2.4**: 이 프로젝트는 최신 버전의 Next.js를 사용합니다.
2. **타입 안정성**: strict 모드가 활성화되어 있으므로 모든 타입을 명시적으로 지정해야 합니다.
3. **Tailwind CSS 4**: PostCSS v4 문법을 사용합니다. 이전 버전의 문법과는 다릅니다.
4. **shadcn/ui 컴포넌트**: `npx shadcn@latest add`로 추가된 컴포넌트는 `components/ui/` 디렉토리에 저장됩니다.
5. **API 키 보안**: `.env.local` 파일은 .gitignore에 포함되어 있습니다. 절대 커밋하지 마세요.
6. **SSR 안전성**: localStorage를 사용하는 훅은 반드시 `typeof window === 'undefined'` 체크 필요 (예: `usePortfolio`)

## 주요 파일 수정 시 주의

- **app/globals.css**: 전역 스타일, Tailwind, shadcn 임포트 (변경 시 신중함 필요)
- **app/layout.tsx**: 루트 메타데이터, Geist 폰트 설정, 제목/설명 업데이트
- **tsconfig.json**: TypeScript 설정 (path alias `@/*` 변경 금지)
- **next.config.ts**: Next.js 빌드 및 런타임 동작 설정

## 컴포넌트 디렉토리 구조 (초기화 예시)

프로젝트 성장에 따라 다음 구조로 컴포넌트를 조직화:
```
app/
  components/
    ui/                      # shadcn 컴포넌트 (npx shadcn add로 생성)
      button.tsx
      input.tsx
      card.tsx
    common/                  # 공용 컴포넌트
      Header.tsx
      Footer.tsx
      Sidebar.tsx
    dashboard/               # 기능별 컴포넌트
      OverviewChart.tsx
      ExpenseWidget.tsx
    auth/
      LoginForm.tsx
  lib/                       # 유틸리티 함수
    utils.ts                 # cn() 헬퍼 함수 등
    constants.ts
  hooks/                     # 커스텀 훅
    useAuth.ts
  styles/                    # 추가 스타일 (globals.css가 기본)
```

## 환경 변수

`.env.local` 파일을 생성하여 환경 변수 설정:
```
# 외부 API 키
FINNHUB_API_KEY=your_finnhub_api_key
COINGECKO_API_KEY=your_coingecko_api_key
KIWOOM_API_KEY=your_kiwoom_api_key
CLAUDE_API_KEY=sk-ant-v1-your_claude_api_key
```

### 공개 vs 비공개 환경 변수
- **NEXT_PUBLIC_** 접두사: 클라이언트 사이드에서 접근 가능 (브라우저에 노출됨)
  - API 키가 필요 없거나 공개 API인 경우만 사용
  - 예: Finnhub 공개 엔드포인트
- **접두사 없음**: 서버 사이드만 접근 가능
  - 민감한 정보는 반드시 접두사 없이 설정
  - 예: 외부 API 키, Claude API 키

## 아키텍처 및 데이터 흐름

### 상태 관리 계층

**1. localStorage 기반 포트폴리오 관리** (`usePortfolio` 훅)
- 보유 종목(Holdings), 거래 기록(Transactions), 즐겨찾기, 읽은 뉴스 로컬 저장
- SSR 안전성: `typeof window === 'undefined'` 체크로 서버에서 안전
- 데이터 마이그레이션: 기존 데이터에 누락된 필드 자동으로 추가
- 예: 새로운 `transactions` 필드 추가 시 기존 사용자 데이터도 정상 작동

```typescript
const { holdings, transactions, addHolding, addTransaction, removeTransaction } = usePortfolio();
```

**2. React Query 기반 외부 API 데이터** (`useStockQuotes`, `useCryptoPrices`, `useNews` 등)
- 자동 캐싱 (staleTime: 5분, gcTime: 10분)
- 백그라운드 동기화 및 자동 리트라이
- 데이터 페칭 상태 (isLoading, error, data) 추적

```typescript
const { data: stockPrices, isLoading } = useStockQuotes({
  symbols: ['AAPL', 'GOOGL'],
  enabled: true // 조건부 쿼리
});
```

### 외부 API 통합 패턴

**API 라우트** (`app/api/*/route.ts`) → **클라이언트 훅** → **UI 컴포넌트**

```
app/api/stocks/quotes/route.ts     ← Finnhub API 호출
  ↓
hooks/useStockQuotes.ts             ← React Query 캐싱
  ↓
components/dashboard/StockWatchlist ← UI 렌더링
```

**주요 API 서버:**
- **Finnhub**: 미국 주식 가격, 회사 정보 (`/api/stocks/*`)
- **CoinGecko**: 암호화폐 가격 (`/api/crypto/*`)
- **Claude API**: AI 투자 추천 분석 (`/api/recommendations`)
- **Kiwoom**: 한국 주식 가격, 지수 (`/api/korean-stocks/*`)

### 포트폴리오 계산 시스템

`lib/calculations.ts`에서 제공하는 함수들:
- `calculateGain()`: 손익 계산
- `calculateGainPercent()`: 수익률 계산
- `mergeHoldingsWithPrices()`: 현재 가격 병합
- `calculatePortfolioSummary()`: 전체 포트폴리오 요약
- `calculatePortfolioValueHistory()`: 거래 기록 기반 시계열 자산 추이
- `calculateRebalancingSuggestions()`: 균등 분배 기반 리밸런싱 제안

## 주요 기능 영역

### 대시보드 (`app/(main)/dashboard/page.tsx`)
- 주식/암호화폐 실시간 가격 조회
- 즐겨찾기 목록 표시
- 통합 검색 (주식 + 암호화폐)

### 포트폴리오 (`app/(main)/portfolio/page.tsx`)
포트폴리오는 **3개 탭**으로 구성:

1. **보유종목 탭**
   - 현재 보유 중인 주식/암호화폐 목록
   - 수익률 실시간 계산 및 표시
   - 자산 분배 PieChart
   - 종목 추가/삭제

2. **거래기록 탭**
   - 매수/매도 기록 관리
   - 거래 추가/삭제
   - 데이터: `usePortfolio()` 훅의 `transactions`

3. **분석 탭** (`PortfolioAnalytics` 컴포넌트)
   - **자산 추이 차트**: 거래 기록 기반 시계열 데이터
   - **리밸런싱 제안**: 현재 비중 vs 목표 비중 비교
   - **AI 투자 추천**: Claude API 기반 맞춤형 추천
     - 분석 결과: 분산도, 리스크, 기회 제시

### 뉴스 (`app/(main)/news/page.tsx`)
- Finnhub 시장 뉴스
- 카테고리 필터 (일반, 외환, 암호화폐, M&A)
- 읽음 상태 관리

## 실제 사용 시나리오

### 새로운 페이지 추가
1. `app/(main)/feature/page.tsx` 생성
2. 필요한 훅 사용:
   ```typescript
   const { data, isLoading, error } = useStockQuotes({ symbols: ['AAPL'] });
   ```
3. 컴포넌트 렌더링

### 포트폴리오에 새 종목 추가
```typescript
const { addHolding } = usePortfolio();
addHolding({
  symbol: 'AAPL',
  name: 'Apple Inc.',
  quantity: 10,
  buyPrice: 150,
  buyDate: '2024-01-01',
  type: 'stock',
});
```

### 포트폴리오 데이터 계산
```typescript
import { mergeHoldingsWithPrices, calculatePortfolioSummary } from '@/lib/calculations';

const holdingsWithPrices = mergeHoldingsWithPrices(holdings, stockPriceMap, cryptoPriceMap);
const summary = calculatePortfolioSummary(holdingsWithPrices);
```

## 데이터 타입 및 스키마

### 핵심 타입 (`types/index.ts`)

```typescript
// 보유 종목
interface Holding {
  id: string;
  symbol: string;           // 종목코드 (예: AAPL, 005930)
  name: string;             // 종목명
  quantity: number;         // 보유 수량
  buyPrice: number;         // 매수가
  buyDate: string;          // 매수일 (ISO 8601)
  type: 'stock' | 'crypto'; // 타입
  currentPrice?: number;    // 실시간 가격 (계산됨)
  gain?: number;            // 손익액 (계산됨)
  gainPercent?: number;     // 수익률 (계산됨)
  totalValue?: number;      // 총 평가액 (계산됨)
}

// 거래 기록
interface Transaction {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  date: string;             // YYYY-MM-DD
  memo?: string;
}

// 포트폴리오 저장소 (localStorage 구조)
interface PortfolioStore {
  holdings: Holding[];
  favorites: Favorite[];
  readNews: string[];
  transactions: Transaction[];
  lastUpdated: string;
}
```

## 포트폴리오 시스템 확장 가이드

### 새로운 보유 종목 타입 추가

1. **타입 정의** (`types/index.ts`):
   ```typescript
   // Holding 타입의 type 필드에 추가
   type: 'stock' | 'crypto' | 'bond'; // 새 타입 추가
   ```

2. **API 라우트** 추가:
   - 새 API 서버 연동 필요시 `app/api/bonds/route.ts` 생성
   - 표준 응답 형식: `{ symbol, name, currentPrice, ... }`

3. **훅 추가**:
   ```typescript
   // hooks/useBondPrices.ts
   export function useBondPrices(symbols: string[]) {
     return useQuery({
       queryKey: ['bonds', symbols],
       queryFn: () => fetch(`/api/bonds?symbols=${symbols.join(',')}`),
       // ... React Query 옵션
     });
   }
   ```

4. **포트폴리오 페이지 통합**:
   ```typescript
   // 가격 맵 병합
   const bondPriceMap = new Map(bondData?.data?.map(b => [b.symbol, b.currentPrice]));
   const mergedHoldings = mergeHoldingsWithPrices(
     holdings,
     stockPriceMap,
     cryptoPriceMap,
     bondPriceMap // 새로 추가
   );
   ```

### 새로운 계산 함수 추가

`lib/calculations.ts`에 새 함수 추가 시:
- 함수명은 명확하게 (예: `calculateDividendYield`, `calculateDuration`)
- 입력/출력 타입을 명시
- 엣지 케이스 처리 (0 값, undefined 등)

## 일반적인 패턴 및 주의사항

### localStorage 데이터 마이그레이션

새 필드를 `PortfolioStore`에 추가할 때:
```typescript
// loadStore 함수 업데이트
const parsed = JSON.parse(raw);
return {
  ...parsed,
  newField: parsed.newField ?? 'defaultValue', // 기본값 할당
};
```

### 컴포넌트에서 undefined 처리

props가 undefined일 수 있는 경우:
```typescript
interface MyProps {
  data?: Array<T>;
}

export function MyComponent({ data = [] }: MyProps) {
  const safeData = Array.isArray(data) ? data : [];
  // 이제 safeData는 항상 배열
}
```

## 완료된 기능 (Phase 2)

- **Task 2-1**: 포트폴리오 고급 기능 (거래기록, 자산 추이, 리밸런싱)
- **Task 2-2**: AI 투자 추천 (Claude API 통합)
- **Task 2-3**: 한국 주식 지원 (Kiwoom API 기본 구조)
