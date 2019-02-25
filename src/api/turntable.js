import request from '@/utils/request'

export function listTurntable(query) {
  return request({
    url: '/turntable/list',
    method: 'get',
    params: query
  })
}

export function createTurntable(data) {
  return request({
    url: '/turntable/create',
    method: 'post',
    data
  })
}

export function deleteTurntable(data) {
  return request({
    url: '/turntable/delete',
    method: 'post',
    data
  })
}

export function readTurntable(data) {
  return request({
    url: '/turntable/read',
    method: 'get',
    data
  })
}

export function updateTurntable(data) {
  return request({
    url: '/turntable/update',
    method: 'post',
    data
  })
}

export function openTurntable(data) {
  return request({
    url: '/turntable/openturntable',
    method: 'post',
    data
  })
}

export function checkstateTurntable(data) {
  return request({
    url: '/turntable/checkstate',
    method: 'get',
    data
  })
}
