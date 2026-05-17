/**
 * 키움 증권 OAuth2 토큰 관리 모듈
 *
 * - 싱글톤 패턴으로 서버 프로세스 내 토큰 재사용
 * - 만료 5분 전 자동 갱신으로 요청 단절 방지
 * - Mock/Production 도메인 자동 선택
 */

// ────────────────────────────────────────────────────────────────────────────
// 타입 정의
// ────────────────────────────────────────────────────────────────────────────

interface TokenResponse {
  token: string;
  token_type: string; // "bearer"
  expires_dt: string; // "YYYYMMDDHHMMSS" 형식
  return_code: string;
  return_msg: string;
}

interface CachedToken {
  token: string;
  expiresAt: Date;
}

// ────────────────────────────────────────────────────────────────────────────
// 환경 설정
// ────────────────────────────────────────────────────────────────────────────

function getBaseUrl(): string {
  // Mock 모드: KRX 한국거래소 테스트 환경
  // Production: 실제 거래 환경
  const isMock = process.env.KIWOOM_USE_MOCK === 'true';
  return isMock
    ? 'https://mockapi.kiwoom.com'
    : 'https://api.kiwoom.com';
}

/**
 * "YYYYMMDDHHMMSS" 형식의 문자열을 Date 객체로 변환
 * 예: "20251231235959" → Date(2025-12-31T23:59:59)
 */
function parseKiwoomExpiry(expiresDt: string): Date {
  const y = expiresDt.slice(0, 4);
  const mo = expiresDt.slice(4, 6);
  const d = expiresDt.slice(6, 8);
  const h = expiresDt.slice(8, 10);
  const mi = expiresDt.slice(10, 12);
  const s = expiresDt.slice(12, 14);
  // ISO 8601 형식으로 변환 (한국 시간대 KST = UTC+9)
  return new Date(`${y}-${mo}-${d}T${h}:${mi}:${s}+09:00`);
}

// ────────────────────────────────────────────────────────────────────────────
// 토큰 캐시 (서버 프로세스 싱글톤)
// ────────────────────────────────────────────────────────────────────────────

// Next.js 개발 모드의 HMR 때문에 global 객체에 캐시 저장
// (모듈이 재로드되어도 global은 유지됨)
declare global {
  // eslint-disable-next-line no-var
  var __kiwoomTokenCache: CachedToken | null;
  // eslint-disable-next-line no-var
  var __kiwoomTokenPromise: Promise<CachedToken> | null;
}

if (!global.__kiwoomTokenCache) {
  global.__kiwoomTokenCache = null;
}

if (!global.__kiwoomTokenPromise) {
  global.__kiwoomTokenPromise = null;
}

// 만료 전 갱신 여유 시간 (5분)
const REFRESH_BUFFER_MS = 5 * 60 * 1000;

function isCacheValid(cache: CachedToken | null): cache is CachedToken {
  if (!cache) return false;
  const now = Date.now();
  return now < cache.expiresAt.getTime() - REFRESH_BUFFER_MS;
}

// ────────────────────────────────────────────────────────────────────────────
// 토큰 발급 함수
// ────────────────────────────────────────────────────────────────────────────

/**
 * 키움 OAuth2 토큰 발급 (au10001)
 * POST /oauth2/token
 */
async function issueToken(appkey: string, secretkey: string): Promise<CachedToken> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/oauth2/token`;

  console.log(`[Kiwoom] 토큰 발급 요청: ${url}, appkey=${appkey.slice(0, 10)}...`);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      appkey,
      secretkey,
    }),
    // 토큰 발급은 캐시하지 않음 (직접 관리)
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[Kiwoom] 토큰 발급 HTTP 오류: ${res.status}`, errorText);
    throw new Error(
      `키움 토큰 발급 실패: HTTP ${res.status} ${res.statusText}\n${errorText}`
    );
  }

  const rawText = await res.text();
  console.log(`[Kiwoom] 토큰 발급 raw 응답:`, rawText);

  let data: TokenResponse;
  try {
    data = JSON.parse(rawText);
  } catch (error) {
    throw new Error(
      `키움 토큰 응답 JSON 파싱 실패: ${rawText.slice(0, 200)}`
    );
  }

  console.log(`[Kiwoom] 토큰 발급 응답:`, {
    return_code: data.return_code,
    return_msg: data.return_msg,
    token: data.token ? `${data.token.slice(0, 20)}...` : 'null',
    expires_dt: data.expires_dt,
  });

  if (String(data.return_code) !== '0') {
    throw new Error(
      `키움 토큰 오류 [${data.return_code}]: ${data.return_msg}`
    );
  }

  const expiresAt = parseKiwoomExpiry(data.expires_dt);

  return {
    token: data.token,
    expiresAt,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// 공개 API
// ────────────────────────────────────────────────────────────────────────────

/**
 * 유효한 Bearer 토큰을 반환합니다.
 * 캐시가 유효하면 재사용, 만료 임박 시 자동 갱신합니다.
 *
 * @throws 환경 변수 미설정 시 또는 API 오류 시
 */
export async function getKiwoomToken(): Promise<string> {
  // 환경 변수 검증
  const appkey = process.env.KIWOOM_APP_KEY;
  const secretkey = process.env.KIWOOM_SECRET_KEY;

  if (!appkey || !secretkey) {
    throw new Error(
      'KIWOOM_APP_KEY 또는 KIWOOM_SECRET_KEY 환경 변수가 설정되지 않았습니다.'
    );
  }

  // 캐시 유효성 확인
  if (isCacheValid(global.__kiwoomTokenCache)) {
    return global.__kiwoomTokenCache.token;
  }

  // 이미 토큰 발급 중이면 동일한 Promise 대기 (중복 발급 방지)
  if (global.__kiwoomTokenPromise) {
    const cached = await global.__kiwoomTokenPromise;
    return cached.token;
  }

  // 새 토큰 발급 시작 (Promise를 global에 저장)
  global.__kiwoomTokenPromise = issueToken(appkey, secretkey)
    .then((cached) => {
      global.__kiwoomTokenCache = cached;
      const remainMin = Math.floor(
        (cached.expiresAt.getTime() - Date.now()) / 60000
      );
      console.log(`[Kiwoom] 토큰 발급 완료. 만료까지 약 ${remainMin}분`);
      return cached;
    })
    .finally(() => {
      // 발급 완료 후 Promise 참조 제거
      global.__kiwoomTokenPromise = null;
    });

  const cached = await global.__kiwoomTokenPromise;
  return cached.token;
}

/**
 * 현재 캐시된 토큰 정보를 반환합니다. (디버깅용)
 */
export function getTokenCacheStatus(): {
  cached: boolean;
  expiresAt: string | null;
  remainingMinutes: number | null;
} {
  const cache = global.__kiwoomTokenCache;

  if (!isCacheValid(cache)) {
    return { cached: false, expiresAt: null, remainingMinutes: null };
  }

  return {
    cached: true,
    expiresAt: cache.expiresAt.toISOString(),
    remainingMinutes: Math.floor(
      (cache.expiresAt.getTime() - Date.now()) / 60000
    ),
  };
}
