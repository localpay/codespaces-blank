var DataManager = function(options) {
  this.options = _.defaults(options, {});

  this.fetchURL = 'https://apis.data.go.kr/B190001/localFranchises/franchise';

  this.defaultPage = 1;
  this.defaultPerPage = 2000;

  this.page = this.defaultPage;
  this.perPage = this.defaultPerPage;
  this.keyword = '';
  this.giftCardType = '03';

  this.init();
}

DataManager.prototype.fetchData = async function() {
  var self = this;

  try {
    self.totalCount = 0;
    self.data = [];

    const res = await self.callAPI();
    self.appendData(res);
    self.aggregateSameLocationMap();

    return [ self.totalCount, self.data, self.dataMap ];
  } catch (e) {
    console.error(e);
  }
}

DataManager.prototype.callNextPage = async function() {
  var self = this;

  try {
    self.page++;

    const res = await self.callAPI();
    self.appendData(res);
    self.aggregateSameLocationMap();

    return [ self.totalCount, self.data, self.dataMap ];
  } catch (e) {
    console.error(e);
  }
}

DataManager.prototype.appendData = async function(res) {
  var self = this;

  self.totalCount = res.matchCount;
  self.data = self.data.concat(_.map(res.data, function(d) {
    var result = {
      id: `${d["brno"]}_${d["frcs_zip"]}`,
      brno: d["brno"],
      distance: geoDistance(d["lat"], d["lot"], self.lat, self.lon),
      frcsAddr: nullToEmpty(d["frcs_addr"]),
      frcsDtlAddr: nullToEmpty(d["frcs_dtl_addr"]),
      frcsNm: d["frcs_nm"],
      frcsRegSe: d["frcs_reg_se"],
      frcsRegSeNm: d["frcs_reg_se_nm"],
      frcsRprsTelno: formatPhoneNumber(d["frcs_rprs_telno"]),
      frcsStlmInfoSe: d["frcs_stlm_info_se"],
      frcsStlmInfoSeNm: d["frcs_stlm_info_se_nm"],
      fullAddress: `${nullToEmpty(d["frcs_addr"])} ${nullToEmpty(d["frcs_dtl_addr"])}`,
      location: {lat: d["lat"], lon: d["lot"]},
      onlDlvyEntUseYn: d["onl_dlvy_ent_use_yn"],
      pprFrcsAplyYn: d["ppr_frcs_aply_yn"],
      pvsnInstCd: d["pvsn_inst_cd"],
      teGdsHdYn: d["te_gds_hd_yn"],
      usageRgnCd: d["usage_rgn_cd"],
    };

    return result;
  }));
  curCount = res.currentCount;

}

DataManager.prototype.callAPI = async function() {
  var self = this;

  var curCount = 0;

  // API 검색조건 설정: 자세한 호출방법은 https://www.data.go.kr/data/15119539/openapi.do 참고
  var requestJSON = {
    serviceKey: apiServiceKey,
    // "cond[lat::GT]": -360,    // 위경도 없는 데이터 제외할 경우 사용
    // "cond[lot::GT]": -360,    // 위경도 없는 데이터 제외할 경우 사용
    // // "cond[bzmn_stts::EQ]": "01", // 사업자 상태가 '계속' 인 경우만 조회 시 사용
    page: self.page,
    perPage: self.perPage,
  };
  if (self.keyword) requestJSON["cond[frcs_nm::LIKE]"] = self.keyword;
  if (self.giftCardType) requestJSON["cond[frcs_stlm_info_se::LIKE]"] = self.giftCardType;
  if (usageRgnCd) requestJSON["cond[usage_rgn_cd::EQ]"] = usageRgnCd;
  

  return new Promise( function (resolve, reject) {
    $.ajax({
      url: `${self.fetchURL}?${new URLSearchParams(requestJSON).toString()}`,
      method: "GET",
      success: function(res) {
        resolve(res);
      },
      error: function(e) {
        alert("통신중 오류가 발생하였습니다.");
        reject(e);
      }
    });
  });
}



DataManager.prototype.setInitPage = function() {
  var self = this;

  self.page = self.defaultPage;
  self.perPage = self.defaultPerPage;
}

DataManager.prototype.setKeyword = function(keyword) {
  var self = this;

  self.keyword = keyword;
}

DataManager.prototype.setRelationType = function(relationType) {
  var self = this;

  self.relationType = relationType;
}

DataManager.prototype.setGiftCardType = function(giftCardType) {
  var self = this;

  self.giftCardType = giftCardType;
}

DataManager.prototype.setTopLeft = function(topLeft) {
  var self = this;

  self.topLeft = topLeft;
}

DataManager.prototype.setBottomRight = function(bottomRight) {
  var self = this;

  self.bottomRight = bottomRight;
}

DataManager.prototype.setLocation = function(location) {
  var self = this;
  
  self.lat = location.lat;
  self.lon = location.lon;
}

DataManager.prototype.aggregateSameLocationMap = function() {
  var self = this;

  if (!self.data) return;

  var result = {};
  for (var datum of self.data) {
      if (!datum.location.lat || !datum.location.lon) continue;

      var key = `${datum.location.lat}_${datum.location.lon}`;
      if (!result[key]) {
          result[key] = [];
      }

      result[key].push(datum);
  }

  self.dataMap = result;
}

DataManager.prototype.getFranchiseById = function(id) {
  var self = this;

  var franchise;
  for (var datum of self.data) {
      if (datum.id === id) {
          franchise = datum;
          break;
      }
  }

  return franchise;

}



DataManager.prototype.init = function() {
  var self = this;

}