import request from '@/utils/request'

export function listCategory(data) {
  return request({
    url: '/item/category/list',
    method: 'post',
    data
  })
}

export function createCategory(data) {
return request({
    url: '/item/category/add',
    method: 'post',
    data
})
}

export function deleteCategory(data) {
	return request({
	  url: '/item/category/delete',
	  method: 'post',
	  data
	})
}

export function listsSub(data){
	return request({
		url:'/item/category/sub/list',
		method:'post',
		data
	})
}

export function addSub(data){
	return request({
		url:'/item/category/sub/add',
		method:'post',
		data
	})
}

export function deleteSub(data){
	return request({
		url:'/item/category/sub/delete',
		method:'post',
		data
	})
}
//热门搜索
export function hotSearchadd(data){
	return request({
		url:'/hotSearch/add',
		method:'post',
		data
	})
}
export function hotSearchdel(id) {
  return request({
    url: '/hotSearch/del/'+id,
    method: 'get',
    //params: query
  })
}
export function getHotSearchList(query) {
  return request({
    url: '/hotSearch/getHotSearchList',
    method: 'get',
    params: query
  })
}