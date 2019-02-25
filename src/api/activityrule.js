import request from '@/utils/request'

export function readRule(query) {
  return request({
    url: '/activityrule/read',
    method: 'get',
    params: query
  })
}

export function updateRule(data) {
  return request({
    url: '/activityrule/update',
    method: 'post',
    data
  })
}
