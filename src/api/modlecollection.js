import request from '@/utils/request'


export function listCollect(data) {
  return request({
    url: '/collect/cert/template/list',
    method: 'post',
    data
  })
}

export function addCollect(data) {
  return request({
    url: '/collect/cert/template/add',
    method: 'post',
    data
  })
}

export function deleteCollect(data) {
  return request({
    url: '/collect/cert/template/delete',
    method: 'post',
    data
  })
}



