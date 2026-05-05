# 📊 Moneytoring MVP PRD (Product Requirements Document)

**문서 버전**: 1.0  
**생성 일시**: 2026-05-05  
**프로젝트 단계**: Phase 1 (MVP)  
**예상 기간**: 2-3주

---

## 1️⃣ 개요 (Overview)

### 1.1 프로젝트 비전
**Moneytoring**은 개인 투자자들이 실시간으로 글로벌 주식, 암호화폐 시장 정보를 모니터링하고, 자신의 포트폴리오를 효율적으로 관리하며, AI 기반의 투자 인사이트를 받을 수 있는 올인원 웹 애플리케이션입니다.

### 1.2 핵심 목표
- ✅ **실시간 정보 제공**: Finnhub, CoinGecko API를 통한 실시간 시세 조회
- ✅ **포트폴리오 관리**: 사용자의 투자 종목 CRUD 및 수익률 분석
- ✅ **뉴스 피드**: 시장 관련 뉴스 자동 수집 및 제공
- ✅ **검색 및 즐겨찾기**: 빠른 종목 검색 및 관심 종목 저장
- ✅ **사용자 친화적 UI**: 반응형 디자인으로 모든 기기 지원

### 1.3 타겟 사용자 (User Persona)

#### Persona 1: 개인 투자자 (홍길동, 35세)
- **배경**: 직장인, 퇴근 후 투자 활동
- **목표**: 포트폴리오 실시간 모니터링, 간단한 자산 관리
- **니즈**: 직관적인 UI, 빠른 정보 조회, 모바일 친화적
- **행동**: 주식 1-5개, 암호화폐 2-3개 보유

#### Persona 2: 활발한 트레이더 (김영희, 28세)
- **배경**: 투자 경험 풍부, 시간이 있는 직업
- **목표**: 다양한 자산 분석, 수익률 추적, 거래 기록 관리
- **니즈**: 상세한 분석 차트, 빠른 검색, 데이터 정확성
- **행동**: 주식 10+개, 암호화폐 10+개 관리

#### Persona 3: 초보 투자자 (이순신, 42세)
- **배경**: 투자 초보자, 학습 욕구 높음
- **목표**: 투자 기초 학습, 안전한 포트폴리오 구성
- **니즈**: 쉬운 사용법, 뉴스 학습, AI 추천
- **행동**: 주식 2-3개, 장기 보유 전략

### 1.4 핵심 가치 제안 (Value Proposition)
| 요소 | 설명 |
|------|------|
| **편의성** | 여러 시장(글로벌 주식, 암호화폐)을 하나의 플랫폼에서 관리 |
| **실시간성** | 실시간 가격 업데이트로 최신 시장 정보 제공 |
| **분석 기능** | 포트폴리오 수익률, 자산 분배 등 한눈에 파악 |
| **AI 인사이트** | Claude API 기반 투자 추천 (Phase 2) |
| **무료 접근** | 무료 API 활용으로 비용 장벽 제거 |

### 1.5 성공 지표 (Success Metrics)

**개발 단계 성공 지표**:
- ✅ MVP 기능 완성도: 100% (모든 핵심 기능 구현)
- ✅ API 통합 성공: Finnhub, CoinGecko 정상 작동
- ✅ 사용성: 신규 사용자 5분 내 포트폴리오 추가 완료
- ✅ 성능: 페이지 로드 시간 < 2초
- ✅ 테스트 커버리지: 주요 기능 > 80%

**출시 후 성공 지표**:
- 📈 월간 활성 사용자 (MAU): 500+
- 💾 포트폴리오 저장 수: 100+
- ⭐ 앱 만족도: 4.0점 이상 (5점 만점)
- 🔄 일일 방문자: 50+

---

## 2️⃣ 기능 요구사항 (Functional Requirements)

### 2.1 핵심 기능 (Core Features)

#### 2.1.1 대시보드 (Dashboard)
**목적**: 실시간 시장 정보 및 포트폴리오 한눈에 보기

**기능 명세**:
| 항목 | 요구사항 | 설명 |
|------|---------|------|
| **실시간 가격 조회** | Finnhub API | 글로벌 주식 현재가, 변동률, 고가/저가 |
| **암호화폐 조회** | CoinGecko API | 주요 암호화폐(BTC, ETH 등) 가격 |
| **포트폴리오 요약** | 데이터베이스 | 총 자산, 수익/손실, 수익률(%) |
| **가격 차트** | 라인 차트 | 선택된 종목의 일일 가격 변동 |
| **즐겨찾기 위젯** | 빠른 조회 | 즐겨찾기 종목 상단 표시 |

**사용자 흐름**:
```
로그인 → 대시보드 로드 → 포트폴리오 데이터 조회 
→ Finnhub/CoinGecko API 호출 → 실시간 가격 매핑 
→ 차트 렌더링 → 대시보드 표시
```

**인수 조건**:
- [ ] 대시보드 페이지 로드 시간 < 2초
- [ ] 실시간 가격 업데이트 5초 이내
- [ ] API 실패 시 캐시된 데이터 표시
- [ ] 반응형 디자인 (모바일, 태블릿, 데스크톱)
- [ ] 어두운 모드 지원

---

#### 2.1.2 포트폴리오 관리 (Portfolio Management)
**목적**: 사용자의 투자 종목 CRUD 및 성과 분석

**기능 명세**:
| 항목 | 요구사항 | 설명 |
|------|---------|------|
| **종목 추가** | 폼 입력 | 종목명, 수량, 매입가, 구매일 |
| **종목 수정** | 폼 업데이트 | 기존 종목 정보 변경 |
| **종목 삭제** | 삭제 확인 | 종목 제거 (취소 옵션) |
| **종목 목록** | 테이블 표시 | 모든 보유 종목 일람 |
| **수익률 계산** | 자동 계산 | (현재가-매입가) / 매입가 × 100 |
| **자산 분배** | 원형 차트 | 종목별 비율 시각화 |

