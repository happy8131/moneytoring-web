/**
 * 한국 주식 및 ETF 데이터셋
 * - KOSPI 주요 종목 (~80개)
 * - KOSDAQ 주요 종목 (~60개)
 * - 주요 ETF (~40개)
 */

export interface KoreanStockData {
  symbol: string;   // 6자리 종목코드
  name: string;     // 한글 이름
  nameEn: string;   // 영어 이름
  market: 'KOSPI' | 'KOSDAQ';
  type: 'stock' | 'etf';
}

export const KOREAN_STOCKS: KoreanStockData[] = [
  // ────────────────────────────────────────────────────────────────────
  // KOSPI 주요 종목
  // ────────────────────────────────────────────────────────────────────
  { symbol: '005930', name: '삼성전자', nameEn: 'Samsung Electronics', market: 'KOSPI', type: 'stock' },
  { symbol: '000660', name: 'SK하이닉스', nameEn: 'SK Hynix', market: 'KOSPI', type: 'stock' },
  { symbol: '005380', name: '현대차', nameEn: 'Hyundai Motor', market: 'KOSPI', type: 'stock' },
  { symbol: '000270', name: '기아', nameEn: 'Kia Corporation', market: 'KOSPI', type: 'stock' },
  { symbol: '051910', name: 'LG화학', nameEn: 'LG Chem', market: 'KOSPI', type: 'stock' },
  { symbol: '005490', name: 'POSCO홀딩스', nameEn: 'POSCO Holdings', market: 'KOSPI', type: 'stock' },
  { symbol: '068270', name: '셀트리온', nameEn: 'Celltrion', market: 'KOSPI', type: 'stock' },
  { symbol: '207940', name: '삼성바이오로직스', nameEn: 'Samsung Biologics', market: 'KOSPI', type: 'stock' },
  { symbol: '035720', name: '카카오', nameEn: 'Kakao', market: 'KOSPI', type: 'stock' },
  { symbol: '035420', name: 'NAVER', nameEn: 'NAVER', market: 'KOSPI', type: 'stock' },
  { symbol: '055550', name: '신한지주', nameEn: 'Shinhan Financial Group', market: 'KOSPI', type: 'stock' },
  { symbol: '086790', name: '하나금융지주', nameEn: 'Hana Financial Group', market: 'KOSPI', type: 'stock' },
  { symbol: '105560', name: 'KB금융', nameEn: 'KB Financial Group', market: 'KOSPI', type: 'stock' },
  { symbol: '032830', name: '삼성생명', nameEn: 'Samsung Life Insurance', market: 'KOSPI', type: 'stock' },
  { symbol: '017670', name: 'SK텔레콤', nameEn: 'SK Telecom', market: 'KOSPI', type: 'stock' },
  { symbol: '030200', name: 'KT', nameEn: 'KT Corporation', market: 'KOSPI', type: 'stock' },
  { symbol: '096770', name: 'SK이노베이션', nameEn: 'SK Innovation', market: 'KOSPI', type: 'stock' },
  { symbol: '259960', name: '크래프톤', nameEn: 'Krafton', market: 'KOSPI', type: 'stock' },
  { symbol: '018260', name: '삼성SDS', nameEn: 'Samsung SDS', market: 'KOSPI', type: 'stock' },
  { symbol: '011200', name: 'HMM', nameEn: 'HMM', market: 'KOSPI', type: 'stock' },
  { symbol: '009150', name: '삼성전기', nameEn: 'Samsung Electro-Mechanics', market: 'KOSPI', type: 'stock' },
  { symbol: '006800', name: '미래에셋증권', nameEn: 'Mirae Asset Securities', market: 'KOSPI', type: 'stock' },
  { symbol: '015760', name: '한국전력', nameEn: 'KEPCO', market: 'KOSPI', type: 'stock' },
  { symbol: '000810', name: '삼성화재', nameEn: 'Samsung Fire & Marine Insurance', market: 'KOSPI', type: 'stock' },
  { symbol: '034730', name: 'SK', nameEn: 'SK Inc', market: 'KOSPI', type: 'stock' },
  { symbol: '033780', name: 'KT&G', nameEn: 'KT&G', market: 'KOSPI', type: 'stock' },
  { symbol: '066570', name: 'LG전자', nameEn: 'LG Electronics', market: 'KOSPI', type: 'stock' },
  { symbol: '003550', name: 'LG', nameEn: 'LG Corporation', market: 'KOSPI', type: 'stock' },
  { symbol: '402340', name: 'SK스퀘어', nameEn: 'SK Square', market: 'KOSPI', type: 'stock' },
  { symbol: '352820', name: '하이브', nameEn: 'HYBE', market: 'KOSPI', type: 'stock' },
  { symbol: '377300', name: '카카오페이', nameEn: 'KakaoPay', market: 'KOSPI', type: 'stock' },
  { symbol: '293490', name: '카카오게임즈', nameEn: 'Kakao Games', market: 'KOSPI', type: 'stock' },
  { symbol: '035250', name: '강원랜드', nameEn: 'Kangwon Land', market: 'KOSPI', type: 'stock' },
  { symbol: '009540', name: 'HD한국조선해양', nameEn: 'HD Korea Shipbuilding', market: 'KOSPI', type: 'stock' },
  { symbol: '316140', name: '우리금융지주', nameEn: 'Woori Financial Group', market: 'KOSPI', type: 'stock' },
  { symbol: '028260', name: '삼성물산', nameEn: 'Samsung C&T', market: 'KOSPI', type: 'stock' },
  { symbol: '010130', name: '고려아연', nameEn: 'Korea Zinc', market: 'KOSPI', type: 'stock' },
  { symbol: '012330', name: '현대모비스', nameEn: 'Hyundai Mobis', market: 'KOSPI', type: 'stock' },
  { symbol: '047050', name: '포스코인터내셔널', nameEn: 'POSCO International', market: 'KOSPI', type: 'stock' },
  { symbol: '000080', name: '하이트진로', nameEn: 'Hite Jinro', market: 'KOSPI', type: 'stock' },
  { symbol: '001450', name: 'S-Oil', nameEn: 'S-Oil Corporation', market: 'KOSPI', type: 'stock' },
  { symbol: '002960', name: '한라', nameEn: 'Halla', market: 'KOSPI', type: 'stock' },
  { symbol: '005560', name: '아프리카TV', nameEn: 'AfreecaTV', market: 'KOSPI', type: 'stock' },
  { symbol: '007070', name: 'GS리테일', nameEn: 'GS Retail', market: 'KOSPI', type: 'stock' },
  { symbol: '028670', name: '롯데정보통신', nameEn: 'Lotte Information Technology', market: 'KOSPI', type: 'stock' },
  { symbol: '032350', name: '롯데쇼핑', nameEn: 'Lotte Shopping', market: 'KOSPI', type: 'stock' },
  { symbol: '039490', name: '키움증권', nameEn: 'Kiwoom Securities', market: 'KOSPI', type: 'stock' },
  { symbol: '041020', name: '카나리즈', nameEn: 'Canareeze', market: 'KOSPI', type: 'stock' },
  { symbol: '006360', name: 'GS건설', nameEn: 'GS Engineering & Construction', market: 'KOSPI', type: 'stock' },
  { symbol: '010950', name: 'S-1', nameEn: 'S-1 Corporation', market: 'KOSPI', type: 'stock' },
  { symbol: '020150', name: '롯데에너지머터리얼즈', nameEn: 'Lotte Energy Materials', market: 'KOSPI', type: 'stock' },
  { symbol: '030000', name: '제일기획', nameEn: 'Cheil Worldwide', market: 'KOSPI', type: 'stock' },
  { symbol: '003620', name: 'KG케미칼', nameEn: 'KG Chemical', market: 'KOSPI', type: 'stock' },
  { symbol: '004800', name: '효성', nameEn: 'Hyosung', market: 'KOSPI', type: 'stock' },
  { symbol: '011780', name: '금호아시아나', nameEn: 'Asiana Airlines', market: 'KOSPI', type: 'stock' },
  { symbol: '042670', name: 'HD현대인프라코어', nameEn: 'HD Hyundai Infracore', market: 'KOSPI', type: 'stock' },
  { symbol: '047810', name: '한국항공우주', nameEn: 'Korea Aerospace Industries', market: 'KOSPI', type: 'stock' },
  { symbol: '036570', name: 'TJX', nameEn: 'TJX', market: 'KOSPI', type: 'stock' },
  { symbol: '024110', name: 'LG', nameEn: 'LG Electronics (Other)', market: 'KOSPI', type: 'stock' },
  { symbol: '138040', name: 'ICTK홀딩스', nameEn: 'ICTK Holdings', market: 'KOSPI', type: 'stock' },
  { symbol: '007310', name: 'KCC', nameEn: 'KCC Corporation', market: 'KOSPI', type: 'stock' },
  { symbol: '001430', name: '세아베스틸', nameEn: 'Sae-A Steel Industries', market: 'KOSPI', type: 'stock' },
  { symbol: '000100', name: 'CJ대한통운', nameEn: 'CJ Logistics', market: 'KOSPI', type: 'stock' },
  { symbol: '023530', name: 'RAK', nameEn: 'RAK Automotive', market: 'KOSPI', type: 'stock' },
  { symbol: '091990', name: '셀트리온헬스케어', nameEn: 'Celltrion Healthcare', market: 'KOSPI', type: 'stock' },

  // ────────────────────────────────────────────────────────────────────
  // KOSDAQ 주요 종목
  // ────────────────────────────────────────────────────────────────────
  { symbol: '247540', name: '에코프로비엠', nameEn: 'EcoPro BM', market: 'KOSDAQ', type: 'stock' },
  { symbol: '086520', name: '에코프로', nameEn: 'EcoPro', market: 'KOSDAQ', type: 'stock' },
  { symbol: '196170', name: '알테오젠', nameEn: 'Alteogen', market: 'KOSDAQ', type: 'stock' },
  { symbol: '041510', name: '에스엠', nameEn: 'SM Entertainment', market: 'KOSDAQ', type: 'stock' },
  { symbol: '137950', name: '클래시스', nameEn: 'Classys', market: 'KOSDAQ', type: 'stock' },
  { symbol: '145020', name: '휴젤', nameEn: 'Hugel', market: 'KOSDAQ', type: 'stock' },
  { symbol: '302440', name: 'SK바이오사이언스', nameEn: 'SK Bioscience', market: 'KOSDAQ', type: 'stock' },
  { symbol: '323410', name: '카카오뱅크', nameEn: 'KakaoBank', market: 'KOSDAQ', type: 'stock' },
  { symbol: '263750', name: '펄어비스', nameEn: 'Pearl Abyss', market: 'KOSDAQ', type: 'stock' },
  { symbol: '112040', name: '위메이드', nameEn: 'Wemade', market: 'KOSDAQ', type: 'stock' },
  { symbol: '028300', name: 'HLB', nameEn: 'HLB', market: 'KOSDAQ', type: 'stock' },
  { symbol: '183420', name: '삼성메디슨', nameEn: 'Samsung Medison', market: 'KOSDAQ', type: 'stock' },
  { symbol: '214150', name: '클리오', nameEn: 'Clio Cosmetics', market: 'KOSDAQ', type: 'stock' },
  { symbol: '357780', name: '솔브레인', nameEn: 'Soulbrain', market: 'KOSDAQ', type: 'stock' },
  { symbol: '353200', name: '대덕', nameEn: 'Daeduk Electronics', market: 'KOSDAQ', type: 'stock' },
  { symbol: '257720', name: '실리콘투', nameEn: 'Silicon2', market: 'KOSDAQ', type: 'stock' },
  { symbol: '095340', name: 'ISC', nameEn: 'ISC', market: 'KOSDAQ', type: 'stock' },
  { symbol: '145030', name: '레이', nameEn: 'Ray', market: 'KOSDAQ', type: 'stock' },
  { symbol: '288620', name: '에코프로에이치엔', nameEn: 'EcoPro HN', market: 'KOSDAQ', type: 'stock' },
  { symbol: '153460', name: '네이버웹툰', nameEn: 'Webtoon Entertainment', market: 'KOSDAQ', type: 'stock' },
  { symbol: '095570', name: 'AJ네트웍스', nameEn: 'AJ Networks', market: 'KOSDAQ', type: 'stock' },
  { symbol: '161890', name: '한국콜마', nameEn: 'Korea Kolmar', market: 'KOSDAQ', type: 'stock' },
  { symbol: '248170', name: '샘씨엔에스', nameEn: 'SamC&S', market: 'KOSDAQ', type: 'stock' },
  { symbol: '099430', name: '바이오톡스', nameEn: 'BIOTOX', market: 'KOSDAQ', type: 'stock' },
  { symbol: '036180', name: '지니언스', nameEn: 'Genieus', market: 'KOSDAQ', type: 'stock' },
  { symbol: '241840', name: 'SKM', nameEn: 'SKM Corporation', market: 'KOSDAQ', type: 'stock' },
  { symbol: '217670', name: '우인', nameEn: 'UIN', market: 'KOSDAQ', type: 'stock' },
  { symbol: '228360', name: '올릭스', nameEn: 'Ollix', market: 'KOSDAQ', type: 'stock' },
  { symbol: '214320', name: '이노션', nameEn: 'INOSION', market: 'KOSDAQ', type: 'stock' },
  { symbol: '211050', name: 'MCI', nameEn: 'MCI', market: 'KOSDAQ', type: 'stock' },

  // ────────────────────────────────────────────────────────────────────
  // ETF - 국내지수
  // ────────────────────────────────────────────────────────────────────
  { symbol: '069500', name: 'KODEX 200', nameEn: 'KODEX 200', market: 'KOSPI', type: 'etf' },
  { symbol: '229200', name: 'KODEX 코스닥150', nameEn: 'KODEX KOSDAQ150', market: 'KOSPI', type: 'etf' },
  { symbol: '122630', name: 'KODEX 레버리지', nameEn: 'KODEX Leverage', market: 'KOSPI', type: 'etf' },
  { symbol: '114800', name: 'KODEX 인버스', nameEn: 'KODEX Inverse', market: 'KOSPI', type: 'etf' },
  { symbol: '252670', name: 'KODEX 200 인버스2X', nameEn: 'KODEX 200 Inverse 2X', market: 'KOSPI', type: 'etf' },
  { symbol: '148070', name: 'KOSEF 국고채10년', nameEn: 'KOSEF Korea Government Bond 10Y', market: 'KOSPI', type: 'etf' },
  { symbol: '091160', name: 'KODEX 반도체', nameEn: 'KODEX Semiconductor', market: 'KOSPI', type: 'etf' },
  { symbol: '091170', name: 'KODEX 은행', nameEn: 'KODEX Banking', market: 'KOSPI', type: 'etf' },

  // ────────────────────────────────────────────────────────────────────
  // ETF - 해외지수
  // ────────────────────────────────────────────────────────────────────
  { symbol: '305080', name: 'TIGER S&P500레버리지', nameEn: 'TIGER S&P500 Leverage', market: 'KOSPI', type: 'etf' },
  { symbol: '360750', name: 'TIGER 미국S&P500', nameEn: 'TIGER US S&P500', market: 'KOSPI', type: 'etf' },
  { symbol: '133690', name: 'TIGER 미국나스닥100', nameEn: 'TIGER US NASDAQ100', market: 'KOSPI', type: 'etf' },
  { symbol: '364980', name: 'TIGER 차이나전기차', nameEn: 'TIGER China EV', market: 'KOSPI', type: 'etf' },
  { symbol: '161490', name: 'TIGER 차이나CSI300', nameEn: 'TIGER China CSI300', market: 'KOSPI', type: 'etf' },
  { symbol: '278490', name: 'TIGER 200IT', nameEn: 'TIGER 200 IT', market: 'KOSPI', type: 'etf' },
  { symbol: '395160', name: 'TIGER 미국테크TOP10', nameEn: 'TIGER US Tech Top10', market: 'KOSPI', type: 'etf' },
  { symbol: '381170', name: 'TIGER 글로벌혁신기술', nameEn: 'TIGER Global Innovation', market: 'KOSPI', type: 'etf' },
  { symbol: '426000', name: 'KODEX 미국S&P500TR', nameEn: 'KODEX US S&P500 TR', market: 'KOSPI', type: 'etf' },

  // ────────────────────────────────────────────────────────────────────
  // ETF - 테마/섹터
  // ────────────────────────────────────────────────────────────────────
  { symbol: '278540', name: 'KODEX MSCI Korea', nameEn: 'KODEX MSCI Korea', market: 'KOSPI', type: 'etf' },
  { symbol: '117480', name: 'KODEX 삼성그룹', nameEn: 'KODEX Samsung Group', market: 'KOSPI', type: 'etf' },
];

/**
 * 종목 검색 유틸리티 함수
 */
export function searchKoreanStocks(query: string): KoreanStockData[] {
  if (!query || query.length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase();

  return KOREAN_STOCKS.filter((stock) => {
    // 한글 이름 검색
    if (stock.name.includes(query)) return true;

    // 영어 이름 검색 (대소문자 무시)
    if (stock.nameEn.toLowerCase().includes(lowerQuery)) return true;

    // 종목코드 검색 (시작 일치)
    if (stock.symbol.startsWith(query)) return true;

    return false;
  }).sort((a, b) => {
    // 종목을 ETF보다 먼저 표시
    if (a.type !== b.type) {
      return a.type === 'stock' ? -1 : 1;
    }
    return 0;
  })
  .slice(0, 10); // 최대 10개
}
