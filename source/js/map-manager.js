var MapManager = function(options) {
  this.options = _.defaults(options, {
    mapId: "",
  });

  this.defaultLevel = 3;
  this.map;

  this.listRenderer = new ListItemRenderer({});
  
  this.curLocMarkerImage = this.createMarkerImage(40, 40, './img/current_location.png');
  this.curLocPointMap = {};
  this.curMarkers = {};
  this.curMarker = null;

  this.franchiseMarkerDefaultImage = this.createMarkerImage(24, 25, './img/marker_default.svg');
  this.franchiseMarkerClickImage = this.createMarkerImage(42, 52, './img/marker_click.svg');
  this.franchiseMarkerPointMap = {};  /* 마커들의 위치정보 */
  this.franchiseMarkers = {}; /* 가맹점 마커들 */
  this.franchiseCurMarker = null;

  this.bottomContentWrap = document.getElementById('bottomContentWrap');

  this.topLeftPoint = {};
  this.bottomRightPoint = {};
}

MapManager.prototype.createMap = function(location) {
  var self = this;

  self.map = new kakao.maps.Map(document.getElementById(self.options.mapId), {
    center: self.createLatLngLocation(location.lat, location.lon),
    level: self.defaultLevel,
  });
  self.setMapBounds();
  self.setMapEvents();
}

MapManager.prototype.renderCurrentMarker = function(location) {
  var self = this;

  self.renderMarker(location,
      self.curLocPointMap,
      self.curMarkers,
      self.curLocMarkerImage,
      false,
      true);
}

MapManager.prototype.renderMarker = function(location, pointMap, markers, kakaoMarkerImage, isCluster, isCurrentLocMarker = false) {
  var self = this;
  
  var key = `${location.lat}_${location.lon}`;

  var isNew = !pointMap[key];
  var kakaoLatLng = isNew
      ? self.createLatLngLocation(location.lat, location.lon)
      : pointMap[key];

  var marker = isNew
      ? self.createMarker(self.map, kakaoLatLng, kakaoMarkerImage, isCluster)
      : markers[key];

  /* map 없을때 init */
  if (!isCluster && !marker.getMap()) {
      marker.setMap(self.map);
  }

  self.changeMarkerImage(marker, kakaoMarkerImage);

  /* deep copy */
  markers[key] = marker;
  pointMap[key] = kakaoLatLng;

  if (isCurrentLocMarker) {
      self.curMarker = marker;
      self.map.panTo(kakaoLatLng);
  }
}



MapManager.prototype.setMapBounds = function() {
  var self = this;

  var bounds = self.map.getBounds();
  var swLatLng = bounds.getSouthWest();
  var neLatLng = bounds.getNorthEast();

  self.topLeftPoint = {
      lat: neLatLng.Ma,
      lon: swLatLng.La,
  };

  self.bottomRightPoint = {
      lat: swLatLng.Ma,
      lon: neLatLng.La,
  };
}


MapManager.prototype.createLatLngLocation = function(lat, lng) {
  return new kakao.maps.LatLng(lat, lng);
}

MapManager.prototype.createMarker = function(map, kakaoLocation, kakaoMarkerImage, isCluster = false) {
  var self = this;

  var option = {
      position: kakaoLocation,
      image: kakaoMarkerImage,
      zIndex: 1,
  }
  if (!isCluster) option.map = map;

  return new kakao.maps.Marker(option);
}


MapManager.prototype.createMarkerImage = function(width, height, imgSrc) {
  return new kakao.maps.MarkerImage(imgSrc, new kakao.maps.Size(width, height));
}

MapManager.prototype.createCluster = function(map) {
  var self = this;

  return new kakao.maps.MarkerClusterer({
      map: map,
      averageCenter: true,
      minLevel: this.defaultLevel,
      disableClickZoom: true
  });
}

MapManager.prototype.createInfoWindow = function(map, kakaoLocation, content, zIndex) {
  return new kakao.maps.InfoWindow({
      map: map,
      position: kakaoLocation,
      content: content,
      removable: false,
      zIndex: zIndex,
  });
}

MapManager.prototype.changeMarkerImage = function(marker, kakaoMarkerImage) {
  if (!marker) return;

  marker.setImage(kakaoMarkerImage);
}

