---
name: 암호화폐 통합 패턴
description: Moneytoring Web의 CoinGecko 통합 아키텍처 결정 사항
type: project
---

/coins/markets를 /simple/price 대신 선택함. 이유: 단일 요청으로 이미지 URL, 시가총액, 24h 거래량을 모두 포함하며 Finnhub MarketItem 타입 구조와 맞추기 용이함.

**Why:** Finnhub 주식 데이터와 동일한 MarketItem 인터페이스(types/market.ts)로 통합하여 UI 컴포넌트 재사용성 극대화.

**How to apply:** 신규 암호화폐 엔드포인트 추가 시 항상 MarketItem으로 변환하는 toMarketItem() 패턴 사용. 공통 타입은 types/market.ts에 집중 관리.

레이트 리밋 전략: Next.js fetch revalidate 60초 + React Query staleTime 60초 이중 캐싱. 무료 플랜 30 req/min 기준 안전.
