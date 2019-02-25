import request from '@/utils/request'

export function listShopdraw(query) {
  return request({
    url: '/shopdraw/list',
    method: 'get',
    params: query
  })
}

export function createShopdraw(data) {
  return request({
    url: '/shopdraw/create',
    method: 'post',
    data
  })
}

export function readShopdraw(id) {
return request({
    url: '/shopdraw/read',
    method: 'get',
    params: { id }
})
}
///admin/finance/changeStateAudited/{reflectId}
export function updateShopdraw(reflectId) {
return request({
    url: '/finance/changeStateAudited/'+reflectId,
    method: 'get',
    //data
})
}
///admin/finance/changeStateRefused/{reflectId}
export function changeStateRefused(reflectId) {
return request({
    url: '/finance/changeStateRefused/'+reflectId,
    method: 'get',
    //data
})
}

export function deleteShopdraw(data) {
  return request({
    url: '/shopdraw/delete',
    method: 'post',
    data
  })
}

//用户提现 wsz---1011
export function getReflectList(data) {
  return request({
    url: '/finance/getReflectList',
    method: 'post',
    data
  })
}
export function getBalanceRecordList(data) {
  return request({
    url: '/finance/getBalanceRecordList',
    method: 'post',
    data
  })
}
export function balancePlatformRecordList(data) {
return request({
    url: '/finance/balancePlatformRecordList',
    method: 'post',
    data
})
}
export function shopDistributionRecordList(data) {
return request({
    url: '/finance/shopDistributionRecord',
    method: 'post',
    data
})
}


//积分流水
export function scoreRecordListList(data) {
return request({
    url: '/user/scoreRecordList',
    method: 'post',
    data
})
}