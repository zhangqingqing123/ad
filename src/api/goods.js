import request from '@/utils/request'

export function listGoods(data) {
  return request({
    url: '/veg/list',
    method: 'post',
    data
  })
}

export function publishGoods(data) {
  return request({
    url: '/veg/add',
    method: 'post',
    data
  })
}

export function listArea(data) {
  return request({
    url: '/user/getArea',
    method: 'get'
  })
}

export function listShop(data) {
  return request({
    url: '/user/shopList/2',
    method: 'get'
  })
}



export function addListGoods(data) {
  return request({
    url: '/item/add',
    method: 'post',
    data
  })
}

export function deleteGoods(data) {
  return request({
    url: '/veg/delete',
    method: 'post',
    data
  })
}

//素食上下架
export function displayGoods(data) {
  return request({
    url: '/veg/display',
    method: 'post',
    data
  })
}
//查看素食详情
export function detailGoods(id) {
  return request({
    url: '/veg/detail'+'/'+id,
    method: 'get',
    //params:{id}
  })
}

//素食审核
export function vegExamine(data) {
  return request({
    url: '/veg/update',
    method: 'post',
    data
  })
}








export function editGoods(data) {
  return request({
    url: '/goods/update',
    method: 'post',
    data
  })
}

export function listCatAndBrand() {
  return request({
    url: '/goods/catAndBrand',
    method: 'get'
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



//内容管理api  wsz---0925；
//添加推荐产品  列表
export function listRecommendedGoods(data) {
  return request({
    url: '/item/recommend/list',
    method: 'post',
    data
  })
}
//查询推荐商品列表  /admin/item/recommend/addlist addRecommendedGoods
export function addListRecommendedGoods(data){
	return request({
		url:'/item/recommend/addlist',
		method:'post',
		data
	})
}
//添加/admin/item/recommend/add
export function addRecommendedGoods(data) {
  return request({
    url: '/item/recommend/add',
    method: 'post',
    data
  })
}
//禁用
export function changeRecommendedGoods(data) {
  return request({
    url: '/item/recommend/display',
    method: 'post',
    data
  })
}
//删除
export function deleteRecommendedGoods(data) {
  return request({
    url: '/item/recommend/delete',
    method: 'post',
    data
  })
}








//商品管理Item Controller api；wsz---0925；
//列表
export function listItemGoods(data) {
  return request({
    url: '/item/list',
    method: 'post',
    data
  })
}
//添加  
export function addItemGoods(data) {
  return request({
    url: '/item/category/sub/add',
    method: 'post',
    data
  })
}
//详情
export function detailItemGoods(id) {
  return request({
    url: '/item/detail/'+id,
    method: 'get'
  })
}
//查询商品种类 /admin/item/cateType/list
export function getItems() {
  return request({
    url: '/item/cateType/list',
    method: 'get',
    params: {  }
  })
}
//查询商品类型
export function gitCategory(data) {
  return request({
    url: '/item/category/list',
    method: 'post',
    data
  })
}
//查询商品类目
export function getTypes(data) {
  return request({
    url: '/item/category/sub/list',
    method: 'post',
    data
  })
}
//获取所属商家
export function getRole() {
  return request({
    url: '/user/shopList/2',
    method: 'get',
    params: {  }
  })
}
//删除商品
export function deleteItemGoods(data) {
  return request({
    url: '/item/delete',
    method: 'post',
    data
  })
}
//上下架商品
export function displayItemGoods(data) {
  return request({
    url: '/item/display',
    method: 'post',
    data
  })
}
//查询单个商品详情；
export function getGoodsDetail(id) {
  return request({
    url: '/item/detail/'+id,
    method: 'get',
    //params: { id }
  })
}

