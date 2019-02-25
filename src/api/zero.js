import request from '@/utils/request'

//获取列表
export function listZero(query) {
  return request({
    url: '/purchase/list',
    method: 'get',
    params: query
  })
}
//添加；
export function addzero(data) {
  return request({
    url: '/purchase/create',
    method: 'post',
    data
  })
}
//删除
export function deleteZero(data) {
  return request({
    url: '/purchase/delete',
    method: 'post',
    data
  })
}
//详情
export function detailZero(query) {
  return request({
    url: '/purchase/read',
    method: 'get',
    params: query
  })
}
//更新
export function updateZero(data) {
  return request({
    url: '/purchase/update',
    method: 'post',
    data
  })
}
//获取规格id
export function getSpecificationId(query) {
  return request({
    url: '/goods/detail',
    method: 'get',
    params: query
  })
}


//banner管理 ----2018/09/29----wsz
export function bannerList(data) {
  return request({
    url: '/banner/list',
    method: 'post',
    data
  })
}
export function bannerRecover(id) {
  return request({
    url: '/banner/recover/'+id,
    method: 'post',
    //data
  })
}
export function bannerForbidden(id) {
  return request({
    url: '/banner/forbidden/'+id,
    method: 'post',
    //data
  })
}
export function bannerDel(id) {
  return request({
    url: '/banner/delete/'+id,
    method: 'post',
    //data
  })
}
export function bannerAdd(data) {
  return request({
    url: '/banner/add',
    method: 'post',
    data
  })
}