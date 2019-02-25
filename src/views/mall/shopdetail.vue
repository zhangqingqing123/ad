<template>
	<div class="app-container calendar-list-container">

		<el-card class="box-card">
			<h3>商家基础信息</h3>
			<el-form :data="shopDetail" label-width="150px">
				<el-form-item label="商家名称">
					<span>{{shopDetail.name}}</span>
				</el-form-item>
				<el-form-item label="商家类型">
					<template>
						<el-tag :type="shopDetail.category==1 ? 'success' : shopDetail.category==2?'error':  shopDetail.category==3?'danger':shopDetail.category==4? 'warning': 'info' ">{{shopDetail.category==1 ? '精品民宿' : shopDetail.category==2?'素食餐厅':shopDetail.category==3?'禅茶素材':shopDetail.category==4?'投资收藏':'其他'}}</el-tag>
					</template>
				</el-form-item>
				<el-form-item label="联系人" prop="leader">
					<span>{{shopDetail.leader}}</span>
				</el-form-item>
				<el-form-item label="手机号码" prop="phone">
					<span>{{shopDetail.phone}}</span>
				</el-form-item>
				<el-form-item label="商家电话" prop="tel">
					<span>{{shopDetail.tel}}</span>
				</el-form-item>
				<el-form-item label="商家地址">
					<span>{{shopDetail.province}}-{{shopDetail.city}}-{{shopDetail.district}}</span>
				</el-form-item>
				<el-form-item label="详细地址" prop="address">
					<span>{{shopDetail.address}}</span>
				</el-form-item>
			</el-form>
		</el-card>

		<el-card class="box-card" :data='shopDetail' v-if="shopDetail.admissionProportion || shopDetail.distributionProportion">
			<h3>抽成比例</h3>
			<el-form>
				<h6>入驻平台抽成比例</h6>
				<el-form-item label="平台">
					<el-input v-model="shopDetail.admissionProportion" disabled>
					</el-input>
				</el-form-item>
				<!--<el-form-item label="商户" >
     					<el-input ></el-input>
     			</el-form-item>-->
			</el-form>
			<el-form>
				<h6>推荐用户分销比例</h6>
				<el-form-item label="平台">
					<el-input v-model="shopDetail.distributionProportion" disabled>
					</el-input>
				</el-form-item>
				<!--<el-form-item label="商户">
     					<el-input ></el-input>
     			</el-form-item>-->
			</el-form>
			<!--<el-form-item label="商户">
     					<el-input ></el-input>
     			</el-form-item>-->
			</el-form>

		</el-card>

		<el-card class="box-card" :data='shopDetail' v-if='shopDetail.authDetail'>
			<h3>未审核通过原因</h3>
			<el-form>
				<el-form-item>
					<el-input disabled type="textarea" :autosize="{ minRows: 2, maxRows:4}" v-if='shopDetail.authDetail' v-model="shopDetail.authDetail"></el-input>
				</el-form-item>
			</el-form>
		</el-card>

		<el-card class="box-card">
			<h3>商家所有商品</h3>
			<el-table size="small" :data="shopGoodsDetail" border fit highlight-current-row>

				<el-table-column align="center" label="商品">
					<template slot-scope="scope">
						<div style="width: 50px;height: 50px;border: 1px solid #ebeef5;float:left;z-index: 9999;">
							<img style="width: 50px;height: 50px;z-index: 9999;" v-if="scope.row.picUrl" :src="sysConfig+scope.row.picUrl" />
						</div>
						<div>{{scope.row.title}}</div>
						<div>￥{{scope.row.originalPrice}}</div>
						<div>{{scope.row.cateName}}</div>
					</template>

				</el-table-column>

				<el-table-column align="center" label="库存" prop="inventory">
				</el-table-column>

				<el-table-column align="center" label="总销量" prop="saleCount">
				</el-table-column>

				<el-table-column align="center" label="所属商家" prop="shopTitle">
				</el-table-column>

				<el-table-column align="center" label="发布时间" prop="saleTime">
				</el-table-column>

			</el-table>

			<div class="pagination-container">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[2,5,8]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="totalgoods">
				</el-pagination>
			</div>
		</el-card>

		<el-card class="box-card">
			<h3>店铺所有订单</h3>
			<el-table size="small" :data="shopOrderDetail"   border fit highlight-current-row>

				<el-table-column type="expand">
					<template slot-scope="props">
						<el-form label-position="left" class="table-expand">
							<!--精品民宿-->
							<div v-for="w in props.row.goodsList" v-show="shopDetail.category==1">
								<el-form-item label="图片：">
									<div  v-if="w.item">  
										<img  class="gallery" style="height: 80px;" v-for="v in w.item.pictures" :src="sysConfig+v.itemPicUrl" />
									</div>
									<div  v-if="w.vegItem">
										<img  class="gallery" style="height: 80px;" v-for="v in w.vegItem.pictures" :src="sysConfig+v.itemPicUrl" />
									</div>
									<div  v-if="w.roomItem">
										<img  class="gallery" style="height: 80px;" v-for="v in w.roomItem.pictures" :src="sysConfig+v.itemPicUrl" />
									</div>
								</el-form-item>
								<el-form-item label="房间名称：">
									<span v-if="w.roomItem">{{w.roomItem.roomName}}</span>
								</el-form-item>
								<el-form-item label="房间价格：">
									<span>￥{{w.price}}</span>
								</el-form-item>
								<el-form-item label="房间数量：">
									<span v-if="w.roomItem">{{w.roomItem.roomNum}}</span>
								</el-form-item>
								
								<el-form-item label="房间类型：">
									<span v-if="w.roomItem">{{w.roomItem.roomType}}</span>
								</el-form-item>
								<el-form-item label="房间布局：">
									<span v-if="w.roomItem">{{w.roomItem.roomLayout}}</span>
								</el-form-item>
							</div>
							<!--素食餐厅-->
							<div v-for="w in props.row.goodsList" v-show="shopDetail.category==2">
								<el-form-item label="图片：">
									<div  v-if="w.item">  
										<img  class="gallery" style="height: 80px;" v-for="v in w.item.pictures" :src="sysConfig+v.itemPicUrl" />
									</div>
									<div  v-if="w.vegItem">
										<img  class="gallery" style="height: 80px;" v-for="v in w.vegItem.pictures" :src="sysConfig+v.itemPicUrl" />
									</div>
									<div  v-if="w.roomItem">
										<img  class="gallery" style="height: 80px;" v-for="v in w.roomItem.pictures" :src="sysConfig+v.itemPicUrl" />
									</div>
								</el-form-item>
								<el-form-item label="名称：">
									<span v-if="w.vegItem">{{w.vegItem.vegName}}</span>
								</el-form-item>
								<el-form-item label="价格：">
									<span>￥{{w.price}}</span>
								</el-form-item>
								<el-form-item label="素食数量：">
									<span  v-if="w.vegItem">{{w.vegItem.saleCount}}</span>
								</el-form-item>
							</div>
							<!--禅茶素材-->
							<div v-for="w in props.row.goodsList" v-show="shopDetail.category==3">
								<el-form-item label="图片：">
									<div  v-if="w.item">  
										<img  class="gallery" style="height: 80px;" v-for="v in w.item.pictures" :src="sysConfig+v.itemPicUrl" />
									</div>
									<div  v-if="w.vegItem">
										<img  class="gallery" style="height: 80px;" v-for="v in w.vegItem.pictures" :src="sysConfig+v.itemPicUrl" />
									</div>
									<div  v-if="w.roomItem">
										<img  class="gallery" style="height: 80px;" v-for="v in w.roomItem.pictures" :src="sysConfig+v.itemPicUrl" />
									</div>
								</el-form-item>
								<el-form-item label="名称：">
									<span>{{w.title}}</span>
								</el-form-item>
								<el-form-item label="价格：">
									<span>￥{{w.price}}</span>
								</el-form-item>
								<el-form-item label="商品类型：">
									<span  v-if="w.item">{{w.item.cateName}}&nbsp;&nbsp;&nbsp;&nbsp;X{{w.num}}</span>
								</el-form-item>
								<el-form-item label="商品分类：">
									<span  v-if="w.item">{{w.item.cateTypeName}}</span>
								</el-form-item>
								<el-form-item label="商品规格：">
									<div v-if="w.item">
										<span  v-for="v in w.item.skus">{{ v.specName }}&nbsp;&nbsp; {{ v.inventory }}库存、</span>
									</div>
								</el-form-item>
							</div>
							<!--投资收藏-->
							<div v-for="w in props.row.goodsList" v-show="shopDetail.category==4">
								<el-form-item label="图片：">
									<div  v-if="w.collectItem">  
										<img  class="gallery" style="height: 80px;" v-for="v in w.collectItem.pictures" :src="sysConfig+v.itemPicUrl" />
									</div>
								</el-form-item>
								<el-form-item label="藏品名称：">
									<span v-if="w.collectItem">{{w.collectItem.collectName}}</span>
								</el-form-item>
								<el-form-item label="藏品价格：">
									<span>￥{{w.price}}</span>
								</el-form-item>
								<el-form-item label="藏品类型：">
									<span  v-if="w.collectItem">{{w.collectItem.specName}}</span>
								</el-form-item>
								<el-form-item label="收藏地址：">
									<span  v-if="w.collectItem">{{w.collectItem.collectAddr}}</span>
								</el-form-item>
							</div>
						</el-form>
					</template>
				</el-table-column>

				<el-table-column align="center" label="订单号" prop="identifier">
				</el-table-column>

				<el-table-column align="center" label="下单人" prop="userName">
				</el-table-column>

				<el-table-column align="center" label="下单人电话" prop="userPhone">
				</el-table-column>

				<el-table-column align="center" label="下单时间" prop="createdAt">
				</el-table-column>

				<el-table-column align="center" label="物流方式" prop="expressCompany">
				</el-table-column>

				<el-table-column align="center" label="收货时间/自提时间" prop="receiveTime">
				</el-table-column>

				<el-table-column align="center" label="订单状态" prop="orderType">
					<template slot-scope="scope">
						<el-tag :type="scope.row.isNew ? 'success' : 'error' ">{{scope.row.orderType==1 ? '待付款' : (scope.row.orderType==2?'待发货':(scope.row.orderType==3?'已发货':'已完成'))}}</el-tag>
					</template>
				</el-table-column>

				<el-table-column align="center" label="购买金额" prop="originalSum">
				</el-table-column>

			</el-table>

			<div class="pagination-container">
				<el-pagination background @size-change="handleSizeChangeOrder" @current-change="handleCurrentChangeOrder" :current-page="listQuery.page" :page-sizes="[2,5,8]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="totalorder">
				</el-pagination>
			</div>
		</el-card>

		<el-card class="box-card">
			<h3>分销用户</h3>
			<el-table size="small" :data="shopDistributionDetail" border fit highlight-current-row>

				<el-table-column align="center" label="分销用户" prop="username">
				</el-table-column>

				<el-table-column align="center" label="绑定时间" prop="shareDate">
				</el-table-column>

			</el-table>

			<div class="pagination-container">
				<el-pagination background @size-change="handleSizeChangeShare" @current-change="handleCurrentChangeShare" :current-page="listQuery.pageNum" :page-sizes="[5,8,10]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalshare">
				</el-pagination>
			</div>
		</el-card>
		<el-card class="box-card">
			<h3>证件照片</h3>
			<el-form :data="picList" v-if='picList.length>0' style="display: inline-flex; flex-wrap: wrap; margin-left: 150px;">
				<el-form-item v-for='(item,index) in picList' :key="index" class="distance">
					<img :src="sysConfig+item.key" width="150" height="150" v-if="item.key" style="border:1px solid #ebeef5" />
					<div class="nameImg">
						<span>{{item.cateName}}</span>
					</div>
				</el-form-item>
			</el-form>

		</el-card>

		<div class="op-container">
			<el-button @click="handleCancel">返回</el-button>
		</div>

	</div>
