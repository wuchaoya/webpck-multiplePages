import CryptoJS from 'crypto-js';

export default class Encryption {
	
	static encryptFun(data) {
		var key = CryptoJS.enc.Latin1.parse('IYnGgQe8jDfADSFWDbEWzdPDMEnsdDuI');
		var iv = CryptoJS.enc.Latin1.parse('XYgGnQE2jDFADSXF');
		// 加密
		var encrypted = CryptoJS.AES.encrypt(
			data,
			key,
			{
				iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
			});
		// 解密
		var decrypted = CryptoJS.AES.decrypt(encrypted, key, {iv: iv, padding: CryptoJS.pad.ZeroPadding});
		// console.log('decrypted: ' + decrypted.toString(CryptoJS.enc.Utf8) + '    --->    ' + 'encrypted: ' + encrypted);
		return encrypted.toString();
	}
	
}