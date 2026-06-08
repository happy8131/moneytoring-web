# 🚀 Moneytoring (머니터링) - 프로젝트 로드맵

## 프로젝트 개요
**목표**: 실시간 투자 정보 제공 및 포트폴리오 관리, AI 기반 투자 추천 웹앱

**기술 스택**:
- Frontend: Next.js 16+ (App Router) + TypeScript
- 상태관리/데이터: TanstackQuery (React Query)
- 백엔드: Next.js API Routes
- 스타일: Tailwind CSS
- API: Finnhub (글로벌 주식), CoinGecko (암호화폐), 한국거래소 (한국주식)

---

## Phase 1️⃣: MVP (최소 기능 제품) - 2-3주
핵심 기능 구현으로 기본 가치 증명

| Task | 제목 | 설명 | 예상 기간 | 의존성 | 상태 |
|------|------|------|---------|--------|------|
| #1 | Task 1-1: 프로젝트 기초 세팅 | 폴더 구조, 타입 정의, 환경변수 설정 | 1-2일 | 없음 | ⏳ 대기 |
| #2 | Task 1-2: 기본 UI/UX 레이아웃 | shadcn/ui, Header, Sidebar, MainLayout | 1-2일 | #1 | ⏳ 대기 |
| #3 | Task 1-3: 실시간 가격 조회 | 대시보드, Finnhub, CoinGecko API | 2-3일 | #1, #2 | ⏳ 대기 |
| #4 | Task 1-4: 포트폴리오 기능 | 포트폴리오 페이지, CRUD, 수익률 계산 | 2-3일 | #1, #2, #3 | ⏳ 대기 |
| #5 | Task 1-5: 뉴스 피드 | 뉴스 페이지, 검색, 필터링, 읽음 표시 | 1-2일 | #1, #2 | ⏳ 대기 |

### 1-1. Task 1-1: 프로젝트 기초 세팅 및 폴더 구조 완성
**기간**: 1-2일 | **상태**: ⏳ 대기 | **의존성**: 없음

**목표**: Next.js 프로젝트의 기초 인프라 구축 및 핵심 타입/유틸리티 정의

**주요 작업**:
- [ ] 폴더 구조 생성 (components/, lib/, hooks/, types/, styles/)
- [ ] TypeScript 타입 정의 (Stock, Crypto, Portfolio, Holding, News)
- [ ] 환경변수 설정 (.env.local, .env.example)
- [ ] 기본 유틸리티 함수 (cn() 헬퍼, API 호출 기본 로직)
- [ ] React Query QueryClientProvider 설정
- [ ] API 라우트 폴더 구조 (/api/stocks, /api/crypto, /api/portfolio, /api/news)

**완료 기준**:
- ✅ 폴더 구조 완성 및 모든 파일 생성
- ✅ TypeScript 컴파일 오류 없음
- ✅ 환경변수 설정 및 .gitignore 포함

---

### 1-2. Task 1-2: 기본 UI/UX 및 공통 레이아웃 구성
**기간**: 1-2일 | **상태**: ⏳ 대기 | **의존성**: Task 1-1

**목표**: shadcn/ui를 활용한 기본 디자인 시스템 및 레이아웃 구축

**주요 작업**:
- [ ] shadcn/ui 기본 컴포넌트 추가 (Button, Card, Input, Badge, Dialog)
- [ ] Header 컴포넌트 (로고, 네비게이션, 사용자 메뉴)
- [ ] Sidebar 컴포넌트 (메뉴 항목: 대시보드, 포트폴리오, 뉴스)
- [ ] MainLayout 컴포넌트 (Header + Sidebar + Content)
- [ ] 전역 스타일 업데이트 (colors, typography)
- [ ] 반응형 디자인 (모바일/태블릿/데스크톱)
- [ ] 다크 모드 기본 지원

**완료 기준**:
- ✅ 모든 페이지에서 일관된 레이아웃 표시
- ✅ 반응형 디자인 검증 (모바일, 태블릿, 데스크톱)
- ✅ 다크 모드 지원

---

### 1-3. Task 1-3: 실시간 가격 조회 대시보드
**기간**: 2-3일 | **상태**: ⏳ 대기 | **의존성**: Task 1-1, Task 1-2

**목표**: Finnhub 및 CoinGecko API를 통한 실시간 가격 조회 및 대시보드 페이지 구현

**주요 작업**:
- [ ] Finnhub API 라우트 (/api/stocks) - 주식 가격 조회
- [ ] CoinGecko API 라우트 (/api/crypto) - 암호화폐 가격 조회
- [ ] 대시보드 페이지 (app/dashboard/page.tsx) 개발
- [ ] PriceCard 컴포넌트 (종목, 현재가, 등락률)
- [ ] SearchBar 컴포넌트 (주식/암호화폐 검색)
- [ ] FavoriteList 컴포넌트 (즐겨찾기 관리)
- [ ] localStorage 기반 즐겨찾기 저장

