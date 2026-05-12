# Moneytoring Web - AI 개발 표준 문서

**목적**: AI Agent가 프로젝트 작업을 수행할 때 따를 표준 및 규칙 정의

---

## 프로젝트 개요

**프로젝트**: Moneytoring Web - 실시간 투자 정보 제공 및 포트폴리오 관리 플랫폼

**기술 스택**:
- Frontend: Next.js 16.2.4 (App Router) + TypeScript 5 + React 19.2.4
- 스타일링: Tailwind CSS 4 + shadcn/ui
- 상태 관리: React Query v5 + Context API
- 외부 API: Finnhub (글로벌 주식), CoinGecko (암호화폐), Kiwoom (한국 주식)
- 호스팅: Vercel

**개발 언어**: 한국어 (주석, 커밋, 문서) / 영어 (코드, 변수명)

---

## 프로젝트 아키텍처

### 폴더 구조 표준

```
moneytoring-web/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 루트 레이아웃 (필수)
│   ├── globals.css               # 전역 스타일 (Tailwind, shadcn 임포트)
│   ├── page.tsx                  # 홈페이지
│   ├── api/                      # API 라우트
│   │   ├── stocks/route.ts       # Finnhub API
│   │   ├── crypto/route.ts       # CoinGecko API
│   │   ├── portfolio/route.ts    # 포트폴리오 CRUD
│   │   └── news/route.ts         # 뉴스 데이터
│   ├── dashboard/                # 대시보드 페이지
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── portfolio/                # 포트폴리오 페이지
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── news/                     # 뉴스 페이지
│       ├── layout.tsx
│       └── page.tsx
├── components/                   # 재사용 가능한 컴포넌트
│   ├── ui/                       # shadcn/ui 컴포넌트 (npx shadcn add)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── common/                   # 공용 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainLayout.tsx
│   ├── dashboard/                # 기능별 컴포넌트
│   │   ├── PriceCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── FavoriteList.tsx
│   ├── portfolio/
│   │   ├── PortfolioTable.tsx
│   │   ├── AssetChart.tsx
│   │   └── AddHoldingModal.tsx
│   └── news/
│       ├── NewsCard.tsx
│       └── NewsFilter.tsx
├── lib/                          # 유틸리티 함수
│   ├── utils.ts                  # cn() 헬퍼, tailwind-merge 사용
│   ├── api.ts                    # API 호출 래퍼
│   └── calculations.ts           # 수익률 계산 함수
├── hooks/                        # 커스텀 훅
│   ├── useStocks.ts              # React Query + Finnhub
│   ├── useCryptos.ts             # React Query + CoinGecko
│   ├── usePortfolio.ts           # 포트폴리오 상태 관리
│   └── useReadNews.ts            # 읽음 상태 관리
├── types/                        # TypeScript 타입 정의
│   ├── index.ts                  # 핵심 타입 export
│   ├── stock.ts                  # Stock, StockQuote
│   ├── crypto.ts                 # Crypto, CryptoData
│   ├── portfolio.ts              # Portfolio, Holding
│   ├── news.ts                   # NewsArticle, NewsFeed
│   └── api.ts                    # API 응답 형식
├── styles/                       # 추가 스타일 (globals.css가 기본)
├── docs/                         # 문서
│   └── ROADMAP.md                # 프로젝트 로드맵 (Task 형식)
├── .env.local                    # 환경변수 (gitignore 포함)
├── .env.example                  # 환경변수 샘플
├── package.json
├── tsconfig.json
├── next.config.ts
├── CLAUDE.md                     # 프로젝트 개발 가이드
├── shrimp-rules.md               # AI 개발 표준 (이 파일)
└── README.md                     # 프로젝트 설명 (사용자용)
```

**규칙**:
- 파일명: kebab-case (SearchBar.tsx, add-holding-modal.tsx 아님, **AddHoldingModal.tsx**)
- 컴포넌트/변수: camelCase
- 폴더명: lowercase (components/, lib/, hooks/)
- 모든 새 컴포넌트는 `components/` 하위의 적절한 폴더에 배치
- 모든 새 훅은 `hooks/` 폴더에 배치
- API 라우트는 `app/api/` 아래 관련 폴더로 구성

---

## 코드 표준

### 1. TypeScript