MapManager.prototype.getDefaultLevel = function() {
  var self = this;

  return self.defaultLevel;
}


MapManager.prototype.setMarkerClickEvents = function(location, data, marker) {
  var self = this;

  kakao.maps.event.addListener(marker, 'click', (mouseEvent) => {
      self.hideFranchiseInfo();
      self.showFranchiseContentsInMap(location, data);
  });
}

MapManager.prototype.setClusterEvent = function() {
  var self = this;

  kakao.maps.event.addListener(self.clusterer, 'clusterclick', (cluster) => {
      self.mapLevel = self.map.getLevel();
      self.mapLevel -= 2;

      if (self.mapLevel < 1) {
          self.mapLevel = 1;
      }

      self.map.setLevel(self.mapLevel, { anchor: cluster.getCenter() });
  });
}


MapManager.prototype.getMapLatLon = function() {
  var self = this;
  var mapCenter = self.map.getCenter();
  return {
      lat: mapCenter.Ma,
      lon: mapCenter.La,
  };
}

MapManager.prototype.getMapToLeft = function() {
  var self = this;
  return self.topLeftPoint;
}

MapManager.prototype.getMapBottomRight = function() {
  var self = this;
  return self.bottomRightPoint;
}

MapManager.prototype.closeInfoWindow = function() {
  var self = this;

  if (self.infoWindow) {
      self.infoWindow.close();
  }
}


MapManager.prototype.showFranchiseContentsInMap = function(location, franchises) {
  var self = this;

  var count = franchises.length;

  /* map 이동 */
  if (count === 1) {
      self.showFranchiseContent(franchises[0]);
  } else {
      self.showFranchisesNameList(location, franchises);
  }

  self.map.panTo(self.createLatLngLocation(location.lat, location.lon));
}

MapManager.prototype.showFranchisesNameList = function(location, franchises) {
  var self = this;

  var latLon = `${location.lat}_${location.lon}`;
  var html = self.listItemRenderer.getSameLocationFranchises(latLon, franchises);
  self.infoWindow = self.createInfoWindow(self.map, self.franchiseMarkerPointMap[latLon], html, 100);

  var kakaoWrapper = document.querySelector(`.show-item-wrap[data-lat-lng="${latLon}"]`);
  var grandParentWrapper = kakaoWrapper.parentElement.parentElement;

  if (grandParentWrapper) {
      grandParentWrapper.classList.add('marker-wrap');
  }
}

MapManager.prototype.hideFranchiseContent = function() {
  var self = this;

  self.bottomContentWrap.classList.add('d-none');
}

MapManager.prototype.hideFranchiseInfo = function() {
  var self = this;

  self.closeInfoWindow();
  self.hideFranchiseContent();


  if (!self.franchiseCurMarker) return;

  self.changeMarkerImage(self.franchiseCurMarker, self.franchiseMarkerDefaultImage);
  self.franchiseCurMarker = null;
}

MapManager.prototype.renderFranchises = function(totalCount, franchises, franchisesMap) {
  var self = this;

  self.removeAllCluster();
  self.removeAllFranchiseMarkers();
  self.renderFranchiseMarkerInMap(franchisesMap);

  self.listRenderer.renderItems(totalCount, franchises);
  self.showSameNameFranchise(franchises);
}

MapManager.prototype.togglePlaceList = function() {
  var listContentWrap = document.getElementById('listContentWrap');

  if (!listContentWrap) return;

  var isShowList = !listContentWrap.classList.contains('d-none');
  var listBtnText = document.getElementById('listBtnText');
  var listBtnIcon = document.getElementById('listBtnIcon');

  if (listBtnText) {
      listBtnText.innerText = isShowList ? '목록' : '지도';
  }

  if (listBtnIcon) {
      listBtnIcon.classList.remove(isShowList ? 'fa-map' : 'fa-list');
      listBtnIcon.classList.add(isShowList ? 'fa-list' : 'fa-map');
  }

  /* after set - 순서 중요 */
  if (isShowList) {
      listContentWrap.classList.add('d-none');
  } else {
      listContentWrap.classList.remove('d-none');
  }

}

