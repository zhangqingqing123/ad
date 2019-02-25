<template>
	<div class="app-container calendar-list-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input clearable class="filter-item" style="width: 150px;" placeholder="请输入商品名称" v-model="listQuery.name">
			</el-input>
			<el-date-picker v-model="listQuery.startTime" type="date" :picker-options="pickerBeginDateBefore" format="yyyy-MM-dd" value-format="yyyy-MM-dd 00:00:00" placeholder="开始时间" class="filter-item">
			</el-date-picker>至
			<el-date-picker v-model="listQuery.endTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd 23:59:59" :picker-options="pickerBeginDateAfter" placeholder="结束时间" class="filter-item">
			</el-date-picker>
			<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>

		</div>
		<div class="filter-container">
			<el-button class="filter-item" type="primary" @click="handleOnCreate" icon="el-icon-edit">添加推荐商品</el-button>
		</div>

		<!-- 查询结果 -->
		<el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>

			<el-table-column align="center" label="序号" width="80">
				<template slot-scope="scope">
					<span v-text="getIndex(scope.$index)"> </span>
				</template>
			</el-table-column>

			<el-table-column align="center" label="推荐商品" prop="itemTitle">
			</el-table-column>

			<el-table-column align="center" label="图片" prop="itemTitle">
				<template slot-scope="scope">
					<img style="width: 42px;" :src="sysConfig.storageBaseUrl+scope.row.picUrl" />
				</template>
			</el-table-column>

			<el-table-column align="center" label="所属商户" prop="shopTitle">
			</el-table-column>

			<el-table-column align="center" label="状态" prop="display">
				<template slot-scope="scope">
					<el-button size="mini"><span @click="changeType(scope.row)">{{scope.row.display==1?"正常":"禁用"}}</span></el-button>
				</template>
			</el-table-column>

			<el-table-column align="center" label="上传时间" prop="createdAt">
			</el-table-column>

			<el-table-column align="center" label="操作人" prop="createdName">
			</el-table-column>

			<el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<!--<el-button type="primary" size="mini" @click="handleRecovery(scope.row)">恢复</el-button>-->
					<!--<el-button type="primary" size="mini" @click="handleDisable(scope.row)">禁用</el-button>-->
					<!--<el-button type="danger" size="mini" @click="handleUpdate">编辑</el-button>-->
					<el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 添加或修改对话框 -->
		<el-dialog title="添加商品" :visible.sync="dialogVisible" width="30%" @close='closeDialog'>

			<el-form :rules="rules" ref="listQuery" :model="listQuery" status-icon label-position="left" label-width="100px">
				<el-form-item label="请选择:" prop="title" style="z-index: 9999;">
					<!--<el-select v-model="tempRole.categoryListSpeciesData" @change="itemsChange" placeholder="请选择">
						<el-option v-for="item in categoryListSpecies" :key="item.type" :label="item.title" :value="item.id">
						</el-option>
					</el-select>-->
					<el-autocomplete style="z-index: 9999;" popper-class="my-autocomplete" v-model="listQuery.title" :fetch-suggestions="querySearchAsync" placeholder="请输入需要搜索的商品" @select="handleSelect">
						<template slot-scope="props">
							<div class="name" style="z-index: 9999;">
								{{ props.item.title }}
							</div>
						</template>
					</el-autocomplete>
				</el-form-item>

			</el-form>

			<span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addGoodsBtn">确 定</el-button>
		  </span>
		</el-dialog>

		<!-- 分页 -->
		<div class="pagination-container">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>

		<el-tooltip placement="top" content="返回顶部">
			<back-to-top :visibilityHeight="100"></back-to-top>
		</el-tooltip>

	</div>
</template>

<style>
	#el-autocomplete-6759{
		z-index: 99999;
	}
	.table-expand {
		font-size: 0;
	}
	
	.table-expand label {
		width: 100px;
		color: #99a9bf;
	}
	
	.table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
	}
	
	.gallery {
		width: 80px;
		margin-right: 10px;
	}
</style>

