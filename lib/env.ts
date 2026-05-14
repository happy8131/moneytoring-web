// 서버 전용 환경변수 검증
// 이 파일은 오직 서버 컴포넌트/API 라우트에서만 사용됨

function getEnvVariable(key: string, optional: boolean = false): string {
  const value = process.env[key];

  if (!value && !optional) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value || '';
}

export const env = {
  // Finnhub API (선택사항 - 주식 데이터는 Yahoo Finance로 대체)
  finnhubApiKey: getEnvVariable('FINNHUB_API_KEY', true),

  // CoinGecko API
  coinGeckoApiKey: getEnvVariable('COINGECKO_API_KEY', true),

  // Kiwoom Securities API
  kiwoomApiKey: getEnvVariable('KIWOOM_API_KEY', true),

  // 환경 설정
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// 환경변수 초기 검증
export function validateEnv(): void {
  // Finnhub API는 선택사항 (Yahoo Finance로 대체됨)
  // 다른 필수 환경변수는 필요 시 추가
}
