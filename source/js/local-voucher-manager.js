var LocalVoucherManager = function(options) {
    this.options = _.defaults(options, {
        container: {
            mapId: "map",
        }
    });

    /* 조폐공사 위,경도 */
    this.initLat = 36.37725787826933;
    this.initLon = 127.3693460226059;
    
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
    $("#placesList > :first-child").click();
}

LocalVoucherManager.prototype.init = function() {
    var self = this;

    self.initRenderMap();

    document.addEventListener('click', function(e) {
        /* 동일 위치 여러 가맹점 목록 클릭 이벤트 */
        var placeListItem = e.target.closest('.place-list-item');

        /* 목록 아이템 클릭 이벤트 */
        if (placeListItem) {
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

        await localVoucherManager.searchFranchises(keyword, giftCardType);
        $("#placesList > :first-child").click();
    });
}