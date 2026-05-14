---
name: kiwoom-endpoints
description: 키움 REST API의 TR 코드별 실제 엔드포인트 경로 매핑 (잘못된 /api/dostk/v1 대신 카테고리별 경로 사용)
metadata:
  type: project
---

# 키움 REST API 엔드포인트 구조

## 핵심 사실

키움 REST API는 단일 공통 엔드포인트를 사용하지 않는다.  
TR 코드 카테고리별로 URL 경로가 분리되어 있다.

**잘못된 패턴** (이전 구현): `/api/dostk/v1` — 존재하지 않는 경로  
**올바른 패턴**: TR 코드 prefix에 따라 경로가 결정됨

## TR 코드별 엔드포인트 매핑

| TR 코드 | 엔드포인트 경로 | 설명 |
|---------|----------------|------|
| ka10001 | /api/dostk/stkinfo | 주식 현재가 |
| ka10002 | /api/dostk/stkinfo | 주식 일봉 |
| ka10003 | /api/dostk/stkinfo | 주식 주봉 |
| ka10004 | /api/dostk/stkinfo | 주식 월봉 |
| ka10005 | /api/dostk/stkinfo | 주식 분봉 |
| ka20001 | /api/dostk/mrkcond | 업종 현재가 |
| kt10001 | /api/dostk/acnt | 주식 잔고 조회 (Production 전용) |
| kt10002 | /api/dostk/acnt | 주식 체결 내역 (Production 전용) |

## ka10001 (주식 현재가) 전체 명세

### 요청
- Method: POST
- URL: https://api.kiwoom.com/api/dostk/stkinfo
- Content-Type: application/json;charset=UTF-8
- Headers: Authorization: Bearer {token}, api-id: ka10001
- Body: { "stk_cd": "005930" }

### 응답 구조
응답 바디 자체가 단일 객체 (배열 래퍼 없음)

```json
{
  "return_code": 0,
  "return_msg": "정상적으로 처리되었습니다",
  "stk_cd": "005930",
  "stk_nm": "삼성전자",
  "cur_prc": "+79400",
  "pred_cls_prc": "79200",
  "pred_pre_sig": "2",
  "pred_pre": "200",
  "flu_rt": "+0.25",
  "trde_qty": "8423451",
  "trde_prc": "668953000000",
  "open_prc": "79100",
  "high_prc": "79600",
  "low_prc": "78900",
  "up_lmt_prc": "103000",
  "dn_lmt_prc": "55500",
  "mrkt_cls_nm": "코스피"
}
```

### pred_pre_sig (전일대비부호) 코드
- "1": 상한
- "2": 상승
- "3": 보합
- "4": 하락
- "5": 하한

## return_code 검증 주의사항

키움 API는 return_code를 숫자 0 또는 문자열 "0" 으로 반환한다.  
검증 시 `String(returnCode) !== '0'` 패턴을 사용해야 한다.  
`json.return_code && json.return_code !== '0'` 패턴은 숫자 0이 falsy 처리되어 정상 응답도 통과시킬 수 있으니 주의.

**Why:** /api/dostk/v1 로 요청했을 때 토큰은 정상이지만 data 배열이 비어있는 에러 발생했던 사례.  
**How to apply:** 새로운 TR 코드를 추가할 때 TR_ENDPOINT_MAP에 먼저 경로를 등록한다. 미등록 TR은 /api/dostk/stkinfo 폴백 사용.
