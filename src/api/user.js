import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/user/userList',
    method: 'post',
    data
  })
}

export function readUserDetail(userId) {
	return request({
	    url: '/user/userDetail'+'/'+userId,
	    method: 'get'
	})
}

//用户状态
export function changeStatusUser(userId) {
	return request({
	    url: '/user/changeStatus'+'/'+userId,
	    method: 'get'
	})
}

