function geoDistance(lat1, lon1, lat2, lon2) {
  if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
  } else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
          dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515 * 1.609344;
      return dist;
  }
}

function addCommas(num) {
    var result = "" + num;

    var l = result.split("");
    var tempList = [];

    var count = 0;
    for (var i=l.length; i>0; i--) {
        if (count != 0 && count%3 == 0) tempList.push(",");
        tempList.push(l[i-1]);
        count++;
    }

    result = tempList.reverse().join("");

    return result;
}

function nullToEmpty(str) {
    
    return str ? str : "";
}

function formatPhoneNumber(phone) {
    if (!phone || phone.trim().length == 0) return '';

    var result = '';
    var length = phone.length;

    if (length === 8) {
      if (phone.startsWith('0')) {
        result = phone.replace(/(\d{4})(\d{4})/, '$1-$2');
      } else if (phone.startsWith('2')) {
        result = '0' + phone.replace(/(\d{1})(\d{3})(\d{4})/, '$1-$2-$3');
      } else {
        result = '0' + phone.replace(/0(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
      }
    } else if (phone.startsWith('02') && (length === 9 || length === 10)) {
      result = phone.replace(/(\d{2})(\d{3,4})(\d{4})/, '$1-$2-$3');
    } else if (!phone.startsWith('02') && (length === 10 || length === 11)) {
      result = phone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
    } else {
      if (phone.startsWith('2')) {
        result = '0' + phone.replace(/(\d{1})(\d{3,4})(\d{4})/, '$1-$2-$3');
      } else {
        result = '0' + phone.replace(/0(\d{2})(\d{3,4})(\d{4})/, '$1-$2-$3');
      }
    }

    return result;
}
