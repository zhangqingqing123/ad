import request from '@/utils/request'
//论坛评论
export function listForum(data) {
  return request({
    url: '/post/list',
    method: 'post',
	data
  })
}

export function listForumDetail(id) {
  return request({
    url: '/post/detail'+'/'+id,
    method: 'get'
  })
}

export function listForumDelete(data) {
  return request({
    url: '/post/delete',
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