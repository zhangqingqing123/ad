import request from '@/utils/request'

export function listhomestay(data) {
  return request({
    url: '/room/list',
    method: 'post',
    data
  })
}


export function displayRoom(data) {
  return request({
    url: '/room/display',
    method: 'post',
    data
  })
}

export function deleteRoom(data) {
  return request({
    url: '/room/delete',
    method: 'post',
    data
  })
}

export function detailRoom(id) {
  return request({
    url: '/room/detail'+'/'+id,
    method: 'get',
    //params:{id}
  })
}

export function roomCreate(data) {
  return request({
    url: '/room/add',
    method: 'post',
    data
  })
}

//民宿审核
export function roomExamine(data) {
  return request({
    url: '/room/update',
    method: 'post',
    data
  })
}