**요구사항**:
- **strict 모드 필수** (tsconfig.json에서 활성화됨)
- 모든 함수에 명시적 타입 지정
- 제네릭 사용 시 기본 타입(T)보다 구체적 타입명 선호 (ItemType, ResponseType)
- 모든 비동기 함수는 `Promise<Type>` 반환 타입 명시

**예시 - 금지**:
```typescript
function calculateGain(quantity, avgPrice, currentPrice) { // 타입 없음
  return (currentPrice - avgPrice) * quantity;
}

const data = fetch('/api/stocks'); // async 명시 없음
```

**예시 - 권장**:
```typescript
function calculateGain(
  quantity: number,
  avgPrice: number,
  currentPrice: number
): number {
  return (currentPrice - avgPrice) * quantity;
}

async function fetchStocks(symbol: string): Promise<Stock[]> {
  const response = await fetch(`/api/stocks?symbol=${symbol}`);
  return response.json();
}
```

### 2. 네이밍 컨벤션

| 항목 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `PriceCard.tsx`, `AddHoldingModal.tsx` |
| 파일명 (컴포넌트) | PascalCase | `HeaderNavigation.tsx` |
| 파일명 (훅/유틸) | camelCase | `useStocks.ts`, `calculateGain.ts` |
| 변수/함수 | camelCase | `const stockPrice = 100` |
| 상수 | UPPER_SNAKE_CASE | `const API_KEY = '...'` |
| 타입/인터페이스 | PascalCase | `type Stock = {...}`, `interface Portfolio {...}` |
| 한국어 주석 | 자유 | `// 주식 가격 조회` |

### 3. 들여쓰기 및 포매팅

- **들여쓰기**: 2칸 (스페이스)
- **세미콜론**: 필수
- **라인 길이**: 80-100자 이상이면 줄바꿈
- **Tailwind 클래스**: `className="flex gap-4 p-2"` (여러 클래스는 공백 분리)

### 4. 주석

**규칙**:
- 주석은 최소화 (코드 자체가 명확해야 함)
- WHY가 명확하지 않은 경우만 주석 추가
- 함수 주석은 한 줄 이하 (JSDoc 사용 금지, 복잡하면 코드 리팩터링)

**금지**:
```typescript
// 가격을 계산한다
function calculatePrice(qty, price) { ... }

// 받은 응답에서 데이터를 추출한다
const data = response.data;
```

**권장**:
```typescript
function calculateTotalPrice(quantity: number, unitPrice: number): number {
  return quantity * unitPrice;
}

// API 응답이 주식/암호화폐/뉴스를 혼합하므로 타입 검사 필수
const stockData = validateStockResponse(response);
```

---

## 기능 구현 표준

### 1. 페이지 작성

**규칙**:
- 모든 페이지는 `app/` 아래의 디렉토리에 `page.tsx` 형식
- 페이지는 기본적으로 **Server Component** (클라이언트 상태 필요 시만 `'use client'` 추가)
- 메타데이터는 각 페이지에서 export

**예시**:
```typescript
// app/dashboard/page.tsx
import type { Metadata } from 'next';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export const metadata: Metadata = {
  title: '대시보드 - Moneytoring',
  description: '실시간 주식 및 암호화폐 가격 조회',
};

export default function DashboardPage() {
  return <DashboardContent />;
}
```

**금지**:
- 페이지에서 복잡한 비즈니스 로직 구현 (컴포넌트 또는 유틸로 분리)
- 스타일을 인라인 CSS로 정의 (Tailwind CSS 사용)

### 2. 컴포넌트 작성

**Server Component (기본)**:
```typescript
// components/common/Header.tsx
import { Navigation } from './Navigation';

export function Header() {
  return (
    <header className="sticky top-0 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Navigation />
      </div>
    </header>
  );
}
```

**Client Component** (`'use client'` 필요한 경우):
```typescript
// components/dashboard/SearchBar.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';

export function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <Input
      placeholder="종목 검색..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
```

**규칙**:
- 상태/이벤트 필요 시만 `'use client'` 추가
- shadcn/ui 컴포넌트는 직접 import (상대 경로 금지, `@/components/ui/` 사용)
- Props는 항상 타입 지정
- 컴포넌트 분리 (너무 많은 로직 금지, 500줄 이상이면 분리)

