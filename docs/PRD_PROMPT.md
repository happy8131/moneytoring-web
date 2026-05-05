# 🎯 Moneytoring MVP PRD 작성 메타 프롬프트

## 목표
Claude AI를 사용하여 **Moneytoring 실시간 투자정보 제공 및 포트폴리오 관리 웹앱의 MVP PRD 문서**를 자동 생성하는 메타 프롬프트입니다.

---

## 📋 작성 지시사항

다음 정보를 바탕으로 **전문적인 PRD (Product Requirements Document)** 문서를 작성하세요:

### 프로젝트 기본 정보
- **프로젝트명**: Moneytoring (머니터링)
- **목표**: 실시간 투자 정보 제공 및 포트폴리오 관리, AI 기반 투자 추천 웹앱
- **단계**: MVP (최소 기능 제품, Minimum Viable Product)
- **예상 기간**: 2-3주
- **기술 스택**:
  - Frontend: Next.js 16+ (App Router) + TypeScript
  - 상태관리: TanstackQuery (React Query)
  - 스타일: Tailwind CSS + shadcn/ui
  - 백엔드: Next.js API Routes
  - 호스팅: Vercel

### Open API 통합 요구사항

**외부 API 연동** (무료 Tier 또는 유료 옵션):
- **Finnhub API**: 글로벌 주식 실시간 가격 조회
  - 무료 Tier: 충분한 요청량
  - 기능: 주식 검색, 시세, 회사 정보
  
- **CoinGecko API**: 암호화폐 실시간 가격 조회
  - 무료: API 제한 없음
  - 기능: 가격, 차트 데이터, 마켓 데이터
  
- **Claude API (Anthropic)** *(선택 사항)*:
  - AI 기반 투자 추천 (Phase 2 고려)
  - 포트폴리오 분석 및 인사이트 제공
  - 기술적 분석 기반 추천

### PRD 작성 구조

다음 섹션을 포함한 **구조화된 PRD** 문서를 작성하세요:

#### 1. **개요 (Overview)**
   - 프로젝트 비전 및 목표
   - 타겟 사용자 (User Persona)
   - 핵심 가치 제안 (Value Proposition)
   - 성공 지표 (Success Metrics)

#### 2. **기능 요구사항 (Functional Requirements)**
   - **핵심 기능 (Core Features)**
     - 대시보드 (실시간 가격 조회)
     - 포트폴리오 관리
     - 뉴스 피드
     - 검색 기능
     - 즐겨찾기
   
   - **각 기능별 상세 명세**
     - 기능 설명
     - 사용자 흐름 (User Flow)
     - 입력/출력 사양
     - 인수 조건 (Acceptance Criteria)

#### 3. **비기능 요구사항 (Non-Functional Requirements)**
   - 성능 (Performance)
   - 보안 (Security)
   - 확장성 (Scalability)
   - 접근성 (Accessibility)
   - 응답 시간 (Response Time)

#### 4. **UI/UX 요구사항**
   - 주요 페이지 및 화면:
     - 홈페이지 / 대시보드
     - 포트폴리오 페이지
     - 뉴스 페이지
     - 검색 결과 페이지
     - 상세 정보 페이지
   - 반응형 디자인 (Mobile, Tablet, Desktop)
   - 어두운 모드 지원
   - 사용자 인터페이스 패턴

#### 5. **기술 요구사항**
   - API 아키텍처:
     - `/api/stocks` - 주식 API
     - `/api/crypto` - 암호화폐 API
     - `/api/portfolio` - 포트폴리오 관리 API
     - `/api/news` - 뉴스 API
   - 데이터베이스 스키마 (초기 MVP)
   - 캐싱 전략
   - 에러 처리

#### 6. **데이터 모델 (Data Model)**
   - 주요 엔티티 및 관계:
     - User
     - Portfolio
     - Holdings (보유 종목)
     - Price (가격 정보)
     - News (뉴스)
   - 각 엔티티의 필드 및 타입

#### 7. **API 연동 상세**
   - **Finnhub API 통합**
     - 엔드포인트 명세
     - 요청/응답 형식
     - 에러 핸들링
     - 레이트 리미팅
   
   - **CoinGecko API 통합**
     - 엔드포인트 명세
     - 요청/응답 형식
     - 데이터 변환 로직
   
   - **Claude API 통합** (선택 사항)
     - 프롬프트 구조
     - 입력 데이터 (포트폴리오 정보)
     - 출력 포맷 (추천사항)