**완료 기준**:
- ✅ /api/stocks, /api/crypto 라우트 동작
- ✅ 대시보드에서 실시간 가격 표시
- ✅ 검색 기능 정상 작동
- ✅ 즐겨찾기 추가/제거 기능

---

### 1-4. Task 1-4: 포트폴리오 기본 기능 및 수익률 분석
**기간**: 2-3일 | **상태**: ⏳ 대기 | **의존성**: Task 1-1, Task 1-2, Task 1-3

**목표**: 포트폴리오 CRUD 기능 및 수익률 계산, 자산 분배 차트 구현

**주요 작업**:
- [ ] Portfolio API 라우트 (/api/portfolio) - CRUD 작업
- [ ] 포트폴리오 페이지 (app/portfolio/page.tsx) 개발
- [ ] PortfolioTable 컴포넌트 (종목, 수량, 단가, 현재가, 손익)
- [ ] 수익률 계산 함수 (손익, 수익률%)
- [ ] AssetChart 컴포넌트 (자산 분배 차트)
- [ ] AddHolding 모달 (종목 추가)
- [ ] localStorage 기반 포트폴리오 저장

**완료 기준**:
- ✅ /api/portfolio CRUD 기능 동작
- ✅ 포트폴리오 페이지 렌더링
- ✅ 수익률 계산 정확성 검증
- ✅ 자산 분배 차트 표시

---

### 1-5. Task 1-5: 뉴스 피드 및 검색/필터링
**기간**: 1-2일 | **상태**: ⏳ 대기 | **의존성**: Task 1-1, Task 1-2

**목표**: 뉴스 조회, 검색, 필터링 기능 및 뉴스 페이지 구현

**주요 작업**:
- [ ] News API 라우트 (/api/news) - 뉴스 데이터 조회
- [ ] 뉴스 페이지 (app/news/page.tsx) 개발
- [ ] NewsCard 컴포넌트 (제목, 요약, 이미지, 링크)
- [ ] NewsFilter 컴포넌트 (검색, 필터링, 정렬)
- [ ] 읽음 표시 기능 (localStorage)
- [ ] 무한 스크롤 또는 페이지네이션

**완료 기준**:
- ✅ /api/news 라우트 동작
- ✅ 뉴스 페이지 렌더링
- ✅ 검색/필터링 기능 정상 작동
- ✅ 읽음 상태 localStorage 저장

---

## Phase 2️⃣: 핵심 기능 확장 - 3-4주
사용성 개선 및 고급 기능 추가

| Task | 제목 | 설명 | 예상 기간 | 의존성 | 상태 |
|------|------|------|---------|--------|------|
| #6 | Task 2-1: 포트폴리오 고급 기능 | 거래 기록, 자산 추이, 수익률 분석 | 2-3일 | Phase 1 완료 | ⏳ 대기 |
| #7 | Task 2-2: AI 투자 추천 | Claude API 활용 맞춤형 추천 | 2-3일 | Phase 1 완료 | ⏳ 대기 |
| #8 | Task 2-3: 한국 주식 지원 | Kiwoom API, 한국주식 검색/추가 | 2-3일 | Phase 1 완료 | ⏳ 대기 |
| #9 | Task 2-4: 고급 차트 및 분석 | Recharts, 캔들차트, 기술적 지표 | 2-3일 | Phase 1 완료 | ⏳ 대기 |
| #10 | Task 2-5: 사용자 설정 및 개인화 | 통화, 테마, 알림 설정 | 1-2일 | Phase 1 완료 | ⏳ 대기 |

### Task 2-1: 포트폴리오 고급 기능
**기간**: 2-3일 | **상태**: ⏳ 대기 | **의존성**: Phase 1 완료

**목표**: 포트폴리오 거래 기록, 수익률 분석, 자산 추이 그래프 구현

**주요 작업**:
- [ ] 거래 기록 데이터 모델 (매수/매도, 날짜, 수량, 가격)
- [ ] 거래 기록 관리 페이지 (생성, 수정, 삭제)
- [ ] 평균 단가 자동 계산
- [ ] 총 자산 추이 그래프 (시계열 차트)
- [ ] 일일/주간/월간 수익률 분석 대시보드
- [ ] 리밸런싱 제안 기능

**완료 기준**:
- ✅ 거래 기록 CRUD 기능 동작
- ✅ 자산 추이 그래프 표시
- ✅ 수익률 분석 대시보드 완성

---

### Task 2-2: AI 투자 추천
**기간**: 2-3일 | **상태**: ⏳ 대기 | **의존성**: Phase 1 완료

**목표**: Claude API를 활용한 AI 기반 투자 추천 시스템 구현

