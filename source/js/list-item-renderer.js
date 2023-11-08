var ListItemRenderer = function(options) {
  this.options = _.defaults(options, {});

  this.placeListEl = document.getElementById('placesList');
  this.searchCountEl = document.getElementById('searchCount');

  this.init();
}

ListItemRenderer.prototype.getSameLocationTemplate = function(latLon, franchises) {
  var $container = $("<div>");
  $container.addClass("show-item-wrap");
  $container.attr("data-lat-lng", latLon);

  if (!franchises || franchises.length == 0) return $container;
  var size = franchises.length;

  _.forEach(franchises, function(franchise, idx) {
    var $a = $("<a>");
    $a[0].innerHTML = `<i class="fa-solid fa-store"></i> ${franchise.frcsNm}`;

    var $div = $("<div>");
    $div.addClass("show-item");
    $div.attr("data-id", franchise.id);

    $div.append($a);
    $container.append($div);
    if (size-1 != idx) {
      var $divider = $("<div>");
      $divider.addClass("item-divider");
      $container.append($divider);
    }
  });

  return $container;
}

ListItemRenderer.prototype.renderItems = function(totalCount, data) {
  var self = this;

  self.dataCount = totalCount;
  self.searchCountEl.innerText = addCommas(totalCount);

  if (!data || data.length === 0) {
    self.placeListEl.innerHTML = '<li class="place-list-item text-center">검색결과가 없습니다.</li>';
  } else {
    self.appendItems(data, totalCount == data.length);
  }

  self.placeListEl.classList.add('overflow-y-scroll');
}

ListItemRenderer.prototype.appendItems = function(data, isLastPage) {
  var self = this;

  var html = '';
  for (var d of data) {
      html += self.getItemHTML(d);
  }

  if (!isLastPage) {
    html += self.getNextHTML();
  }

  self.placeListEl.innerHTML = html;
}

ListItemRenderer.prototype.getItemHTML = function(place) {
  var $root = $("<root>");
  var $li = $(`<li class="place-list-item" data-id="${place.id}" data-type="list">`);

  var $container = $(`<div class="container-fluid">`);
  var $row = $(`<div class="row row-cols-1">`);

  var $name = $(`<div class="d-flex mt-2 mb-1"><div class="list-item-title me-1">${place.frcsNm}</div></div>`);
  var $phone = $(`<div class="item-phone">${place.frcsRprsTelno ? place.frcsRprsTelno : '전화번호 없음'}</div>`);
  var $addr = $(`<div class="mb-2" style="word-break:keep-all;">${place.frcsAddr}&nbsp;${place.frcsDtlAddr}</div>`);
  var $type = $(`<div class='d-flex'><div class='type-item me-1'>${place.frcsStlmInfoSeNm}</div></div>`);
  
  $row.append($name);
  $row.append($phone);
  $row.append($addr);
  $row.append($type);

  $container.append($row);
  $li.append($container);
  $root.append($li);

  return $root.html();
}

ListItemRenderer.prototype.getNextHTML = function() {
  return `<li class="place-list-item to-next-button"><div class="container-fluid"><div class="row row-cols-1"><div class="text-center">더 보기 (2000개)</div></div></div></li>`
}

ListItemRenderer.prototype.init = function() {
  var self = this;


}
