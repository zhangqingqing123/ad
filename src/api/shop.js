import request from '@/utils/request'

export function userAuthList(data) {
  return request({
    url: '/user/userAuthList',
    method: 'post',
    data
  })
}

export function userAuthDetail(userAuthId) {
  return request({
    url: '/user/userAuthDetail'+'/'+userAuthId,   
    method: 'get'
  })
}

export function addUserList(data) {
  return request({
    url: '/user/addShop',
    method: 'post',
    data
  })
}

export function editUserList(data) {
  return request({
    url: '/user/editShop',
    method: 'post',
    data
  })
}

//省市区
export function getAreaList() {
  return request({
    url: '/user/getArea',
    method: 'get'
  })
}

export function referrerList() {
  return request({
    url: '/user/shopList/4',
    method: 'get'
  })
}

//详情商品列表
export function goodsList(data) {
  return request({
    url: '/item/list',
    method: 'post',
    data
  })
}

//详情订单
export function listOrder(query) {
  return request({
    url: '/order/itemlist',
    method: 'get',
    params: query
  })
}

//详情分销
export function shareUserList(data) {
  return request({
    url: '/user/shopShareUserList',
    method: 'post',
    data
  })
}

//审核

export function shopAuditUser(data) {
  return request({
    url: '/user/shopAudit',
    method: 'post',
    data
  })
}
export function getLatlog(address) {
  return request({
    url: 'http://api.map.baidu.com/geocoder/v2/?ak=eIxDStjzbtH0WtU50gqdXYCz&output=json&address='+(address),
    method: 'get'
  })
}