**주요 작업**:
- [ ] 사용자 포트폴리오 분석 로직
- [ ] Claude API 통합 (투자 추천 생성)
- [ ] 기술적 분석 기반 추천
- [ ] 포트폴리오 분산도 분석
- [ ] 리스크/수익률 최적화 제안
- [ ] 추천 아이템 카드 UI 개발

**완료 기준**:
- ✅ AI가 포트폴리오 분석하여 추천 생성
- ✅ 추천 이유 및 분석 결과 표시
- ✅ 추천 아이템 카드 UI 완성

---

### Task 2-3: 한국 주식 지원
**기간**: 2-3일 | **상태**: ✅ 완료 | **의존성**: Phase 1 완료

**목표**: 한국 증권 API 연동 및 한국 주식 기능 구현

**주요 작업**:
- [ ] 한국거래소 API 또는 Kiwoom API 연동
- [ ] 코스피/코스닥 지수 조회
- [ ] 한국 주식 검색 기능
- [ ] 한국 주식 상세정보 페이지
- [ ] 한국 주식 포트폴리오 추가/관리
- [ ] 환율 표시 및 통화 변환

**완료 기준**:
- ✅ 한국 주식 검색 및 조회 가능
- ✅ 한국 주식을 포트폴리오에 추가 가능
- ✅ 환율 변환 기능 동작

---

### Task 2-4: 고급 차트 및 분석
**기간**: 2-3일 | **상태**: ⏳ 대기 | **의존성**: Phase 1 완료

**목표**: Recharts를 활용한 고급 차트 및 기술적 지표 구현

**주요 작업**:
- [ ] Recharts 라이브러리 통합
- [ ] 캔들 차트 (OHLC 데이터)
- [ ] 기술적 지표 (이동평균, RSI, MACD, 볼린저 밴드)
- [ ] 여러 종목 비교 기능
- [ ] 차트 인터랙티브 기능 (확대/축소, 기간 변경)
- [ ] 기술적 분석 대시보드

**완료 기준**:
- ✅ 고급 차트 렌더링 (캔들, 라인, 바)
- ✅ 기술적 지표 표시
- ✅ 종목 비교 기능 동작

---

### Task 2-5: 사용자 설정 및 개인화
**기간**: 1-2일 | **상태**: ⏳ 대기 | **의존성**: Phase 1 완료

**목표**: 사용자 선호 설정 및 개인화 기능 구현

**주요 작업**:
- [ ] 사용자 설정 페이지 개발
- [ ] 선호 통화 설정 (KRW, USD, EUR 등)
- [ ] 테마 설정 (라이트/다크 모드)
- [ ] 알림 설정 (가격 변동 알림, 메일 알림)
- [ ] 언어 설정 (한국어, 영어)
- [ ] 포트폴리오 기본 설정 (목표 수익률 등)

**완료 기준**:
- ✅ 사용자 설정 페이지 완성
- ✅ 설정이 localStorage에 저장
- ✅ 설정 적용 시 UI 즉시 업데이트

---

## Phase 3️⃣: 커뮤니티 기능 - 3-4주
소셜 및 정보 공유 기능

| Task | 제목 | 설명 | 예상 기간 | 의존성 | 상태 |
|------|------|------|---------|--------|------|
| #11 | Task 3-1: 커뮤니티 피드 | 포스트, 댓글, 좋아요, 필터링 | 2-3일 | Phase 2 완료 | ⏳ 대기 |
| #12 | Task 3-2: 토론 게시판 | 종목별 토론, 핫 토픽, 전문가 구분 | 2-3일 | Phase 2 완료 | ⏳ 대기 |
| #13 | Task 3-3: 포트폴리오 공유 | 공개/비공개, 벤치마킹, 팔로우 | 2일 | Phase 2 완료 | ⏳ 대기 |

---

### 📊 Phase 3 데이터베이스 스키마 설계

#### 필수 테이블 구조

**1. profiles (사용자 프로필 확장)**
```sql
-- Supabase Auth의 users 테이블 확장
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  is_expert BOOLEAN DEFAULT FALSE,
  expertise TEXT[], -- 전문 분야
  followers_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**2. posts (커뮤니티 포스트)**
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- 인덱스
  CONSTRAINT posts_content_not_empty CHECK (LENGTH(content) > 0)
);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

**3. comments (포스트 댓글)**
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT comments_content_not_empty CHECK (LENGTH(content) > 0)
);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_comment_id);
```

**4. post_likes (포스트 좋아요)**
```sql
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(post_id, user_id)
);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
```

**5. discussions (토론 게시판)**
```sql
CREATE TABLE discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL, -- 종목 코드 (AAPL, BTC 등)
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  is_hot BOOLEAN DEFAULT FALSE, -- 핫 토픽 여부
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_discussions_symbol ON discussions(symbol);
CREATE INDEX idx_discussions_created_at ON discussions(created_at DESC);
CREATE INDEX idx_discussions_is_hot ON discussions(is_hot);
```

