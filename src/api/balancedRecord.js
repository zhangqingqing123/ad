import request from '@/utils/request'

export function listRecord(query) {
  return request({
    url: '/balancedRecord/list',
    method: 'get',
    params: query
  })
}

