<template>
	<div>
		<div style="margin-top: 20px;margin-left: 35px;">
			<el-select v-model="listQuery.timeLevel" placeholder="请选择">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<el-date-picker v-model="listQuery.beginDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" align="right">
			</el-date-picker>
			<el-date-picker v-model="listQuery.endDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" align="right">
			</el-date-picker>
			<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFiltershop">查找</el-button>
		</div>
		<div class="app-container calendar-list-container">
			<ve-histogram :extend="chartExtend" :data="chartData" :settings="chartSettings"></ve-histogram>
		</div>
	</div>
	

</template>

<script>
	import { statUser, countTodayAmount, countHistoryAmount, countTodaySaleNum, countHistorySaleNum , countHistoryOrders , countTodayOrders, countUserCountByTime ,countMonthActiveUser } from '@/api/stat'
	import VeHistogram from 'v-charts/lib/histogram'

	export default {
		components: {
			VeHistogram
		},
		data() {
			return {
				chartData: {
					columns: ["groupDate", "groupTypeCount1" ,"groupTypeCount2","groupTypeCount3","groupTypeCount4"],
					rows: []
				},
				chartSettings: {},
				chartExtend: {},
				listQuery: {
					page: 1,
					limit: 20,
					beginDate: "1970-01-01 00:00:00",
					endDate: "2018-10-30 00:00:00",
					timeLevel: "Day"
				},
				options: [{
					value: 'Day',
					label: 'Day'
				}, {
					value: 'Week',
					label: 'Week'
				}, {
					value: 'Month',
					label: 'Month'
				}],
			}
		},
		methods: {
			//销售额
			getCountHistoryAmount() {
				countHistoryAmount(this.listQuery).then(response => {
					var newArry = response.data.data
					var arr = []
					if(newArry.length>0){
						for(var i = 0 ; i < newArry.length ; i++){
							if(newArry[i].groupType==1){
								arr.push({
									groupDate:newArry[i].groupDate,
									groupTypeCount1:newArry[i].count,
									groupTypeCount2:null,
									groupTypeCount3:null,
									groupTypeCount4:null
								})
							}
							if(newArry[i].groupType==2){
								arr.push({
									groupDate:newArry[i].groupDate,
									groupTypeCount2:newArry[i].count,
									groupTypeCount1:null,
									groupTypeCount3:null,
									groupTypeCount4:null
								})
							}
							if(newArry[i].groupType==3){
								arr.push({
									groupDate:newArry[i].groupDate,
									groupTypeCount3:newArry[i].count,
									groupTypeCount2:null,
									groupTypeCount1:null,
									groupTypeCount4:null,
								})
							}
							if(newArry[i].groupType==4){
								arr.push({
									groupDate:newArry[i].groupDate,
									groupTypeCount4:newArry[i].count,
									groupTypeCount2:null,
									groupTypeCount3:null,
									groupTypeCount1:null,
								})
							}
						}
					}
					this.chartData.rows = arr;
					this.chartSettings = {
						labelMap: {
							'groupTypeCount1': "禅茶",
							'groupTypeCount2': "素食",
							'groupTypeCount3': "民宿",
							'groupTypeCount4': "投资收藏",
						}
					}
					this.chartExtend = {
						xAxis: {
							boundaryGap: true
						},
						series: {
							label: {
								show: true,
								position: 'top'
							}
						}
					}
				})
			},
			//销售量
			countHistorySaleNum() {
				countHistorySaleNum(this.listQuery).then(response => {
					var newArry = response.data.data
					var arr = []
					if(newArry.length>0){
						for(var i = 0 ; i < newArry.length ; i++){
							if(newArry[i].groupType==1){
								arr.push({
									groupDate:newArry[i].groupDate,
									groupTypeCount1:newArry[i].count,
									groupTypeCount2:null,
									groupTypeCount3:null,
									groupTypeCount4:null
								})
							}
							if(newArry[i].groupType==2){
								arr.push({
									groupDate:newArry[i].groupDate,
									groupTypeCount2:newArry[i].count,
									groupTypeCount1:null,
									groupTypeCount3:null,
									groupTypeCount4:null
								})
							}
							if(newArry[i].groupType==3){
								arr.push({
									groupDate:newArry[i].groupDate,
									groupTypeCount3:newArry[i].count,
									groupTypeCount2:null,
									groupTypeCount1:null,
									groupTypeCount4:null,
								})
							}
							if(newArry[i].groupType==4){
								arr.push({
									groupDate:newArry[i].groupDate,
									groupTypeCount4:newArry[i].count,
									groupTypeCount2:null,
									groupTypeCount3:null,
									groupTypeCount1:null,
								})
							}
						}
					}
					this.chartData.rows = arr;
					this.chartSettings = {
						labelMap: {
							'groupTypeCount1': "禅茶",
							'groupTypeCount2': "素食",
							'groupTypeCount3': "民宿",
							'groupTypeCount4': "投资收藏",
						}
					}
					this.chartExtend = {
						xAxis: {
							boundaryGap: true
						},
						series: {
							label: {
								show: true,
								position: 'top'
							}
						}
					}
				})
			},
			//订单
			countHistoryOrders() {
				countHistoryOrders(this.listQuery).then(response => {
					var newArry = response.data.data
					var arr = []
					if(newArry.length>0){
						for(var i = 0 ; i < newArry.length ; i++){
							if(newArry[i].groupType==1){
								arr.push({
									groupDate:newArry[i].groupDate,
									groupTypeCount1:newArry[i].count,
									groupTypeCount2:null,
									groupTypeCount3:null,
									groupTypeCount4:null
								})
							}
							if(newArry[i].groupType==2){
								arr.push({
									groupDate:newArry[i].groupDate,
									groupTypeCount2:newArry[i].count,
									groupTypeCount1:null,
									groupTypeCount3:null,
									groupTypeCount4:null
								})
							}
							if(newArry[i].groupType==3){
								arr.push({
									groupDate:newArry[i].groupDate,
									groupTypeCount3:newArry[i].count,
									groupTypeCount2:null,
									groupTypeCount1:null,
									groupTypeCount4:null,
								})
							}
							if(newArry[i].groupType==4){
								arr.push({
									groupDate:newArry[i].groupDate,
									groupTypeCount4:newArry[i].count,
									groupTypeCount2:null,
									groupTypeCount3:null,
									groupTypeCount1:null,
								})
							}
						}
					}
					this.chartData.rows = arr;
					this.chartSettings = {
						labelMap: {
							'groupTypeCount1': "禅茶",
							'groupTypeCount2': "素食",
							'groupTypeCount3': "民宿",
							'groupTypeCount4': "投资收藏",
						}
					}
					this.chartExtend = {
						xAxis: {
							boundaryGap: true
						},
						series: {
							label: {
								show: true,
								position: 'top'
							}
						}
					}
				})
			},
			//用户；
			countUserCountByTime() {
				countUserCountByTime(this.listQuery).then(response => {
					var newArry = response.data.data
					this.chartData.rows = newArry;
					this.chartSettings = {
						labelMap: {
							'amount': '销售量',
							'groupType': "类型"
						}
					}
					this.chartExtend = {
						xAxis: {
							boundaryGap: true
						},
						series: {
							label: {
								show: true,
								position: 'top'
							}
						}
					}
				})
			},
			//月活跃量
			countMonthActiveUser() {
				countMonthActiveUser(this.listQuery).then(response => {
					var newArry = response.data.data
					this.chartData.rows = newArry;
					this.chartSettings = {
						labelMap: {
							'amount': '销售量',
							'groupType': "类型"
						}
					}
					this.chartExtend = {
						xAxis: {
							boundaryGap: true
						},
						series: {
							label: {
								show: true,
								position: 'top'
							}
						}
					}
				})
			},
			getCountTodayAmount() {
				countTodayAmount().then(response => {
					this.chartData = response.data.data;
					this.chartSettings = {
						labelMap: {
							'users': '用户增长数'
						}
					}
					this.chartExtend = {
						xAxis: {
							boundaryGap: true
						},
						series: {
							label: {
								show: true,
								position: 'top'
							}
						}
					}
				})
			},
			handleFiltershop() {
				this.getType() ;
			},
			getDate() {
				var date = new Date();
				var seperator1 = "-";
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				if(month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if(strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				this.listQuery.endDate = year + seperator1 + month + seperator1 + strDate + " 00:00:00";
			},
			getType(){
				var type = this.$route.query.orderToday;
				switch(type) {
					case "orderToday":this.countHistoryOrders(); //订单；
					break;
					case "userTotal":this.countUserCountByTime(); //新增用户；
					break;
					case "activeTotal":this.countMonthActiveUser(); //活跃用户；
					break;
					case "turnoverTotal":this.getCountHistoryAmount();//营业额；
					break;
					case "salesTotal":this.countHistorySaleNum(); //销量；
					break;
					default:console.log(0)
				}
			}
		},
		created() {
			this.getDate();
			this.getType();

		}

	}
</script>