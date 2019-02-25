<template>
	<div class="app-container calendar-list-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input clearable class="filter-item" style="width: 150px;" placeholder="请输入资讯名称" v-model="listQuery.title">
			</el-input>
			<!--<el-select multiple style="width: 150px" class="filter-item" placeholder="请选择资讯种类" v-model="listQuery.status" >
        <el-option v-for="item in typeDisplayList" :key="item.id" :label="item.cateName" :value="item.cateType">
        </el-option>
      </el-select>-->
			<el-select class="filter-item" placeholder="请选择资讯种类" v-model="listQuery.cateType">
				<el-option v-for="item in statusMap" :key="item.type" :label="item.name" :value="item.type">
				</el-option>
			</el-select>
			<!--<el-select multiple style="width: 150px" class="filter-item" placeholder="请选择资讯状态" v-model="listQuery.status" >
        <el-option v-for="(key, value) in advstatusMap" :key="key" :label="key" :value="value">
        </el-option>
      </el-select> -->
			<el-date-picker v-model="listQuery.startTime" type="date" :picker-options="pickerBeginDateBefore" format="yyyy-MM-dd" value-format="yyyy-MM-dd 00:00:00" placeholder="开始时间" class="filter-item">
			</el-date-picker>至
			<el-date-picker v-model="listQuery.endTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd 23:59:59" :picker-options="pickerBeginDateAfter" placeholder="结束时间" class="filter-item">
			</el-date-picker>
			<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>

		</div>
		<div class="filter-container">
			<el-button class="filter-item" type="primary" @click="handleOnCreate" icon="el-icon-edit">添加资讯管理</el-button>
		</div>

		<!-- 查询结果 -->
		<el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>

			<el-table-column align="center" label="序号" width="80">
				<template slot-scope="scope">
					<span v-text="getIndex(scope.$index)"> </span>
				</template>
			</el-table-column>

			<el-table-column align="center" label="资讯名称" prop="title">
			</el-table-column>

			<el-table-column align="center" label="资讯种类" prop="cateName">
				<template slot-scope="scope">
					<el-tag :type="scope.row.cateType==1 ? 'success' : scope.row.cateType==2?'error':scope.row.cateType==3?'danger':scope.row.cateType==4?'warning':scope.row.cateType==5?'blue':'info' ">{{scope.row.cateType==1 ? '禅茶素材' : scope.row.cateType==2?'素食餐厅':scope.row.cateType==3?'精品民宿':scope.row.cateType==4?'投资收藏': scope.row.cateType==5 ? '活动商品':'精准扶贫'}}</el-tag>
				</template>
			</el-table-column>

			<el-table-column align="center" label="资讯类型" prop="cateName">
			</el-table-column>

			<el-table-column align="center" label="来源" prop="source">
			</el-table-column>

			<el-table-column align="center" label="上传人" prop="managerName">
			</el-table-column>

			<el-table-column align="center" label="上传时间" prop="createdAt">
			</el-table-column>

			<el-table-column align="center" label="详情" prop="isDisplay">
				<template slot-scope="scope">
					<el-dialog title="详情" :visible.sync="descDialogVisible">
						<div v-html="descDetail"></div>
					</el-dialog>
					<el-button size="mini" @click="handleDetails(scope.row)">查看</el-button>
				</template>
			</el-table-column>

			<el-table-column align="center" label="状态" prop="isDisplay">
				<template slot-scope="scope">
					<el-button size="mini"><span @click="displayItemGoods(scope.row)">{{scope.row.isDisplay==1?"正常":"禁用"}}</span></el-button>
				</template>
			</el-table-column>

			<el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<!--<el-button type="primary" size="mini" @click="handleRecovery(scope.row)">恢复</el-button>
          <el-button type="primary" size="mini" @click="handleDisable(scope.row)">禁用</el-button>-->
					<el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">编辑</el-button>
					<el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
			<el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="140px" style='width: 80%; margin-left:50px;'>
				<el-form-item label="资讯名称" prop="title">
					<el-input v-model="dataForm.title"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="display">
					<el-select v-model="dataForm.display">
						<el-option v-for="item in displaydatas" :key="item.id" :label="item.displayStr" :value="item.id">
						</el-option>
					</el-select>

				</el-form-item>
				<el-form-item label="资讯种类" prop="cateType">
					<el-select class="filter-item" placeholder="请选择资讯种类" v-model="dataForm.cateType" @change="itemsChange">
						<el-option v-for="item in statusMap" :key="item.type" :label="item.name" :value="item.type">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="资讯类型" prop="cateId">
					<template slot-scope="scope">
						<el-select placeholder="请选择资讯类型" v-model="dataForm.cateId">
							<el-option v-for="item in typeDisplayLists" :key="item.id" :label="item.cateName" :value="item.id">
							</el-option>
						</el-select>
					</template>
				</el-form-item>
				<el-form-item label="资讯来源" prop="source">
					<el-input v-model="dataForm.source"></el-input>
				</el-form-item>
				<el-form-item label="资讯简介" prop="shortContent">
					<el-input type="textarea" v-model="dataForm.shortContent"></el-input>
				</el-form-item>
				<el-form-item label="内容" prop="content">
					<editor :init="editorInit" v-model="dataForm.content"></editor>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
				<el-button v-else type="primary" @click="updateData(dataForm.id)">确定</el-button>
			</div>
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
	import { listInformation, deleteInformation, displayInformation, typeListInformation, addInformation, detailInformation, displayGoods, listcateType } from '@/api/contents'
	//import { listGoods, deleteGoods } from '@/api/goods'
	import BackToTop from '@/components/BackToTop'
	import Editor from '@tinymce/tinymce-vue'
	import { Message, MessageBox } from 'element-ui'
	import { parseTime } from '@/utils/index'
	import { createStorage, uploadPath, pictureAIP } from '@/api/storage'

	//const statusMap = {
	//	1: '全部',
	//	2: '茶叶',
	//	3: '住房'
	//}

	export default {
		name: 'GoodsList',
		components: {
			Editor,
			BackToTop
		},
		data() {
			const validateTitle = (rule, value, callback) => {
				var reg = /^.{1,30}$/
				if(!value) {
					callback(new Error('资讯简介不能为空'))
				} else {
					if(!reg.test(value)) {
						callback(new Error('资讯简介字数限制不能超过30个字符！'))
					} else {
						callback()
					}

				}
			}
			const validateShortContent = (rule, value, callback) => {
				var reg = /^.{1,100}$/
				if(!value) {
					callback(new Error('资讯简介不能为空'))
				} else {
					if(!reg.test(value)) {
						callback(new Error('资讯简介字数限制不能超过100个字符！'))
					} else {
						callback()
					}

				}
			}
			return {
				list: [],
				total: 0,
				statusMap: [],
				//    advstatusMap,
				listLoading: true,
				listQuery: {
					cateId: undefined,
					cateType: undefined,
					endTime: undefined,
					isDisplay: undefined,
					pageNum: 1,
					pageSize: 20,
					startTime: undefined,
					title: undefined,
					cateName: undefined,
					ids: undefined,
					//      sort: 'add_time',
					//      order: 'desc'
				},
				displayData: {
					ids: '',
					isDisplay: ''
				},
				displaydatas: [{
						id: 1,
						displayStr: '上线'
					},
					{
						id: 0,
						displayStr: '下线'
					}
				],
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
				dataForm: {
					ids: undefined,
					isDisplay: undefined,
					display: undefined,
					cateType: undefined,
					dataFormtype: [],
					cateId: undefined,
					id: undefined,
					title: '',
					cateName: '',
					source: '',
					shortContent: '',
					managerName: '',
					content: ''
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
						message: '资讯名称不能为空',
						trigger: 'blur'
					},
					{
						validator: validateTitle,
						trigger: 'blur'
					}
					],
					dataFormtype: [{
						required: true,
						message: '资讯种类不能为空',
						trigger: 'blur'
					}],
					source: [{
						required: true,
						message: '资讯来源不能为空',
						trigger: 'blur'
					}],
					shortContent: [{
							required: true,
							message: '资讯简介不能为空',
							trigger: 'blur'
						},
						{
							validator: validateShortContent,
							trigger: 'blur'
						}
					],
					cateType: [{
						required: true,
						message: '资讯种类,不能为空',
						trigger: 'blur'
					}],
					cateId: [{
						required: true,
						message: '资讯类型不能为空',
						trigger: 'blur'
					}]
				},
				editorInit: {
					language: 'zh_CN',
					plugins: ['advlist anchor autolink autoresize autosave emoticons fullscreen hr image imagetools importcss insertdatetime legacyoutput link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace tabfocus table template textcolor textpattern visualblocks visualchars wordcount'],
					toolbar: ['bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript ', 'hr bullist numlist link image charmap preview anchor pagebreak fullscreen media table emoticons forecolor backcolor'],
					images_upload_handler: function(blobInfo, success, failure) {
						const formData = new FormData()
						formData.append('file', blobInfo.blob())
						createStorage(formData).then(res => {
							success(res.data.data.url)
						}).catch(() => {
							failure('上传失败，请重新上传')
						})
					}
				},
				typeDisplayList: [],
				typeDisplayLists: [],
				//   		dataFormtype:"",
				descDialogVisible: false
			}
		},
		created() {
			this.init()
			this.getList()
			this.getCatetype()
		},
		methods: {
			init: function() {
				var data = {
					cateName: undefined,
					cateType: this.dataForm.cateType,
					endTime: undefined,
					isDisplay: undefined,
					startTime: undefined
				}
				typeListInformation(data).then(response => {
					this.typeDisplayList = response.data.data
					this.typeDisplayLists = response.data.data
				})

			},
			getCatetype: function() {
				listcateType().then(response => {
					this.statusMap = response.data.data
				})
			},
			//获取咨询种类Id
			itemsChange(val) {
				console.log(val)
				this.dataForm.cateType = val;
				this.dataForm.cateId = '';
				this.init()
			},
			getIndex($index) {
				return $index + 1
			},
			getList() {
				this.listLoading = true
				listInformation(this.listQuery).then(response => {
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
			handleOnCreate() {
				this.dialogFormVisible = true
				this.dialogStatus = 'create'
				this.dataForm.cateType = undefined
				this.dataForm.cateId = undefined
				this.dataForm.content = ""
				this.dataForm.shortContent = undefined
				this.dataForm.source = undefined
				this.dataForm.title = undefined
				this.dataForm.display = ''

				this.$nextTick(() => {
					this.$refs['dataForm'].clearValidate()
				})
			},
			//  上下架
			displayItemGoods(row) {

				this.displayData.ids = row.id;
				//console.log(row);
				if(row.isDisplay == 0) {
					this.displayData.isDisplay = 1;
					console.log(this.displayData.isDisplay)
				}
				if(row.isDisplay == 1) {
					this.displayData.isDisplay = 0;
					console.log(this.displayData.isDisplay)
				}
				displayGoods(this.displayData).then(response => {
					this.getList();
				})
			},
			handleRecovery(row) {
				var data = {
					ids: row.id,
					isDisplay: 1
				}
				displayInformation(data).then(response => {
					this.$notify({
						title: '成功',
						message: '启动成功',
						type: 'success',
						duration: 2000
					})
					this.getList()
				})
			},
			handleDisable() {
				var data = {
					ids: row.id,
					isDisplay: 0
				}
				displayInformation(data).then(response => {
					this.$notify({
						title: '成功',
						message: '禁止成功',
						type: 'success',
						duration: 2000
					})
					this.getList()
				})
			},
			createData() {
				//  	console.log(dataform)
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						const dataform = {
							cateType: this.dataForm.cateType,
							cateId: this.dataForm.cateId,
							content: this.dataForm.content,
							shortContent: this.dataForm.shortContent,
							source: this.dataForm.source,
							title: this.dataForm.title,
							display: this.dataForm.display,
						}
						addInformation(dataform).then(response => {
							this.getList()
							this.dialogFormVisible = false
							this.$notify({
								title: '成功',
								message: '创建成功',
								type: 'success',
								duration: 2000
							})
						})
					}

				})

			},
			//	编辑
			handleUpdate(row) {
				this.dialogStatus = 'update'
				this.dialogFormVisible = true
				detailInformation(row).then(response => {
					this.dataForm.title = response.data.data.title
					this.dataForm.content = response.data.data.content
					this.dataForm.cateName = response.data.data.cateName
					this.dataForm.source = response.data.data.source
					this.dataForm.shortContent = response.data.data.shortContent
					this.dataForm.managerName = response.data.data.managerName
					this.dataForm.cateType = response.data.data.cateType
					this.dataForm.cateId = response.data.data.cateId
					this.dataForm.display = response.data.data.isDisplay
					this.dataForm.id = response.data.data.id
					this.init()
				})
				this.$nextTick(() => {
					this.$refs['dataForm'].clearValidate()
				})
			},
			//编辑修改
			updateData(row) {
				this.$refs['dataForm'].clearValidate()
				const data = {
					cateType: this.dataForm.cateType,
					cateId: this.dataForm.cateId,
					content: this.dataForm.content,
					shortContent: this.dataForm.shortContent,
					source: this.dataForm.source,
					title: this.dataForm.title,
					display: this.dataForm.display,
					id: this.dataForm.id
				}
				addInformation(data).then(response => {
					this.getList()
					this.dialogFormVisible = false
					this.$notify({
						title: '成功',
						message: '修改成功',
						type: 'success',
						duration: 2000
					})
				})
			},
			//删除
			handleDelete(row) {
				this.$confirm('确定要删除此项吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var data = {
						ids: row.id,
						isDisplay: row.isDisplay
					}
					deleteInformation(data).then(response => {
						this.$notify({
							title: '成功',
							message: '删除成功',
							type: 'success',
							duration: 2000
						})
						const index = this.list.indexOf(row)
						this.list.splice(index, 1)
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})

			},
			//  查看详情
			handleDetails(row) {

				const id = row.id
				detailInformation(id).then(response => {
					this.descDetail = response.data.data.content
					//    	this.cateAreaList = 
				})
				this.descDialogVisible = true
			}
		}
	}
</script>