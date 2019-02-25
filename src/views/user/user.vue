<template>
	<div class="app-container calendar-list-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入用户名" v-model="listQuery.nickname">
			</el-input>
			<!--<el-select multiple style="width: 200px" class="filter-item" placeholder="请选择使用状态" v-model="listQuery.statusArray" >
        <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value">
        </el-option>
      </el-select> -->
			<el-date-picker v-model="listQuery.registerStartDate" type="date" :picker-options="pickerBeginDateBefore" format="yyyy-MM-dd" value-format="yyyy-MM-dd 00:00:00" placeholder="开始时间" class="filter-item">
			</el-date-picker>至
			<el-date-picker v-model="listQuery.registerEndDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd 23:59:59" :picker-options="pickerBeginDateAfter" placeholder="结束时间" class="filter-item">
			</el-date-picker>
			<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>

		</div>

		<!-- 查询结果 -->
		<el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
			<el-table-column align="center" label="序号" width="80">
				<template slot-scope="scope">
					<span v-text="getIndex(scope.$index)"> </span>
				</template>
			</el-table-column>

			<el-table-column align="center" label="用户名" prop="username">
			</el-table-column>

			<el-table-column align="center" label="手机号码" prop="phone">
			</el-table-column>

			<el-table-column align="center" label="账户余额" prop="balance">
			</el-table-column>

			<el-table-column align="center" label="积分数" prop="score">
			</el-table-column>

			<el-table-column align="center" label="平台赠送金额" prop="giveMoney">
			</el-table-column>

			<el-table-column align="center" label="待结算金额" prop="unsettledFunds">
			</el-table-column>

			<el-table-column align="center" label="分享人数" prop="shareCount">
			</el-table-column>

			<el-table-column align="center" label="用户归属地" >
				<template slot-scope="scope">
					<!--<el-tag :type="scope.row.status ? 'success' :'info' ">{{scope.row.status ? '正常' : '禁用'}}</el-tag>-->
					<span>{{scope.row.province}}{{scope.row.city}}{{scope.row.district}}</span>
				</template>
			</el-table-column>

			<el-table-column align="center" label="使用状态" prop="status">
				<template slot-scope="scope">
					<el-tag :type="scope.row.status ? 'success' :'info' ">{{scope.row.status ? '正常' : '禁用'}}</el-tag>
				</template>
			</el-table-column>

			<el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button type="success" size="mini" @click="handleOpen(scope.row)" v-if='scope.row.status==false' v-show='isShow'>正常</el-button>
					<el-button type="danger" size="mini" @click="handleDanger(scope.row)" v-if='scope.row.status==true' v-show='isShowDag'>禁用</el-button>
					<el-button type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<div class="pagination-container">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>

	</div>
</template>
<style>
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
</style>
<script>
	import { fetchList, readUserDetail, changeStatusUser } from '@/api/user'
	import { parseTime } from '@/utils/index'
	const statusMap = {
		1: '正常',
		0: '禁用'
	}
	export default {
		name: 'User',
		data() {
			return {
				list: [],
				total: null,
				shopDetail: '',
				listLoading: true,
				statusMap,
				isShow: true,
				isShowDag:true,
				listQuery: {
					pageNum: 1,
					pageSize: 10,
					nickname: undefined,
					registerEndDate: undefined,
					registerStartDate: undefined
				},
				shipForm: {
					userId: undefined,
					status: true
				},
				dataForm: {
					userId: undefined,
					status: false
				},
				dialogFormVisible: false,
				//dialogFormVisiblePower:false,
				//userDetail: {},
				dialogTextVisible: false,
				downloadLoading: false,
				currentTimestamp: new Date(parseTime(new Date(), '{y}-{m}-{d}')).getTime(),
				pickerBeginDateBefore: {
					disabledDate: (time) => {
						let beginDateVal = this.listQuery.registerEndDate;
						if(beginDateVal) {
							return time.getTime() > new Date(beginDateVal).getTime() || time.getTime() > this.currentTimestamp;
						} else {
							return time.getTime() > this.currentTimestamp;
						}
					}
				},
				pickerBeginDateAfter: {
					disabledDate: (time) => {
						let beginDateVal = this.listQuery.registerStartDate;
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
			getIndex($index) {
				return $index + 1
			},
			getList() {
				this.listLoading = true
				fetchList(this.listQuery).then(response => {
					this.list = response.data.data.items
					this.total = response.data.data.total
					this.listLoading = false
				}).catch(() => {
					this.list = []
					this.total = 0
					this.listLoading = false
				})
			},
			handleFilter() {
				this.listQuery.pageNum = 1
				this.getList()
			},
			handleSizeChange(val) {
				this.listQuery.pageSize = val
				this.getList()
			},
			handleCurrentChange(val) {
				console.log(val)
				this.listQuery.pageNum = val
				this.getList()
			},
			handleDetail(row) {
				this.$router.push({
					path: '/user/detail',
					query: {
						userId: row.userId
					}
				})
			},
			handleOpen(row) {
				this.dataForm.status = true
				changeStatusUser(row.userId).then(response => {
					this.getList()
					this.isShowDag = this.isShowDag
					
				})
				
			},
			handleDanger(row) {
				this.shipForm.status = false
				changeStatusUser(row.userId).then(response => {
					this.getList()
					this.isShow = this.isShow
				})
				
			},
			//权限查看
//			handleChangePower(res){
//				this.dialogFormVisiblePower = true ; 
//				console.log(res)
//				
//			},
			//权限确定按钮
//			createRole(res){
//				console.log(1234);
//			}
		}
	}
</script>