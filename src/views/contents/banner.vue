<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <span class="demonstration">下单时间：</span>
				<el-date-picker v-model="listQuery.beginDate" type="datetime" value-format="yyyy-MM-dd" placeholder="选择日期时间" align="right" :picker-options="pickerOptions1">
			</el-date-picker>
			<span>-</span>
      <span class="demonstration">下单时间：</span>
				<el-date-picker v-model="listQuery.endDate" type="datetime" value-format="yyyy-MM-dd" placeholder="选择日期时间" align="right" :picker-options="pickerOptions1">
				</el-date-picker>
      <el-button class="filter-item" type="primary"  icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="类型" prop="bannerType">
      	 <template slot-scope="scope">
      	 	<span>{{scope.row.bannerType==0?'无':scope.row.bannerType==1?'禅茶素材':scope.row.bannerType==3?'素食餐厅':scope.row.bannerType==4?'线上活动':scope.row.bannerType==5?'线下活动':scope.row.bannerType==6?'精准扶贫':scope.row.bannerType==101?'活动首页图':scope.row.bannerType==101?'精准扶贫首页图':'其它'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="对象名称" prop="name">
      </el-table-column>
      
      <el-table-column align="center" label="操作人" prop="operationName">
      </el-table-column>          

      <el-table-column align="center" label="状态" prop="state">
      	<template slot-scope="scope">
					<el-button size="mini"><span @click="changeType(scope.row)">{{scope.row.state==1?"正常":"禁用"}}</span></el-button>
				</template>
      </el-table-column>   

      <el-table-column align="center" property="url" label="图片">
        <template slot-scope="scope">
          <img :src="sysConfig+scope.row.imageKey" width="40"/>
        </template>
      </el-table-column>

      <el-table-column align="center" label="上传时间" prop="createdAt">
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>-->
          <el-button type="danger" size="mini"  @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 添加对话框 -->
    <el-dialog title="上传对象" :visible.sync="createDialogVisible">
    	<el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="banner名称" prop="name">
          <el-input v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="banner类型" prop="bannerType">
         	 <el-select v-model="dataForm.bannerType"  @change="itemsChangeType" placeholder="请选择">
					    <el-option
					      v-for="item in bannerTypeList"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
        </el-form-item>
        
        <el-form-item label="排序" prop="sort">
          <el-input v-model="dataForm.sort"></el-input>
        </el-form-item>
         <el-form-item label="跳转类型">
         	 <el-select v-model="dataForm.targetType"  @change="itemsChange" placeholder="请选择">
					    <el-option
					      v-for="item in bannerChangeList"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
        </el-form-item>
        <el-form-item label="外链地址链接" prop="target" v-show="istargetShowwb">
        		<el-input v-model="dataForm.target"></el-input>
        </el-form-item>
        <!--禅茶素材-->
        <el-form-item label="禅茶内链地址链接" v-if="dataForm.bannerType == 1" v-show="istargetShow">
				  <el-autocomplete popper-class="my-autocomplete" 
				  	          v-model = "dataForm.target"
					           :fetch-suggestions="querySearchAsync"
					            placeholder="请搜索"
					            @select="handleSelect">
					             <template slot-scope="props">
					                       <div class="name">
					                              {{ props.item.title }}
					                        </div>
					             </template>
					</el-autocomplete>
			     
        </el-form-item>
        <!--素食餐厅-->
        <el-form-item label="素食内链地址链接"  v-if="dataForm.bannerType == 3" v-show="istargetShow">
				  <el-autocomplete popper-class="my-autocomplete" 
				  	          v-model = "dataForm.target"
					           :fetch-suggestions="querySearchAsync"
					            placeholder="请搜索"
					            @select="handleSelectveg">
					             <template slot-scope="props">
					                       <div class="name">
					                              {{ props.item.vegName }}
					                        </div>
					             </template>
					</el-autocomplete>
			     
        </el-form-item>
        <!--活动线上，线下-->
        <el-form-item label="活动内链地址链接"  v-if="dataForm.bannerType == 4 || dataForm.bannerType == 5" v-show="istargetShow">
				  <el-autocomplete popper-class="my-autocomplete" 
				  	          v-model = "dataForm.target"
					           :fetch-suggestions="querySearchAsync"
					            placeholder="请搜索"
					            @select="handleSelectAct">
					             <template slot-scope="props">
					                       <div class="name">
					                              {{ props.item.actName }}
					                        </div>
					             </template>
					</el-autocomplete>
			     
        </el-form-item>
         <el-form-item label="选择图片：" prop="imageKey">
	         	 <!--<el-upload
	         	 v-model="dataForm.imageKey"
					   class="avatar-uploader"
					  :action="uploadPath"
					  :show-file-list="false"
					  :on-success="handleAvatarSuccess"
					  accept=".jpg,.jpeg,.png"
					  :before-upload="beforeAvatarUpload">
					  <img v-if="dataForm.imageKey" :src="sysConfig+dataForm.imageKey" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>-->
						<div class="imgBox" id="uploadHeader1" @click="getupload1">
							<img v-if = 'dataForm.imageKey' class="bigImage1" :src="sysConfig+dataForm.imageKey" alt="+">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							<div class="bigImagebg" v-if="speedProgress!=0 && speedProgress!=100">{{speedProgress==100?'speedProgress':'完成'}}%</div>
						</div>
        </el-form-item>
       
     </el-form>
			
       <div slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改banner名称" :visible.sync="updateDialogVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="banner名称" prop="name">
          <el-input v-model="dataForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import { createStorage, uploadPath ,pictureAIP} from '@/api/storage'
import { qiniu_config } from '@/api/qiniuUpload'
//搜索
import { listItemGoods, listGoods} from '@/api/goods'
import { listActivity } from '@/api/contents'	
//import { createStorage } from '@/api/storage'
import { bannerList , bannerForbidden , bannerRecover , bannerDel , bannerAdd } from '@/api/zero.js'
import { Message, MessageBox } from 'element-ui'
export default {
  name: 'Storage',
  data() {
    return {
    	uploadPath,
      list: null,
      total: null,
      width:750,
      height:360,
      listLoading: true,
      httpStatusCode:{},
      bannerTypeVal:'',
      bannerchangeVal:'',
      bannerChangeList:[
      		{
          value: 0,
          label: '内链'
        },
        {
          value: 1,
          label: '外链'
        }
      ],
      bannerTypeList:[
      	{
          value: 0,
          label: '无'
        },
        {
          value: 1,
          label: '禅茶素材'
        },
         {
          value: 3,
          label: '素食餐厅'
        },
         {
          value: 4,
          label: '线上活动'
        },
         {
          value: 5,
          label: '线下活动'
        },
        {
          value: 6,
          label: '精准扶贫'
        },
        {
      		value:101,
      		label: '活动首页图'
      	},
      	{
      		value:102,
      		label: '精准扶贫首页图'
      	}
        
      ],
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        sort: 'add_time',
        order: 'desc',
        
        beginDate:'',
        endDate:'',
        id:null,
        key:'',
        location:0,
        pageNum:1,
        pageSize:20
      },
      createDialogVisible: false,
      pickerOptions1: {
					shortcuts: [{
						text: '今天',
						onClick(picker) {
							picker.$emit('pick', new Date());
						}
					}, {
						text: '昨天',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24);
							picker.$emit('pick', date);
						}
					}, {
						text: '一周前',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', date);
						}
					}]
				},
      dataForm: {
        id: undefined,
        imageKey:'',
        location:0,
        name:'',
        sort:1,
        target:undefined,  
        targetType:undefined,
        bannerType:undefined,
      },
      updateDialogVisible: false,
      rules: {
        name: [{ required: true, message: 'banner名称不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: 'banner类型不能为空', trigger: 'blur' }],
//      target: [{ required: true, message: '请输入链接', trigger: 'blur' }],
//      imageKey:[{ required: true, message: '图片不能为空', trigger: 'blur' }],
        bannerType:[{ required: true, message: 'banner类型不能为空', trigger: 'blur' }],
//      targetType:[{ required: true, message: '跳转类型不能为空', trigger: 'blur' }],
      },
      downloadLoading: false,
      sysConfig:'',
      istargetShow:false,
      istargetShowwb:false,
      searchData:{
      	  pageNum: 1,
					pageSize: 50000,
					shopId: undefined,
					cateType: undefined,
					cateId: undefined,
					activityId: undefined,
					isDisplay: undefined,
					ids: undefined,
					isDisplay: undefined,
					title:undefined,
					vegName:undefined,
					actName:undefined,
					actType:undefined,
      },
      commodityListDatas:[],
      bannerType:"",
      bannerId:"",
      picImg:'',
      imageKey:'',
      speedProgress:0
    }
  },
  created() {
    this.getList();
    this.sysConfig = this.$store.getters.sysConfig.storageBaseUrl
  },
  methods: {
    getList() {
      this.listLoading = true
      bannerList(this.listQuery).then(response => {
      	console.log(response);
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
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: ''
      }
    },
    handleCreate() {
      this.createDialogVisible = true ; 
//    this.dataForm = {}
			this.dataForm = {
        id: undefined,
        imageKey:'',
        location:0,
        name:'',
        sort:1,
        target:"无",  ////////；
        targetType:undefined,
        bannerType:undefined,
      },
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
     // bannerAdd
      
    },
    handleUpload(item) {
      const formData = new FormData()
      formData.append('file', item.file)
      createStorage(formData).then(response => {
        this.list.unshift(response.data.data)
        this.createDialogVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.$message.error('上传失败，请重新上传')
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.updateDialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
//  	this.dataForm.sort = Math.ceil(Math.random()*2 147 483 64);
			
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
//      	bannerId

					if(this.dataForm.targetType == 0){
							this.dataForm.target = this.bannerId		
					}
          bannerAdd(this.dataForm).then(() => {
          	this.getList();
            this.createDialogVisible = false
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
		           MessageBox.alert('最多上传八张banner图', '提示', {
				        confirmButtonText: '确定',
				        type: 'error'
				      })
//				      return Promise.reject('error')         
		      })
        }
      })
    },
    handleDelete(row) {
    	this.$confirm('确定要删除此项吗？','提示',{
				  confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
			}).then(()=>{
				bannerDel(row.id).then(response => {
	        this.$notify({
	          title: '成功',
	          message: '删除成功',
	          type: 'success',
	          duration: 2000
	        })
	        const index = this.list.indexOf(row)
	        this.list.splice(index, 1)
	      })
			}).catch(()=>{
      	this.$message({
        type: 'info',
        message: '已取消删除'
      })         
      })
      
    },
    bannerForbidden(id){
    	bannerForbidden(id).then(response => {
					this.getList();
				});
    },
    bannerRecover(id){
    	bannerRecover(id).then(response => {
					this.getList();
				});
    },
     changeType(row){
     	if(row.state == 1){
     		this.bannerForbidden(row.id);
     	}
     	if(row.state == 0){
     		this.bannerRecover(row.id);
     	}
		},
//		搜索
//		商品列表
		getCommodityList(){
			
		},
//		随机搜索
		querySearchAsync(queryString, cb){
			 var sr = [];
			 if (queryString != undefined && queryString.length > 0){
			 			if(this.dataForm.bannerType == 0){
			 				
			 			} else if(this.dataForm.bannerType == 1){
			 				this.searchData.title = queryString
			 				listItemGoods(this.searchData).then(response => {					
									this.commodityListDatas = response.data.data.items
					        var list = this.commodityListDatas
					        cb(list);
							}).catch(() => {
							})
							
			 			} else if(this.dataForm.bannerType == 3){
				 				this.searchData.vegName = queryString
				 				listGoods(this.searchData).then(response => {					
	//									this.commodityListDatas = response.data.data.items
						        var list = response.data.data.items
						        cb(list);
								}).catch(() => {
								})
								console.log(queryString)
			 			} else if(this.dataForm.bannerType == 4){
			 				  this.searchData.actName = queryString
			 				  this.searchData.actType = 1
			 				  listActivity(this.searchData).then(response => {					
	//									this.commodityListDatas = response.data.data.items
						        var list = response.data.data.items
						        cb(list);
								}).catch(() => {
								})
			 			} else if(this.dataForm.bannerType == 5){
			 				  this.searchData.actName = queryString
			 				  this.searchData.actType = 2
			 				  listActivity(this.searchData).then(response => {					
	//									this.commodityListDatas = response.data.data.items
						        var list = response.data.data.items
						        cb(list);
								}).catch(() => {
								})
			 			}
			 			
			 } else {
			 		 cb(sr);
			 }
		},
//		商品
		handleSelect(item){
			this.dataForm.target = item.title
			this.bannerId = item.id
		},
//		素食
		handleSelectveg(item){
			this.dataForm.target = item.vegName
			this.bannerId = item.id
		},
//		活动
		handleSelectAct(item){
			this.dataForm.target = item.actName
			this.bannerId = item.id
		},
		itemsChangeType(val){
			console.log(val)
			if(val ==101 || val == 6){
				this.width = 240
				this.height = 240
			}else{
				this.width = 750
				this.height = 360
			}
			this.dataForm.bannerType = val
			this.dataForm.target = "";
//			console.log(this.dataForm.bannerType)
		},
		itemsChange(val) {
			console.log(val)	
			if(val == 0){
				this.istargetShow = true
				this.istargetShowwb = false
			} else {
				this.istargetShow = false
				this.istargetShowwb = true
			}
//			this.dataForm.target = val
		},
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '对象KEY', '对象名称', '对象类型', '对象大小', '访问链接']
        const filterVal = ['id', 'key', 'name', 'type', 'size', 'url']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '对象存储信息')
        this.downloadLoading = false
      })
    },
     handleAvatarSuccess(res, file) {
     	console.log(res);
     	console.log(file);
//      this.imageKey = URL.createObjectURL(file.raw);
        this.dataForm.imageKey = res.data.key;
      },
      beforeAvatarUpload(file) {
      	
      },
      //图片
      //选择图片
		getupload1:function(event){
				let _this = this
				var width = this.width 
				var height = this.height 
				var _qiniu_config = qiniu_config();
					$(event.srcElement).uploadHeader({
						width: width,
						height: height,
						showMode:false,
						cropParams:{allowSelect:false},
						ok:function(dataUrl){
							var arr   = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
							    bstr  = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
							  while(n--){
							      u8arr[n] = bstr.charCodeAt(n);
							  }						  
							var file = new File([u8arr], 'ght_image', {type:mime});
							_qiniu_config.callBack={
	//								  进度
									  next(res){
									  	_this.speedProgress = res.total.percent
									  },
	//								  失败
									  error(err){
										  alert('上传失败，请重新上传');
									  }, 
	//								  成功
									  complete(res){
										  console.log(res)
									  	_this.dataForm.imageKey = res.key
									  }
							}
							_qiniu_config.uploadFile(file,"",_qiniu_config.callBack)
						}
					}).click();
				},   
    
    
  }
}
</script>
<style type="text/css">
	.imgBox{
		width: 148px;
		height: 148px;
		border: 1px dashed rgba(0,0,0,.2);
		border-radius: 5px;
	}
	.imgBox img{
		width: 148px;
		height: 148px;
		border: 1px dashed rgba(0,0,0,.1);
		text-align: center;
		line-height: 148px;
		font-size: 40px;
		color: rgba(0,0,0,.1);
		display: block;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 148px;
		height: 148px;
		line-height: 148px;
		text-align: center;
	}
	.bigImagebg{
		position: absolute;
		top: 0;
		width: 148px;
		height: 148px;
		background-color: rgba(0,0,0,.5);
		color: #FFFFFF;
		text-align: center;
		line-height: 148px;
	}
	 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  /*.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }*/
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>