import request from '@/utils/request'

export function listAd(query) {
  return request({
    url: '/order/itemlist',
    method: 'get',
    params: query
  })
}

export function createAd(data) {
  return request({
    url: '/ad/create',
    method: 'post',
    data
  })
}

export function readAd(data) {
  return request({
    url: '/ad/read',
    method: 'get',
    data
  })
}

export function updateAd(data) {
  return request({
    url: '/ad/update',
    method: 'post',
    data
  })
}

export function deleteAd(data) {
  return request({
    url: '/ad/delete',
    method: 'post',
    data
  })
}
//發貨狀態
export function updateordertype(data) {
  return request({
    url: '/order/updateordertype',
    method: 'post',
    data
  })
}

//订单号码查询
export function searchIdentifiers(query) {
  return request({
    url: '/order/searchIdentifiers',
    method: 'get',
    params: query
  })
}