MapManager.prototype.removeAllCluster = function() {
  var self = this;

  if (self.clusterer) {
    self.clusterer.clear();
  }
}
MapManager.prototype.removeAllFranchiseMarkers = function() {
  var self = this;
  
  for (var key in self.franchiseMarkers) {
    var franchiseMarker = self.franchiseMarkers[key];
    franchiseMarker.setMap(null);
  }

  if (self.franchiseCurMarker) {
      self.changeMarkerImage(self.franchiseCurMarker, self.franchiseMarkerDefaultImage);
  }
}
MapManager.prototype.renderFranchiseMarkerInMap = function(franchisesMap) {
  var self = this;
  
  var count = Object.keys(franchisesMap).length;
  if (count === 0) {
      self.showNoResult();
      return;
  }

  var mapLevel = self.map.getLevel();
  var isCluster = false;

  if (mapLevel >= self.getDefaultLevel()) {
      isCluster = true;
  }

  for (var key in franchisesMap) {
      var data = franchisesMap[key];
      var isNew = !self.franchiseMarkers[key];
      var location = {
          lat: key.split('_')[0],
          lon: key.split('_')[1]
      };

      self.renderMarker(location,
          self.franchiseMarkerPointMap,
          self.franchiseMarkers,
          self.franchiseMarkerDefaultImage,
          isCluster
      );

      if (isNew) {
          self.setMarkerClickEvents(location, data, self.franchiseMarkers[key]);
      }
  }

  if (isCluster) {
      self.renderCluster(franchisesMap);
  }
}
MapManager.prototype.showSameNameFranchise = function(franchises) {
  var self = this;
  
  var keywordInput = document.getElementById('keywordInput');
  var keyword = keywordInput.value;

  for (var franchise of franchises) {
      if (franchise.frcsNm === keyword) {
          self.showFranchiseContent(franchise);
          return;
      }
  }
}
MapManager.prototype.showNoResult = function() {
  var self = this;

  var noResultItem = document.getElementById('noSearchResultMessageWrap');
  var isActive = noResultItem.classList.contains('active');

  if (!isActive) {
      noResultItem.classList.add('active');
      setTimeout(function() {
          noResultItem.classList.remove('active')
      }, 3000);
  }

}
MapManager.prototype.renderCluster = function(franchisesMap) {
  var self = this;
  
  if (!self.clusterer) {
    self.clusterer = self.createCluster(self.map);
    self.setClusterEvent();
  }

  var markers = [];
  for (var key in self.franchiseMarkers) {
      if (franchisesMap[key]) markers.push(self.franchiseMarkers[key]);
  }

  self.clusterer.addMarkers(markers);
}

MapManager.prototype.showFranchiseContent = function(franchise) {
  var self = this;
  
  var latLon = `${franchise.location.lat}_${franchise.location.lon}`;
  self.franchiseCurMarker = self.franchiseMarkers[latLon];
  self.showClickMarker();

  self.bottomContentWrap.classList.remove('d-none');
  self.bottomContentWrap.innerHTML = self.listRenderer.getItemHTML(franchise);

  self.map.panTo(self.franchiseMarkerPointMap[latLon]);
  self.map.setLevel(2);
}

MapManager.prototype.setFranchiseMarker = function(franchise) {
  var self = this;

  var latLon = `${franchise.location.lat}_${franchise.location.lon}`;
  self.franchiseCurMarker = self.franchiseMarkers[latLon];

}


MapManager.prototype.showClickMarker = function() {
  var self = this;

  self.franchiseCurMarker.setZIndex(100);
  self.changeMarkerImage(self.franchiseCurMarker, self.franchiseMarkerClickImage);
}

MapManager.prototype.setMapEvents = function() {
  var self = this;

  /* 지도 클릭 이벤트 */
  kakao.maps.event.addListener(self.map, 'click', function(mouseEvent) {
    self.hideFranchiseInfo();
  });

  /* 지도 끌어서 이동시킬때 이벤트 */
  kakao.maps.event.addListener(self.map, 'dragend', function(mouseEvent) {
    self.hideFranchiseInfo();
    /* 현위치 검색 활성화 */
    self.setMapBounds();
    self.mapLevel = self.map.getLevel();
  });

  kakao.maps.event.addListener(self.map, 'zoom_changed', function() {
    /* 현위치 검색 활성화 */
    self.setMapBounds();
    self.mapLevel = self.map.getLevel();
  });
}