**6. discussion_comments (토론 댓글)**
```sql
CREATE TABLE discussion_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES discussion_comments(id) ON DELETE CASCADE,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_discussion_comments_discussion_id ON discussion_comments(discussion_id);
CREATE INDEX idx_discussion_comments_user_id ON discussion_comments(user_id);
```

**7. portfolio_shares (포트폴리오 공유)**
```sql
CREATE TABLE portfolio_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  share_link TEXT UNIQUE,
  views_count INT DEFAULT 0,
  followers_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_portfolio_shares_user_id ON portfolio_shares(user_id);
CREATE INDEX idx_portfolio_shares_is_public ON portfolio_shares(is_public);
```

**8. follows (사용자 팔로우)**
```sql
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
```

**9. portfolio_benchmarks (포트폴리오 벤치마킹)**
```sql
CREATE TABLE portfolio_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id_1 UUID NOT NULL REFERENCES portfolio_shares(id) ON DELETE CASCADE,
  portfolio_id_2 UUID NOT NULL REFERENCES portfolio_shares(id) ON DELETE CASCADE,
  similarity_score NUMERIC DEFAULT 0, -- 0-100
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(portfolio_id_1, portfolio_id_2)
);
```

#### RLS (Row Level Security) 정책

```sql
-- 1. posts 테이블 RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 모든 사용자는 읽기 가능
CREATE POLICY "posts_read_all" ON posts
  FOR SELECT USING (true);

-- 자신의 포스트만 수정/삭제 가능
CREATE POLICY "posts_write_own" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "posts_update_own" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "posts_delete_own" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- 2. comments 테이블 RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments_read_all" ON comments
  FOR SELECT USING (true);

CREATE POLICY "comments_write" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments_delete_own" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- 3. discussions 테이블 RLS
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "discussions_read_all" ON discussions
  FOR SELECT USING (true);

CREATE POLICY "discussions_write" ON discussions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "discussions_delete_own" ON discussions
  FOR DELETE USING (auth.uid() = user_id);

-- 4. portfolio_shares 테이블 RLS
ALTER TABLE portfolio_shares ENABLE ROW LEVEL SECURITY;

-- 공개 포트폴리오는 모두 읽기 가능
CREATE POLICY "portfolio_shares_read_public" ON portfolio_shares
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

-- 자신의 포트폴리오만 생성/수정/삭제 가능
CREATE POLICY "portfolio_shares_write_own" ON portfolio_shares
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "portfolio_shares_update_own" ON portfolio_shares
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "portfolio_shares_delete_own" ON portfolio_shares
  FOR DELETE USING (auth.uid() = user_id);
```

#### 마이그레이션 적용 방법

**작업 전 (검사)**:
```bash
# Supabase MCP를 통해 기존 스키마 확인
mcp__supabase__list_tables({ schemas: ["public"] })
mcp__supabase__get_advisors({ type: "security" })
mcp__supabase__get_advisors({ type: "performance" })
```

**마이그레이션 적용**:
```bash
# 마이그레이션 파일 생성 (supabase/migrations/YYYYMMDDHHMMSS_create_phase3_schema.sql)
# 위의 SQL 스크립트를 파일에 저장

# 마이그레이션 적용
mcp__supabase__apply_migration({
  name: "create_phase3_schema",
  query: "-- 위의 SQL 스크립트 내용"
})
```

**마이그레이션 후 (검증)**:
```bash
# TypeScript 타입 생성
mcp__supabase__generate_typescript_types()

# 보안/성능 검증
mcp__supabase__get_advisors({ type: "security" })
mcp__supabase__get_advisors({ type: "performance" })

# 로그 확인
mcp__supabase__get_logs({ service: "postgres" })
```

---

### Task 3-1: 커뮤니티 피드
**기간**: 2-3일 | **상태**: ⏳ 대기 | **의존성**: Phase 2 완료

**목표**: 사용자 포스트, 좋아요, 댓글, 프로필 기능 구현

#### 데이터베이스 요구사항
**필수 테이블**: `profiles`, `posts`, `comments`, `post_likes`
- `profiles`: 사용자 프로필 (username, bio, avatar_url, is_expert)
- `posts`: 포스트 (content, image_url, likes_count, comments_count)
- `comments`: 댓글 (post_id, content, parent_comment_id - 답글 지원)
- `post_likes`: 좋아요 (post_id, user_id)

**마이그레이션**: `create_phase3_community_tables` (위의 데이터베이스 스키마 섹션 참고)

