import request from '@/utils/request'

export function statUser(query) {
  return request({
    url: '/stat/user',
    method: 'get',
    params: query
  })
}

export function statOrder(query) {
  return request({
    url: '/stat/order',
    method: 'get',
    params: query
  })
}

export function statGoods(query) {
  return request({
    url: '/stat/goods',
    method: 'get',
    params: query
  })
}

//数据管理
//统计区域商户数据量
export function countAreaBusyUserCount(data) {
  return request({
    url: '/data/user/countAreaBusyUserCount',
    method: 'post',
    data
  })
}
//统计区域用户数据量
export function countAreaUserCount(data) {
  return request({
    url: '/data/user/countAreaUserCount',
    method: 'post',
    data
//  params: query
  })
}
//统计月活跃用户量
export function countMonthActiveUser(data) {
  return request({
    url: '/data/user/countMonthActiveUser',
    method: 'post',
    data
  })
}
//统计日活跃用户量
export function countTodayActiveUser(data) {
  return request({
    url: '/data/user/countTodayActiveUser',
    method: 'post',
    data
  })
}
//统计今日用户量
export function countTodayUser() {
  return request({
    url: '/data/user/countTodayUser',
    method: 'get'
//  params: query
  })
}
//统计用户数量
export function countUserCountByTime(data) {
  return request({
    url: '/data/user/countUserCountByTime',
    method: 'post',
    data
  })
}


//wsz 1017
//今日销售额;  //历史销售额统计;
export function countTodayAmount() {
  return request({
    url: '/data/order/countTodayAmount',
    method: 'get'
//  params: query
  })
}
//历史销售额统计;
export function countHistoryAmount(data) {
  return request({
    url: '/data/order/countTodayAmount',
    method: 'post',
    data
  })
}
//今日销售量；
//admin/data/order/countTodaySaleNum
export function countTodaySaleNum() {
  return request({
    url: '/data/order/countTodaySaleNum',
    method: 'get'
//  params: query
  })
}
///admin/data/order/countHistorySaleNum
//历史销售量统计
export function countHistorySaleNum(data) {
  return request({
    url: '/data/order/countHistorySaleNum',
    method: 'post',
    data
  })
}
///admin/data/order/countHistoryOrders历史订单量
export function countHistoryOrders(data) {
  return request({
    url: '/data/order/countHistoryOrders',
    method: 'post',
    data
  })
}
///admin/data/order/countTodayOrders统计今日订单量
export function countTodayOrders() {
  return request({
    url: '/data/order/countTodayOrders',
    method: 'get'
//  params: query
  })
}