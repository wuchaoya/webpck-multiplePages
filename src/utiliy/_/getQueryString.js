/**
 * 获取获取当前url参数
 * @param name
 * @returns value
 * @constructor
 */
export default function getQueryString (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
}