#### Next.js 구현 구조
```
app/(main)/community/
├── page.tsx                    # 피드 리스트 (Server Component)
├── @modal/(.)post/[id]/page.tsx # 포스트 상세 (모달)
├── components/
│   ├── CommunityFeed.tsx       # 피드 (Server Component)
│   ├── PostCard.tsx            # 포스트 카드 (Client)
│   ├── PostForm.tsx            # 포스트 작성 (Client)
│   ├── CommentSection.tsx      # 댓글 섹션 (Client)
│   └── UserProfile.tsx         # 사용자 프로필 (Server)
└── actions/
    ├── posts.ts                # Server Actions (CRUD)
    ├── comments.ts             # 댓글 Server Actions
    └── likes.ts                # 좋아요 Server Actions
```

**주요 작업**:
- [ ] Supabase 테이블 마이그레이션 & RLS 정책 적용
- [ ] `createClient()` 를 통한 Server Component 데이터 조회
- [ ] 포스트 작성/삭제 Server Actions 구현
- [ ] 좋아요 토글 기능 (Client Component 상호작용)
- [ ] 댓글 작성/삭제 Server Actions
- [ ] 피드 필터링 (최신순, 인기순, 팔로우) - `useQuery` + 정렬
- [ ] 사용자 프로필 페이지 (`/community/users/[username]`)
- [ ] Realtime 구독 (실시간 좋아요/댓글 반영 - 선택사항)

**완료 기준**:
- ✅ 포스트 CRUD 기능 동작
- ✅ 좋아요/댓글 실시간 상호작용 가능
- ✅ 피드 필터링 정상 작동
- ✅ TypeScript 타입 안전성 검증 (`npm run typecheck` 통과)
- ✅ RLS 정책 보안 검증 (`mcp__supabase__get_advisors`)

---

### Task 3-2: 토론 게시판
**기간**: 2-3일 | **상태**: ⏳ 대기 | **의존성**: Phase 2 완료

**목표**: 종목별 토론방 및 핫 토픽 자동 추출 기능 구현

#### 데이터베이스 요구사항
**필수 테이블**: `discussions`, `discussion_comments`, `profiles`
- `discussions`: 토론방 (symbol, title, content, is_pinned, is_hot, views_count)
- `discussion_comments`: 토론 댓글 (discussion_id, content, parent_comment_id - 답글)
- `profiles`: 사용자 정보 (is_expert - 전문가 구분)

**마이그레이션**: `create_phase3_discussions_tables` (위의 데이터베이스 스키마 섹션 참고)

**인덱스 최적화**:
- `symbol` (종목별 조회)
- `is_hot` (핫 토픽 필터링)
- `created_at` (시간순 정렬)

#### Next.js 구현 구조
```
app/(main)/discussions/
├── page.tsx                          # 토론 목록 (Server Component)
├── [symbol]/
│   └── page.tsx                      # 종목별 토론방 (Server)
├── [symbol]/[discussionId]/
│   └── page.tsx                      # 토론 상세 (Server)
└── components/
    ├── DiscussionList.tsx            # 토론 목록 (Server)
    ├── DiscussionCard.tsx            # 토론 카드 (Server)
    ├── DiscussionForm.tsx            # 토론 작성 (Client)
    ├── DiscussionDetail.tsx          # 토론 상세 (Server)
    ├── HotTopics.tsx                 # 핫 토픽 섹션 (Server)
    └── ExpertBadge.tsx               # 전문가 배지 (Client)
```

**주요 작업**:
- [ ] Supabase 테이블 마이그레이션 & RLS 정책
- [ ] 종목별 토론방 조회 (`symbol` 파라미터 필터링)
- [ ] 토론 생성/수정/삭제 Server Actions
- [ ] 댓글 작성/삭제 Server Actions
- [ ] 핫 토픽 자동 추출 로직:
  - 최근 24시간 댓글 수 > 10
  - 또는 좋아요/조회수 기반 알고리즘
- [ ] 전문가/일반 사용자 구분 UI (`profiles.is_expert`)
- [ ] 토론 인기도 정렬 (조회수, 댓글 수, 좋아요)
- [ ] 토론 고정/해제 (관리자 기능)

**완료 기준**:
- ✅ 종목별 토론 생성/조회/수정 가능
- ✅ 핫 토픽 자동 표시 (알고리즘 구현)
- ✅ 전문가 배지 표시 및 전문가 댓글 강조
- ✅ 성능 인덱스 적용 (`npm run build` 통과)
- ✅ RLS 정책 보안 검증

---

### Task 3-3: 포트폴리오 공유
**기간**: 2일 | **상태**: ⏳ 대기 | **의존성**: Phase 2 완료

**목표**: 포트폴리오 공개/비공개 및 벤치마킹 기능 구현

#### 데이터베이스 요구사항
**필수 테이블**: `portfolio_shares`, `follows`, `portfolio_benchmarks`
- `portfolio_shares`: 공유 포트폴리오 (user_id, title, is_public, share_link)
- `follows`: 팔로우 관계 (follower_id, following_id)
- `portfolio_benchmarks`: 벤치마킹 데이터 (portfolio_id_1, portfolio_id_2, similarity_score)