<script>
	import { listGoods, deleteGoods, deleteRecommendedGoods, listRecommendedGoods, addListRecommendedGoods, addRecommendedGoods, changeRecommendedGoods } from '@/api/goods'
	import BackToTop from '@/components/BackToTop'
	import { parseTime } from '@/utils/index'
	import { Message, MessageBox } from 'element-ui'
	const statusMap = {
		1: '全部',
		2: '茶叶',
		3: '住房'
	}
	const advstatusMap = {
		1: '全部',
		2: '进行中',
		3: '已结束',
		4: '未开始'
	}

	export default {
		name: 'GoodsList',
		components: {
			BackToTop
		},
		data() {
			return {
				tempRole: {
					categoryListSpeciesData: '',
				},
				categoryListSpecies: [],
				itemsList: [],
				httpStatusCode: '',
				sysConfig: '',
				dialogVisible: false,
				list: [],
				total: 0,
				statusMap,
				advstatusMap,
				listLoading: true,
				dataForm: {
					itemIds: '',
					ids: '',
					isDisplay: ''
				},
				rules: {
					title: [{
						required: true,
						message: '选择商品不能为空！',
						trigger: 'blur'
					}]
				},
				listQuery: {
					pageNum: 1,
					pageSize: 20,
					goodsSn: undefined,
					name: undefined,
					sort: 'add_time',
					order: 'desc',
					endTime: undefined,
					isDisplay: '',
					itemTitle: undefined,
					shopTitle: undefined,
					startTime: undefined,
					title: undefined
				},
				descDetail: '',
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
				},

			}
		},
		created() {
			this.getList();
			this.httpStatusCode = this.$store.getters.httpStatusCode;
			//this.getItems();
			this.sysConfig = this.$store.getters.sysConfig;
		},
		methods: {
			getIndex($index) {
				return $index + 1
			},
			getList() {
				this.listLoading = true
				listRecommendedGoods(this.listQuery).then(response => {
					this.list = response.data.data.items
					this.total = response.data.data.total
					this.listLoading = false
				}).catch(() => {
					this.list = []
					this.total = 0
					this.listLoading = false
				})
			},
			//随机搜索
			querySearchAsync(queryString, cb) {
				var sr = [];
					this.listQuery.title = queryString
					
					//console.log(queryString) ; 
					addListRecommendedGoods(this.listQuery).then(response => {
						console.log(document.getElementsByName("el-autocomplete-suggestion"))
						this.itemsList = response.data.data;
						var itemsList = response.data.data;
						if(itemsList == "" || itemsList == []){
						this.$message({
				            type: 'warning',
				            message: '没有找到该商品!'
				          });
					}
						cb(itemsList)
					})
				
			},
			//商品
			handleSelect(item) {
				this.listQuery.title = item.title
				this.dataForm.itemIds = item.id
				this.$nextTick(() => {
					this.$refs['listQuery'].clearValidate()
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
				this.listQuery.pageNum = val
				this.getList()
			},
			handleOnCreate() {
				this.dialogVisible = true;
				this.listQuery.title = '';
				this.$nextTick(() => {
					this.$refs['listQuery'].clearValidate()
				})
				//this.$router.push({ path: '/vendorgoods/vendoradd'})
			},
			handleRecovery() {

			},
			handleDisable() {

			},
			handleUpdate(row) {
				//    this.$router.push({ path: '/advertisement/online', query: { id: row.id }})
				this.$router.push({
					path: '/contents/online'
				})
			},
			createData() {

			},
			updateData() {

			},
			//得到商品种类列表
			getItems() {
				addListRecommendedGoods(this.listQuery).then(response => {
					var itemsList = response.data.data.items;
					this.categoryListSpecies = itemsList;

				})
			},
			closeDialog(){
				location.reload() 
				console.log(123)
			},
			addGoodsBtn() {
				this.$refs['listQuery'].validate((valid) => {
					if(valid) {
						addRecommendedGoods(this.dataForm).then(response => {
							location.reload() 
							//this.getItems();
							//this.querySearchAsync();
							this.getList();
							this.dialogVisible = false;

						})
					}
				})

			},
			itemsChange(val) {
				this.dataForm.itemIds = val;
			},
//			handleClose(done) {
//				this.$confirm('确认关闭？')
//					.then(_ => {
//						done();
//					})
//					.catch(_ => {});
//			},
			changeType(row) {
				this.dataForm.ids = row.id;
				if(row.display == 0) {
					this.dataForm.isDisplay = 1;
				}
				if(row.display == 1) {
					this.dataForm.isDisplay = 0;
				}
				changeRecommendedGoods(this.dataForm).then(response => {
					this.getList();

				});
			},
			handleDelete(row) {
				this.$confirm('确定要删除此项吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.dataForm.ids = row.id;
					//this.dataForm.isDisplay = 0 ; 
					deleteRecommendedGoods(this.dataForm).then(response => {
						this.$notify({
							title: '成功',
							message: '删除成功',
							type: 'success',
							duration: 2000
						})
						const index = this.list.indexOf(row)
						this.list.splice(index, 1)
						//this.getItems();
						this.getList();
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})

			},
		}
	}
</script>