<template>
	<el-row class="panel-group" :gutter="40">
		<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
			<div class='card-panel' @click="handleSetLineChartData('orderToday')">
				<div class="card-panel-icon-wrapper icon-people">
					<svg-icon icon-class="message" class-name="card-panel-icon" />
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">今日订单量</div>
					<count-to class="card-panel-num" :startVal="0" :endVal="orderToday" :duration="2600"></count-to>
				</div>
			</div>
		</el-col>
		<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
			<div class="card-panel" @click="handleSetLineChartData('userTotal')">
				<div class="card-panel-icon-wrapper icon-message">
					<svg-icon icon-class="peoples" class-name="card-panel-icon" />
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">日新增用户量</div>
					<count-to class="card-panel-num" :startVal="0" :endVal="userTotal" :duration="3000"></count-to>
				</div>
			</div>
		</el-col>
		<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
			<div class="card-panel" @click="handleSetLineChartData('activeTotal')">
				<div class="card-panel-icon-wrapper icon-money">
					<svg-icon icon-class="peoples" class-name="card-panel-icon" />
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">月活跃用户量</div>
					<count-to class="card-panel-num" :startVal="0" :endVal="activeTotal" :duration="3200"></count-to>
				</div>
			</div>
		</el-col>
		<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
			<div class="card-panel" @click="handleSetLineChartData('userarea')">
				<div class="card-panel-icon-wrapper icon-shoppingCard">
					<svg-icon icon-class="ad" class-name="card-panel-icon" />
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">用户地信息</div>
					<count-to class="card-panel-num" :startVal="0" :endVal="userarea" :duration="3600"></count-to>
				</div>
			</div>
		</el-col>
		<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
			<div class="card-panel" @click="handleSetLineChartData('salesTotal')">
				<div class="card-panel-icon-wrapper icon-shoppingCard">
					<svg-icon icon-class="shoppingCard" class-name="card-panel-icon" />
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">日平台销量</div>
					<count-to class="card-panel-num" :startVal="0" :endVal="salesTotal" :duration="3600"></count-to>
				</div>
			</div>
		</el-col>
		<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
			<div class="card-panel" @click="handleSetLineChartData('turnoverTotal')">
				<div class="card-panel-icon-wrapper icon-shoppingCard">
					<svg-icon icon-class="money" class-name="card-panel-icon" />
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">日平台营业额</div>
					<count-to class="card-panel-num" :startVal="0" :endVal="turnoverTotal" :duration="3600"></count-to>
				</div>
			</div>
		</el-col>
	</el-row>
</template>

<script>
	import { info, getSysConfig } from '@/api/dashboard'
	import { todayOrderNum,historyOrderStatistics} from '@/api/order'
	import { statUser,countMonthActiveUser, countTodayAmount,countTodaySaleNum, countTodayUser,countHistoryAmount , countTodayOrders , countAreaUserCount} from '@/api/stat'
	import CountTo from 'vue-count-to'

	export default {
		components: {
			CountTo
		},
		data() {
			return {
				userTotal: 0,
				goodsTotal: 0,
				productTotal: 0,
				orderTotal: 0,
				
				orderToday:0,
				userTotal:0,
				activeTotal:0,
				userarea:0,
				salesTotal:0,
				turnoverTotal:0
								
			}
		},
		methods: {
			handleSetLineChartData(type) {
				switch(type) {
					case "orderToday":this.$router.push({ path: '/sys/orderToday',query:{orderToday:type}})	 //订单；
					break;
					case "userTotal":this.$router.push({ path: '/sys/salesTotal',query:{orderToday:type}})	 //新增用户；
					break;
					case "activeTotal":this.$router.push({ path: '/sys/salesTotal',query:{orderToday:type}})	 //活跃用户；
					break;
					case "userarea":this.$router.push({ path: '/sys/data',query:{orderToday:type}})	 //统计区域用户数据量；
					break;
					case "turnoverTotal":this.$router.push({ path: '/sys/orderToday',query:{orderToday:type}})	 //营业额；
					break;
					case "salesTotal":this.$router.push({ path: '/sys/orderToday',query:{orderToday:type}})	 //销量；
					break;
					default:console.log(0)
				}
			}
		},
		created() {
//			info(this.listQuery).then(response => {
//				this.userTotal = response.data.data.userCount
//				this.goodsTotal = response.data.data.itemCount
//				this.productTotal = response.data.data.goodsCount
//				this.orderTotal = response.data.data.orderCount
//			})
			countTodayOrders().then(response =>{ //今日订单
				var arry = response.data.data ; 
				var n = 0;
				for(var i = 0 ; i<arry.length ; i++){
					n+=arry[i].count ; 
				}
				this.orderToday = n ; 
			})
			countTodaySaleNum().then(response =>{ //今日销售量
				var arry = response.data.data ; 
				var n = 0;
				for(var i = 0 ; i<arry.length ; i++){
					n+=arry[i].count ; 
				}
				this.salesTotal = n ; 
			})
			countTodayAmount().then(response =>{ //今日销售额
				var arry = response.data.data ; 
				var n = 0;
				for(var i = 0 ; i<arry.length ; i++){
					n+=arry[i].count ; 
				}
				this.turnoverTotal = n ; 
			})
			countTodayUser().then(response =>{ //今日用户量
				var arry = response.data.data ; 
				var n = 0;
				for(var i = 0 ; i<arry.length ; i++){
					n+=arry[i].count ; 
				}
				this.userTotal = n ; 
			})
	

		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.el-col-lg-6 {
		width: 50%;
	}
	
	.panel-group {
		margin-top: 18px;
		.card-panel-col {
			margin-bottom: 32px;
		}
		.card-panel {
			height: 108px;
			cursor: pointer;
			font-size: 12px;
			position: relative;
			overflow: hidden;
			color: #666;
			background: #fff;
			box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
			border-color: rgba(0, 0, 0, .05);
			&:hover {
				.card-panel-icon-wrapper {
					color: #fff;
				}
				.icon-people {
					background: #40c9c6;
				}
				.icon-message {
					background: #36a3f7;
				}
				.icon-money {
					background: #f4516c;
				}
				.icon-shoppingCard {
					background: #34bfa3
				}
			}
			.icon-people {
				color: #40c9c6;
			}
			.icon-message {
				color: #36a3f7;
			}
			.icon-money {
				color: #f4516c;
			}
			.icon-shoppingCard {
				color: #34bfa3
			}
			.card-panel-icon-wrapper {
				float: left;
				margin: 14px 0 0 14px;
				padding: 16px;
				transition: all 0.38s ease-out;
				border-radius: 6px;
			}
			.card-panel-icon {
				float: left;
				font-size: 48px;
			}
			.card-panel-description {
				float: right;
				font-weight: bold;
				margin: 26px;
				margin-left: 0px;
				.card-panel-text {
					line-height: 18px;
					color: rgba(0, 0, 0, 0.45);
					font-size: 16px;
					margin-bottom: 12px;
				}
				.card-panel-num {
					font-size: 20px;
				}
			}
		}
	}
</style>