**마이그레이션**: `create_phase3_portfolio_share_tables` (위의 데이터베이스 스키마 섹션 참고)

**RLS 정책 (중요)**:
- 공개 포트폴리오(`is_public=true`)는 모든 사용자 조회 가능
- 비공개 포트폴리오는 본인만 조회 가능
- 팔로우 기능은 인증된 사용자만 가능

#### Next.js 구현 구조
```
app/(main)/portfolios/
├── page.tsx                        # 공개 포트폴리오 탐색 (Server)
├── [shareId]/
│   ├── page.tsx                    # 포트폴리오 상세 (Server)
│   └── benchmarks/page.tsx         # 벤치마킹 비교 (Server)
└── components/
    ├── PortfolioGrid.tsx           # 포트폴리오 그리드 (Server)
    ├── PortfolioCard.tsx           # 포트폴리오 카드 (Server)
    ├── ShareSettings.tsx           # 공개/비공개 설정 (Client)
    ├── BenchmarkChart.tsx          # 벤치마킹 차트 (Client)
    ├── FollowButton.tsx            # 팔로우 버튼 (Client)
    └── ShareLink.tsx               # 공유 링크 (Client)
```

**주요 작업**:
- [ ] Supabase 테이블 마이그레이션 & RLS 정책 적용
- [ ] 포트폴리오 공개/비공개 설정 Server Actions
- [ ] 공개 포트폴리오 탐색 페이지 (필터링, 정렬)
  - 최신순, 인기순 (조회수, 팔로워 수)
  - 사용자별 포트폴리오 필터
- [ ] 포트폴리오 상세 페이지 (RLS로 자동 권한 검증)
  - 보유 종목 목록
  - 수익률 분석
  - 자산 분배 차트
- [ ] 팔로우 기능:
  - Server Actions (`toggleFollow`)
  - Realtime 구독 (팔로워 수 실시간 업데이트)
- [ ] 벤치마킹 기능:
  - 두 포트폴리오 비교
  - 유사도 점수 계산 (similarity_score)
  - 비교 차트 렌더링
- [ ] 공유 링크 생성 (`share_link` - UUID 기반)
- [ ] 포트폴리오 소유자 프로필 연동

**벤치마킹 알고리즘**:
```typescript
// 유사도 점수 계산 (0-100)
- 공통 종목 비율
- 자산 배분 유사도
- 수익률 근사도
- 보유 기간 유사도

similarity_score = (
  (공통_종목_비율 * 30) +
  (자산배분_유사도 * 40) +
  (수익률_근사도 * 20) +
  (보유기간_유사도 * 10)
) / 100
```

**완료 기준**:
- ✅ 포트폴리오 공개/비공개 설정 가능
- ✅ 공개 포트폴리오 탐색 및 필터링 정상 작동
- ✅ 벤치마킹 유사도 점수 계산 정확성 검증
- ✅ 팔로우 Realtime 업데이트 동작
- ✅ RLS 정책으로 권한 자동 검증 (`mcp__supabase__get_advisors`)
- ✅ 공유 링크 생성 & 접근 권한 검증

---

## Phase 4️⃣: 고급 기능 및 최적화 - 2-3주
성능 개선 및 부가 기능

| Task | 제목 | 설명 | 예상 기간 | 의존성 | 상태 |
|------|------|------|---------|--------|------|
| #14 | Task 4-1: 고급 스크리닝 | 필터링, 조건 저장, 자동 알림 | 2-3일 | Phase 3 완료 | ⏳ 대기 |
| #15 | Task 4-2: 예측 및 센티멘트 분석 | ML 가격 예측, 뉴스/커뮤니티 분석 | 2-3일 | Phase 3 완료 | ⏳ 대기 |
| #16 | Task 4-3: 데이터 관리 및 내보내기 | CSV, PDF 내보내기, 백업/복원 | 1-2일 | Phase 3 완료 | ⏳ 대기 |
| #17 | Task 4-4: 성능 최적화 | 번들 최적화, 이미지, 캐싱, 가상 스크롤 | 2-3일 | Phase 3 완료 | ⏳ 대기 |
| #18 | Task 4-5: PWA 지원 | 오프라인 모드, 홈 추가, 푸시 알림 | 2-3일 | Phase 3 완료 | ⏳ 대기 |

### Task 4-1: 고급 스크리닝
**기간**: 2-3일 | **상태**: ⏳ 대기 | **의존성**: Phase 3 완료

**목표**: 사용자 정의 필터 및 자동 스크리닝 기능 구현

**주요 작업**:
- [ ] 스크리닝 필터 UI 개발
- [ ] 기술적 지표 범위 필터 (RSI, MACD 등)
- [ ] 기본 지표 필터 (시가총액, PER, 배당률 등)
- [ ] 스크린 저장 및 실행 기능
- [ ] 스크린 결과 자동 알림
- [ ] 스크린 결과 내보내기

