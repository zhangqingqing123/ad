<template>
	<div class="app-container calendar-list-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<!--<el-select v-model="categoryListSpeciesData" @change="itemsChange" placeholder="商品种类" class="filter-item">
				<el-option v-for="item in categoryListSpecies" :key="item.type" :label="item.name" :value="item.type">
				</el-option>
			</el-select>-->
			<el-select v-model="categoryListCategoryData" @change="categoryChange" placeholder="商品类型" class="filter-item">
				<el-option v-for="item in categoryList" :key="item.id" :label="item.cateName" :value="item.id">
				</el-option>
			</el-select>
			<el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入商品名称" v-model="dataForm.title">
			</el-input>
			<el-date-picker v-model="dataForm.startTime" type="date" :picker-options="pickerBeginDateBefore" format="yyyy-MM-dd" value-format="yyyy-MM-dd 00:00:00" placeholder="开始时间" class="filter-item">
			</el-date-picker>至
			<el-date-picker v-model="dataForm.endTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd 23:59:59" :picker-options="pickerBeginDateAfter" placeholder="结束时间" class="filter-item">
			</el-date-picker>
			<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
			<el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
		</div>

		<!-- 查询结果 -->
		<el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>

			<el-table-column align="center" label="序号" width="80">
				<template slot-scope="scope">
					<span v-text="getIndex(scope.$index)"> </span>
				</template>
			</el-table-column>
			<el-table-column align="center" min-width="100" label="商品类型" prop="cateName">
			</el-table-column>

			<el-table-column align="center" min-width="100" label="商品名称" prop="title">
			</el-table-column>
			<el-table-column align="center" min-width="100" label="图片" prop="cateName">
				<template slot-scope="scope" class="catenews">
					<img style="width: 40px;height: 40px;" :src="sysConfig.storageBaseUrl+scope.row.picUrl" alt=""  />
					<p >￥{{scope.row.originalPrice}}</p>
				</template>
			</el-table-column>

			<el-table-column align="center" label="库存" prop="inventory">
			</el-table-column>

			<el-table-column align="center" label="总销量" prop="saleCount">
			</el-table-column>

			<el-table-column align="center" label="所属商家" prop="shopTitle">
			</el-table-column>

			<el-table-column align="center" label="状态" prop="shopTitle">
				<template slot-scope="scope">
					<el-button type="" size="mini" @click="displayItemGoods(scope.row)"> {{scope.row.isDisplay==0?"已下架":"已上架"}} </el-button>
				</template>
			</el-table-column>

			<el-table-column align="center" label="发布时间" prop="saleTime">
			</el-table-column>

			<el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
					<el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 添加或修改对话框 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
				<el-form-item label="修改库存" prop="title">
					<el-input v-model="dataForm.title"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button v-if="dialogStatus=='update'" type="primary" @click="createData">确定</el-button>
				<el-button v-else type="primary" @click="updateData">确定</el-button>
			</div>
		</el-dialog>

		<!-- 分页 -->
		<div class="pagination-container">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="dataForm.pageNum" :page-sizes="[10,20,30,50]" :page-size="dataForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>

		<el-tooltip placement="top" content="返回顶部">
			<back-to-top :visibilityHeight="100"></back-to-top>
		</el-tooltip>

	</div>
</template>

