import {request , baseRequest} from '@/utils/request'

export function loginByUsername(phone, password) {
  const data = {
//  username,
		phone,
    password
  }
  return request({
//  url: '/login/login',
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getUserInfo() {
	return request({
	   url: '/user/userInfo',
	   method: 'get'
	})
}

export function getSysConfig() {
	return baseRequest({
	   url: '/sysConfig/get',
	    method: 'get'
	})
}

