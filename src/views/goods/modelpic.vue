<template>
  <div class="app-container calendar-list-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-select style="width: 200px" class="filter-item" placeholder="请选择图片种类状态" v-model="listQuery.cateTypeArray" >
        <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value">
        </el-option>
      </el-select> 
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="图片" prop="picUrl">
        <template slot-scope="scope">
          <img :src="sysConfig+scope.row.picUrl" width="80" v-if="scope.row.picUrl"/>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="图片种类" prop="cateType">
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
    <!--添加修改弹窗-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" style='width: 560px; margin-left:50px;'>             
        
        <el-form-item label="所属种类" prop="cateType">
	         <el-select v-model="dataForm.cateType">
            <el-option label="禅茶素材" :value="1">
            </el-option>
            <el-option label="素食餐厅" :value="2">
            </el-option>
            <el-option label="精品民宿" :value="3">
            </el-option>
            <el-option label="投资收藏" :value="4">
            </el-option>
            <el-option label="活动商品" :value="5">
            </el-option>
            <el-option label="精准扶贫" :value="6">
            </el-option>
          </el-select>        
        </el-form-item>
        <el-form-item label="图片" prop="picUrl">
          <!--<el-upload class="avatar-uploader" :action="uploadPath" list-type="picture-card" :show-file-list="false" accept=".jpg,.jpeg,.png,.gif" :on-success="uploadUrl">
			      <img v-if="dataForm.picUrl" :src="dataForm.picUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>-->
          <div class="imgBox" id="uploadHeader1" @click="getupload1">
							<img v-if = 'dataForm.picUrl' class="bigImage1" :src="sysConfig+dataForm.picUrl" alt="+">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							<div class="bigImagebg" v-if="speedProgress!=0 && speedProgress!=100">{{speedProgress==100?'speedProgress':'完成'}}%</div>
						</div>
						
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <!--<div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>-->

  </div>
</template>

<script>
import { listModelpic,addModelpic,deleteModelpic } from '@/api/modelpic'
import { uploadPath } from '@/api/storage'
import { Message, MessageBox } from 'element-ui'
import { qiniu_config } from '@/api/qiniuUpload'
const statusMap = {
	1:'禅茶素材',
	2:'素食餐厅',
	3:'精品民宿',
	4:'投资收藏',
	5:'活动商品',
	6:'精准扶贫'
}
export default {
  name: 'Keyword',
  data() {
    return {
    	uploadPath,
      list: undefined,
      //total: undefined,
      speedProgress:0,
      statusMap,
      listLoading: true,
      listQuery: {
      	pageNum:1,
      	pageSize:20,
        cateType:undefined,
        cateTypeArray:[]
      },
      downloadLoading: false,
      dataForm:{
      	cateType: undefined,
			  id: undefined,
			  picUrl:undefined
      },
      dialogFormVisible:false,
      dialogStatus: '',
      textMap: {
        create: '创建',
        update: '编辑'
      },
      rules: {
        picUrl: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
        cateType: [{ required: true, message: '图片种类不能为空', trigger: 'blur' }]   
      },
//    storageBaseUrl:localStorage.getItem("ghtstorageBaseUrl")
			sysConfig:'',
    }
  },
  created() {
  	this.sysConfig = this.$store.getters.sysConfig.storageBaseUrl
    this.getList()
  },
  methods: {
  	getIndex($index){
  		return  $index + 1
  	},
    getList() {
      this.listLoading = true
      listModelpic(this.listQuery).then(response => {
        this.list = response.data.data
        //this.total = response.data.data
        this.listLoading = false
      }).catch(() => {
        this.list = []
        //this.total = 0
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
    uploadUrl: function(response) {
      this.dataForm.picUrl = this.sysConfig + response.data.key
    }, 
    //选择图片
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
								  	_this.speedProgress = res.total.percent
								  },
//								  失败
								  error(err){
									  alert('上传失败，请重新上传');
								  }, 
//								  成功
								  complete(res){
									  console.log(res)
								  	_this.dataForm.picUrl = res.key
								  }
						}
						_qiniu_config.uploadFile(file,"",_qiniu_config.callBack)
					}
				}).click();
		},   
    resetForm() {
      this.dataForm = {
        cateType: undefined,
			  id: undefined,
			  picUrl:undefined
      }
    },
    handleCreate(){
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
		},
     handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
    	this.$confirm('确定要删除此项吗？','提示',{
				  confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
			}).then(()=>{
				var formData = {
						ids:row.id
					}
				deleteModelpic(formData).then(response => {					
	        this.$message({
	            type: 'success',
	            message: '删除成功!'
	          });
	      const index = this.list.indexOf(row)
	      this.list.splice(index, 1)
	      this.getList()
	      })
			}).catch(()=>{
      	this.$message({
	        type: 'info',
	        message: '已取消删除'
	      })         
      })
      
    },
    createData(data){
    	var _this = this;
    	this.$refs['dataForm'].validate((valid) => {
    		if(valid){
    			addModelpic(this.dataForm).then(response => {
			  	    _this.getList()
		        _this.list.unshift(response.data);
		        _this.dialogFormVisible = false;
		        _this.$notify({
		          title: '成功',
		          message: '添加成功',
		          type: 'success',
		          duration: 2000
		        })
		      })
    		}
    	})
		  
    },
    updateData(){
    	this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addModelpic(this.dataForm).then(() => {
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
    }
  }
}
</script>
<style scoped>
	.imgBox{
		width: 148px;
		height: 148px;
		border: 1px dashed rgba(0,0,0,.2);
		border-radius: 5px;
		margin-left: 80px;
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
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 148px;
		height: 148px;
		line-height: 148px;
		text-align: center;
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
	/*.avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 120px;
	    height: 120px;
	    line-height: 120px;
	    text-align: center;
	}*/
	.avatar {
	    width: 120px;
	    height: 120px;
	    display: block;
	}
	#specifications{
		width: 200px;
		color: #606266;
		height: 36px;
		border-radius: 4px;
    border: 1px solid #dcdfe6;
}
</style>