</template>

<style>
	.el-card {
		margin-bottom: 10px;
	}
	
	.el-tag+.el-tag {
		margin-left: 10px;
	}
	
	.input-new-keyword {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}
	
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	
	.avatar-uploader .el-upload:hover {
		border-color: #20a0ff;
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 120px;
		height: 120px;
		line-height: 120px;
		text-align: center;
	}
	
	.avatar {
		width: 100%;
		height: 100%;
		display: block;
	}
	
	.distance {
		margin-right: 50px;
	}
	
	.gallery {
		width: 80px;
		margin-right: 10px;
	}
</style>

<script>
	import { userAuthDetail, goodsList, listOrder, shareUserList } from '@/api/shop'

	import { createStorage, uploadPath, pictureAIP } from '@/api/storage'

	export default {
		name: 'GoodsCreate',
		data() {
			return {
				shopDetail: {},
				shopGoodsDetail: [],
				totalgoods: null,
				shopOrderDetail: [],
				totalorder: null,
				goodsList: [],
				shopDistributionDetail: [],
				totalshare: null,
				uploadPath,
				admission: [],
				distribution: [],
				picList: [],
				total: null,

				listQuery: {
					pageNum: 1,
					pageSize: 2,
					shopId: undefined
				},
				sysConfig: '',
				storageBaseUrl: localStorage.getItem("ghtstorageBaseUrl")
			}
		},
		created() {
			this.init()
			this.sysConfig = this.$store.getters.sysConfig.storageBaseUrl

		},
		methods: {
			init: function() {
				const userAuthId = this.$route.query.userAuthId
				userAuthDetail(userAuthId).then(response => {
					this.shopDetail = response.data.data ;
					this.listQuery.shopId = response.data.data.shopId ;
					this.picList = response.data.data.userAuthPicVoList ;
					this.goodsShopList() ;
					this.goodsShopOrderList() ;
					this.goodsShopShareList() ;
				})
			},
			goodsShopList() {
				goodsList(this.listQuery).then(response => {
					this.shopGoodsDetail = response.data.data.items
					this.totalgoods = response.data.data.total
				}).catch(() => {
					this.shopGoodsDetail = []
					this.totalgoods = 0
				})
			},
			goodsShopOrderList() {
				listOrder(this.listQuery).then(response => {
					this.shopOrderDetail = response.data.data.items
					this.totalorder = response.data.data.total
				}).catch(() => {
					this.shopOrderDetail = []
					this.totalorder = 0
				})
			},
			goodsShopShareList() {
				shareUserList(this.listQuery).then(response => {
					this.shopDistributionDetail = response.data.data.items
					this.totalshare = response.data.data.total
				}).catch(() => {
					this.shopDistributionDetail = []
					this.totalshare = 0
				})
			},
			handleSizeChange(val) {
				this.listQuery.pageSize = val
				this.goodsShopList()
			},
			handleCurrentChange(val) {
				this.listQuery.pageNum = val
				this.goodsShopList()
			},

			handleSizeChangeOrder(val) {
				//alert(val);
				this.listQuery.pageSize = val
				this.goodsShopOrderList()
			},
			handleCurrentChangeOrder(val) {
				this.listQuery.pageNum = val
				this.goodsShopOrderList()
			},

			handleSizeChangeShare(val) {
				this.listQuery.pageSize = val
				this.goodsShopShareList()
			},
			handleCurrentChangeShare(val) {
				this.listQuery.pageNum = val
				this.goodsShopShareList()
			},

			handleCancel: function() {
				this.$router.push({
					path: '/mall/shop'
				})
			},

		}
	}
</script>