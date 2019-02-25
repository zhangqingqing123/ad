import request from '@/utils/request'

export function listModelpic(data) {
  return request({
    url: '/item/picture/template/list',
    method: 'post',
    data
  })
}

export function addModelpic(data) {
return request({
    url: '/item/picture/template/add',
    method: 'post',
    data
 })
}

export function deleteModelpic(data) {
return request({
    url: '/item/picture/template/delete',
    method: 'post',
    data
 })
}