<style>
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
	import { listGoods, deleteGoods, listItemGoods, deleteItemGoods, displayItemGoods, getTypes, gitCategory , getItems } from '@/api/goods'
	import BackToTop from '@/components/BackToTop'
	import { parseTime } from '@/utils/index'

	const statusMap = {
		1: '全部',
		2: '茶叶',
		3: '住房'
	}

	export default {
		name: 'GoodsList',
		components: {
			BackToTop
		},
		data() {
			return {
				categoryListSpeciesData: '',
				categoryListSpecies: '',
				categoryList: '',
				categoryListCategoryData: '',
				list: [],
				total: 0,
				statusMap,
				listLoading: true,
				sysConfig: {},
				dataForm: {
					pageNum: 1,
					pageSize: 10,
					shopId: undefined,
					cateType: undefined,
					cateId: undefined,
					activityId: undefined,
					isDisplay: undefined,
					ids: undefined,
					isDisplay: undefined
				},
				descDetail: '',
				downloadLoading: false,
				currentTimestamp: new Date(parseTime(new Date(), '{y}-{m}-{d}')).getTime(),
				pickerBeginDateBefore: {
					disabledDate: (time) => {
						let beginDateVal = this.dataForm.endTime;
						if(beginDateVal) {
							return time.getTime() > new Date(beginDateVal).getTime() || time.getTime() > this.currentTimestamp;
						} else {
							return time.getTime() > this.currentTimestamp;
						}
					}
				},
				pickerBeginDateAfter: {
					disabledDate: (time) => {
						let beginDateVal = this.dataForm.startTime;
						if(beginDateVal) {
							return time.getTime() < new Date(beginDateVal).getTime() || time.getTime() > this.currentTimestamp;
						} else {
							return time.getTime() > this.currentTimestamp;
						}
					}
				},
				dialogFormVisible: false,
				dialogStatus: '',
				textMap: {
					update: '编辑',
					create: '创建'
				},
				rules: {
					title: [{
						required: true,
						message: '库存不能为空',
						trigger: 'blur'
					}]
				}

			}
		},
		created() {
			this.getList();
			this.sysConfig = this.$store.getters.sysConfig;
			this.getItems();
			this.gitCategory();
		},
		methods: {
			getIndex($index) {
				return $index + 1
			},
			getList() {
				console.log(this.dataForm);
				this.listLoading = true
				listItemGoods(this.dataForm).then(response => {					
					this.list = response.data.data.items
					this.total = response.data.data.total
					this.listLoading = false
				}).catch(() => {
					this.list = []
					this.total = 0
					this.listLoading = false
				})
			},
			//商品上架
			displayUp(row) {

			},
			handleFilter() {
				this.dataForm.pageNum = 1
				this.getList()
			},
			handleSizeChange(val) {
				this.dataForm.pageSize = val
				this.getList()
			},
			handleCurrentChange(val) {
				this.dataForm.pageNum = val
				this.getList()
			},
			handleCreate() {
				this.$router.push({
					path: '/goods/add'
				})
			},
			handleDelete(row) {
				this.$router.push({
					path: '/goods/edit',
					query: {
						id: row.id
					}
				})
			},
//			getCurrentRow(index, row) {
//				//console.log(index)
//				//console.log(row)
//				this.templateSelection = row;
//				this.dataForm.goodsId = row.id;
//			},
			handleShelves() {

			},
			createData() {

			},
			updateData() {

			},
			//商品删除
			handleDelete(row) {
				this.$confirm('确定要删除此项吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          	this.dataForm.ids = row.id;
					deleteItemGoods(this.dataForm).then(response => {
						this.$notify({
							title: '成功',
							message: '删除成功',
							type: 'success',
							duration: 2000
						})
						const index = this.list.indexOf(row)
						this.list.splice(index, 1)
						this.getList()
					})
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          })          
		        })
			},
			//上下架商品
			displayItemGoods(row) {
				this.dataForm.ids = row.id;
				//console.log(row);
				if(row.isDisplay == 1) {
					var message = "已下架";
					this.dataForm.isDisplay = 0;
				} else {
					var message = "已上架";
					this.dataForm.isDisplay = 1;
				}
				displayItemGoods(this.dataForm).then(response => {
					//console.log(response)
					this.$notify({
						title: '成功',
						message: message,
						type: 'success',
						duration: 2000
					})
					var arr = this.list; //更新数据；
					for(var i = 0; i < arr.length; i++) {
						if(arr[i].id == row.id) {
							arr[i].isDisplay = !arr[i].isDisplay;
						}
					}
					this.list = arr;
				})
			},
			handleUpdate(row) {
				//console.log(row);
				this.$router.push({
					path: '/goods/amendGood',
					query: {
						id: row.id
					}
				})
			},
			handleStock() {
				this.dialogFormVisible = true
			},
			//得到商品种类列表
			getItems() {
				getItems().then(response => {
					var itemsList = response.data.data;
					this.categoryListSpecies = itemsList;

				})
			},
			//得到商品类型
			gitCategory() {
				gitCategory(this.dataForm).then(response => {
					this.categoryList = response.data.data;
				})
			},
			//获取商品种类Id
			itemsChange(val) {
				this.dataForm.cateType = val;
				//this.cateType = val ;
				this.gitCategory();
			},
			//获取商品类型Id
			categoryChange(val) {
				this.dataForm.cateId = val;
				//this.cateId = val ; 
				//this.getTypes();
			},
		}
	}
</script>