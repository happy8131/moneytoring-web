# Moneytoring - 자산 관리 서비스

**실시간 주식, 암호화폐, 한국 주식을 한 곳에서 관리하는 포트폴리오 플랫폼**

🌐 **배포 사이트**: [https://moneytoring-web.vercel.app/](https://moneytoring-web.vercel.app/)

## 📋 목차

- [프로젝트 소개](#프로젝트-소개)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [사용 방법](#사용-방법)
- [API 및 외부 서비스](#api-및-외부-서비스)
- [프로젝트 구조](#프로젝트-구조)
- [개발 가이드](#개발-가이드)

## 프로젝트 소개

**Moneytoring**은 전 세계의 주식, 암호화폐, 그리고 한국 주식을 통합적으로 관리할 수 있는 포트폴리오 관리 플랫폼입니다.

- 📈 **실시간 가격 조회**: Finnhub, CoinGecko API를 통한 실시간 시세 제공
- 💼 **포트폴리오 관리**: 보유 종목, 거래 기록, 자산 분배 분석
- 🤖 **AI 투자 추천**: Claude API를 활용한 맞춤형 투자 조언
- 🌍 **다양한 자산군**: 미국 주식, 한국 주식, 암호화폐, 외환, 지수 등 다양한 자산 지원
- 👥 **커뮤니티**: 투자 토론 및 포트폴리오 공유 기능
- 📰 **시장 뉴스**: 실시간 시장 뉴스 및 경제 캘린더

## 주요 기능

### 🏠 대시보드
- 즐겨찾기 종목의 실시간 가격
- 시장 뉴스 피드
- 포트폴리오 요약

### 💼 포트폴리오 관리
- **보유 종목**: 현재 보유 중인 자산 목록 및 수익률 실시간 계산
- **거래 기록**: 매수/매도 기록 관리
- **포트폴리오 분석**:
  - 자산 분배 파이 차트
  - 시계열 자산 추이 그래프
  - 리밸런싱 제안 (현재 vs 목표 비중)
  - AI 투자 추천

### 📊 자산 조회
- **미국 주식** (`/stocks`): 실시간 가격, 기업 정보, 뉴스
- **한국 주식** (`/kr-stocks`): 한국 거래소 데이터
- **암호화폐** (`/crypto`): 비트코인, 이더리움 등 주요 코인
- **지수** (`/indices`): 주요 지수 (S&P 500, NASDAQ, 코스피 등)
- **외환** (`/forex`): 주요 환율 정보
- **경제 캘린더** (`/economic-calendar`): 주요 경제 지표 일정

### 👥 커뮤니티
- 투자 토론 게시판
- 포트폴리오 공유 기능
- 사용자 프로필

### 👤 사용자 계정
- 회원가입/로그인 (이메일 기반)
- 프로필 관리

## 기술 스택

### Frontend
- **Framework**: [Next.js 16.2.4](https://nextjs.org/) (App Router)
- **언어**: [TypeScript 5](https://www.typescriptlang.org/)
- **UI Framework**: [React 19.2.4](https://react.dev/)
- **스타일링**: [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **아이콘**: [lucide-react](https://lucide.dev/)
- **차트**: [Recharts](https://recharts.org/)
- **상태 관리**: [React Query (@tanstack/react-query)](https://tanstack.com/query/)

### Backend & Services
- **백엔드**: Next.js API Routes
- **데이터베이스**: [Supabase](https://supabase.com/) (PostgreSQL)
- **인증**: [Supabase Auth](https://supabase.com/docs/guides/auth)
- **AI**: [Anthropic Claude API](https://www.anthropic.com/) (투자 추천)

### 외부 API
- **Finnhub**: 미국 주식 데이터
- **CoinGecko**: 암호화폐 데이터
- **Kiwoom Securities**: 한국 주식 데이터 (구현 중)

### 개발 도구
- **패키지 관리**: npm
- **린팅**: ESLint
- **배포**: Vercel

## 시작하기

### 전제 조건
- Node.js 18+ 
- npm 또는 yarn

### 설치

1. **저장소 클론**
```bash
git clone https://github.com/yourusername/moneytoring-web.git
cd moneytoring-web
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**

`.env.local` 파일을 생성하고 다음을 추가합니다:

```bash
# Finnhub API
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key

# CoinGecko API (필요시)
COINGECKO_API_KEY=your_coingecko_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Claude API (AI 추천 기능)
CLAUDE_API_KEY=sk-ant-v1-your_claude_api_key

# Kiwoom Securities API (선택사항)
KIWOOM_API_KEY=your_kiwoom_api_key
```

4. **개발 서버 실행**
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 애플리케이션이 시작됩니다.

## 사용 방법

### 1️⃣ 회원가입 및 로그인

- 우측 상단의 **회원가입** 버튼 클릭
- 이메일과 비밀번호로 가입
- 이메일 인증 후 로그인

### 2️⃣ 대시보드 탐색

**대시보드** (`/dashboard`)에서:
- 즐겨찾기 종목의 실시간 가격 확인
- 최신 시장 뉴스 조회
- 빠른 검색으로 주식/암호화폐 조회

### 3️⃣ 포트폴리오 관리

**포트폴리오** (`/portfolio`)에서:

#### 보유 종목 탭
1. **"종목 추가"** 버튼 클릭
2. 종목코드(예: AAPL, BTC) 입력
3. 보유 수량, 매수가, 매수일 입력
4. **"추가"** 클릭

#### 거래 기록 탭
- 매수/매도 기록 추가 및 관리
- 거래 날짜, 가격, 수량 기록

#### 분석 탭
- **자산 추이**: 시간대별 포트폴리오 가치 변화
- **리밸런싱 제안**: 현재 비중 vs 목표 비중 비교
- **AI 추천**: Claude AI가 제시하는 맞춤형 투자 조언

### 4️⃣ 자산 조회

원하는 자산군 선택:
- **주식**: `/stocks/[심볼]` (예: `/stocks/AAPL`)
- **한국주식**: `/kr-stocks/[심볼]` (예: `/kr-stocks/005930`)
- **암호화폐**: `/crypto/[코인]` (예: `/crypto/bitcoin`)
- **지수**: `/indices/[코드]`
- **외환**: `/forex/[심볼]`

각 페이지에서:
- 실시간 가격 및 변동률 확인
- 뉴스 피드 조회
- 즐겨찾기 추가/제거

### 5️⃣ 커뮤니티

**커뮤니티** (`/community`)에서:
- 투자 토론 시작
- 다른 사용자의 포트폴리오 공유 보기
- 투자 팁 및 경험 공유

### 6️⃣ 포트폴리오 공유

자신의 포트폴리오를 링크로 공유:
- **포트폴리오** 페이지에서 **"공유"** 버튼 클릭
- 생성된 링크 복사
- 다른 사용자와 공유

## API 및 외부 서비스

### Finnhub API
- **용도**: 미국 주식 실시간 가격, 기업 정보
- **엔드포인트**: `/api/stocks/*`
- **API 키**: [https://finnhub.io/](https://finnhub.io/)에서 발급

### CoinGecko API
- **용도**: 암호화폐 가격 데이터
- **엔드포인트**: `/api/crypto/*`
- **API 키**: [https://www.coingecko.com/](https://www.coingecko.com/)에서 발급

### Claude API
- **용도**: AI 투자 추천
- **엔드포인트**: `/api/recommendations`
- **API 키**: [https://www.anthropic.com/](https://www.anthropic.com/)에서 발급

### Supabase
- **용도**: 사용자 인증, 데이터 저장
- **셋업**: [https://supabase.com/](https://supabase.com/)에서 프로젝트 생성

## 프로젝트 구조

```
moneytoring-web/
├── app/
│   ├── (auth)/                 # 인증 라우트
│   │   ├── login/
│   │   └── register/
│   ├── (main)/                 # 메인 레이아웃
│   │   ├── dashboard/          # 대시보드
│   │   ├── portfolio/          # 포트폴리오 관리
│   │   ├── stocks/[symbol]/    # 주식 상세
│   │   ├── crypto/[id]/        # 암호화폐 상세
│   │   ├── kr-stocks/[symbol]/ # 한국 주식
│   │   ├── community/          # 커뮤니티
│   │   ├── news/               # 뉴스
│   │   ├── profile/            # 사용자 프로필
│   │   └── ...
│   ├── api/                    # API 라우트
│   │   ├── stocks/
│   │   ├── crypto/
│   │   ├── recommendations/
│   │   └── ...
│   ├── components/             # React 컴포넌트
│   │   ├── ui/                 # shadcn/ui 컴포넌트
│   │   └── common/             # 공용 컴포넌트
│   ├── hooks/                  # 커스텀 훅
│   ├── lib/                    # 유틸리티 함수
│   ├── types/                  # TypeScript 타입
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 홈페이지 (대시보드로 리다이렉트)
│   ├── globals.css             # 전역 스타일
│   └── providers.tsx           # 프로바이더 (React Query, etc.)
├── public/                     # 정적 파일
├── package.json                # 의존성
├── tsconfig.json               # TypeScript 설정
├── next.config.ts              # Next.js 설정
└── tailwind.config.ts          # Tailwind CSS 설정
```

## 개발 가이드

### 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start

# 코드 린팅
npm run lint
```

### 새로운 UI 컴포넌트 추가

shadcn/ui에서 컴포넌트 설치:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
# ... 필요한 컴포넌트 추가
```

### 새로운 페이지 추가

1. `app/(main)/feature-name/page.tsx` 생성
2. 컴포넌트 작성 (기본적으로 서버 컴포넌트)
3. 필요시 `'use client'` 지시어 추가

### API 라우트 추가

1. `app/api/endpoint/route.ts` 생성
2. GET, POST 등 HTTP 메서드 정의:

```typescript
export async function GET(request: Request) {
  // 요청 처리
  return Response.json(data);
}
```

### 스타일링

Tailwind CSS 유틸리티 클래스 사용:

```typescript
<div className="rounded-lg border border-border bg-card p-6 shadow-sm">
  <h2 className="text-lg font-semibold">제목</h2>
</div>
```

## 배포

### Vercel에 배포

1. [Vercel](https://vercel.com)에 가입
2. GitHub 저장소 연동
3. 환경 변수 설정
4. 자동 배포

```bash
# 또는 CLI로 배포
npm i -g vercel
vercel
```

## 피드백 및 기여

이 프로젝트에 기여하고 싶으신가요?

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 문의

문제가 있거나 제안사항이 있으신가요?

- 📧 이메일: [dlfwnd5532@gmail.com](mailto:dlfwnd5532@gmail.com)
- 🐛 이슈: GitHub Issues에 등록

---

**마지막 업데이트**: 2026년 9월 14일
