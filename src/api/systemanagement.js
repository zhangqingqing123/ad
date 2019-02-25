import request from '@/utils/request'

export function listRole(data) {
  return request({
    url: '/system/role/list',
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: '/system/role/delete',
    method: 'post',
    data
  })
}

export function addRole(data) {
  return request({
    url: '/system/role/add',
    method: 'post',
    data
  })
}

//权限管理
export function listPermission(data) {
  return request({
    url: '/system/permission/list',
    method: 'post',
    data
  })
}

export function deletePermission(data) {
  return request({
    url: '/system/permission/delete',
    method: 'post',
    data
  })
}

export function addPermission(data) {
  return request({
    url: '/system/permission/add',
    method: 'post',
    data
  })
}

export function editPermission(data) {
  return request({
    url: '/system/permission/update',
    method: 'post',
    data
  })
}

export function getPermisson(data) {
  return request({
    url: '/system/permission/list',
    method: 'post',
    data
  })
}

//获取权限1-2   wsz10-08
export function getRolePermisson01(data) {
  return request({
    url: '/system/role/permission/list',
    method: 'post',
    data
  })
}
export function getRolePermisson02(data) {
  return request({
    url: '/system/permission/list',
    method: 'post',
    data
  })
}
export function permissionAdd(data) {
  return request({
    url: '/system/role/permission/add',
    method: 'post',
    data
  })
}

export function fetchList(data) {
  return request({
    url: '/user/userList',
    method: 'post',
    data
  })
}
export function permissionUserAdd(data) {
  return request({
    url: '/system/role/user/add',
    method: 'post',
    data
  })
}

//查询角色用户
export function getpermissionUser(data) {
  return request({
    url: '/system/role/user/list',
    method: 'post',
    data
  })
}

//添加系统用户
export function addUserRole(data) {
  return request({
    url: '/user/addManager',
    method: 'post',
    data
  })
}

//添加合伙人

export function addPartnerRole(data) {
  return request({
    url: '/user/addPartner',
    method: 'post',
    data
  })
}
