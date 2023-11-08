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

    self.callAPI();
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

    self.callAPI();
    self.aggregateSameLocationMap();

    return [ self.totalCount, self.data, self.dataMap ];
  } catch (e) {
    console.error(e);
  }
}

DataManager.prototype.callAPI = function() {
  var self = this;

  var curCount = 0;
  var requestJSON = {
    serviceKey: apiServiceKey,
    "cond[lat::GT]": -360,
    "cond[lot::GT]": -360,
    "cond[bzmn_stts::EQ]": "01",
    page: self.page,
    perPage: self.perPage,
  };
  if (self.keyword) requestJSON["cond[frcs_nm::LIKE]"] = self.keyword;
  if (self.giftCardType) requestJSON["cond[frcs_reg_se::EQ]"] = self.giftCardType;
  if (usageRgnCd) requestJSON["cond[usage_rgn_cd::EQ]"] = usageRgnCd;
  
  $.ajax({
    url: `${self.fetchURL}?${new URLSearchParams(requestJSON).toString()}`,
    method: "GET",
    async: false,
    success: function(res) {
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
    },
    error: function(e) {
      alert("통신중 오류가 발생하였습니다.");
    }
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