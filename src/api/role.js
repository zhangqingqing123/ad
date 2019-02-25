import request from '@/utils/request'

//查询所有权限
export function getPermisson(query) {
  return request({
    url: "/role/getAllPermission",
    method: "get",
    params: query
  })
}

export function getListRole(query) {
	return request({
    url: "/role/querySysRole",
    method: "get",
    params: query
  })
}

export function getRoleByUserId(query) {
	return request({
    url: "/role/getRoleByUserId",
    method: "get",
    params: query
  })
}

export function getAllRole(data) {
	return request({
    url: "/role/getAllRole",
    method: "get",
    data
  })
}

export function addRole(data) {
  return request({
    url: '/role/addRole',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/role/updateRole',
    method: 'post',
    data
  })
}

export function removeRole(data) {
  return request({
    url: '/role/removeRole',
    method: 'post',
    data
  })
}

export function updateUserRole(data) {
  return request({
    url: '/role/updateUserRole',
    method: 'post',
    data
  })
}
