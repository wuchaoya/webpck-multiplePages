import fetch from 'fetch';
import Encryption from './Encode';

const HttpUitl = {
	/**
	 * 封装 fetch post 请求
	 * @param path  string
	 * @param parameter obj
	 * @param callback function
	 */
	post: (path, parameter, callbackSuccess, callbackError)=> {
		console.log('========== 网络请求参数 ==========' + path);
		console.log(parameter);
		parameter.time = (new Date()).valueOf(); // 增加时间戳,防止同一请求加密后内容一样
		fetch( path, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Sign': Encryption.encryptFun(JSON.stringify(parameter)) // 加密
			},
			body: JSON.stringify(parameter)
		}).then((response) => {
			return response.json()
		}).then((responseJson) => {
			callbackSuccess(responseJson)
		}).catch((error) => {
			callbackError(error);
		}).done();
		
	},
	
	get: (path, parameter, callbackSuccess, callbackError)=> {
		fetch( path + parameter).then((response) => {
			return response.json()
		}).then((responseJson) => {
			callbackSuccess(responseJson)
		}).catch((error) => {
			callbackError(error);
		}).done();
	}
}

module.exports = HttpUitl