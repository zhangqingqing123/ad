import request from '@/utils/request'

export function listInformation(data) {
  return request({
    url: '/information/list',
    method: 'post',
    data
  })
}

export function deleteInformation(data) {
  return request({
    url: '/information/delete',
    method: 'post',
    data
  })
}

export function displayInformation(data) {
  return request({
    url: '/information/display',
    method: 'post',
    data
  })
}

export function addInformation(data) {
  return request({
    url: '/information/add',
    method: 'post',
    data
  })
}


export function detailInformation(id) {
  return request({
    url: '/information/'+id+'/detail',
    method: 'get'
  })
}

export function typeListInformation(data) {
  return request({
    url: '/information/type/list',
    method: 'post',
    data
  })
}
export function typeAddInformation(data) {
  return request({
    url: '/information/type/add',
    method: 'post',
    data
  })
}
export function typeDeleteInformation(data) {
  return request({
    url: '/information/type/delete',
    method: 'post',
    data
  })
}
export function typeDisplayInformation(data) {
  return request({
    url: '/information/type/display',
    method: 'post',
    data
  })
}

export function listcateType() {
  return request({
    url: '/item/cateType/list',
    method: 'get'
  })
}


//活动管理
export function listActivity(data) {
  return request({
    url: '/activity/list',
    method: 'post',
    data
  })
}

export function listItem(data) {
  return request({
    url: '/item/list',
    method: 'post',
    data
  })
}

export function shoplistItem() {
  return request({
    url: '/user/shopList/'+ 2,
    method: 'get'
  })
}

export function addActivity(data) {
  return request({
    url: '/activity/add',
    method: 'post',
    data
  })
}

export function deleteActivity(data) {
  return request({
    url: '/activity/delete',
    method: 'post',
    data
  })
}

export function detailcateType(id) {
  return request({
    url: '/activity/detail/'+id,
    method: 'get'
  })
}



//兑换卡
export function listcard(data) {
  return request({
    url: '/exchangeCard/list',
    method: 'post',
    data
  })
}

export function addCard(data) {
  return request({
    url: '/exchangeCard/add',
    method: 'post',
    data
  })
}

export function deleCard(id) {
  return request({
    url: '/exchangeCard/del/'+id,
    method: 'get'
  })
}


//新闻上架
export function displayGoods(data) {
  return request({
    url: '/information/display',
    method: 'post',
    data
  })
}