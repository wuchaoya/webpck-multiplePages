/**
 * 去除字符串空格
 * @param string
 * @returns string
 */

export default function trim(s){
	return s.replace(/(^\s*)|(\s*$)/g, "");
}