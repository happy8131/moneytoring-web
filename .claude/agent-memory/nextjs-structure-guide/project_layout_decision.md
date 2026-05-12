---
name: Moneytoring 레이아웃 구조 결정
description: Moneytoring Web 프로젝트의 App Router 레이아웃 설계 결정 사항 (라우트 그룹 방식 채택)
type: project
---

라우트 그룹 `app/(main)/layout.tsx` 방식으로 공통 레이아웃을 구성하기로 결정.

**Why:** 홈 페이지(`/`)와 대시보드 계열 페이지(`/dashboard`, `/portfolio`, `/news`)가 다른 레이아웃을 가져야 하며, 향후 `(auth)`, `(admin)` 그룹으로 확장이 필요할 수 있기 때문.

**How to apply:** 새 주요 페이지를 만들 때는 `app/(main)/` 하위에 배치하면 자동으로 Header + Sidebar 레이아웃을 상속받음. 레이아웃이 필요 없는 페이지(랜딩, 로그인 등)는 라우트 그룹 밖 `app/` 직하에 배치.

레이아웃 컴포넌트 위치: `components/layout/` (header.tsx, sidebar.tsx, sidebar-nav.tsx, mobile-sidebar.tsx)
서버/클라이언트 분리: sidebar-nav.tsx(usePathname), mobile-sidebar.tsx(useState)만 클라이언트, 나머지는 서버 컴포넌트.
