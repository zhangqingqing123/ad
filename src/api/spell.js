import request from '@/utils/request'

export function listSpell(query) {
  return request({
    url: '/spell/list',
    method: 'get',
    params: query
  })
}

export function createSpell(data) {
  return request({
    url: '/spell/create',
    method: 'post',
    data
  })
}

export function readSpell(data) {
  return request({
    url: '/spell/read',
    method: 'get',
    data
  })
}

export function updateSpell(data) {
  return request({
    url: '/spell/update',
    method: 'post',
    data
  })
}

export function deleteSpell(data) {
  return request({
    url: '/spell/delete',
    method: 'post',
    data
  })
}


//积分管理
export function readIntergral() {
  return request({
    url: '/systemConfig/getSystemConfig',
    method: 'get'   
  })
}

export function updateIntergral(data) {
  return request({
    url: '/systemConfig/update',
    method: 'post',
    data
  })
}

//积分列表

export function scoreRecordIntergral(data) {
  return request({
    url: '/user/scoreRecordList',
    method: 'post',
    data
  })
}

//分销管理
export function readDistribution() {
  return request({
    url: '/systemConfig/getDistributionConfig',
    method: 'get'   
  })
}