**완료 기준**:
- ✅ 스크리닝 필터 UI 완성
- ✅ 조건에 맞는 종목 자동 필터링
- ✅ 스크린 결과 알림 기능 동작

---

### Task 4-2: 예측 및 센티멘트 분석
**기간**: 2-3일 | **상태**: ⏳ 대기 | **의존성**: Phase 3 완료

**목표**: 머신러닝 기반 가격 예측 및 센티멘트 분석 기능 구현

**주요 작업**:
- [ ] 가격 예측 모델 개발 (선택사항: ML 모델)
- [ ] 예측 결과 시각화
- [ ] 뉴스 센티멘트 분석
- [ ] 커뮤니티 센티멘트 분석
- [ ] 센티멘트 대시보드
- [ ] 예측 정확도 표시

**완료 기준**:
- ✅ 예측 데이터 표시 (신뢰도 포함)
- ✅ 센티멘트 분석 결과 표시
- ✅ 예측/분석 기반 인사이트 제공

---

### Task 4-3: 데이터 관리 및 내보내기
**기간**: 1-2일 | **상태**: ⏳ 대기 | **의존성**: Phase 3 완료

**목표**: 포트폴리오 및 거래 기록 내보내기, 백업/복원 기능 구현

**주요 작업**:
- [ ] CSV 내보내기 기능 (포트폴리오, 거래 기록)
- [ ] PDF 내보내기 기능 (보고서 형식)
- [ ] Excel 내보내기 기능
- [ ] 데이터 백업 기능
- [ ] 데이터 복원 기능
- [ ] 데이터 삭제 기능

**완료 기준**:
- ✅ 포트폴리오 CSV/PDF 내보내기 가능
- ✅ 데이터 백업/복원 기능 동작
- ✅ 내보낸 파일 정상 열람 가능

---

### Task 4-4: 성능 최적화
**기간**: 2-3일 | **상태**: ⏳ 대기 | **의존성**: Phase 3 완료

**목표**: 번들 최적화, 이미지 최적화, 캐싱, 가상 스크롤링 구현

**주요 작업**:
- [ ] 번들 크기 분석 및 최적화
- [ ] 이미지 최적화 (next/image, WebP 변환)
- [ ] 캐싱 전략 개선 (SWR, React Query 최적화)
- [ ] 가상 스크롤링 (대량 데이터 표시)
- [ ] 코드 스플리팅
- [ ] 성능 모니터링

**완료 기준**:
- ✅ 페이지 로딩 시간 50% 감소
- ✅ 렌더링 성능 최적화 (Lighthouse 점수)
- ✅ 가상 스크롤링으로 대량 데이터 처리

---

### Task 4-5: PWA 지원
**기간**: 2-3일 | **상태**: ⏳ 대기 | **의존성**: Phase 3 완료

**목표**: 오프라인 모드, 홈 화면 추가, 푸시 알림 구현

**주요 작업**:
- [ ] Service Worker 구현
- [ ] 오프라인 모드 (캐시된 데이터 조회)
- [ ] 홈 화면 추가 기능 (manifest.json)
- [ ] 푸시 알림 서버 설정
- [ ] 알림 구독/관리 UI
- [ ] PWA 테스트 및 배포

**완료 기준**:
- ✅ 앱을 홈 화면에 추가 가능
- ✅ 오프라인에서 기본 기능 사용 가능
- ✅ 푸시 알림 수신 및 표시

---

## Phase 5️⃣: Stretch Goals - 부가 기능
추가 가치 제공

| Task | 제목 | 설명 | 우선순위 | 상태 |
|------|------|------|---------|------|
| #19 | Task 5: Stretch Goals | Web3, 자동거래봇, 모바일앱 등 | 선택적 | ⏳ 대기 |

### Task 5: Stretch Goals - 부가 기능
**상태**: ⏳ 대기 | **의존성**: Phase 4 완료 (선택적)

**목표**: 앱의 가치를 극대화하는 고도화 기능 구현 (우선순위에 따라 진행)

**주요 작업** (선택적 구현):
- [ ] **Web3 암호화폐 지갑 연동**
  - MetaMask, WalletConnect 연동
  - 지갑 잔액 조회 및 거래
  - NFT 포트폴리오 지원
  
- [ ] **자동 거래 봇 시뮬레이션**
  - 매매 전략 백테스팅
  - 자동 거래 시뮬레이션
  - 성과 분석 및 최적화
  
- [ ] **포트폴리오 최적화 엔진**
  - Markowitz 포트폴리오 이론 적용
  - 효율의 경계(Efficient Frontier) 계산
  - 자동 리밸런싱 제안
  
- [ ] **모바일 앱 (React Native)**
  - iOS/Android 네이티브 앱 개발
  - 네이티브 푸시 알림
  - 오프라인 동기화
  
