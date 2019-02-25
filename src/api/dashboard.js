import {request, baseRequest} from '@/utils/request'

export function info(query) {
  return request({
    url: '/data/index',
    method: 'get',
    params: query
  })
}

export function getSysConfig(query) {
  return baseRequest({
    url: '/sysConfig/get',
    method: 'get',
    params: query
  })
}
