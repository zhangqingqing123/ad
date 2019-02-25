<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入类目ID" v-model="listQuery.cateId">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入类目名称" v-model="listQuery.subCateName">
      </el-input>
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

       <!--<el-table-column align="center" label="商品类目" prop="subCateName" sortable>
      </el-table-column>-->

      <el-table-column align="center" label="类目名称" prop="subCateName">
      </el-table-column>

      <el-table-column align="center" prop="subCatePic" label="类目图片">
        <template slot-scope="scope">
          <img :src="scope.row.subCatePic" width="80" v-if="scope.row.subCatePic"/>
        </template>
      </el-table-column>
			
			<el-table-column align="center" label="商品类型" prop="cateName">
      </el-table-column>
      
     <el-table-column align="center" label="商品种类" prop="cateType">
     	<template slot-scope="scope">
           <el-tag :type="scope.row.cateType==1 ? 'success' : scope.row.cateType==2?'error':scope.row.cateType==3?'danger':scope.row.cateType==4?'warning':scope.row.cateType==5?'blue':'info' ">{{scope.row.cateType==1 ? '禅茶素材' : scope.row.cateType==2?'素食餐厅':scope.row.cateType==3?'精品民宿':scope.row.cateType==4?'投资收藏': scope.row.cateType==5 ? '活动商品':'精准扶贫'}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini"  @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!--<div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>-->

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="禅茶素材种类">
					<template>
						<span>禅茶素材种类</span>
						<!--<el-select v-model="dataForm.cateType" @change="itemsChange" placeholder="禅茶素材种类">
							<el-option v-for="item in categoryListSpecies" :key="item.type" :label="item.name" :value="item.type">
							</el-option>
							<template>
								<span>禅茶素材</span>
							</template>
						</el-select>-->
					</template>
				</el-form-item>
        <el-form-item label="禅茶素材类型" prop="cateId">
          <el-select v-model="dataForm.cateId" @change="categoryChange" placeholder="禅茶素材类型">
	          	<el-option v-for="item in listCatData" :key="item.id" :label="item.cateName" :value="item.id">
	            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="禅茶素材分类名称" prop="subCateName" >
          <el-input v-model="dataForm.subCateName" placeholder="禅茶素材分类名称"></el-input>
        </el-form-item>
        
        <el-form-item label="禅茶素材分类图片" prop="subCatePic">
          <!--<el-upload v-model="dataForm.subCatePic" class="avatar-uploader" :action='uploadPath' list-type="picture-card" :show-file-list="false" accept=".jpg,.jpeg,.png" :on-success="uploadPicUrl">
			      <img v-if="dataForm.subCatePic" :src="dataForm.subCatePic" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>-->
          <div class="imgBox" id="uploadHeader1" @click="getupload1">
						<img class="bigImage1" v-if="dataForm.subCatePic" :src="dataForm.subCatePic" alt="+">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						<!--<div class="bigImagebg" v-if="speedProgress!=0 && speedProgress!=100">{{speedProgress==100?'speedProgress':'完成'}}%</div>-->
						
					</div>
        </el-form-item>              
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>
	.imgBox{
		width: 148px;
		height: 148px;
		border: 1px dashed rgba(0,0,0,.2);
		border-radius: 5px;
		position: relative;
		margin-right: 8px;
	}
	.imgBox i{
		text-align: center;
		line-height: 148px;
		display: block;
		font-size: 40px;
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
	.avatar {
	    width: 120px;
	    height: 120px;
	    display: block;
	}
</style>

<script>
import { addListGoods, addItemGoods, detailItemGoods, getItems, gitCategory, getTypes, listArea , getRole } from '@/api/goods'
import { listsSub,addSub,deleteSub,listCategory} from '@/api/category'
import { qiniu_config } from '@/api/qiniuUpload'
import { uploadPath } from '@/api/storage'
import { Message, MessageBox } from 'element-ui'

export default {
  name: 'Category',
  data() {
    return {
      uploadPath,
      list: undefined,
     // total: undefined,
      listLoading: true,
      listQuery: {
        cateId:undefined,
        subCateName:undefined
      },
      dataForm: {
      	id:undefined,
        cateId:undefined,
        subCateName:undefined,
        subCatePic:undefined,
        cateType:1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      listQuerycat: {
				cateName: undefined,
				cateType:undefined,
				type: undefined
      },
      listCatData:[],
      categoryListSpecies:[],
      rules: {
        cateId: [{ required: true, message: '商品类型不能为空', trigger: 'blur' }],
        subCateName: [{ required: true, message: '类目名称不能为空', trigger: 'blur' }],
        cateType: [{ required: true, message: '商品种类不能为空', trigger: 'blur' }], 
        //subCatePic:[{ required: true, message: '类目图片不能为空', trigger: 'blur' }], 
      },
      downloadLoading: false,
//    storageBaseUrl:localStorage.getItem("ghtstorageBaseUrl")
			sysConfig:''
    }
  },
  created() {
    this.getList()
    this.sysConfig = this.$store.getters.sysConfig.storageBaseUrl
    this.getlistCategory()
    
  },
  methods: {
  	getIndex($index) {
			return $index + 1
		},
    getList() {
      this.listLoading = true
      listsSub(this.listQuery).then(response => {
        this.list = response.data.data
       // this.total = response.data.data
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
//  getItems() {
//				getItems().then(response => {
//					this.categoryListSpecies = response.data.data;
//				})
//			},
			//商品种类
//			itemsChange(val) {
//				this.dataForm.cateType = val;
//				this.getlistCategory();
//				this.dataForm.cateId = '';
//			},
			//商品类型
			categoryChange(val) {
				this.dataForm.cateId = val ;
			},
    getlistCategory(){
    	listCategory(this.dataForm).then(response => {
        this.listCatData = response.data.data
        if(this.listCatData == ""){
						this.$message({
	            type: 'warning',
	            message: '请先设置商品类型!'
	          });
					}
      }).catch(() => {
        this.list = []
        //this.total = 0
        this.listLoading = false
      })
    },
    handleFilter() {
      //this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      //this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
     // this.listQuery.page = val
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id:undefined,
        cateId:undefined,
        subCateName:undefined,
        subCatePic:undefined,
        cateType:undefined
      }
    },
    handleCreate() {
//  	this.getItems()
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    uploadIconUrl: function(response) {
      this.dataForm.subCatePic = response.data.subCatePic
    },
    uploadPicUrl: function(response) {
      this.dataForm.subCatePic = this.sysConfig + response.data.key
    },
    //			选择商品图片
		getupload1:function(event){
			let _this = this
			var _qiniu_config = qiniu_config();
				$(event.srcElement).uploadHeader({
					width: 300,
					height: 300,
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
//									  	console.log(res.total.percent)
								  	_this.speedProgress = res.total.percent
								  },
//								  失败
								  error(err){
									  alert('上传失败，请重新上传');
								  }, 
//								  成功
								  complete(res){
									console.log(res)
//								  	_this.pictures[0].itemPicUrl = res.key;
//									_this.pictures[0].imgUrl =  res.key;
										_this.dataForm.subCatePic = _this.sysConfig+res.key
								  }
						}
						_qiniu_config.uploadFile(file,"",_qiniu_config.callBack)
					}
				}).click();
			},
    createData() {
    	
//  	console.log(this.dataForm.cateType)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
        	this.dataForm.cateType = 1
          addSub(this.dataForm).then(response => {
          	this.getList();
            this.list.unshift(response.data.data)
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
    handleUpdate(row) {
//  	this.getItems()
    	this.getlistCategory()
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
        	this.dataForm.cateType = 1
          addSub(this.dataForm).then(() => {
            for (const v of this.list) {
              if (v.id === this.dataForm.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.dataForm)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
    	this.$confirm('确定要删除此项吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
      	  			var fromData = {
					    		ids:row.id
					    	}
					      deleteSub(fromData).then(response => {
					         this.$message({
					            type: 'success',
					            message: '删除成功!'
					          });
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
    }
  }
}
</script>