**금지**:
```typescript
// 금지: Server Component에서 브라우저 API 사용
export function MyComponent() {
  const handleClick = () => localStorage.setItem('key', 'value'); // ❌
  return <button onClick={handleClick}>클릭</button>;
}

// 금지: Props 타입 없음
export function Card({ title, content }) { // ❌
  return <div>{title}</div>;
}
```

### 3. API 라우트

**규칙**:
- `app/api/` 아래 카테고리별 폴더 (stocks, crypto, portfolio, news)
- 각 폴더에 `route.ts` 파일
- HTTP 메서드별로 `GET`, `POST`, `PUT`, `DELETE` 함수 정의
- 환경변수로 API 키 관리 (.env.local)
- 에러 처리는 필수 (사용자 친화적 메시지)

**예시**:
```typescript
// app/api/stocks/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const symbol = request.nextUrl.searchParams.get('symbol');
    if (!symbol) {
      return NextResponse.json(
        { error: '종목명이 필요합니다' },
        { status: 400 }
      );
    }

    // Finnhub API 호출
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
    );
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Stock API error:', error);
    return NextResponse.json(
      { error: '주식 정보를 조회할 수 없습니다' },
      { status: 500 }
    );
  }
}
```

**금지**:
- 클라이언트에서 직접 외부 API 호출 (API 라우트를 통해야 함)
- 비공개 API 키를 클라이언트 코드에 노출 (서버 환경변수 사용)

### 4. React Query 사용

**규칙**:
- 서버 상태는 React Query (`useQuery`)로 관리
- 캐시 시간은 데이터 특성에 따라 설정 (주식 가격은 낮게: staleTime: 1m)
- 에러/로딩 상태 처리는 필수

**예시**:
```typescript
// hooks/useStocks.ts
import { useQuery } from '@tanstack/react-query';

interface Stock {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
}

export function useStocks(symbol: string) {
  return useQuery<Stock>({
    queryKey: ['stocks', symbol],
    queryFn: async () => {
      const response = await fetch(`/api/stocks?symbol=${symbol}`);
      if (!response.ok) throw new Error('주식 정보 조회 실패');
      return response.json();
    },
    staleTime: 60_000, // 1분
    gcTime: 5 * 60_000, // 5분
    enabled: !!symbol,
  });
}
```

**사용**:
```typescript
export function StockChart() {
  const { data, isLoading, error } = useStocks('AAPL');

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error.message}</div>;

  return <div>{data?.currentPrice}</div>;
}
```

---

## Tailwind CSS 4 + shadcn/ui 표준

### 1. Tailwind CSS 4 PostCSS 문법

**규칙**:
- `@theme inline` 사용 (globals.css)
- CSS 변수로 색상/간격 정의
- 다크 모드: `@media (prefers-color-scheme: dark)`

**globals.css 예시**:
```css
@import "tailwindcss";
@import "shadcn/tailwind.css";
@import "tw-animate-css";

@theme inline {
  --color-primary: rgb(59 130 246);
  --color-secondary: rgb(107 114 128);
  --color-background: rgb(255 255 255);
  --color-foreground: rgb(31 41 55);
}

@media (prefers-color-scheme: dark) {
  @theme inline {
    --color-background: rgb(17 24 39);
    --color-foreground: rgb(243 244 246);
  }
}
```

### 2. shadcn/ui 컴포넌트 추가

**규칙**:
- 필요한 컴포넌트는 `npx shadcn@latest add <component>` 명령으로 추가
- `components/ui/` 디렉토리에 자동 생성
- 커스터마이징은 권장 (색상, 크기 등)

**추가 예시**:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

### 3. 클래스명 유틸

**규칙**:
- `cn()` 함수로 클래스 병합 (tailwind-merge 포함)
- 조건부 클래스는 `clsx` 또는 삼항 연산자

**예시**:
```typescript
import { cn } from '@/lib/utils';

export function Card({ variant = 'default' }) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        variant === 'highlight' && 'bg-yellow-100'
      )}
    >
      내용
    </div>
  );
}
```

---

## 상태 관리 표준

### 1. 서버 상태 (React Query)

**용도**: API 데이터, 비동기 작업
**도구**: `@tanstack/react-query`
**예시**: 주식 가격, 포트폴리오 데이터, 뉴스

### 2. 클라이언트 상태 (useState/Context)

