import request from '@/utils/request'

export function listCoupons(query) {
  return request({
    url: '/voucher/list',
    method: 'get',
    params: query
  })
}

export function detailCoupons(query) {
  return request({
    url: '/voucher/read',
    method: 'get',
    params: query
  })
}

export function updateCoupons(data) {
  return request({
    url: '/voucher/update',
    method: 'post',
    data
  })
}