**사용자 흐름**:
```
포트폴리오 페이지 → "종목 추가" 버튼 클릭 
→ 폼 입력 (종목명 검색 자동완성) 
→ "추가" 버튼 클릭 → 데이터 저장 → 목록 갱신
```

**데이터 구조**:
```typescript
interface Holding {
  id: string;
  symbol: string;        // 종목 코드 (예: AAPL)
  name: string;          // 종목명
  quantity: number;      // 수량
  buyPrice: number;      // 매입가
  buyDate: Date;         // 구매일
  currentPrice: number;  // 현재가 (API로부터)
  gain: number;          // 수익/손실 (자동 계산)
  gainPercent: number;   // 수익률 (자동 계산)
  type: 'stock' | 'crypto'; // 종목 타입
}
```

**인수 조건**:
- [ ] 종목 추가/수정/삭제 완료되고 즉시 UI 갱신
- [ ] 수익률 자동 계산 (매입가 기준)
- [ ] 삭제 시 확인 모달 필수
- [ ] 자산 분배 차트 실시간 업데이트
- [ ] 빈 포트폴리오 상태 메시지 표시

---

#### 2.1.3 검색 기능 (Search)
**목적**: 빠른 종목 검색 및 상세 정보 조회

**기능 명세**:
| 항목 | 요구사항 | 설명 |
|------|---------|------|
| **검색창** | 입력 필드 | 실시간 자동완성 (500ms 디바운싱) |
| **검색 결과** | 드롭다운 | 매칭 종목 10개 표시 |
| **종목 상세** | 모달/새 페이지 | 가격, 변동률, 뉴스, 설명 |
| **즐겨찾기 추가** | 별 아이콘 | 선택 종목 빠른 저장 |

**검색 알고리즘**:
- Finnhub: `/search` 엔드포인트로 주식 검색
- CoinGecko: `/coins/search` 엔드포인트로 암호화폐 검색
- 입력값 최소 1글자부터 검색 시작
- 결과 우선순위: 정확 매칭 > 부분 매칭

**인수 조건**:
- [ ] 검색 응답 시간 < 500ms
- [ ] 자동완성 카테고리 구분 (주식/암호화폐)
- [ ] 검색 결과 최대 10개
- [ ] 검색 기록 로컬 저장 (최근 5개)

---

#### 2.1.4 뉴스 피드 (News Feed)
**목적**: 투자 관련 뉴스 자동 수집 및 제공

**기능 명세**:
| 항목 | 요구사항 | 설명 |
|------|---------|------|
| **뉴스 목록** | API 연동 | Finnhub 회사뉴스 + 일반 뉴스 |
| **필터링** | 카테고리 | 기술, 금융, 암호화폐 등 |
| **검색** | 키워드 검색 | 뉴스 제목/설명 검색 |
| **읽음 표시** | 상태 관리 | 읽은 뉴스 시각적 구분 |
| **뉴스 상세** | 모달 또는 외부 링크 | 전문 출처 링크 제공 |

**뉴스 소스**:
- Finnhub API: `/company-news` (종목별 뉴스)
- CoinGecko: 암호화폐 관련 뉴스 링크 제공

**인수 조건**:
- [ ] 뉴스 로드 시간 < 2초
- [ ] 최신 뉴스부터 표시 (역순)
- [ ] 읽음/안 읽음 상태 로컬 저장
- [ ] 뉴스 링크 외부 브라우저에서 열기
- [ ] 모바일에서 레이아웃 적절히 조정

---

#### 2.1.5 즐겨찾기 (Favorites)
**목적**: 관심 종목 빠른 접근

**기능 명세**:
| 항목 | 요구사항 | 설명 |
|------|---------|------|
| **즐겨찾기 추가** | 별 아이콘 클릭 | 종목을 즐겨찾기에 추가 |
| **즐겨찾기 제거** | 별 아이콘 다시 클릭 | 즐겨찾기 해제 |
| **즐겨찾기 목록** | 전용 섹션 | 즐겨찾기 종목 빠른 조회 |
| **정렬** | 드래그 앤 드롭 | 즐겨찾기 순서 변경 (선택사항) |

**저장소**: 로컬 스토리지 (초기 MVP)

**인수 조건**:
- [ ] 즐겨찾기 추가/제거 즉시 반영
- [ ] 즐겨찾기 상태 새로고침 후에도 유지
- [ ] 즐겨찾기 최대 50개까지 지원

---

### 2.2 추가 기능 (Secondary Features)

#### 2.2.1 로그인/로그아웃 (Authentication)
**요구사항**:
- 이메일/비밀번호 기반 간단한 인증 (초기 MVP)
- 로그인 상태 유지 (토큰 기반, 7일)
- 로그아웃 기능

**참고**: 데이터베이스 연동 전까지 로컬 스토리지로 임시 구현 가능

#### 2.2.2 반응형 디자인
**요구사항**:
- 모바일: 320px 이상
- 태블릿: 768px 이상
- 데스크톱: 1024px 이상
- 모든 화면 크기에서 기능 정상 작동

#### 2.2.3 어두운 모드 (Dark Mode)
**요구사항**:
- CSS 변수 기반 테마 전환
- 사용자 선호도 저장 (로컬 스토리지)
- OS 기본 설정 감지 (prefers-color-scheme)

---

## 3️⃣ 비기능 요구사항 (Non-Functional Requirements)

### 3.1 성능 (Performance)
| 지표 | 목표 | 설명 |
|------|------|------|
| **페이지 로드** | < 2초 | 초기 페이지 로드 시간 |
| **API 응답** | < 1초 | 외부 API 응답 시간 |
| **상호작용 지연** | < 100ms | 사용자 상호작용 응답 |
| **캐싱** | 5분 | API 응답 캐싱 시간 |

**최적화 전략**:
- 이미지 최적화 (WebP, 압축)
- 코드 스플릿팅 (Next.js 자동)
- API 응답 캐싱 (TanstackQuery)
- 번들 크기 최소화 (Tree-shaking)

