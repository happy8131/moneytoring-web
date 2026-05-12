/**
 * 키움 증권 REST API 클라이언트
 *
 * - 토큰 자동 주입 (getKiwoomToken 활용)
 * - 페이지네이션 헤더(cont-yn, next-key) 자동 처리
 * - Rate limit 준수: 요청 간 딜레이 적용
 */

import { getKiwoomToken } from './kiwoom-token';

// ────────────────────────────────────────────────────────────────────────────
// 타입 정의
// ────────────────────────────────────────────────────────────────────────────

export interface KiwoomRequestOptions {
  // TR 코드 (예: "ka10001")
  trCode: string;
  // 요청 바디
  body: Record<string, unknown>;
  // 페이지네이션 - 이전 응답의 next-key
  nextKey?: string;
}

export interface KiwoomResponse<T> {
  data: T;
  // 다음 페이지 존재 여부 ("Y" | "N")
  contYn: string;
  // 다음 페이지 키
  nextKey: string | null;
  // API ID (응답 헤더의 api-id)
  apiId: string | null;
}

// ────────────────────────────────────────────────────────────────────────────
// 에러 클래스
// ────────────────────────────────────────────────────────────────────────────

export class KiwoomAPIError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly httpStatus?: number
  ) {
    super(message);
    this.name = 'KiwoomAPIError';
  }
}

// ────────────────────────────────────────────────────────────────────────────
// 기본 요청 함수
// ────────────────────────────────────────────────────────────────────────────

function getBaseUrl(): string {
  const isMock = process.env.KIWOOM_USE_MOCK === 'true';
  return isMock ? 'https://mockapi.kiwoom.com' : 'https://api.kiwoom.com';
}

/**
 * 키움 API 공통 요청 함수
 * 모든 REST 엔드포인트는 POST /api/dostk/v1 에 TR 코드로 구분됩니다.
 */
export async function kiwoomRequest<T>(
  options: KiwoomRequestOptions
): Promise<KiwoomResponse<T>> {
  const token = await getKiwoomToken();
  const baseUrl = getBaseUrl();

  // 키움 REST API 공통 엔드포인트
  const url = `${baseUrl}/api/dostk/v1`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json;charset=UTF-8',
    Authorization: `Bearer ${token}`,
    'api-id': options.trCode,
  };

  // 페이지네이션 요청 시 next-key 헤더 추가
  if (options.nextKey) {
    headers['next-key'] = options.nextKey;
    headers['cont-yn'] = 'Y';
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(options.body),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new KiwoomAPIError(
      `HTTP_${res.status}`,
      `키움 API HTTP 오류: ${res.status} ${res.statusText}`,
      res.status
    );
  }

  // 응답 헤더에서 페이지네이션 정보 추출
  const contYn = res.headers.get('cont-yn') ?? 'N';
  const nextKey = res.headers.get('next-key') ?? null;
  const apiId = res.headers.get('api-id') ?? null;

  const json = await res.json();

  // return_code 검증 (키움 API 비즈니스 에러)
  if (json.return_code && json.return_code !== '0' && json.return_code !== 0) {
    throw new KiwoomAPIError(
      String(json.return_code),
      json.return_msg ?? '알 수 없는 키움 API 오류'
    );
  }

  return {
    data: json as T,
    contYn,
    nextKey,
    apiId,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Rate Limiting 유틸리티
// ────────────────────────────────────────────────────────────────────────────

/**
 * 키움 API Rate Limit 준수용 딜레이
 * 연속 요청 시 최소 200ms 간격 권장
 */
export function kiwoomDelay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 여러 심볼에 대해 순차 요청 실행 (병렬 금지 - Rate Limit 준수)
 * Promise.allSettled 패턴으로 부분 실패 허용
 */
export async function kiwoomBatchRequest<TInput, TOutput>(
  items: TInput[],
  requestFn: (item: TInput) => Promise<TOutput>,
  delayMs = 200
): Promise<{ item: TInput; result: TOutput | null; error: string | null }[]> {
  const results = [];

  for (let i = 0; i < items.length; i++) {
    try {
      const result = await requestFn(items[i]);
      results.push({ item: items[i], result, error: null });
    } catch (err) {
      results.push({
        item: items[i],
        result: null,
        error: err instanceof Error ? err.message : '알 수 없는 오류',
      });
    }

    // 마지막 요청 이후에는 딜레이 불필요
    if (i < items.length - 1) {
      await kiwoomDelay(delayMs);
    }
  }

  return results;
}
