import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [{
		path: '/login',
		component: _import('login/index'),
		hidden: true
	},
	{
		path: '/404',
		component: _import('error/404'),
		hidden: true
	},
	{
		path: '/401',
		component: _import('error/401'),
		hidden: true
	},
	{
		path: '',
		component: Layout,
		redirect: 'dashboard',
		children: [{
			path: 'dashboard',
			component: _import('dashboard/index'),
			name: 'dashboard',
			meta: {
				title: '首页',
				icon: 'dashboard',
				noCache: true
			}
		}]
	}
]

export default new Router({
	// mode: 'history', // require service support
	scrollBehavior: () => ({
		y: 0
	}),
	routes: constantRouterMap
})

export const asyncRouterMap = [{
		path: '/systemanagement',
		component: Layout,
		redirect: 'noredirect',
		name: 'systemanagementManage',
		meta: {
			title: '系统管理',
			icon: 'config',
			permission: 'sys',
			type: 1
		},
		children: [{
				path: 'index',
				component: _import('systemanagement/index'),
				name: 'index',
				meta: {
					title: '角色管理',
					permission: 'sys:index',
					type: 2,
					noCache: true
				}
			},
			//      { path: 'addsystemanagement', component: _import('systemanagement/addsystemanagement'), name: 'addsystemanagement', meta: { title: '创建角色',type:2, noCache: true },hidden: true},
			{
				path: 'power',
				component: _import('systemanagement/power'),
				name: 'power',
				meta: {
					title: '权限管理',
					permission: 'sys:power',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'user',
				component: _import('systemanagement/user'),
				name: 'user',
				meta: {
					title: '系统用户',
					permission: 'sys:user',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'partner',
				component: _import('systemanagement/partner'),
				name: 'partner',
				meta: {
					title: '合伙人',
					permission: 'sys:partner',
					type: 2,
					noCache: true
				}
			}

		]
	},
	{
		path: '/user',
		component: Layout,
		redirect: 'noredirect',
		name: 'userManage',
		meta: {
			title: '用户管理',
			icon: 'peoples',
			permission: 'user',
			type: 1
		},
		children: [{
				path: 'user',
				component: _import('user/user'),
				name: 'user',
				meta: {
					title: '用户管理列表',
					permission: 'user:user',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'detail',
				component: _import('user/detail'),
				name: 'detail',
				meta: {
					title: '用户详情',
					permission: 'user:detail',
					type: 2,
					noCache: true
				},
				hidden: true
			},
			{
				path: 'address',
				component: _import('user/address'),
				name: 'address',
				meta: {
					title: '收货地址',
					permission: 'user:address',
					type: 2,
					noCache: true
				},
				hidden: true
			}
			//{ path: 'collect', component: _import('user/collect'), name: 'collect', meta: { title: '会员收藏',permission:'user:collection',type:2, noCache: true }},
			//{ path: 'footprint', component: _import('user/footprint'), name: 'footprint', meta: { title: '会员足迹',permission:'user:footprint',type:2, noCache: true }},
			//{ path: 'history', component: _import('user/history'), name: 'history', meta: { title: '搜索历史',permission:'user:history',type:2, noCache: true }}
		]
	},

	{
		path: '/mall',
		component: Layout,
		redirect: 'noredirect',
		name: 'mallManage',
		meta: {
			title: '商家管理',
			icon: 'shop',
			permission: 'mall',
			type: 1
		},
		children: [{
				path: 'shop',
				component: _import('mall/shop'),
				name: 'shopList',
				meta: {
					title: '商家管理列表',
					permission: 'mall:shopList',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'shopdetail',
				component: _import('mall/shopdetail'),
				name: 'shopdetail',
				meta: {
					title: '商家管理详情',
					permission: 'mall:shopdetail',
					type: 2,
					noCache: true
				},
				hidden: true
			},
			{
				path: 'apply',
				component: _import('mall/apply'),
				name: 'apply',
				meta: {
					title: '商家申请列表',
					permission: 'mall:apply',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'applydetail',
				component: _import('mall/applydetail'),
				name: 'applydetail',
				meta: {
					title: '商家申请详情',
					permission: 'mall:applydetail',
					type: 2,
					noCache: true
				},
				hidden: true
			},

			{
				path: 'create',
				component: _import('mall/create'),
				name: 'mallcreate',
				meta: {
					title: '新建商家',
					permission: 'mall:mallcreate',
					type: 2,
					noCache: true
				},
				hidden: true
			},
			{
				path: 'edit',
				component: _import('mall/edit'),
				name: 'edit',
				meta: {
					title: '编辑',
					permission: 'mall:edit',
					type: 2,
					noCache: true
				},
				hidden: true
			},
			{
				path: 'examine',
				component: _import('mall/examine'),
				name: 'examine',
				meta: {
					title: '查看',
					permission: 'mall:examine',
					type: 2,
					noCache: true
				},
				hidden: true
			},
			{
				path: 'examineShop',
				component: _import('mall/examineShop'),
				name: 'examineShop',
				meta: {
					title: '查看商家',
					permission: 'mall:examineShop',
					type: 2,
					noCache: true
				},
				hidden: true
			},

			{
				path: 'order',
				component: _import('mall/order'),
				name: 'order',
				meta: {
					title: '订单管理',
					permission: 'mall:order',
					type: 2,
					noCache: true
				},
				hidden: true
			},
			{
				path: 'issue',
				component: _import('mall/issue'),
				name: 'issue',
				meta: {
					title: '通用问题',
					permission: 'mall:issue',
					type: 2,
					noCache: true
				},
				hidden: true
			},
			{
				path: 'keyword',
				component: _import('mall/keyword'),
				name: 'keyword',
				meta: {
					title: '关键词',
					permission: 'mall:keyword',
					type: 2,
					noCache: true
				},
				hidden: true
			},
			{
				path: 'map',
				component: _import('mall/map'),
				name: 'map',
				meta: {
					title: '地图控件',
					//permission: 'mall:map',
					type: 2,
					noCache: true
				},
				hidden: true
			},
		]
	},

	{
		path: '/goods',
		component: Layout,
		redirect: 'noredirect',
		name: 'goodsManage',
		meta: {
			title: '商品管理',
			icon: 'goods',
			permission: 'goods',
			type: 1
		},
		children: [{
				path: 'list',
				component: _import('goods/list'),
				name: 'goodsList',
				meta: {
					title: '禅茶素材列表',
					permission: 'goods:list',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'add',
				component: _import('goods/add'),
				name: 'add',
				meta: {
					title: '添加禅茶素材',
					permission: 'goods:add',
					type: 2,
					noCache: true
				},
				hidden: true
			},
			{
				path: 'amendGood',
				component: _import('goods/amendGood'),
				name: 'amendGood',
				meta: {
					title: '修改禅茶素材',
					permission: 'goods:amendGood',
					type: 2,
					noCache: true
				},
				hidden: true
			},

			{
				path: 'goodstype',
				component: _import('goods/goodstype'),
				name: 'goodstype',
				meta: {
					title: '禅茶素材类型管理',
					permission: 'goods:goodstype',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'goodscategory',
				component: _import('goods/goodscategory'),
				name: 'goodscategory',
				meta: {
					title: '禅茶素材分类管理',
					permission: 'goods:goodscategory',
					type: 2,
					noCache: true
				}
			},
			
			{
				path: 'hotSearch',
				component: _import('goods/hotSearch'),
				name: 'hotSearch',
				meta: {
					title: '热门商品管理',
					permission: 'goods:hotSearch',
					type: 2,
					noCache: true
				}
			},

			

			{
				path: 'food',
				component: _import('goods/food'),
				name: 'food',
				meta: {
					title: '素食餐厅申请列表',
					permission: 'goods:food',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'foodCreate',
				component: _import('goods/foodCreate'),
				name: 'foodCreate',
				meta: {
					title: '添加素食',
					permission: 'goods:foodCreate',
					type: 2,
					noCache: true
				},
				hidden: true
			},
			{
				path: 'foodEdit',
				component: _import('goods/foodEdit'),
				name: 'foodEdit',
				meta: {
					title: '素食餐厅详情',
					permission: 'goods:foodEdit',
					type: 2,
					noCache: true
				},
				hidden: true
			},

			{
				path: 'homestay',
				component: _import('goods/homestay'),
				name: 'homestay',
				meta: {
					title: '精品民宿申请列表',
					permission: 'goods:homestay',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'homestayCreate',
				component: _import('goods/homestayCreate'),
				name: 'homestayCreate',
				meta: {
					title: '添加民宿',
					permission: 'goods:homestayCreate',
					type: 2,
					noCache: true
				},
				hidden: true
			},
			{
				path: 'homestayEdit',
				component: _import('goods/homestayEdit'),
				name: 'homestayEdit',
				meta: {
					title: '精品民宿详情',
					permission: 'goods:homestayEdit',
					type: 2,
					noCache: true
				},
				hidden: true
			},

			{
				path: 'collection',
				component: _import('goods/collection'),
				name: 'collection',
				meta: {
					title: '投资收藏列表',
					permission: 'goods:collection',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'collectionCreate',
				component: _import('goods/collectionCreate'),
				name: 'collectionCreate',
				meta: {
					title: '添加投资收藏',
					permission: 'goods:collectionCreate',
					type: 2,
					noCache: true
				},
				hidden: true
			},
			{
				path: 'collectionEdit',
				component: _import('goods/collectionEdit'),
				name: 'collectionEdit',
				meta: {
					title: '投资收藏编辑',
					permission: 'goods:collectionEdit',
					type: 2,
					noCache: true
				},
				hidden: true
			},

			{
				path: 'colloctcertificate',
				component: _import('goods/colloctcertificate'),
				name: 'colloctcertificate',
				meta: {
					title: '投资收藏证书模板',
					permission: 'goods:colloctcertificate',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'collocttype',
				component: _import('goods/collocttype'),
				name: 'collocttype',
				meta: {
					title: '投资收藏种类',
					permission: 'goods:collocttype',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'modelpic',
				component: _import('goods/modelpic'),
				name: 'modelpic',
				meta: {
					title: '商品模板图片',
					permission: 'goods:modelpic',
					type: 2,
					noCache: true
				}
			},
		]
	},
	{
		path: '/promotion',
		component: Layout,
		redirect: 'noredirect',
		name: 'promotionManage',
		meta: {
			title: '订单管理',
			icon: 'ad',
			permission: 'ad',
			type: 1
		},
		//添加权限 topic
		children: [{
				path: 'adlist',
				component: _import('promotion/ad'),
				name: 'adlist',
				meta: {
					title: '禅茶素材订单',
					permission: 'ad:adlist',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'topic',
				component: _import('promotion/topic'),
				name: 'topic',
				meta: {
					title: '素食餐厅订单',
					permission: 'ad:topic',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'homestays',
				component: _import('promotion/homestays'),
				name: 'homestays',
				meta: {
					title: '精品民宿订单',
					permission: 'ad:homestays',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'Investment',
				component: _import('promotion/Investment'),
				name: 'Investment',
				meta: {
					title: '投资收藏转让订单',
					permission: 'ad:Investment',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'delivery',
				component: _import('promotion/delivery'),
				name: 'delivery',
				meta: {
					title: '投资收藏转让提货',
					permission: 'ad:delivery',
					type: 2,
					noCache: true
				}
			}
		]
	},
	{
		path: '/contents',
		component: Layout,
		redirect: 'noredirect',
		name: 'contentsManage',
		meta: {
			title: '内容管理',
			icon: 'icon',
			permission: 'contents',
			type: 1
		},
		//添加权限 topic
		children: [{
				path: 'banner',
				component: _import('contents/banner'),
				name: 'banner',
				meta: {
					title: 'banner管理',
					permission: 'contents:banner',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'recommendgoods',
				component: _import('contents/recommendgoods'),
				name: 'recommendgoods',
				meta: {
					title: '推荐商品管理',
					permission: 'contents:recommendgoods',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'information',
				component: _import('contents/information'),
				name: 'information',
				meta: {
					title: '资讯管理',
					permission: 'contents:information',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'informationtype',
				component: _import('contents/informationtype'),
				name: 'informationtype',
				meta: {
					title: '资讯类型管理',
					permission: 'contents:infotype',
					type: 2,
					noCache: true
				}
			},

			{
				path: 'forum',
				component: _import('contents/forum'),
				name: 'forum',
				meta: {
					title: '论坛管理',
					permission: 'contents:forum',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'forumdetail',
				component: _import('contents/forumdetail'),
				name: 'forumdetail',
				meta: {
					title: '论坛详情',
					permission: 'contents:forumdetail',
					type: 2,
					noCache: true
				},
				hidden: true
			},

			{
				path: 'activity',
				component: _import('contents/activity'),
				name: 'activity',
				meta: {
					title: '活动管理',
					permission: 'contents:activity',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'online',
				component: _import('contents/online'),
				name: 'online',
				meta: {
					title: '线上活动',
					permission: 'contents:online',
					type: 2,
					noCache: true
				},
				hidden: true
			},
			{
				path: 'underline',
				component: _import('contents/underline'),
				name: 'underline',
				meta: {
					title: '线下活动',
					permission: 'contents:underline',
					type: 2,
					noCache: true
				},
				hidden: true
			},
			// { path: 'usercomment', component: _import('contents/usercomment'), name: 'usercomment', meta: { title: '用户评论管理',permission:'ad:topic',type:2, noCache: true }},
			//{ path: 'goodscomment', component: _import('contents/goodscomment'), name: 'goodscomment', meta: { title: '商品评论管理',permission:'ad:topic',type:2, noCache: true }},
			{
				path: 'ordercomment',
				component: _import('contents/ordercomment'),
				name: 'ordercomment',
				meta: {
					title: '商品评论管理',
					permission: 'contents:ordercomment',
					type: 2,
					noCache: true
				}
			},

			{
				path: 'integral',
				component: _import('contents/integral'),
				name: 'integral',
				meta: {
					title: '积分管理',
					permission: 'contents:integral',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'integrallist',
				component: _import('contents/integrallist'),
				name: 'integrallist',
				meta: {
					title: '积分列表',
					permission: 'contents:integrallist',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'distribution',
				component: _import('contents/distribution'),
				name: 'distribution',
				meta: {
					title: '分销管理',
					permission: 'contents:distribution',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'cards',
				component: _import('contents/cards'),
				name: 'cards',
				meta: {
					title: '兑换卡管理',
					permission: 'contents:cards',
					type: 2,
					noCache: true
				}
			}
		]
	},
	{
		//添加过权限 finance
		path: '/finance',
		component: Layout,
		redirect: 'noredirect',
		name: 'financeManage',
		meta: {
			title: '财务管理',
			icon: 'money',
			permission: 'finance',
			type: 1
		},
		children: [{
				path: 'examine',
				component: _import('finance/examine'),
				name: 'financeExamine',
				meta: {
					title: '用户提现',
					permission: 'finance:financeExamine',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'business',
				component: _import('finance/business'),
				name: 'financeBusiness',
				meta: {
					title: '商家提现',
					permission: 'finance:financeBusiness',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'abnormal',
				component: _import('finance/abnormal'),
				name: 'financeAbnormal',
				meta: {
					title: '流水积分',
					permission: 'finance:financeExamine',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'branch',
				component: _import('finance/branch'),
				name: 'branch',
				meta: {
					title: '商户分销记录',
					permission: 'finance:branch',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'stream',
				component: _import('finance/stream'),
				name: 'financeStream',
				meta: {
					title: '平台资金流水',
					permission: 'finance:financeStream',
					type: 2,
					noCache: true
				}
			}
		]
	},
	{
		path: '/sys',
		component: Layout,
		redirect: 'noredirect',
		name: 'sysManage',
		meta: {
			title: '数据管理',
			icon: 'data',
			permission: 'sysManage',
			type: 1
		},
		//添加过 店铺管理
		children: [{
				path: 'data',
				component: _import('sys/data'),
				name: 'data',
				meta: {
					title: '数据管理列表',
					permission: 'sysManage:data',
					type: 2,
					noCache: true
				},
				hidden: true
			},
			{
				path: 'os',
				component: _import('sys/os'),
				name: 'os',
				meta: {
					title: '对象存储',
					permission: 'sysManage:os',
					type: 2,
					noCache: true
				}
			},
			{
				path: 'ordertoday',
				component: _import('sys/orderToday'),
				name: 'ordertoday',
				meta: {
					title: '今日订单量',
					permission: 'sysManage:ordertoday',
					type: 2,
					noCache: true
				},
				hidden: true
			},
			{
				path: 'salesTotal',
				component: _import('sys/salesTotal'),
				name: 'salesTotal',
				meta: {
					title: '销售额',
					permission: 'sysManage:salesTotal',
					type: 2,
					noCache: true
				},
				hidden: true
			},
			{
				path: 'role',
				component: _import('sys/role'),
				name: 'role',
				meta: {
					title: '数据管理列表',
					permission: 'sysManage:role',
					type: 2,
					noCache: true
				},
				hidden: true
			},
		]
	},
	{
		path: '*',
		redirect: '/404',
		hidden: true
	}
]