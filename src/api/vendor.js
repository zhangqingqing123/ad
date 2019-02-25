import request from '@/utils/request'

export function listVendor(query) {
  return request({
    url: '/vendor/list',
    method: 'get',
    params: query
  })
}

export function createVendor(data) {
  return request({
    url: '/vendor/create',
    method: 'post',
    data
  })
}

export function readVendor(data) {
  return request({
    url: '/vendor/read',
    method: 'get',
    data
  })
}

export function updateVendor(data) {
  return request({
    url: '/vendor/update',
    method: 'post',
    data
  })
}

export function deleteVendor(data) {
  return request({
    url: '/vendor/delete',
    method: 'post',
    data
  })
}

export function regionVendor(query) {
  return request({
    url: '/region/get',
    method: 'get',
    params:query
  })
}


export function getByPidVendor(query) {
  return request({
    url: '/region/getByPid',
    method: 'get',
    params:query
  })
}

