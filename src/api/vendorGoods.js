import request from '@/utils/request'

export function listGoods(query) {
  return request({
    url: '/goods/list',
    method: 'get',
    params: query
  })
}

export function listVendorGoods(query) {
  return request({
    url: '/vendorgoods/list',
    method: 'get',
    params: query
  })
}

export function addVendorGoods(data){
	return request({
		url:'/vendorgoods/add',
		method:'post',
		data
	})
}

export function deleteVendorGoods(data){
	return request({
		url:'/vendorgoods/delete',
		method:'post',
		data
	})
}

export function detailSpecification(query) {
  return request({
    url: '/goods/detail',
    method: 'get',
    params: query
  })
}