import Cookies from 'js-cookie'

const TokenKey = 'X-Token'
const SysConfigKey = 'SYSCONFIG'

export function getToken() {
return Cookies.get(TokenKey)
}

export function setToken(token) {
return Cookies.set(TokenKey,token)
}

export function getSysConfigByCookies() {
	try{
		return JSON.parse(Cookies.get(SysConfigKey))
	}catch(e){
		return {};
	}

}

export function setSysConfigToCookies(obj) {
return Cookies.set(SysConfigKey, JSON.stringify(obj))
}

export function removeToken() {
return Cookies.remove(TokenKey)
}
