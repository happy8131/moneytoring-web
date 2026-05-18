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
**잘못된 패턴** (확인): `/api/dostk/mrkcond` — ka20001에 사용 불가, 1504 오류 발생 확인 (2026-05-18)  
**올바른 패턴**: TR 코드 prefix에 따라 경로가 결정됨

### 1504 vs 8005 오류 구분

| 오류 코드 | 의미 | 원인 |
|-----------|------|------|
| 1504 | 해당 URI에서 해당 API ID 미지원 | TR 코드와 엔드포인트 경로 조합이 틀림 |
| 8005 | 토큰 유효하지 않음 | 토큰 누락/만료/경로 미존재(라우팅 실패) |

1504 발생 시: TR 코드에 맞는 경로로 수정 (TR_ENDPOINT_MAP 업데이트)  
8005 발생 시: 토큰 상태 먼저 확인, 그 다음 경로 확인

## TR 코드별 엔드포인트 매핑

| TR 코드 | 엔드포인트 경로 | 설명 |
|---------|----------------|------|
| ka10001 | /api/dostk/stkinfo | 주식 현재가 |
| ka10002 | /api/dostk/stkinfo | 주식 일봉 |
| ka10003 | /api/dostk/stkinfo | 주식 주봉 |
| ka10004 | /api/dostk/stkinfo | 주식 월봉 |
| ka10005 | /api/dostk/stkinfo | 주식 분봉 |
| ka20001 | /api/dostk/sect | 업종 현재가 (mrkcond에서 1504 오류 확인) |
| ka20002 | /api/dostk/sect | 업종 일봉 |
| ka20003 | /api/dostk/sect | 업종 주봉 |
| ka20004 | /api/dostk/sect | 업종 월봉 |
| kt10001 | /api/dostk/acnt | 주식 잔고 조회 (Production 전용) |
| kt10002 | /api/dostk/acnt | 주식 체결 내역 (Production 전용) |

## ka10002 (주식 일봉) 핵심 주의사항

TR 코드는 `api-id` 헤더로만 전달한다. 바디에 `tr_code` 필드를 포함하면 API가 현재가(ka10001) 형식으로 응답한다.

### 요청 바디 (올바른 형식)
```json
{ "stk_cd": "005930", "base_dt": "20260518" }
```

### 응답 구조 — dt_list 배열 형식
```json
{
  "return_code": 0,
  "stk_cd": "005930",
  "stk_nm": "삼성전자",
  "dt_list": [
    {
      "dt": "20260518",
      "open_prc": "79100",
      "high_prc": "79600",
      "low_prc": "78900",
      "clos_prc": "79400",
      "trde_qty": "8423451"
    }
  ]
}
```

**Why:** 바디에 `tr_code` 포함 시 현재가 데이터만 반환되는 현상 확인 (2026-05-18).  
**How to apply:** kiwoom-client.ts의 body 조립 시 tr_code 필드를 절대 추가하지 않는다. TR 코드는 오직 `api-id` 헤더로만 전달.

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

## ka20001 (업종 현재가) 명세

### 요청
- Method: POST
- URL: https://api.kiwoom.com/api/dostk/mrkcond
- Content-Type: application/json;charset=UTF-8
- Headers: Authorization: Bearer {token}, api-id: ka20001
- Body: { "mrkt_tp": "0", "inds_cd": "001" }

### mrkt_tp (시장구분) 코드
- "0": 코스피
- "1": 코스닥
- "2": 코스피200

### inds_cd (업종코드)
- "001": 코스피 종합
- "101": 코스닥 종합
- "201": 코스피200

## 8005 오류 원인 패턴

8005: Token이 유효하지 않습니다 — 이 오류가 발생하는 실제 케이스:
1. Bearer 토큰 누락
2. 만료된/잘못된 토큰 값
3. **존재하지 않는 엔드포인트 경로** — 경로 자체가 없으면 라우팅 실패로 8005 반환 (토큰과 무관)

참고: /api/dostk/sect 는 존재하는 경로이지만, 이전에 토큰 미발급 상태로 호출하여 8005가 발생했던 사례 있음.  
sect 경로가 8005를 반환했다면 토큰을 먼저 의심해야 한다 (경로 자체는 유효).

## return_code 검증 주의사항

키움 API는 return_code를 숫자 0 또는 문자열 "0" 으로 반환한다.  
검증 시 `String(returnCode) !== '0'` 패턴을 사용해야 한다.  
`json.return_code && json.return_code !== '0'` 패턴은 숫자 0이 falsy 처리되어 정상 응답도 통과시킬 수 있으니 주의.

**Why:** /api/dostk/v1 로 요청했을 때 토큰은 정상이지만 data 배열이 비어있는 에러 발생했던 사례.  
**How to apply:** 새로운 TR 코드를 추가할 때 TR_ENDPOINT_MAP에 먼저 경로를 등록한다. 미등록 TR은 /api/dostk/stkinfo 폴백 사용.

## 토큰 캐시와 로그 누락

`[Kiwoom] 토큰 발급 요청:` 로그가 없는 경우 = 캐시 유효, 토큰 재사용 중  
토큰 문제가 아니라 API 경로 문제임을 의심해야 한다.
