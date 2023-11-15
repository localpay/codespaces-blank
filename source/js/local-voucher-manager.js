var LocalVoucherManager = function(options) {
    this.options = _.defaults(options, {
        container: {
            mapId: "map",
        }
    });

    
    // 사용처지역코드가 지정되어 있을 경우에는 해당 지역의 중심좌표를 첫 지도 중심으로 사용
    if (usageRgnCd) {
        this.initLat = sggCodes[usageRgnCd].lat;
        this.initLon = sggCodes[usageRgnCd].lon;
    } else { // 아닐 경우에는 조폐공사 위,경도 사용
        this.initLat = 36.37725787826933;
        this.initLon = 127.3693460226059;
    }
    
    
    this.spinner = new Spinner();
    this.dataManager = new DataManager({});
    this.mapManager = new MapManager({
        mapId: this.options.container.mapId,
    });
    this.init();
}

LocalVoucherManager.prototype.searchFranchises = async function(keyword, giftCardType) {
    var self = this;

    self.spinner.startLoading();

    self.mapManager.hideFranchiseInfo();

    self.dataManager.setInitPage();
    self.dataManager.setKeyword(keyword);
    self.dataManager.setGiftCardType(giftCardType);
    self.dataManager.setLocation(self.mapManager.getMapLatLon());

    var [totalCount, franchises, franchiseMap] = await self.dataManager.fetchData();
    self.mapManager.renderFranchises(totalCount, franchises, franchiseMap);

    self.spinner.stopLoading();
}

LocalVoucherManager.prototype.searchNextPage = async function() {
    var self = this;

    self.spinner.startLoading();

    var [totalCount, franchises, franchiseMap] = await self.dataManager.callNextPage();
    self.mapManager.renderFranchises(totalCount, franchises, franchiseMap);

    self.mapManager.hideFranchiseInfo();

    self.spinner.stopLoading();
}


LocalVoucherManager.prototype.initRenderMap = async function() {
    var self = this;

    var initLocation = {
        lat: self.initLat, lon: self.initLon
    };

    self.mapManager.createMap(initLocation);
    self.mapManager.renderCurrentMarker(initLocation);
    await self.searchFranchises('');
}

LocalVoucherManager.prototype.init = function() {
    var self = this;

    self.initRenderMap();

    document.addEventListener('click', function(e) {
        /* 동일 위치 여러 가맹점 목록 클릭 이벤트 */
        var placeListItem = e.target.closest('.place-list-item');
        var showItem = e.target.closest('.show-item');

        if (showItem) {
            var franchise = self.dataManager.getFranchiseById(showItem.dataset.id);
            self.mapManager.hideFranchiseInfo();
            self.mapManager.showFranchiseContent(franchise);
        } else if (placeListItem) {
            var parentId = placeListItem.parentElement.id;

            if (parentId === 'bottomContentWrap') return;

            var placeLi = e.target.closest('li');
            var isNextPageButton = placeLi.classList.contains('to-next-button');

            if (isNextPageButton) {
                self.searchNextPage();
            } else {
                var franchise = self.dataManager.getFranchiseById(placeLi.dataset.id);
                self.mapManager.togglePlaceList();
                self.mapManager.hideFranchiseInfo();
                
                if (!franchise.location.lat || !franchise.location.lon) {
                    alert("지도에 표시 할 수 없습니다.");
                    return;
                }

                self.mapManager.setFranchiseMarker(franchise);              
                self.mapManager.showFranchiseContent(franchise);
            }
        }
    });

    document.getElementById("searchBtn").addEventListener("click", async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        var keyword = document.getElementById("keywordInput").value;
        var giftCardType = document.getElementById("giftTypeSelect").value;

        await self.searchFranchises(keyword, giftCardType);
    });
}