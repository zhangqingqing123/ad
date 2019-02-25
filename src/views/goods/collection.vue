<template>
	<div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入藏品名称" v-model="listQuery.collectName">
      </el-input> 
      <el-select style="width: 200px" class="filter-item" placeholder="请选择藏品种类" v-model="listQuery.cateId" >
        <el-option v-for="item in statusMap" :key="item.id" :label="item.cateName" :value="item.id">
        </el-option>
      </el-select> 
     	<el-date-picker
	            v-model="listQuery.startTime"
	            type="date"
	            :picker-options="pickerBeginDateBefore"
	            format="yyyy-MM-dd"
	            value-format="yyyy-MM-dd 00:00:00"
	            placeholder="开始时间" class="filter-item">
	    </el-date-picker>至
	    <el-date-picker
	            v-model="listQuery.endTime"
	            type="date"
	            format="yyyy-MM-dd"
	            value-format="yyyy-MM-dd 23:59:59" 
	            :picker-options="pickerBeginDateAfter"
	            placeholder="结束时间" class="filter-item">
	    </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>

		</div>
		<div class="filter-container">
			<el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
			<!--<el-button class="filter-item" type="primary" @click="handleShelves (scope.row)">下架</el-button>-->
		</div>

		<!-- 查询结果 -->
		<el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>

			<!--<el-table-column align="center" label="选择" >
      	<template slot-scope="scope">
      	 <el-checkbox :label="scope.row.goodsId "  v-model="scope.row.goodsId" @change.native="getCurrentRow(scope.$index,scope.row )">&nbsp;</el-checkbox>
      	</template>
      </el-table-column>-->

			<el-table-column align="center" label="序号" width="80">
				<template slot-scope="scope">
					<span v-text="getIndex(scope.$index)"> </span>
				</template>
			</el-table-column>

			<el-table-column align="center" min-width="100" label="藏品" prop="collectName">
			</el-table-column>

			<el-table-column align="center" min-width="100" label="图片" prop="collectName">
				<template slot-scope="scope" class="catenews">
					<img style="width: 40px;height: 40px;" :src="sysConfig.storageBaseUrl+scope.row.collectPicUrl" alt="" />
					<p>￥{{scope.row.originalPrice}}</p>
				</template>
			</el-table-column>

			<el-table-column align="center" label="库存" prop="inventory">
			</el-table-column>

			<el-table-column align="center" label="总销量" prop="saleCount">
			</el-table-column>

			<el-table-column align="center" label="藏品种类" prop="cateName">
			</el-table-column>

			<el-table-column align="center" label="状态" prop="display">
				<!--<template slot-scope="scope">
           <el-tag :type="scope.row.display==1 ? 'success' : scope.row.display==0?'error':'info' ">{{scope.row.display==1 ? '上架' : scope.row.display==0?'下架':'其他'}}</el-tag>
        </template>-->
				<template slot-scope="scope">
					<el-button size="mini">
						<span @click="changeType(scope.row)">{{scope.row.display==1?"上架":"下架"}}</span>
					</el-button>
				</template>
			</el-table-column>

			<el-table-column align="center" label="藏品历史价格" prop="saleTime">
				<template slot-scope="scope">
					<el-button size="mini">
						<span @click="gethisList(scope.row)">查看</span>
					</el-button>
				</template>
			</el-table-column>
			<el-table-column align="center" label="发布时间" prop="saleTime">
			</el-table-column>

			<el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
					<el-button type="warning" size="mini" @click="handleDelete(scope.row)">删除</el-button>
					<!--<el-button type="primary" plain size="mini" @click="handleOnShelf(scope.row)">上架</el-button>
          <el-button type="primary" plain size="mini" @click="handleLowerFrame(scope.row)">下架</el-button>-->

				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<div class="pagination-container">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>

		<!-- 藏品历史价格对话框 -->
		<el-dialog title="" :visible.sync="dialogFormVisible">
			<!-- 查询结果 -->
			<div class="filter-container">
				<span style="font-size: 18px;">藏品历史价格</span>
				<el-button class="filter-item" type="primary" size="mini" @click="handlegoodsCreate" icon="el-icon-edit">添加</el-button>
				<!--<el-button class="filter-item" type="primary" @click="handleShelves (scope.row)">下架</el-button>-->
			</div>
			<el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100%" style='width: 100%; margin-left:0px;'>
				<el-table size="small" :data="priceList" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>

					<el-table-column align="center" label="时间" prop="cateName">
						<template slot-scope="scope">
							<el-input :disabled="true" v-model="scope.row.year" style="width: 80%;"></el-input><span>年</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="值" prop="cateName">
						<template slot-scope="scope">
							<el-input :disabled="true" v-model="scope.row.price" style="width: 80%;"></el-input><span>元</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
						<template slot-scope="scope">
							<el-button type="warning" size="mini" @click="handlegoodsDelete(scope.row)">删除</el-button>

						</template>
					</el-table-column>

				</el-table>
			</el-form>
		</el-dialog>
		<el-dialog title="新增藏品历史价格" :visible.sync="dialogFormVisible1">
			<el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
				<el-form-item label="年份：" prop="year">
					<el-input v-model="dataForm.year"></el-input>
				</el-form-item>
				<el-form-item label="值：" prop="price">
					<el-input v-model="dataForm.price" type="number"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible1 = false">取消</el-button>
				<el-button type="primary" @click="createData">确定</el-button>
			</div>
		</el-dialog>

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
	import { listCollect, deletCollect, displayCollect, categoryListCollection, collectPriceList, collectPricedelete, collectPriceadd } from '@/api/collection'
	import BackToTop from '@/components/BackToTop'
	import { parseTime } from '@/utils/index'
	import { Message, MessageBox } from 'element-ui'
	//const statusMap = {
	//	1: '全部',
	//	2: '茶叶',
	//	3: '住宿',
	//	4: '投资',
	//	5: '拍卖'
	//}

	export default {
		name: 'GoodsList',
		components: {
			BackToTop
		},
		data() {
			return {
				list: [],
				total: 0,
				listLoading: true,
				priceList: undefined,
				listQuery: {
					pageNum: 1,
					pageSize: 20,
					collectName: undefined,
					collectName: undefined,
					startTime: undefined,
					endTime: undefined
				},
				descDetail: '',
				downloadLoading: false,
				dialogFormVisible: false,
				dialogFormVisible1: false,
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
				rules: {
					title: [{
						required: true,
						message: '库存不能为空',
						trigger: 'blur'
					}],
					year: [{
						required: true,
						message: '年份不能为空',
						trigger: 'blur'
					}],
					price: [{
						required: true,
						message: '价格不能为空',
						trigger: 'blur'
					}]
				},
				dataForm: {
					itemIds: '',
					ids: '',
					isDisplay: '',
					itemId: undefined,
					price: undefined,
					year: undefined
				},
				careTypedata: {
					type: 2
				},
				statusMap: [],
				sysConfig: '',
			}
		},
		created() {
			this.sysConfig = this.$store.getters.sysConfig;
			this.init()
			this.getList()
		},
		methods: {
			init: function() {
				categoryListCollection(this.careTypedata).then(response => {
					this.statusMap = response.data.data
				})
			},
			getIndex($index) {
				return $index + 1
			},
			getList() {
				this.listLoading = true
				listCollect(this.listQuery).then(response => {
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
				this.listQuery.pageNum = val
				this.getList()
			},
			handleCreate() {
				this.$router.push({
					path: '/goods/collectionCreate'
				})
			},
			handleUpdate(row) {
				this.$router.push({
					path: '/goods/collectionEdit',
					query: {
						id: row.id
					}
				})
			},
			//  删除
			handleDelete(row) {
				this.$confirm('确定要删除此项吗？','提示',{
				  confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
				}).then(()=>{
					const detateData = {
						ids: row.id,
						isDisplay: row.isDisplay
					}
					deletCollect(detateData).then(response => {
						this.$notify({
							title: '成功',
							message: '删除成功',
							type: 'success',
							duration: 2000
						})
						const index = this.list.indexOf(row)
						this.list.splice(index, 1)
						//				this.getList()
					})
				}).catch(()=>{
				    this.$message({
			            type: 'info',
			            message: '已取消删除'
			        })         
		        })
				
			},
			//		上架下架
			changeType(row) {
				this.dataForm.ids = row.id;
				if(row.display == 0) {
					this.dataForm.isDisplay = 1;
				}
				if(row.display == 1) {
					this.dataForm.isDisplay = 0;
				}

				displayCollect(this.dataForm).then(response => {
					this.getList();
					//this.dialogVisible = false ; 

				});
			},
			gethisList(row) {
				this.dataForm.itemId = row.id;
				var FormData = {
					itemId: row.id
				}
				this.dialogFormVisible = true;
				collectPriceList(FormData).then(response => {
					this.priceList = response.data.data
				})
			},
			handlegoodsDelete(row) {
				var FormData = {
					id: row.id
				}
				this.dialogFormVisible = true;
				collectPricedelete(FormData).then(response => {
					this.$notify({
						title: '成功',
						message: '删除成功',
						type: 'success',
						duration: 2000
					})
					const index = this.priceList.indexOf(row)
					this.priceList.splice(index, 1)
				})
			},
			handlegoodsCreate(row) {
				this.dialogFormVisible1 = true;
				this.$nextTick(() => {
					this.$refs['dataForm'].clearValidate()
				})

			},
			createData(row) {
				this.$refs['dataForm'].validate((valid) => {
					var FormData = {
						id: this.dataForm.itemId
					}
					if(valid) {
						collectPriceadd(this.dataForm).then(response => {
							this.dialogFormVisible1 = false;
							this.gethisList(FormData)
						})
					}
				})

			}
		}
	}
</script>