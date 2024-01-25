지역사랑상품권 가맹점기본정보 API 활용 예시 코드
======================

본 페이지는 한국조폐공사에서 개방한 가맹점기본정보 API를 활용하여 지도에서 검색할 수 있도록 만든 예시코드입니다.

# Repository
[https://github.com/localpay/localpay.github.io](https://github.com/localpay/localpay.github.io)

# 예시 화면
![예시 화면][screen_sample]


# 사용한 데이터
[공공데이터포털 한국조폐공사_통합_가맹점기본정보 ][komsco_api] - 해당 API의 활용신청을 통해 API KEY 를 발급

# 그외 외부 서비스
[카카오지도 API][kakao_map_api] 
 * 키 발급 방법:
   * 1. [https://developers.kakao.com/console/app)](https://developers.kakao.com/console/app) 에서 카카오 로그인 후, 애플리케이션 추가.
   * 2. 애플리케이션 상세페이지의 플랫폼 설정하기 클릭 도는 좌측 상단 메뉴의 플랫폼 선택
   * 3. Web 플랫폼 등록 클릭
   * 4. 해당 소스코드를 구동할 도메인 등록


# `service-key.js` 생성
`service-key-sample.js` 파일을 복사하여 `service-key.js` 신규 파일 생성

## service-key.js
``` javascript
// 공공데이터 포털 - API Service Key(공공데이터포털 마이페이지에서 Decoding 된 인증키)
var apiServiceKey = "[공공데이터포털 API KEY]";

// Kakao 지도 API - App Key (javascript 키)
var kakaoMapKey = "카카오맵 API javascript KEY"

// 사용처지역코드:
// 특정 광역시/도 또는 시/군/구를 제한하여 검색서비스를 제공하고 싶을 경우, 해당 변수에 법정동 코드의 앞 5자리 입력 (지역별 코드는 `사용처지역코드.xlsx` 참고)
var usageRgnCd = "";
```

* `사용처지역코드` 입력 시 주의사항:
  * 검색하고자 하는 지역의 지역코드를 `사용처지역코드.xlsx` 파일에서 찾아 입력.
  * 사용처지역코드가 변경(명칭 변경, 통합 등)된 지역의 경우 변경된 사용처지역코드로 입력하여야 하며, 변경 전 사용처지역코드로는 검색 불가.  
  ```
  예시)
  강원도 춘천시(42110) -> 강원특별자치도 춘천시(51110)
  전라북도 군산시(45130) -> 전북특별자치도 군산시(52130)
  ```

# 사용처지역코드
* `사용처지역코드`는 행정안전부에서 제공하는 법정동코드(지역코드 10자리) 중, 앞 5자리(시도코드 2자리 + 시군구코드 2자리)를 사용.
* 법정동코드는 [행정안전부_행정표준코드_법정동코드](https://www.data.go.kr/data/15077871/openapi.do) API를 활용하여 조회 가능

## 사용처지역코드가 변경된 경우
* 명칭 변경, 지역 통합 등으로 `사용처지역코드`가 변경되었을 경우, 아래 예시와 같이 `sgg-code.js` 및 `service-key.js` 파일에서 기존 사용처지역코드를 변경된 사용처지역코드로 수정.

### `sgg-code.js` 수정
변경되기 전의 사용처지역코드를 찾아, 변경된 코드로 업데이트
``` javascript
// 예) 전라북도 전주시 완산구(45111) -> 전북특별자치도 전주시 완산구(52111)
...
"45111":{ // 52111 로 수정
  "sig_cd":"45111", // 52111 로 수정
  "lon":127.12076441825144,
  "lat":35.79124936941967
},
...
```
### `service-key.js` 수정
변경되기 전의 사용처지역코드를 찾아, 변경된 코드로 업데이트
``` javascript
// 예) 전라북도 전주시 완산구(45111) -> 전북특별자치도 전주시 완산구(52111)
...
var usageRgnCd = "45111"; // 52111 로 수정
...
```

# 실행
`index.html` 파일을 더블클릭하여 브라우저로 실행

# 참고
* `source directory` 소스코드
* `ref directory` 참고자료

# 수정 사항
* [Changelog][changelog] 참고

# 문의
* 주소: 한국조폐공사 대전광역시 유성구 과학로 80-67(가정동)
* 연락처: 042-870-1462

# Support
![한국조폐공사][komsco_logo]


[komsco_api]: https://www.data.go.kr/data/15119539/openapi.do "공공데이터포털 한국조폐공사 통합가맹점기본정보"
[kakao_map_api]: https://apis.map.kakao.com/ "카카오 지도 API"
[komsco_logo]: ./ref/komsco_logo.jpg "한국조폐공사"
[screen_sample]: ./ref/screen_sample.png "화면 예시"
[changelog]:  ./CHANGELOG.md "수정 사항"
