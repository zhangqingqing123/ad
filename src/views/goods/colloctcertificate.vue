<template>
  <div class="app-container calendar-list-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入证书模板名称" v-model="listQuery.tempName">
      </el-input>
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

      <el-table-column align="center" min-width="100px" label="证书模板名称" prop="tempName">
      </el-table-column>
      
      <el-table-column align="center" label="证书模板图片" prop="tempUrl">
        <template slot-scope="scope">
          <img :src="scope.row.tempUrl" width="80" v-if="scope.row.tempUrl"/>
        </template>
      </el-table-column>
      
       <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini"  @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!--添加修改弹框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="112px" style='width: 400px; margin-left:50px;'>             
        <el-form-item label="证书模板名称" prop="tempName">
          <el-input v-model="dataForm.tempName"></el-input>
        </el-form-item>
        <el-form-item label="证书模块图片" prop="tempUrl">
          <el-upload class="avatar-uploader" :action="uploadPath" list-type="picture-card" :show-file-list="false" accept=".jpg,.jpeg,.png,.gif" :on-success="uploadUrl">
			      <img v-if="dataForm.tempUrl" :src="dataForm.tempUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!--<div class="imgBox" id="uploadHeader1" @click="getupload1">
							<img v-if = 'dataForm.tempUrl' class="bigImage1" :src="dataForm.tempUrl" alt="+">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							<div class="bigImagebg" v-if="speedProgress!=0 && speedProgress!=100">{{speedProgress==100?'speedProgress':'完成'}}%</div>
						</div>-->
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
//import { listRegion } from '@/api/region'
import { listCollect,addCollect,deleteCollect} from '@/api/modlecollection'
import { uploadPath } from '@/api/storage'
import { Message, MessageBox } from 'element-ui'
import { qiniu_config } from '@/api/qiniuUpload'
export default {
  name: 'Keyword',
  data() {
    return {
      list: undefined,
      //total: undefined,
      speedProgress:0,
      listLoading: true,
      uploadPath,
      listQuery: {
        id:undefined,
        tempName: undefined,
        tempUrl: undefined
      },
      downloadLoading: false,
      dataForm:{
      	id:undefined,
        tempName: undefined,
        tempUrl: undefined,
        file:undefined
        
//      createdAt:'',
//				isUse:undefined,
//				key	:'',
//				mediaType:undefined,
//				originalName:undefined,
//				repeatNum:'',
//				result:'',
//				size:undefined,
//				url:undefined
      },
      dialogFormVisible:false,
      dialogStatus: '',
      textMap: {
        create: '创建',
        update: '编辑'
      },
      rules: {
        tempName: [{ required: true, message: '证书模板不能为空', trigger: 'blur' }],
        tempUrl: [{ required: true, message: '证书模板图片不能为空', trigger: 'blur' }]   
      },
      storageBaseUrl:localStorage.getItem("ghtstorageBaseUrl"),
      sysConfig:''
    }
  },
  created() {
  	this.sysConfig = this.$store.getters.sysConfig.storageBaseUrl;
    this.getList()
  },
  methods: {
  	getIndex($index){
  		return  $index + 1
  	},
    getList() {
      this.listLoading = true
      listCollect(this.listQuery).then(response => {
        this.list = response.data.data
        //this.total = response.data.data
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
    uploadUrl: function(response) {
      this.dataForm.tempUrl = this.sysConfig + response.data.key
    },
    //选择图片
		getupload1:function(event){
				let _this = this
				var _qiniu_config = qiniu_config();
				$(event.srcElement).uploadHeader({
					width:300,
					height:300,
					showMode:false,
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
								  	_this.dataForm.tempUrl =_this.sysConfig+ res.key
								  }
						}
						_qiniu_config.uploadFile(file,"",_qiniu_config.callBack)
					}
				}).click();
			},   
    resetForm(){
    	this.dataForm={
      	id:undefined,
        tempName: undefined,
        tempUrl: undefined,
        file:undefined
        
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
				deleteCollect(formData).then(response => {
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
    	this.$refs['dataForm'].validate((valid)=>{
    		if(valid){
    			addCollect(this.dataForm).then(response => {
	        	console.log(response);
	        	  this.getList();
	            this.list.unshift(response.data);
	            this.dialogFormVisible = false;
	            this.$notify({
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
          addCollect(this.dataForm).then(() => {
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
	.avatar{
		/*height: 80px;*/
		height: 148px;
		width: 148px;
	}
</style>