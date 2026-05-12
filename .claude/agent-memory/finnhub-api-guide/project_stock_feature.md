---
name: 주식 가격 조회 기능 구현 계획
description: Moneytoring Web 대시보드의 실시간 주식 시세 조회 및 심볼 검색 기능 구현 컨텍스트
type: project
---

대시보드(app/(main)/dashboard/page.tsx)에 다음 기능을 구현 예정:
1. 여러 심볼 동시 실시간 시세 조회 (AAPL, GOOGL 등)
2. 주식 심볼 검색 기능
3. React Query를 통한 클라이언트 데이터 패칭

**Why:** 실시간 금융 데이터 모니터링 서비스(Moneytoring) 핵심 기능

**How to apply:** API 라우트는 app/api/ 하위에 생성. 환경변수 FINNHUB_API_KEY(서버 전용, NEXT_PUBLIC_ 미사용)로 키 보호. 배치 요청 패턴 적용.

현재 dashboard page는 플레이스홀더 상태 - "Task 1-3에서 검색 및 가격 표시 기능이 추가됩니다" 메시지만 존재.
