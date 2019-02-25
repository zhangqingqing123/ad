import request from '@/utils/request'

export function listBargain(query) {
  return request({
    url: '/bargain/list',
    method: 'get',
    params: query
  })
}

export function addBargain(data) {
  return request({
    url: '/bargain/addBargain',
    method: 'post',
    data
  })
}

export function deleteBargain(data) {
  return request({
    url: '/bargain/delBargain',
    method: 'post',
    data
  })
}

export function orderListBargain(query) {
  return request({
    url: '/bargain/orderList',
    method: 'get',
    params: query
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