### 3.2 보안 (Security)
| 요소 | 요구사항 | 구현 |
|------|---------|------|
| **API 키** | 환경 변수 저장 | .env.local (서버사이드) |
| **XSS 방지** | 입력값 검증/이스케이프 | React + TypeScript |
| **CSRF 보호** | 토큰 기반 | Next.js API Routes |
| **HTTPS** | 필수 | Vercel 자동 제공 |
| **데이터 암호화** | 민감 정보 암호화 | 추후 Phase 2 |

### 3.3 확장성 (Scalability)
- 사용자 1,000명 동시 접속 지원
- API 요청 최적화 (배치 처리)
- 데이터베이스 마이그레이션 준비 (Phase 2)
- 마이크로서비스 아키텍처 고려

### 3.4 접근성 (Accessibility)
- WCAG 2.1 AA 준수
- 스크린 리더 지원 (시맨틱 HTML)
- 키보드 네비게이션 지원
- 충분한 색상 대비 (4.5:1 이상)

### 3.5 호환성 (Compatibility)
| 브라우저 | 최소 버전 | 지원 여부 |
|---------|----------|---------|
| Chrome | 90+ | ✅ |
| Firefox | 88+ | ✅ |
| Safari | 14+ | ✅ |
| Edge | 90+ | ✅ |

---

## 4️⃣ UI/UX 요구사항

### 4.1 주요 페이지 및 화면

#### 4.1.1 홈페이지 (Landing Page)
**경로**: `/`  
**콘텐츠**:
- 프로젝트 소개
- 핵심 기능 설명
- CTA (Call-to-Action): "시작하기" 버튼
- 푸터: 문의, 약관, 개인정보처리방침

#### 4.1.2 대시보드 (Dashboard)
**경로**: `/dashboard`  
**레이아웃**:
```
┌─────────────────────────────────┐
│  헤더 (로고, 네비게이션, 사용자) │
├──────────────┬──────────────────┤
│              │                  │
│  포트폴리오  │   즐겨찾기       │
│  요약 (카드) │   (위젯)         │
│              │                  │
├──────────────────────────────────┤
│  최근 조회한 종목 (카드 그리드)   │
├──────────────────────────────────┤
│  실시간 가격 차트 (전체 폭)       │
├──────────────────────────────────┤
│  뉴스 피드 (최근 5개)             │
└──────────────────────────────────┘
```

**주요 컴포넌트**:
- **포트폴리오 요약**: 총 자산, 수익/손실, 수익률 카드
- **실시간 가격 차트**: 선택된 종목의 일일 변동 그래프
- **최근 조회**: 최근 검색한 종목 4개 표시
- **뉴스 피드**: 최신 뉴스 5개, "더보기" 링크

#### 4.1.3 포트폴리오 페이지 (Portfolio)
**경로**: `/portfolio`  
**콘텐츠**:
- **종목 목록**: 테이블 형식
  ```
  | 종목명 | 수량 | 매입가 | 현재가 | 수익/손실 | 수익률 | 작업 |
  |--------|------|--------|--------|----------|--------|------|
  | AAPL   | 10   | 150    | 180    | +300     | +20%   | 수정/삭제 |
  ```
- **자산 분배**: 원형 차트 (종목별 비율)
- **종목 추가 버튼**: 모달 폼 열기
- **필터/정렬**: 수익률 순, 수량 순 등

#### 4.1.4 검색 결과 페이지 (Search Results)
**경로**: `/search?q={keyword}`  
**콘텐츠**:
- **검색 결과**: 종목별 카드
  ```
  ┌──────────────────┐
  │ 종목 로고        │
  │ 종목명 (AAPL)    │
  │ 현재가: $180     │
  │ 변동률: +2.5%    │
  │ [즐겨찾기] [상세]│
  └──────────────────┘
  ```
- **필터**: 종목 타입 (주식/암호화폐)
- **정렬**: 관련성, 가격순, 변동률순

#### 4.1.5 종목 상세 페이지 (Stock Detail)
**경로**: `/stock/{symbol}`  
**콘텐츠**:
- **종목 기본 정보**: 로고, 이름, 현재가, 변동률
- **상세 정보**: 고가, 저가, 거래량, 시가총액 (주식인 경우)
- **차트**: 1주, 1개월, 3개월, 1년 선택
- **회사 정보**: 산업, 설명 (Finnhub API)
- **관련 뉴스**: 해당 종목 최신 뉴스 5개
- **포트폴리오 추가**: "내 포트폴리오에 추가" 버튼

#### 4.1.6 뉴스 페이지 (News)
**경로**: `/news`  
**콘텐츠**:
- **뉴스 목록**: 시간순 역순 정렬
  ```
  ┌──────────────────────────────────┐
  │ [이미지] 제목                     │
  │ 출처 | 시간 | [읽음 표시]        │
  │ 요약 텍스트...                   │
  │ [상세보기]                       │
  └──────────────────────────────────┘
  ```
- **필터**: 카테고리 선택 (기술, 금융, 암호화폐)
- **검색**: 뉴스 제목/설명 검색

#### 4.1.7 로그인 페이지 (Login)
**경로**: `/login`  
**콘텐츠**:
- **이메일 입력**: 이메일 유효성 검사
- **비밀번호 입력**: 마스킹 표시
- **로그인 버튼**: 폼 검증 후 제출
- **회원가입 링크**: "/signup" 링크
- **비밀번호 찾기**: 추후 구현

### 4.2 디자인 시스템

**색상 팔레트**:
```
Primary (파란색): #007AFF
Secondary (초록색): #34C759
Danger (빨강): #FF3B30
Warning (주황): #FF9500
Background: #FFFFFF (라이트) / #1C1C1E (다크)
Text: #000000 (라이트) / #FFFFFF (다크)
Border: #E5E5EA
```

