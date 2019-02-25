import request from '@/utils/request'

export function listComment(query) {
  return request({
    url: '/comment/list',
    method: 'get',
    params: query
  })
}

export function createComment(data) {
  return request({
    url: '/comment/create',
    method: 'post',
    data
  })
}

export function readComment(data) {
  return request({
    url: '/comment/read',
    method: 'get',
    data
  })
}

export function updateComment(data) {
  return request({
    url: '/comment/update',
    method: 'post',
    data
  })
}

export function deleteComment(data) {
  return request({
    url: '/comment/delete',
    method: 'post',
    data
  })
}

//订单评论
export function listForumOrder(data) {
  return request({
    url: '/orderComment/list',
    method: 'post',
    data
  })
}

export function listForumOrderDelete(id) {
  return request({
    url: '/orderComment/delete'+'/'+id,
    method: 'post',
    id
  })
}

export function listForumOrderReply(data) {
  return request({
    url: '/orderComment/reply',
    method: 'post',
    data
  })
}