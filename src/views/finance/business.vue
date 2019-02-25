<template>
	<div class="app-container calendar-list-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			
			<el-select style="width: 200px" class="filter-item" placeholder="请选择提现状态" v-model="listQuery.state">
				<el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value">
				</el-option>
			</el-select>
			<el-date-picker v-model="listQuery.startTime" type="date" :picker-options="pickerBeginDateBefore" format="yyyy-MM-dd" value-format="yyyy-MM-dd 00:00:00" placeholder="申请开始时间" class="filter-item">
			</el-date-picker>至
			<el-date-picker v-model="listQuery.endTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd 23:59:59" :picker-options="pickerBeginDateAfter" placeholder="申请结束时间" class="filter-item">
			</el-date-picker>
			<el-date-picker v-model="listQuery.startMakeTime" type="date" :picker-options="pickerBeginDateBefore" format="yyyy-MM-dd" value-format="yyyy-MM-dd 00:00:00" placeholder="打款开始时间" class="filter-item">
			</el-date-picker>至
			<el-date-picker v-model="listQuery.endMakeTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd 23:59:59" :picker-options="pickerBeginDateAfter" placeholder="打款结束时间" class="filter-item">
			</el-date-picker>

			<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
			<el-button class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload" :loading="downloadLoading">导出</el-button>
		</div>

		<!-- 查询结果 -->
		<el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>

			<el-table-column align="center" min-width="100" label="提现单号" prop="accountNumber">
			</el-table-column>

			<el-table-column align="center" label="申请时间" prop="createdAt">
			</el-table-column>

			<el-table-column align="center" label="用户名" prop="userName">
			</el-table-column>

			<el-table-column align="center" label="手机号" prop="phone">
			</el-table-column>

			<el-table-column align="center" label="提现方式" prop="reflectType">
				<template slot-scope="scope">
					<el-tag>{{scope.row.reflectType== 0? '银行卡' : '支付宝'}}</el-tag>
					<p>{{scope.row.accountName}}：{{scope.row.accountNumber}}</p>
					<!--<el-tag>查看</el-tag>-->
				</template>
			</el-table-column>

			<el-table-column align="center" label="提现状态" prop="status">
				<template slot-scope="scope">
					<el-tag :type="scope.row.state==1 ? 'success' : scope.row.state==2?'error':'info' ">{{scope.row.state==1 ? '已打款' : scope.row.state==2?'已拒绝':'待审核'}}</el-tag>
				</template>
			</el-table-column>

			<el-table-column align="center" label="申请提现金额" prop="money">
			</el-table-column>

			<el-table-column align="center" label="应打款金额" prop="money">
			</el-table-column>

			<el-table-column align="center" label="账户余额" prop="balance">
				
			</el-table-column>

			<el-table-column align="center" label="打款时间" prop="makeMoneyTime">
			</el-table-column>

			<el-table-column align="center" label="操作人" prop="makeMoneyManagerName">
				
			</el-table-column>

			<el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<!--<el-button type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>-->
					<el-button type="success" size="mini" @click="handleShip(scope.row)" v-show="scope.row.state==0" >打款</el-button>
					<el-button type="danger" size="mini" @click="handleRefund(scope.row)"  v-show="scope.row.state==0" >驳回</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<div class="pagination-container">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[2,10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!-- 提现信息对话框 -->
		<el-dialog title="提现信息" width="800" :visible.sync="withdrawalDialogVisible">
			<el-form :data="list" label-position="left">
				<!--<el-form-item label="提现方式">
					<el-tag>{{list[0].reflectType== 0? '银行卡' : '支付宝'}}</el-tag>
				</el-form-item>
				<el-form-item label="姓名">
					<span>{{ list[0].accountName }} </span>
				</el-form-item>-->
				<!--<el-form-item label="账号">
					<span>{{ list[0].accountName }} </span>
				</el-form-item>-->
			</el-form>
		</el-dialog>

		<!-- 审核详情对话框 -->
		<el-dialog title="审核详情" width="800" :visible.sync="examineDialogVisible">

			<el-form :data="examineDetail" label-position="left">
				<el-form-item label="提现单号">
					<span>{{ examineDetail.drawNo }}</span>
				</el-form-item>
				<el-form-item label="申请时间">
					<span>{{ examineDetail.createTime }}</span>
				</el-form-item>
				<el-form-item label="用户名">
					<span>{{ examineDetail.phone }}</span>
				</el-form-item>
				<el-form-item label="手机号">
					<span>{{ examineDetail.phone }}</span>
				</el-form-item>
				<el-form-item label="提现方式">
					<span>{{ examineDetail.phone }}</span>
				</el-form-item>
				<el-form-item label="申请提现金额">
					<span>{{ examineDetail.drawPrice }} </span>
				</el-form-item>
				<el-form-item label="应打款金额">
					<span>{{ examineDetail.drawPrice }} </span>
				</el-form-item>
				<el-form-item label="打款时间">
					<span>{{ examineDetail.drawPrice }} </span>
				</el-form-item>
				<el-form-item label="账户余额">
					<span>{{ examineDetail.balance }} </span>
				</el-form-item>
				<el-form-item label="操作人">
					<span>{{ examineDetail.drawPrice }} </span>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<style>

</style>

<script>
	import { listShopdraw, createShopdraw, readShopdraw, updateShopdraw, deleteShopdraw, getReflectList , changeStateRefused } from '@/api/shopdraw'
	import { parseTime } from '@/utils/index'

	const statusMap = {
		0: '申请中',
		1: '已打款',
		2: '已驳回'
	}

	export default {
		name: 'Shopdraw',
		data() {
			return {
				list: null,
				total: null,
				listLoading: true,
				listQuery: {
					pageNum: 1,
					pageSize: 10,

					accountName: undefined,
					accountNumber: undefined,
					endMakeTime: undefined,
					endTime: undefined,
					id: undefined,
					money: undefined,
					reflectType: undefined,
					startMakeTime: undefined,
					startTime: undefined,
					state: undefined,
					userId: undefined
				},
				statusMap,
				examineDialogVisible: false,
				withdrawalDialogVisible:false,
				isShow: true,
				examineDetail: {
					shopdraw: {},
					user: {}
				},
				shipForm: {
					status: undefined,
					id: undefined,
					userId: undefined
				},
				downloadLoading: false,
				currentTimestamp: new Date(parseTime(new Date(), '{y}-{m}-{d}')).getTime(),
				pickerBeginDateBefore: {
					disabledDate: (time) => {
						let beginDateVal = this.listQuery.endTime;
						if(beginDateVal) {
							return time.getTime() > new Date(beginDateVal).getTime() || time.getTime() > this.currentTimestamp;
						} else {
							return time.getTime() > this.currentTimestamp;
						}
					}
				},
				pickerBeginDateAfter: {
					disabledDate: (time) => {
						let beginDateVal = this.listQuery.startTime;
						if(beginDateVal) {
							return time.getTime() < new Date(beginDateVal).getTime() || time.getTime() > this.currentTimestamp;
						} else {
							return time.getTime() > this.currentTimestamp;
						}
					}
				}
			}
		},
		created() {
			this.getList()
		},
		methods: {
			getList() {
				this.listLoading = true
				getReflectList(this.listQuery).then(response => {
					console.log(response)
					this.list = response.data.data.items ;
					this.total = response.data.data.total;
					this.listLoading = false
				}).catch(() => {
					this.list = []
					this.total = 0
					this.listLoading = false
				})
			},
			handleFilter() {
				this.listQuery.pageNum = 1 ;
				this.getList()
			},
			handleSizeChange(val) {
				this.listQuery.pageSize = val
				this.getList()
			},
			handleCurrentChange(val) {
				this.listQuery.pageNum = val
				this.getList()
			},
			//打款
			handleShip(row) {
				this.shipForm.id = row.id ;
				this.shipForm.status = 2 ;
				updateShopdraw(row.id).then(response => {
					this.getList();
					this.$notify({
              title: '成功',
              message: '提现改为已打款',
              type: 'success',
              duration: 2000
            })
				})
			},
			//驳回
			handleRefund(row) {
				this.shipForm.id = row.id ;
				this.shipForm.status = 2 ;
				changeStateRefused(row.id).then(response => {
					this.getList();
					this.$notify({
              title: '成功',
              message: '提现改为已驳回',
              type: 'success',
              duration: 2000
            })
				})
			},
			handleDownload() {
				this.downloadLoading = true
				import('@/vendor/Export2Excel').then(excel => {
					const tHeader = ['提现单号', '申请时间', '申请商户', '手机号', '提现方式', '提现状态', '申请提现金额', '账户余额']
					const filterVal = ['drawNo', 'createTime', 'drawName', 'phone', 'drawWay', 'status', 'drawPrice', 'balance']
					excel.export_json_to_excel2(tHeader, this.list, filterVal, '提现审核信息')
					this.downloadLoading = false
				})
			}
		}
	}
</script>