**타이포그래피**:
- **폰트**: Geist (sans-serif), Geist Mono (monospace)
- **기본 크기**: 16px
- **헤더**: H1 (32px), H2 (24px), H3 (20px)
- **강조**: Bold (600), Regular (400)

**컴포넌트**:
- **버튼**: Primary, Secondary, Outline, Danger
- **입력**: Text, Email, Number, Select, Checkbox
- **카드**: 그림자, 라운드 모서리 (8px)
- **모달**: 배경 오버레이, 중앙 정렬

### 4.3 반응형 디자인

**브레이크포인트**:
```
Mobile: < 768px
Tablet: 768px - 1024px
Desktop: > 1024px
```

**조정사항**:
- **모바일**: 사이드바 → 해머거 메뉴, 1열 레이아웃
- **태블릿**: 2열 그리드, 축소된 사이드바
- **데스크톱**: 3열 레이아웃, 전체 사이드바

### 4.4 인터랙션 & 애니메이션

**마이크로 인터랙션**:
- 버튼 호버: 배경색 변경 (200ms)
- 로딩 스피너: 회전 애니메이션
- 모달 진입: 페이드인 + 슬라이드 (300ms)
- 토스트 알림: 하단에서 슬라이드업 (400ms)

**접근성 고려**:
- `prefers-reduced-motion` 존중
- 과도한 애니메이션 제한

---

## 5️⃣ 기술 요구사항

### 5.1 API 아키텍처

**Next.js API Routes 구조**:
```
app/api/
├── stocks/
│   ├── [symbol]
│   │   └── route.ts        # GET: 종목 정보, 차트 데이터
│   └── search/
│       └── route.ts        # GET: 종목 검색 (Finnhub)
├── crypto/
│   ├── [id]
│   │   └── route.ts        # GET: 암호화폐 정보
│   └── search/
│       └── route.ts        # GET: 암호화폐 검색 (CoinGecko)
├── portfolio/
│   ├── route.ts            # GET: 전체 포트폴리오, POST: 종목 추가
│   └── [id]
│       └── route.ts        # GET/PUT/DELETE: 종목 상세 조회/수정/삭제
└── news/
    └── route.ts            # GET: 뉴스 피드 (Finnhub + 일반)
```

### 5.2 API 엔드포인트 명세

#### 5.2.1 주식 API (/api/stocks)

**GET /api/stocks/search?q={keyword}**
```json
요청:
{
  "q": "AAPL"
}

응답:
{
  "results": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "exchange": "NASDAQ",
      "type": "stock",
      "logo": "https://..."
    }
  ]
}
```

**GET /api/stocks/{symbol}**
```json
응답:
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "currentPrice": 180.5,
  "previousClose": 175.3,
  "change": 5.2,
  "changePercent": 2.97,
  "high": 182.0,
  "low": 175.0,
  "volume": 50000000,
  "marketCap": 2800000000000,
  "description": "Apple Inc. is a technology company...",
  "logo": "https://..."
}
```

**GET /api/stocks/{symbol}/chart?range={1d|1w|1mo|3mo|1y}**
```json
응답:
{
  "symbol": "AAPL",
  "range": "1d",
  "data": [
    {
      "time": "2026-05-05 09:30",
      "open": 175.0,
      "high": 180.5,
      "low": 174.5,
      "close": 178.2,
      "volume": 5000000
    }
  ]
}
```

#### 5.2.2 암호화폐 API (/api/crypto)

**GET /api/crypto/search?q={keyword}**
```json
응답:
{
  "results": [
    {
      "id": "bitcoin",
      "symbol": "BTC",
      "name": "Bitcoin",
      "logo": "https://..."
    }
  ]
}
```

**GET /api/crypto/{id}**
```json
응답:
{
  "id": "bitcoin",
  "symbol": "BTC",
  "name": "Bitcoin",
  "currentPrice": 45000,
  "changePercent": 2.5,
  "marketCap": 900000000000,
  "volume": 25000000000,
  "circulatingSupply": 21000000,
  "description": "Bitcoin is a decentralized digital currency..."
}
```

#### 5.2.3 포트폴리오 API (/api/portfolio)

**GET /api/portfolio**
```json
응답:
{
  "holdings": [
    {
      "id": "h1",
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "quantity": 10,
      "buyPrice": 150,
      "buyDate": "2026-04-01",
      "currentPrice": 180,
      "gain": 300,
      "gainPercent": 20,
      "type": "stock"
    }
  ],
  "totalValue": 1800,
  "totalGain": 300,
  "totalGainPercent": 20
}
```

**POST /api/portfolio**
```json
요청:
{
  "symbol": "AAPL",
  "quantity": 10,
  "buyPrice": 150,
  "buyDate": "2026-04-01",
  "type": "stock"
}

응답:
{
  "id": "h1",
  "symbol": "AAPL",
  ...
}
```

**PUT /api/portfolio/{id}**
```json
요청:
{
  "quantity": 15,
  "buyPrice": 150
}

응답: 업데이트된 Holding 객체
```

**DELETE /api/portfolio/{id}**
```json
응답:
{
  "success": true,
  "message": "Holding deleted successfully"
}
```

#### 5.2.4 뉴스 API (/api/news)

**GET /api/news?category={tech|finance|crypto}&limit=10**
```json
응답:
{
  "news": [
    {
      "id": "1",
      "title": "Apple increases revenue",
      "summary": "Apple Inc. reported Q2 earnings...",
      "source": "Finnhub",
      "url": "https://...",
      "image": "https://...",
      "datetime": "2026-05-05T10:30:00Z",
      "category": "tech"
    }
  ]
}
```

### 5.3 데이터베이스 스키마 (초기 MVP - 로컬 스토리지)

