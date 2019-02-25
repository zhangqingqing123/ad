import request from '@/utils/request'

export function listOrder(query) {
  return request({
    url: '/order/list',
    method: 'get',
    params: query
  })
}

export function detailOrder(id) {
  return request({
    url: '/order/detail',
    method: 'get',
    params: { id }
  })
}

export function shipOrder(data) {
  return request({
    url: '/order/ship',
    method: 'post',
    data
  })
}

export function refundOrder(data) {
  return request({
    url: '/order/refund',
    method: 'post',
    data
  })
}

//今日订单
export function todayOrderNum() {
  return request({
    url: '/data/order/countTodayOrders',
    method: 'get'
  })
}

export function historyOrderStatistics(data) {
  return request({
    url: '/data/order/countHistoryOrders',
    method: 'post',
    data
  })
}