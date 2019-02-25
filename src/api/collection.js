import request from '@/utils/request'

export function listCollect(data) {
  return request({
    url: '/collect/list',
    method: 'post',
    data
  })
}

export function deletCollect(data) {
  return request({
    url: '/collect/delete',
    method: 'post',
    data
  })
}

export function displayCollect(data) {
  return request({
    url: '/collect/display',
    method: 'post',
    data
  })
}

export function templateCollect(data) {
  return request({
    url: '/collect/cert/template/list',
    method: 'post',
    data
  })
}
//collectionCreate

export function collectionCreate(data) {
  return request({
    url: '/collect/add',
    method: 'post',
    data
  })
}

export function detailItemCollection(id) {
  return request({
    url: '/collect/detail'+'/'+id,
    method: 'get'
  })
}

export function categoryListCollection(data) {
  return request({
    url: '/item/category/list',
    method: 'post',
    data
  })
}

export function categoryAddCollection(data) {
  return request({
    url: '/item/category/add',
    method: 'post',
    data
  })
}

export function cateTypeListCollection() {
  return request({
    url: '/item/cateType/list',
    method: 'get'
  })
}

export function categorydeleteCollection(data) {
  return request({
    url: '/item/category/delete',
    method: 'post',
    data
  })
}
//获取历史藏品价格
export function collectPriceList(data) {
  return request({
    url: '/collect/collectPrice/list',
    method: 'post',
    data
  })
}
export function collectPricedelete(data) {
  return request({
    url: '/collect/collectPrice/delete',
    method: 'post',
    data
  })
}
export function collectPriceadd(data) {
  return request({
    url: '/collect/collectPrice/add',
    method: 'post',
    data
  })
}