**저장 구조** (JSON):
```json
{
  "user": {
    "id": "user1",
    "email": "user@example.com",
    "createdAt": "2026-05-05T00:00:00Z"
  },
  "portfolio": [
    {
      "id": "h1",
      "symbol": "AAPL",
      "quantity": 10,
      "buyPrice": 150,
      "buyDate": "2026-04-01",
      "type": "stock"
    }
  ],
  "favorites": [
    {
      "symbol": "GOOGL",
      "type": "stock"
    }
  ],
  "readNews": ["news1", "news2"]
}
```

**Phase 2 데이터베이스** (PostgreSQL):
```sql
-- Users 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio 테이블
CREATE TABLE portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  quantity DECIMAL(18, 2) NOT NULL,
  buy_price DECIMAL(18, 2) NOT NULL,
  buy_date DATE NOT NULL,
  type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Favorites 테이블
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5.4 캐싱 전략

**TanstackQuery (React Query) 설정**:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5분
      cacheTime: 10 * 60 * 1000,       // 10분
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

**캐시 전략**:
| 데이터 | 캐시 시간 | 이유 |
|--------|-----------|------|
| 실시간 가격 | 5분 | 빈번한 변동 |
| 종목 정보 | 1시간 | 기본 정보 변경 드물음 |
| 뉴스 피드 | 10분 | 새로운 뉴스 수시 추가 |
| 포트폴리오 | 즉시 | 사용자 데이터 변경 |

### 5.5 에러 처리

**API 에러 응답**:
```json
{
  "error": {
    "code": "INVALID_SYMBOL",
    "message": "Symbol not found",
    "details": {
      "symbol": "INVALID"
    }
  }
}
```

**에러 코드**:
| 코드 | HTTP | 메시지 | 처리 |
|------|------|--------|------|
| INVALID_SYMBOL | 400 | 유효하지 않은 종목 | 사용자 입력 재검토 |
| API_ERROR | 500 | 외부 API 오류 | 캐시 데이터 사용 또는 재시도 |
| NETWORK_ERROR | 500 | 네트워크 오류 | 오프라인 모드 또는 재시도 |
| RATE_LIMIT | 429 | 요청 초과 | 사용자에게 알림 후 재시도 |

**에러 UI**:
- 토스트 알림: 사용자 친화적 메시지
- 폴백 UI: 캐시된 데이터 또는 마지막 알려진 값 표시
- 재시도 버튼: 중요한 요청 재시도

### 5.6 인증 (Authentication)

**초기 MVP** (로컬 스토리지):
```typescript
// 로컬 스토리지에 사용자 정보 저장
localStorage.setItem('user', JSON.stringify({
  id: 'user1',
  email: 'user@example.com',
  token: 'jwt-token'
}));
```

**인증 상태 관리** (React Context):
```typescript
interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

**보안 고려사항**:
- 토큰은 localStorage 대신 httpOnly 쿠키 사용 (Phase 2)
- 비밀번호는 클라이언트에서 절대 저장하지 않음
- HTTPS 필수 (Vercel 자동 제공)

---

## 6️⃣ 데이터 모델 (Data Model)

### 6.1 핵심 엔티티

#### User (사용자)
```typescript
interface User {
  id: string;                  // 고유 ID (UUID)
  email: string;              // 이메일
  name?: string;              // 사용자명 (선택)
  createdAt: Date;            // 가입일
  updatedAt: Date;            // 최근 수정일
  theme: 'light' | 'dark';    // 테마 선택
}
```

#### Portfolio (포트폴리오)
```typescript
interface Portfolio {
  id: string;
  userId: string;             // 사용자 ID
  holdings: Holding[];        // 보유 종목 배열
  totalValue: number;         // 총 자산
  totalGain: number;          // 총 수익/손실
  totalGainPercent: number;   // 총 수익률
  createdAt: Date;
  updatedAt: Date;
}
```

#### Holding (보유 종목)
```typescript
interface Holding {
  id: string;
  symbol: string;             // 종목 코드 (AAPL, BTC 등)
  name: string;               // 종목명
  quantity: number;           // 수량
  buyPrice: number;           // 매입가
  buyDate: Date;              // 구매일
  type: 'stock' | 'crypto';   // 종목 타입
  currentPrice?: number;      // 현재가 (API로부터)
  gain?: number;              // 수익/손실 (계산값)
  gainPercent?: number;       // 수익률 (계산값)
  createdAt: Date;
  updatedAt: Date;
}
```

#### Price (가격 정보)
```typescript
interface Price {
  symbol: string;
  type: 'stock' | 'crypto';
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  timestamp: Date;
}
```

#### News (뉴스)
```typescript
interface News {
  id: string;
  title: string;
  summary?: string;
  source: string;
  url: string;
  image?: string;
  category: 'tech' | 'finance' | 'crypto' | 'general';
  datetime: Date;
  relatedSymbols?: string[];  // 관련 종목
}
```

#### Favorite (즐겨찾기)
```typescript
interface Favorite {
  symbol: string;
  type: 'stock' | 'crypto';
  addedAt: Date;
}
```

### 6.2 엔티티 관계

```
User
├── Portfolio
│   └── Holding (N:M 관계)
│       ├── Price (실시간 조회)
│       └── News (관련 뉴스)
└── Favorite (N:M 관계)
```

### 6.3 계산 필드

**Holding의 수익/손실**:
```
gain = (currentPrice - buyPrice) × quantity
gainPercent = ((currentPrice - buyPrice) / buyPrice) × 100
```

**Portfolio의 총 자산**:
```
totalValue = Σ(currentPrice × quantity) for all holdings
totalGain = Σ gain for all holdings
totalGainPercent = (totalGain / totalInvestment) × 100
```

---

## 7️⃣ API 연동 상세

### 7.1 Finnhub API 통합

**API 소개**:
- 글로벌 주식 실시간 시세 제공
- 무료 Tier: 60 요청/분 (충분)
- 공식 문서: https://finnhub.io/docs/api

**필요한 엔드포인트**:

#### 1. 종목 검색: `/search`
```bash
GET /api/stocks/search?q=AAPL
```