**용도**: UI 상태, 사용자 입력, 임시 데이터
**도구**: `useState`, `useReducer`, Context API
**예시**: 모달 열림/닫힘, 검색 입력값, 필터 선택

### 3. localStorage

**용도**: 클라이언트 영속성 (프로필 설정, 즐겨찾기 등)
**규칙**:
- 민감한 정보는 저장 금지 (API 키, 토큰)
- JSON 형식으로 저장 (JSON.stringify/parse)
- 초기화 함수 제공

**예시**:
```typescript
// hooks/useReadNews.ts
export function useReadNews() {
  const getReadNews = (): string[] => {
    const stored = localStorage.getItem('readNews');
    return stored ? JSON.parse(stored) : [];
  };

  const markAsRead = (newsId: string) => {
    const readNews = getReadNews();
    if (!readNews.includes(newsId)) {
      readNews.push(newsId);
      localStorage.setItem('readNews', JSON.stringify(readNews));
    }
  };

  return { getReadNews, markAsRead };
}
```

---

## 핵심 파일 상호작용 표준

### Multi-File Coordination

새로운 기능을 추가할 때는 다음 파일들을 동시에 수정해야 합니다:

#### **1. 새 페이지 추가**
- `app/[feature-name]/page.tsx` - 페이지 파일 생성
- `app/[feature-name]/layout.tsx` - 레이아웃 생성 (필요시)
- `types/index.ts` - 페이지에서 사용할 타입 export
- `ROADMAP.md` - Task 진행 상황 표시 (Task 완료 시)

**예시**: 대시보드 페이지 추가
```
app/dashboard/page.tsx         (생성)
app/dashboard/layout.tsx       (생성)
types/index.ts                 (Stock, Crypto 타입 export)
components/dashboard/          (PriceCard, SearchBar 등 생성)
ROADMAP.md                     (Task 1-3 진행 상황 표시)
```

#### **2. 새 API 라우트 추가**
- `app/api/[feature-name]/route.ts` - API 라우트 생성
- `types/index.ts` - API 응답 타입 정의
- `hooks/use[FeatureName].ts` - React Query 훅 생성
- `.env.example` - 필요한 환경변수 추가

**예시**: 주식 API 추가
```
app/api/stocks/route.ts       (생성)
types/stock.ts                (Stock, StockQuote 타입 정의)
hooks/useStocks.ts            (React Query 훅)
.env.example                  (NEXT_PUBLIC_FINNHUB_API_KEY 추가)
```

#### **3. 새 컴포넌트 추가**
- `components/[category]/[ComponentName].tsx` - 컴포넌트 생성
- `types/index.ts` - Props 타입 정의 (필요시)

#### **4. 테마/스타일 변경**
- `app/globals.css` - Tailwind 변수 수정
- 모든 컴포넌트 재검토 (색상 변수 적용 확인)

#### **5. 환경변수 추가**
- `.env.local` - 실제 값 입력
- `.env.example` - 샘플 값 입력

---

## AI 의사결정 표준

### 1. 파일 선택 기준

**새 파일이 필요한가?**
- Yes: 컴포넌트가 400줄 초과, 또는 재사용 가능한 유틸리티
- No: 기존 파일에 추가

**어느 폴더에 배치할 것인가?**
- 컴포넌트 → `components/` (카테고리별 서브폴더)
- 훅 → `hooks/`
- 유틸 → `lib/`
- 타입 → `types/`

### 2. 기술 선택

**상태 관리 방식**:
- API 데이터 → React Query
- UI 토글, 입력값 → useState
- 다양한 컴포넌트에서 공유 → Context API
- 클라이언트 영속성 → localStorage

**스타일링**:
- 기본 → Tailwind CSS 유틸 클래스
- 복잡한 스타일 변형 → CVA (class-variance-authority)
- 조건부 클래스 → `cn()` 함수

### 3. 의존성 추가 판단

**기준**:
- 필요성: 이 기능 없이는 불가능한가?
- 크기: 번들 크기 영향은 작은가? (package.json 확인)
- 인기도: npm 다운로드 수, GitHub 스타 확인
- 유지보수: 활발한 커뮤니티인가?

**이미 설치된 의존성**:
- React Query (@tanstack/react-query) ✅
- Tailwind CSS 4 ✅
- shadcn/ui ✅
- Finnhub SDK ✅
- 추가 필요 시 사전에 확인

---

