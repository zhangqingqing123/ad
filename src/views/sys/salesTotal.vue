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
//	import { statUser, countTodayAmount, countHistoryAmount } from '@/api/stat'
	import { statUser, countTodayAmount, countHistoryAmount, countTodaySaleNum, countHistorySaleNum , countHistoryOrders , countTodayOrders, countUserCountByTime ,countMonthActiveUser } from '@/api/stat'
	import VeHistogram from 'v-charts/lib/histogram'

	export default {
		components: {
			VeHistogram
		},
		data() {
			return {
				chartData: {
					columns: ["groupDate", "count"],
					rows: []
				},
				chartSettings: {},
				chartExtend: {},
				listQuery: {
					page: 1,
					limit: 20,
					beginDate: "1970-01-01 00:00:00",
					endDate: "",
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
			//用户；
			countUserCountByTime() {
				countUserCountByTime(this.listQuery).then(response => {
					var newArry = response.data.data
					this.chartData.rows = newArry;
					this.chartSettings = {
						labelMap: {
							'amount': '数量'
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
							'amount': '数量'
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
			}
		},
		created() {
			this.getDate();
			this.handleFiltershop();

		}

	}
</script>