**Finnhub 원본 요청**:
```bash
GET https://finnhub.io/api/v1/search
  ?q=AAPL
  &token={API_KEY}
```

**응답 변환**:
```typescript
// Finnhub 응답
{
  "count": 10,
  "result": [
    {
      "description": "Apple Inc",
      "displaySymbol": "AAPL",
      "symbol": "AAPL",
      "type": "Common Stock"
    }
  ]
}

// 변환된 응답
{
  "results": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc",
      "type": "stock"
    }
  ]
}
```

#### 2. 실시간 시세: `/quote`
```bash
GET /api/stocks/AAPL
```

**Finnhub 원본 요청**:
```bash
GET https://finnhub.io/api/v1/quote
  ?symbol=AAPL
  &token={API_KEY}
```

**응답**:
```typescript
{
  "c": 180.5,        // 현재가
  "d": 5.2,          // 변동액
  "dp": 2.97,        // 변동률(%)
  "h": 182.0,        // 고가
  "l": 175.0,        // 저가
  "o": 175.3,        // 시가
  "pc": 175.3,       // 전일종가
  "t": 1714982200    // 타임스탬프
}
```

#### 3. 회사 정보: `/company-profile2`
```bash
GET https://finnhub.io/api/v1/stock/profile2
  ?symbol=AAPL
  &token={API_KEY}
```

**응답**:
```json
{
  "name": "Apple Inc",
  "logo": "https://...",
  "description": "Apple Inc is an American technology company...",
  "currency": "USD",
  "exchange": "NASDAQ"
}
```

#### 4. 회사 뉴스: `/company-news`
```bash
GET https://finnhub.io/api/v1/company-news
  ?symbol=AAPL
  &from=2026-05-01
  &to=2026-05-05
  &token={API_KEY}
```

**응답**:
```json
{
  "headline": "Apple raises dividend",
  "id": 1234,
  "image": "https://...",
  "related": "AAPL",
  "source": "Reuters",
  "summary": "Apple Inc. raises quarterly dividend...",
  "url": "https://...",
  "datetime": 1714982200
}
```

**오류 처리**:
```typescript
const fetchStockPrice = async (symbol: string) => {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    );
    
    if (!response.ok) {
      if (response.status === 429) {
        // 레이트 리미팅
        return getCachedPrice(symbol); // 캐시 사용
      }
      throw new Error('Finnhub API error');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Stock fetch error:', error);
    return getCachedPrice(symbol); // 폴백
  }
};
```

### 7.2 CoinGecko API 통합

**API 소개**:
- 암호화폐 실시간 시세 제공
- 무료 Tier: API 제한 없음 (매우 관대)
- 공식 문서: https://www.coingecko.com/api/documentations/v3

**필요한 엔드포인트**:

#### 1. 암호화폐 검색: `/search`
```bash
GET /api/crypto/search?q=bitcoin
```

**CoinGecko 원본 요청**:
```bash
GET https://api.coingecko.com/api/v3/search
  ?query=bitcoin
```

**응답**:
```json
{
  "coins": [
    {
      "id": "bitcoin",
      "name": "Bitcoin",
      "symbol": "btc",
      "large": "https://..."
    }
  ]
}
```

#### 2. 암호화폐 시세: `/simple/price`
```bash
GET /api/crypto/bitcoin
```

**CoinGecko 원본 요청**:
```bash
GET https://api.coingecko.com/api/v3/simple/price
  ?ids=bitcoin
  &vs_currencies=usd
  &include_market_cap=true
  &include_24hr_change=true
```

**응답**:
```json
{
  "bitcoin": {
    "usd": 45000,
    "usd_market_cap": 900000000000,
    "usd_24h_change": 2.5
  }
}
```

#### 3. 시장 데이터: `/coins/markets`
```bash
GET https://api.coingecko.com/api/v3/coins/markets
  ?vs_currency=usd
  ?order=market_cap_desc
  ?per_page=10
  ?page=1
```

**응답**:
```json
{
  "id": "bitcoin",
  "symbol": "btc",
  "current_price": 45000,
  "market_cap": 900000000000,
  "market_cap_rank": 1,
  "total_volume": 25000000000,
  "price_change_percentage_24h": 2.5
}
```

#### 4. 차트 데이터: `/coins/{id}/market_chart`
```bash
GET https://api.coingecko.com/api/v3/coins/bitcoin/market_chart
  ?vs_currency=usd
  ?days=1
  ?interval=hourly
```

**응답**:
```json
{
  "prices": [
    [1714982400000, 44500],
    [1714986000000, 45000]
  ]
}
```