- [ ] **데이터 시각화 고도화**
  - 3D 차트 (Three.js)
  - 대시보드 커스터마이징
  - 실시간 데이터 업데이트
  
- [ ] **마켓플레이스 (전략 판매/구매)**
  - 투자 전략 공유 및 판매
  - 전략 평가 시스템
  - 수익 공유 메커니즘

**구현 순서**:
1. Web3 지갑 연동 (가장 인기도 높음)
2. 포트폴리오 최적화 엔진 (사용자 가치 높음)
3. 자동 거래 봇 (기술 복잡도 높음)
4. 모바일 앱 (개발 기간 많음)
5. 데이터 시각화 고도화
6. 마켓플레이스 (비즈니스 모델 구축 필요)

---

## 주요 마일스톤

| Phase | 기간 | 핵심 완성 사항 | Task 수 |
|-------|------|------------------|--------|
| **Phase 1️⃣** | 2-3주 | 대시보드, 기본 포트폴리오, 뉴스 | 5개 (#1~#5) |
| **Phase 2️⃣** | 3-4주 | AI 추천, 한국주식, 고급 분석, 개인화 | 5개 (#6~#10) |
| **Phase 3️⃣** | 3-4주 | 커뮤니티 피드, 토론, 포트폴리오 공유 | 3개 (#11~#13) |
| **Phase 4️⃣** | 2-3주 | 스크리닝, 예측/분석, 데이터 관리, 성능, PWA | 5개 (#14~#18) |
| **Phase 5️⃣** | 지속 | Stretch Goals (Web3, 모바일앱, 마켓플레이스 등) | 1개 (#19) |
| **합계** | **13-17주** | **완전한 투자 정보 플랫폼 구축** | **19개** |

## Task 현황

### Phase 1: MVP (5개 Task)
- [x] Task #1-1: 프로젝트 기초 세팅 (**1-2일**)
- [x] Task #1-2: 기본 UI/UX 레이아웃 (**1-2일**)
- [x] Task #1-3: 실시간 가격 조회 (**2-3일**)
- [x] Task #1-4: 포트폴리오 기능 (**2-3일**)
- [x] Task #1-5: 뉴스 피드 (**1-2일**)

### Phase 2: 핵심 기능 확장 (5개 Task)
- [ ] Task #2-1: 포트폴리오 고급 기능 (**2-3일**)
- [ ] Task #2-2: AI 투자 추천 (**2-3일**)
- [ ] Task #2-3: 한국 주식 지원 (**2-3일**)
- [ ] Task #2-4: 고급 차트 및 분석 (**2-3일**)
- [ ] Task #2-5: 사용자 설정 (**1-2일**)

### Phase 3: 커뮤니티 기능 (3개 Task)
- [ ] Task #3-1: 커뮤니티 피드 (**2-3일**)
- [ ] Task #3-2: 토론 게시판 (**2-3일**)
- [ ] Task #3-3: 포트폴리오 공유 (**2일**)

### Phase 4: 고급 기능 및 최적화 (5개 Task)
- [ ] Task #4-1: 고급 스크리닝 (**2-3일**)
- [ ] Task #4-2: 예측 및 센티멘트 분석 (**2-3일**)
- [ ] Task #4-3: 데이터 관리 (**1-2일**)
- [ ] Task #4-4: 성능 최적화 (**2-3일**)
- [ ] Task #4-5: PWA 지원 (**2-3일**)

### Phase 5: Stretch Goals (1개 Task)
- [ ] Task #5: 부가 기능 (Web3, 모바일앱, 마켓플레이스 등) (**선택적**)

---

## 기술 결정 사항

### API 선택
- **글로벌 주식**: Finnhub (무료 Tier 충분)
- **암호화폐**: CoinGecko (무료, API 제한 없음)
- **한국 주식**: 미정 (크레온 API, 키움 API 등)

### 상태 관리
- **서버 상태**: TanstackQuery (기본값)
- **클라이언트 상태**: Context API 또는 Zustand

### 백엔드
- **API Routes**: Next.js App Router의 route.ts 사용
  - /app/api/stocks/
  - /app/api/crypto/
  - /app/api/portfolio/
  - /app/api/news/

### 데이터베이스 (필요시)
- **초기 MVP**: Firebase Realtime Database 또는 Supabase (클라이언트 사이드 코드)
- **확장 단계**: PostgreSQL + Prisma ORM (백엔드에서 관리)

### 라우터
- **App Router** (Next.js 13+)
- 페이지: /app/(routes)/dashboard, /portfolio, /news, /community

### 호스팅
- **Vercel** (Next.js 최고 지원)

---

## 다음 단계
- [ ] Phase 1 프로젝트 세팅 시작
- [ ] Finnhub/CoinGecko API 키 발급
- [ ] 디자인 시스템 기초 수립
- [ ] 초기 컴포넌트 구조 설계
