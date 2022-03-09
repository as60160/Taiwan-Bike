import jsSHA from "jssha";

function GetAuthorizationHeader() {
  var AppID = process.env.VUE_APP_ID || "FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF";
  var AppKey = process.env.VUE_APP_KEY || "FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF";
  var GMTString = new Date().toGMTString();
  var ShaObj = new jsSHA("SHA-1", "TEXT");
  ShaObj.setHMACKey(AppKey, "TEXT");
  ShaObj.update("x-date: " + GMTString);
  var HMAC = ShaObj.getHMAC("B64");
  var Authorization =
    'hmac username="' +
    AppID +
    '", algorithm="hmac-sha1", headers="x-date", signature="' +
    HMAC +
    '"';
  return { Authorization: Authorization, "X-Date": GMTString };
}

export default GetAuthorizationHeader;