**오류 처리**:
```typescript
const fetchCryptoPrice = async (id: string) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`
    );
    
    if (!response.ok) {
      throw new Error('CoinGecko API error');
    }
    
    const data = await response.json();
    return data[id];
  } catch (error) {
    console.error('Crypto fetch error:', error);
    return getCachedPrice(id);
  }
};
```

### 7.3 Claude API 통합 (Phase 2 참고)

**목표**: AI 기반 투자 추천

**프롬프트 구조**:
```typescript
const analyzePortfolio = async (portfolio: Portfolio) => {
  const prompt = `
사용자의 포트폴리오를 분석하고 투자 추천을 제공해주세요.

포트폴리오:
${portfolio.holdings.map(h => `- ${h.name} (${h.symbol}): ${h.quantity}주, 수익률 ${h.gainPercent}%`).join('\n')}

총 자산: $${portfolio.totalValue}
총 수익/손실: $${portfolio.totalGain} (${portfolio.totalGainPercent}%)

다음을 분석해주세요:
1. 현재 포트폴리오의 강점과 약점
2. 자산 분산도 평가
3. 리스크 수준 평가
4. 추천 종목 및 매매 전략
5. 리밸런싱 제안
  `;

  const response = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: prompt
    }]
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
};
```

---

## 8️⃣ 마이그레이션 계획

### 8.1 Phase 1 → Phase 2 전환

**현재 (Phase 1) 상태**:
- 로컬 스토리지 기반 데이터 저장
- 모든 API는 클라이언트 사이드 호출
- 데이터베이스 없음

**Phase 2 목표**:
- PostgreSQL 데이터베이스 연동 (Supabase 또는 자체 관리)
- 서버 사이드 API 라우트 강화
- 사용자 인증 개선 (JWT 토큰)
- 고급 포트폴리오 기능 (거래 기록, 리밸런싱)

**마이그레이션 전략**:
1. **데이터 마이그레이션**:
   - 기존 로컬 스토리지 데이터 → PostgreSQL로 이전
   - 초기 로드 시 마이그레이션 스크립트 실행
   - 이전 데이터 검증 및 정제

2. **API 통합**:
   - 기존 클라이언트 사이드 호출 → 서버 사이드로 전환
   - 캐싱 전략 업데이트
   - 성능 모니터링

3. **인증 개선**:
   - httpOnly 쿠키 기반 토큰
   - 리프레시 토큰 메커니즘
   - 보안 강화

### 8.2 기술 부채

**현재 인정하는 기술 부채**:
- [ ] 로컬 스토리지 데이터 제약 (5MB 제한)
- [ ] 클라이언트 사이드 API 호출 (보안 위험)
- [ ] 브라우저 기반 인증 (세션 관리 어려움)
- [ ] 오프라인 데이터 동기화 (미지원)

**Phase 2에서 해결**:
- 데이터베이스 도입
- 서버 사이드 렌더링 (SSR) 검토
- 관계형 데이터 지원
- 고급 쿼리 최적화

### 8.3 확장성 고려

**향후 확장 계획**:
- **Phase 3**: 커뮤니티, 포트폴리오 공유, 토론
- **Phase 4**: 고급 스크리닝, 예측, PWA
- **Phase 5**: Web3 통합, 자동 거래, 최적화 엔진

**아키텍처 결정**:
- **마이크로서비스**: API 서버 분리 (향후 고려)
- **WebSocket**: 실시간 시세 전송 (Phase 3)
- **캐싱 레이어**: Redis (Phase 3)
- **메시지 큐**: 백그라운드 작업 (Phase 4)

---

## 9️⃣ 제약사항 및 위험 요소

### 9.1 기술적 제약사항

| 제약 | 영향 | 해결 방안 |
|------|------|---------|
| **API 레이트 리미팅** | Finnhub 60 req/min | 캐싱 (5분), 배치 요청 |
| **로컬 스토리지 제한** | ~5MB | Phase 2 DB로 전환 |
| **CORS 이슈** | API 호출 불가 | Next.js API Routes 사용 |
| **브라우저 호환성** | 구형 브라우저 미지원 | Polyfill, 점진적 개선 |

### 9.2 데이터 신뢰성

**문제**:
- 외부 API 단절 시 데이터 부정확
- 캐시된 데이터 마지막 값과 다를 수 있음
- 사용자 입력 오류 (예: 잘못된 수량)

**대응**:
- 데이터 검증 강화
- API 실패 시 사용자 안내
- 캐시 타임스탬프 표시
- 재시도 메커니즘

### 9.3 법적/규정 준수

**위험 요소**:
- 금융 정보 제공 시 면책 조항 필요
- 투자 조언 금지 (AI 추천 시)
- 개인정보 보호법 준수 (GDPR, CCPA 등)
- 금융감독 규정 (국가별)

**대응**:
- 이용약관 명확화: "투자 정보 제공일뿐 조언 아님"
- AI 추천 시 "참고만 하세요" 안내
- 개인정보 수집 최소화
- 개인정보 처리방침 공개

### 9.4 성능 최적화 과제

| 과제 | 목표 | 구현 계획 |
|------|------|---------|
| **번들 크기** | < 300KB | Tree-shaking, 동적 import |
| **초기 로드** | < 2초 | 이미지 최적화, 코드 분할 |
| **API 응답** | < 1초 | 캐싱, 데이터 압축 |
| **대량 데이터** | 1000+ 항목 | 가상 스크롤링 (Phase 2) |

### 9.5 보안 고려사항

| 위험 | 수준 | 완화 방안 |
|------|------|---------|
| **API 키 노출** | 높음 | 환경 변수, .gitignore |
| **XSS 공격** | 중간 | React JSX 자동 이스케이프 |
| **CSRF** | 중간 | SameSite 쿠키, CSRF 토큰 |
| **데이터 유출** | 중간 | HTTPS, 민감 데이터 암호화 (Phase 2) |

---

## 🔟 용어 정의 (Glossary)

| 용어 | 정의 | 예시 |
|------|------|------|
| **MVP** | Minimum Viable Product (최소 기능 제품) | 핵심 기능만 포함한 초기 버전 |
| **포트폴리오** | 개인이 보유한 투자 종목 모음 | AAPL 10주, BTC 0.5개 등 |
| **수익률** | 투자 수익을 투자 원금으로 나눈 비율 (%) | 100만원 투자 → 120만원 = 20% 수익률 |
| **종목** | 주식 또는 암호화폐의 개별 자산 | AAPL (애플), BTC (비트코인) |
| **시가** | 하루 중 처음 거래된 가격 | 9:30 AM 첫 체결가 |
| **종가** | 하루 중 마지막 거래된 가격 | 거래 종료 시점 가격 |
| **변동률** | 종가와 전일 종가의 변화율 (%) | 전일 100 → 오늘 102 = +2% |
| **자산 분배** | 포트폴리오 내 종목별 비율 | AAPL 30%, GOOGL 40%, BTC 30% |
| **즐겨찾기** | 사용자가 자주 확인하는 종목 | 관심 있는 종목을 빠르게 조회 |
| **캐싱** | 자주 사용되는 데이터를 임시 저장 | API 응답 5분간 저장하여 재사용 |
| **API** | Application Programming Interface | 외부 데이터 조회를 위한 통신 규약 |
| **Finnhub** | 글로벌 주식 데이터 제공 API 서비스 | 미국, 유럽 등 주식 정보 제공 |
| **CoinGecko** | 암호화폐 데이터 제공 API 서비스 | 비트코인, 이더리움 등 가격 정보 |
| **Claude API** | Anthropic의 AI 대화 API | 포트폴리오 분석 및 추천 (Phase 2) |
| **레이트 리미팅** | API 요청 횟수 제한 | Finnhub 60 요청/분 제한 |
| **TanstackQuery** | 데이터 페칭 및 캐싱 라이브러리 | React Query의 새 이름 |
| **Tailwind CSS** | 유틸리티 기반 CSS 프레임워크 | 클래스명으로 스타일링 |
| **shadcn/ui** | 복사-붙여넣기 기반 UI 컴포넌트 | Radix UI 기반 접근성 있는 컴포넌트 |

---

## 📋 체크리스트 및 검증 항목

### 개발 시작 전 확인 사항
- [ ] Finnhub API 키 발급 완료
- [ ] CoinGecko API 설명서 검토
- [ ] 개발 환경 (Node.js, npm) 설정 완료
- [ ] Git 저장소 초기화
- [ ] CLAUDE.md 참고하여 프로젝트 구조 확인
- [ ] TypeScript, Tailwind CSS, shadcn/ui 숙지

### 기능별 완성도 체크리스트

#### 대시보드
- [ ] 포트폴리오 요약 카드 표시
- [ ] Finnhub API로 주식 가격 조회
- [ ] CoinGecko API로 암호화폐 가격 조회
- [ ] 실시간 가격 업데이트 (5초 이내)
- [ ] 가격 차트 렌더링 (라인 차트)
- [ ] 반응형 디자인 적용
- [ ] 어두운 모드 지원
- [ ] 에러 처리 및 로딩 상태 표시

#### 포트폴리오
- [ ] 종목 추가 폼
- [ ] 종목 목록 테이블
- [ ] 종목 수정 기능
- [ ] 종목 삭제 기능 (확인 모달)
- [ ] 수익률 자동 계산
- [ ] 자산 분배 원형 차트
- [ ] 데이터 로컬 스토리지 저장
- [ ] 데이터 로드 및 갱신

#### 검색
- [ ] 검색창 입력 필드
- [ ] 자동완성 드롭다운
- [ ] Finnhub 주식 검색
- [ ] CoinGecko 암호화폐 검색
- [ ] 종목 상세 페이지
- [ ] 즐겨찾기 추가 버튼

#### 뉴스
- [ ] 뉴스 목록 표시
- [ ] 카테고리 필터링
- [ ] 뉴스 검색 기능
- [ ] 읽음 표시 상태 관리
- [ ] 뉴스 상세보기 링크
- [ ] 시간순 정렬

#### 즐겨찾기
- [ ] 별 아이콘 토글
- [ ] 즐겨찾기 목록 저장
- [ ] 즐겨찾기 제거 기능
- [ ] 로컬 스토리지 동기화

### 기술 검증
- [ ] TypeScript strict 모드 오류 없음
- [ ] ESLint 모든 규칙 통과
- [ ] 번들 크기 < 300KB
- [ ] 페이지 로드 시간 < 2초
- [ ] API 응답 시간 < 1초
- [ ] 모바일 반응형 테스트 완료
- [ ] 주요 브라우저 호환성 확인 (Chrome, Firefox, Safari)
- [ ] 접근성 (WCAG 2.1 AA) 검증

### 테스트
- [ ] 유닛 테스트 (주요 함수)
- [ ] 통합 테스트 (기능 플로우)
- [ ] E2E 테스트 (주요 시나리오)
- [ ] 성능 테스트 (Lighthouse)
- [ ] 보안 테스트 (OWASP)

---

## 📅 개발 스케줄

**총 예상 기간**: 2-3주

### Week 1: 기초 구축
- **Day 1-2**: 프로젝트 세팅, 레이아웃, 네비게이션
- **Day 3-4**: 대시보드 기본 구조, API 통합 준비
- **Day 5**: 포트폴리오 추가/수정/삭제 기능

### Week 2: 핵심 기능
- **Day 6-7**: 포트폴리오 목록, 차트, 자산 분배
- **Day 8-9**: 검색 기능, 종목 상세 페이지
- **Day 10**: 뉴스 피드, 즐겨찾기

### Week 3: 마무리 & 최적화
- **Day 11**: 에러 처리, 로딩 상태, 캐싱 최적화
- **Day 12**: 반응형 디자인, 어두운 모드 완성
- **Day 13-14**: 테스트, 버그 수정, 성능 최적화, 배포 준비

---

## 🚀 배포 및 출시

### 배포 플랫폼
- **Vercel** (Next.js 최고 지원)
- **GitHub 연동**: 자동 빌드 및 배포

### 출시 체크리스트
- [ ] 프로덕션 환경 변수 설정
- [ ] 보안 검토 완료
- [ ] SEO 메타데이터 설정
- [ ] 로그 및 모니터링 설정
- [ ] 이용약관, 개인정보처리방침 작성
- [ ] 사용자 피드백 채널 구축 (이메일, 피드백 폼)

### 출시 후 모니터링
- 실시간 오류 추적 (Sentry)
- 성능 모니터링 (Web Vitals)
- 사용자 피드백 수집
- 주간 성능 리포트

---

## 📞 연락처 및 문서

**담당자**: [프로젝트 매니저]  
**GitHub 저장소**: [저장소 링크]  
**이슈 추적**: GitHub Issues  
**피드백**: dlfwnd5532@gmail.com

**참고 문서**:
- ROADMAP.md: 전체 프로젝트 로드맵
- CLAUDE.md: 기술 스택 및 개발 가이드
- API 문서: Finnhub, CoinGecko 공식 문서

---

**문서 버전**: 1.0  
**최종 수정**: 2026-05-05  
**상태**: 🟢 승인 대기 중

