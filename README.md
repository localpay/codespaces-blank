지역사랑상품권 가맹점기본정보 API 활용 예시 코드
======================

본 페이지는 한국조폐공사에서 개방한 가맹점기본정보 API를 활용하여 지도에서 검색할 수 있도록 만든 예시코드입니다.

# Repository
[https://github.com/laylow861/laylow861.github.io](https://github.com/laylow861/laylow861.github.io)

# 예시 화면
![예시 화면][screen_sample]


# 사용한 데이터
[공공데이터포털 한국조폐공사_통합_가맹점기본정보 ][komsco-api] - 해당 API의 활용신청을 통해 API KEY 를 발급

# 그외 외부 서비스
[카카오지도 API][kakao-map-api] - 우측 상단의 APP KEY 발급

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

# 실행
index.html 파일을 더블클릭하여 브라우저로 실행

# 참고
* `source directory` 소스코드
* `ref directory` 참고자료

# 문의
* 주소: 한국조폐공사 대전광역시 유성구 과학로 80-67(가정동)
* 연락처: 042-870-1462

# Support
![한국조폐공사][komsco_logo]


[komsco_logo]: ./ref/komsco_logo.jpg "한국조폐공사"
[screen_sample]: ./ref/screen_sample.png "화면 예시"