## 금지 사항 (Prohibited)

### ❌ 절대 금지

1. **클라이언트에서 외부 API 직접 호출**
   ```typescript
   // ❌ 금지
   const response = await fetch('https://finnhub.io/api/...');
   
   // ✅ 권장
   const response = await fetch('/api/stocks?symbol=AAPL');
   ```

2. **비공개 API 키를 클라이언트 코드에 노출**
   ```typescript
   // ❌ 금지
   const apiKey = 'sk-xxx'; // 소스에 직접 입력
   
   // ✅ 권장
   const apiKey = process.env.SECRET_API_KEY; // 서버 환경변수
   ```

3. **TypeScript strict 모드 무시**
   ```typescript
   // ❌ 금지
   const data: any = response; // 'any' 타입 사용
   
   // ✅ 권장
   const data: Stock = response;
   ```

4. **Server Component에서 브라우저 API 사용**
   ```typescript
   // ❌ 금지
   export default function Page() {
     const value = localStorage.getItem('key'); // Server Component에서 금지
   }
   
   // ✅ 권장
   'use client';
   export default function Page() {
     const value = localStorage.getItem('key');
   }
   ```

5. **과도한 주석 추가**
   ```typescript
   // ❌ 금지
   // price를 qty와 곱한다
   const total = price * qty;
   
   // ✅ 권장 (명확한 변수명)
   const totalPrice = unitPrice * quantity;
   ```

6. **CLAUDE.md와 다른 구조 사용**
   - 폴더/파일 구조는 CLAUDE.md 준수 필수
   - 벗어나고 싶으면 CLAUDE.md 수정 후 진행

7. **문서화 없이 복잡한 로직 추가**
   - 복잡한 알고리즘은 별도 함수로 분리 후 한 줄 주석
   - 또는 코드를 더 간단하게 리팩터링

8. **Task 완료 체크 누락**
   - 작업 완료 시 ROADMAP.md의 해당 Task 체크 필수
   - 의존성이 있는 Task도 함께 표시

---

## Task 관리 표준

### Task 상태 관리

**Task 생성**:
- 각 Phase마다 여러 Task 생성
- Task는 ROADMAP.md에 표시

**Task 진행 중**:
- 시작 시: `status: in_progress` 설정
- 진행 상황을 설명적으로 기록

**Task 완료**:
- 모든 요구사항 충족 후 `status: completed` 설정
- ROADMAP.md의 Task 항목에서 체크박스 표시 (✅)

**예시**:
```markdown
### Task 1-1: 프로젝트 기초 세팅
- [x] 폴더 구조 생성
- [x] TypeScript 타입 정의
- [x] 환경변수 설정
- [x] React Query 초기화
```

---

## 개발 프로세스 워크플로우

### Phase별 진행

```
Phase 1 (MVP)
├─ Task 1-1: 프로젝트 세팅 (완료시 Task 1-2 시작 가능)
├─ Task 1-2: UI/UX 레이아웃 (완료시 Task 1-3, 1-5 시작 가능)
├─ Task 1-3: 실시간 가격 조회 (완료시 Task 1-4 시작 가능)
├─ Task 1-4: 포트폴리오 기능
└─ Task 1-5: 뉴스 피드

Phase 2 (기능 확장)
├─ Task 2-1~2-5: Phase 1 완료 후 시작
└─ (선택적 병렬 진행)

...계속
```

### 코드 검토 체크리스트

작업 완료 후 다음을 확인:

- [ ] TypeScript 컴파일 오류 없음 (`npm run build`)
- [ ] ESLint 검사 통과 (`npm run lint`)
- [ ] 모든 함수에 타입 지정
- [ ] Tailwind CSS 4 문법 사용
- [ ] shadcn/ui 컴포넌트 활용
- [ ] 환경변수 .env.local에 추가
- [ ] ROADMAP.md Task 완료 표시
- [ ] 관련 파일 모두 수정 (multi-file coordination)
- [ ] 커밋 메시지는 한국어

---

## 참고 자료

- **CLAUDE.md**: 프로젝트 상세 개발 가이드 (사용자용)
- **ROADMAP.md**: 프로젝트 로드맵 및 Task 목록
- **Next.js 문서**: https://nextjs.org/docs
- **Tailwind CSS 4**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com
- **React Query**: https://tanstack.com/query/latest