#### 8. **마이그레이션 계획**
   - Phase 1 MVP 완성 후 Phase 2로의 이행 경로
   - 기술 부채 고려사항
   - 확장성 고려

#### 9. **제약사항 및 위험 요소**
   - API 레이트 리미팅
   - 데이터 신뢰성
   - 법적 준수 (금융 정보 제공)
   - 성능 최적화 과제

#### 10. **용어 정의 (Glossary)**
   - MVP, API, 포트폴리오, 수익률 등 핵심 용어 정의

---

## 📝 작성 스타일 가이드

### 언어 설정
- **기본 언어**: 한국어
- **기술 용어**: 영어 (또는 한국어 병기)
- **코드 예제**: 영어

### 포맷팅
- **마크다운 사용**: 헤더, 리스트, 테이블, 코드 블록
- **명확한 구조**: 계층적 헤더 사용
- **시각적 요소**: 다이어그램, 플로우 차트 (필요시 ASCII 또는 텍스트)

### 작성 원칙
1. **명확성**: 모호하지 않은 명확한 요구사항
2. **구체성**: 추상적 표현 최소화, 구체적인 예시 포함
3. **테스트 가능성**: 각 요구사항은 검증 가능해야 함
4. **우선순위**: MVP에 필수적인 기능 중심

---

## 🔧 API 스펙 가이드

### 1. Finnhub API 활용 예시
```
목적: 글로벌 주식 실시간 조회
주요 엔드포인트:
- /quote: 주가 데이터 (현재가, 변동률 등)
- /search: 종목 검색
- /company-news: 회사 뉴스
```

### 2. CoinGecko API 활용 예시
```
목적: 암호화폐 실시간 조회
주요 엔드포인트:
- /simple/price: 현재 가격
- /coins/markets: 시장 데이터
- /coins/{id}/market_chart: 차트 데이터
```

### 3. Claude API 활용 (Phase 1 스코프 외, 참고)
```
목적: AI 기반 포트폴리오 분석 및 추천 (Phase 2)
입력: 사용자 포트폴리오, 시장 데이터
출력: 맞춤 투자 추천, 분석 리포트
```

---

## 📊 예상 테이블/다이어그램

### 사용자 흐름 예시
```
신규 사용자 → 회원가입 → 대시보드 → 포트폴리오 추가 → 가격 조회 → 분석
```

### 데이터 흐름
```
Frontend → Next.js API Routes → 외부 API (Finnhub/CoinGecko) → 캐시 → Frontend
```

### 포트폴리오 정보 구조
```
| 종목명 | 수량 | 매입가 | 현재가 | 수익(손실) | 수익률(%) |
|--------|------|--------|--------|-----------|----------|
```

---

## ✅ 최종 PRD 체크리스트

생성된 PRD 문서가 다음을 포함하는지 확인:

- [ ] 프로젝트 비전 및 목표가 명확한가?
- [ ] 모든 MVP 핵심 기능이 상세하게 명세되어 있는가?
- [ ] 각 API 연동이 구체적으로 설명되어 있는가?
- [ ] 사용자 흐름이 시각화되어 있는가?
- [ ] 데이터 모델이 정의되어 있는가?
- [ ] 기술 요구사항이 구체적인가?
- [ ] 제약사항과 위험요소가 명시되어 있는가?
- [ ] 성공 지표가 정의되어 있는가?
- [ ] 문서가 개발팀이 즉시 개발을 시작할 수 있을 정도로 상세한가?

---

## 📌 생성된 PRD 파일 위치

최종 생성된 PRD 문서는 다음 경로에 저장됩니다:
```
docs/MONEYTORING_MVP_PRD.md
```

---

## 🚀 사용 방법

### Claude Code에서 PRD 생성
```bash
# Claude Code 프롬프트에서 다음 명령 실행:
# "docs/PRD_PROMPT.md의 메타 프롬프트를 참고하여 Moneytoring MVP PRD를 생성해줘"
```

### 생성 후 검토
1. 생성된 PRD 문서 검토
2. 누락된 요구사항 추가
3. 팀과 함께 검토 및 승인
4. 개발 시작

---

## 📚 참고 자료
- ROADMAP.md: 프로젝트 로드맵 및 Phase 1 정의
- CLAUDE.md: 기술 스택 및 개발 환경 정보
- Finnhub API Docs: https://finnhub.io/docs/api
- CoinGecko API Docs: https://www.coingecko.com/api/documentations/v3

---

**생성 일시**: 2026-05-05  
**메타 프롬프트 버전**: 1.0
