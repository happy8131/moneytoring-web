// 암호화폐 심볼 → CoinGecko ID 매핑
const SYMBOL_TO_COINGECKO_ID: Record<string, string> = {
  // 주요 암호화폐
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDT: 'tether',
  USDC: 'usd-coin',
  BNB: 'binancecoin',
  XRP: 'ripple',
  SOL: 'solana',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  POLKADOT: 'polkadot',
  DOT: 'polkadot',
  AVAX: 'avalanche-2',
  MATIC: 'matic-network',
  LINK: 'chainlink',
  UNI: 'uniswap',
  ATOM: 'cosmos',
  LTC: 'litecoin',
  BCH: 'bitcoin-cash',
  XLM: 'stellar',
  SHIB: 'shiba-inu',

  // 추가 알트코인
  PEPE: 'pepe',
  FLOKI: 'floki',
  APTOS: 'aptos',
  ARB: 'arbitrum',
  OP: 'optimism',
  NEAR: 'near',
  FTM: 'fantom',
  GALA: 'gala',
  SAND: 'the-sandbox',
  MANA: 'decentraland',
};

/**
 * 암호화폐 심볼을 CoinGecko ID로 변환
 * @param symbol 암호화폐 심볼 (예: "BTC", "ETH")
 * @returns CoinGecko ID (예: "bitcoin", "ethereum") 또는 소문자 심볼
 */
export function symbolToCoinGeckoId(symbol: string): string {
  const normalized = symbol.toUpperCase();
  return SYMBOL_TO_COINGECKO_ID[normalized] || symbol.toLowerCase();
}

/**
 * 여러 심볼을 CoinGecko ID로 변환
 */
export function symbolsToCoinGeckoIds(symbols: string[]): string[] {
  return symbols.map(symbolToCoinGeckoId);
}
