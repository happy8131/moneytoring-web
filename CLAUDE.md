# CLAUDE.md

이 파일은 이 저장소의 코드 작업 시 Claude Code (claude.ai/code)에 지침을 제공합니다.

## 프로젝트 개요

**프로젝트명**: Moneytoring Web
**프레임워크**: Next.js 16.2.4 (App Router)
**언어**: TypeScript 5 + React 19.2.4
**스타일링**: Tailwind CSS 4

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

### 폰트
- **Geist 폰트**: Google Fonts에서 로드 (next/font 최적화)
  - `Geist`: 일반 폰트 (`--font-geist-sans`)
  - `Geist_Mono`: 고정폭 폰트 (`--font-geist-mono`)

## 개발 가이드

### 페이지 추가
`app/` 디렉토리 내에 폴더를 생성하고 `page.tsx` 파일 추가:
```typescript
export default function PageName() {
  return (
    <div>
      {/* 컴포넌트 콘텐츠 */}
    </div>
  );
}
```

### 컴포넌트 작성
- 서버 컴포넌트 기본 사용
- 클라이언트 상호작용 필요 시 파일 최상단에 `'use client'` 추가
- Tailwind CSS 클래스 사용

### 레이아웃 구조
- 루트 레이아웃은 `app/layout.tsx`에서 정의
- `<html>`, `<body>` 태그 포함
- 모든 페이지는 루트 레이아웃으로 래핑됨

### 스타일링
- **Tailwind CSS**: 유틸리티 클래스 우선 사용
- **CSS 변수**: 테마 색상은 CSS 변수 활용
- **글로벌 스타일**: `app/globals.css`에서 정의

## ESLint 설정

ESLint는 다음 설정을 포함:
- **Next.js Core Web Vitals**: 성능 관련 린팅
- **TypeScript**: 타입 관련 린팅

ESLint 무시 대상:
- `.next/`
- `out/`
- `build/`
- `next-env.d.ts`

## 주의사항

1. **Next.js 16.2.4**: 이 프로젝트는 최신 버전의 Next.js를 사용합니다. `node_modules/next/dist/docs/`의 관련 가이드를 확인하세요.
2. **타입 안정성**: strict 모드가 활성화되어 있으므로 모든 타입을 명시적으로 지정해야 합니다.
3. **Tailwind CSS 4**: PostCSS v4 문법을 사용합니다. 이전 버전의 문법과는 다릅니다.

## 주요 파일 수정 시 주의

- **app/globals.css**: 전역 스타일 및 Tailwind 임포트 (변경 시 신중함 필요)
- **tsconfig.json**: TypeScript 설정 (path alias 등)
- **next.config.ts**: Next.js 빌드 및 런타임 동작 설정
