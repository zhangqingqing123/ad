<template>
  <div class="app-container calendar-list-container">

  <el-card class="box-card">
    <h3>素食信息</h3>
    <!--:rules="rules"-->
    <el-form :rules="rules" ref="goods" :model="goods" label-width="150px">
    		<el-form-item label="" prop="id">
          <el-input type="hidden" v-model="goods.id"></el-input>
        </el-form-item>	
        <el-form-item label="素食名称" prop="vegName">
          <el-input v-model="goods.vegName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="所属商户" >
          <el-select v-model="goods.shopId" :disabled="true">
            <el-option v-for="item in getShops" :key="item.value" :label="item.title" :value="item.shopId">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="状态" prop="display">
          <el-select v-model="goods.display" :disabled="true">
            <el-option
				      v-for="item in displaydata"
				      :key="item.id"
				      :label="item.displayStr"
				      :value="item.id">
				    </el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="素食价格" prop="originalPrice" >
          <el-input v-model="goods.originalPrice" placeholder="0.00" :disabled="true">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="活动价格" prop="actPrice">
          <el-input v-model="goods.actPrice" placeholder="0.00" :disabled="true">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <!--<el-form-item label="积分抵现" >
          <el-input v-model="goods.deductionCount" placeholder="0.00" style="width: 10%;" :disabled="true">
          </el-input>抵
          <el-input  v-model="goods.deductionPrice" placeholder="0.00" style="width: 10%;" :disabled="true">                    
          </el-input>元
        </el-form-item>-->
        <el-form-item label="积分数量" prop="deductionCount">
					<el-input type='number' v-model="goods.deductionCount" placeholder="0.00" style="width: 50%;" :disabled="true">
					<template slot="append">积分</template>
					</el-input>
				</el-form-item>
				<el-form-item label="抵现金额" prop="deductionPrice">
					<el-input type='number' v-model="goods.deductionPrice" placeholder="0.00" style="width: 50%;" :disabled="true">
					 <template slot="append">元</template>
					</el-input>
				</el-form-item>
        
        <el-form-item label="库存" prop="inventory">
          <el-input v-model="goods.inventory" placeholder="0.00" :disabled="true">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商户地址" prop="selectedOptions">
        	<el-cascader
        :options="cateAreaList"
        v-model="goods.selectedOptions"
        @change="handleCategoryChange" :disabled="true" style="width: 300px;">
   			 </el-cascader>
        </el-form-item>
        <el-form-item label="外置图">
          <!--<el-upload class="avatar-uploader" :action='uploadPath' list-type='picture-card' :show-file-list="false" accept=".jpg,.jpeg,.png,.gif,.jpeg" :on-success="uploadPicUrl">
			      
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>-->
          <img :disabled="true" v-if="outlayImg[0].itemPicUrl" :src="outlayImg[0].itemPicKey" class="avatar avatarImg">
        </el-form-item>
        <div style="color:red;margin-left: 150px;">最多上传一张，图片大小1M以内，尺寸140px*140px</div>
        <br>
        <el-form-item label="简介图">
          <el-upload :disabled="true"  :action='uploadPath' :limit='3' multiple accept=".jpg,.jpeg,.png" :file-list="briefImg" list-type="picture-card" :on-exceed="uploadOverrun" :on-success="handleGalleryUrl" :on-remove="handleRemove">
             <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item> 
        <div style="color:red;margin-left: 150px;">最多上传三张图片，单张图片大小1M以内，尺寸750px*450px</div>
        <br>
        <el-form-item label="素食详细介绍">
          <!--<editor id = 'GoodsCreate' :init="editorInit" v-model="goods.vegDesc" ></editor>-->
          <div v-html="goods.vegDesc" style="width: 80%;"></div>
        </el-form-item>
    </el-form>
  </el-card>
  

    <div class="op-container">
      <el-button @click="handlePublish" type="primary">审核通过</el-button>
      <el-button @click="handleCancel">审核不通过</el-button>
    </div>
		
		<!--审核弹出框-->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width='30%' center>
      <el-form :rules="rules" ref="shipForm" :model="shipForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <h3 v-if="dialogStatus=='create'">确定要审核通过吗？</h3>
        <h3 v-if="dialogStatus=='info'">确定要不通过审核吗？</h3>
       </el-form>
       <div slot="footer" class="dialog-footer">
	        <el-button @click="dialogFormVisible = false">取消</el-button>
	        <el-button v-if="dialogStatus=='create'" type="primary" @click="createShipData">确定</el-button>
      		<el-button v-else  type="primary" @click="createRefundData">确定</el-button>
       </div>
      </el-dialog>
      
  </div>
</template>

<style>
  .el-card {
    margin-bottom: 10px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .input-new-keyword {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
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
	    width: 100%;
	    height: 100%;
	    display: block;
	}
	.avatarImg{
		width: 200px;
	}
.distance{
	margin-right: 50px;
}
</style>

<script>
import {detailGoods, publishGoods , listArea , listShop,vegExamine} from '@/api/goods'
import { createStorage, uploadPath ,pictureAIP} from '@/api/storage'
import Editor from '@tinymce/tinymce-vue'
import { MessageBox } from 'element-ui'

export default {
  name: 'GoodsCreate',
  components: { Editor },
  data() {
    return {      
      uploadPath,
      cateAreaList:[],
      selectedOptions: [],
      getShops:[],
      goods: {
      	deductionCount:0,
      	deductionPrice:0
      },
      outlayImg: [{
      	itemPicUrl:"",
      	itemPicKey:"",
      	picType:1
      }],
      displaydata:[
      	{
      		id: 1,
          displayStr: '上架'
      	},
      	{
      		id: 0,
          displayStr: '下架'
      	}
      ],
      textMap: {
        create: '提示',
        info:'提示'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      shipForm:{
      	id:undefined,
				status:1
      },
      dataForm:{
      	id:undefined,
    	  status:-1
      },
      galleryFileList:[],
      briefImg:[],
      editorInit: {
        language: 'zh_CN',
        plugins: ['advlist anchor autolink autoresize autosave emoticons fullscreen hr image imagetools importcss insertdatetime legacyoutput link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace tabfocus table template textcolor textpattern visualblocks visualchars wordcount'],
        toolbar: ['bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript ', 'hr bullist numlist link image charmap preview anchor pagebreak fullscreen media table emoticons forecolor backcolor'],
        images_upload_handler: function(blobInfo, success, failure) {
          const formData = new FormData()
          formData.append('file', blobInfo.blob())
          createStorage(formData).then(res => {
            success(res.data.data.url)
//          $( '#GoodsCreate ').froalaEditor(' edit.off');
          }).catch(() => {
            failure('上传失败，请重新上传')
          })
        }
      },
			province:"",
			city:"",
			district:"",
			storageBaseUrl:localStorage.getItem("ghtstorageBaseUrl"),
			rules: {
				vegName: [{
						required: true,
						message: '素食名称不能为空',
						trigger: 'blur'
				}],
				originalPrice: [{
					  required: true,
						message: '素食价格不能为空',
						trigger: 'blur'
				}],
				inventory:[{
					  required: true,
						message: '素食价格不能为空',
						trigger: 'blur'
				}],
				display:[{
					  required: true,
						message: '状态不能为空',
						trigger: 'blur'
				}],
				shopId:[{
					  required: true,
						message: '所属商户不能为空',
						trigger: 'blur'
				}],
//				selectedOptions:[{
//					  required: true,
//						message: '商户地址不能为空',
//						trigger: 'blur'
//				}],
//				deductionCount:[{
//						required: true,
//						message: '积分数量不能为空',
//						trigger: 'blur'
//				}],
//				deductionPrice:[{
//					required: true,
//					message: '抵现金额不能为空',
//					trigger: 'blur'
//				}]
			},
			sysConfig:''
    }
  },
  created() {
  	this.sysConfig = this.$store.getters.sysConfig.storageBaseUrl
    this.init() 
//  this.getDetails()
  },
  methods: {     
    init: function() {
      listShop().then(response => {
        this.getShops = response.data.data
      })
      listArea().then(response => {
      	this.cateAreaList = response.data.data
      })
//    const storageBaseUrl = localStorage.getItem("ghtstorageBaseUrl");
//    console.log(storageBaseUrl + ":haha")
      const id = this.$route.query.id
  		detailGoods(id).then(response => {
//			console.log(response)
        	this.goods 						= response.data.data
        	this.galleryFileList  = []
        	this.briefImg 				= []
        	var province 					= 
        	this.goods.selectedOptions 	= [response.data.data.province, response.data.data.city, response.data.data.district]
					this.province 				= response.data.data.province
					this.city 						= response.data.data.city
					this.district 				= response.data.data.district
					var sysConfig  = this.$store.getters.sysConfig.storageBaseUrl
//					console.log(response.data.data.city)
        	for(var index = 0; index < this.goods.pictures.length; index ++ ){
						if(this.goods.pictures[index].picType == 2){
							this.briefImg.push({
								url:sysConfig+this.goods.pictures[index].itemPicUrl,
								itemPicUrl:this.goods.pictures[index].itemPicUrl,
								itemPicKey:sysConfig+this.goods.pictures[index].itemPicUrl,
								picType:2
							})
						} else if(this.goods.pictures[index].picType == 1){
							this.outlayImg[0].itemPicUrl = this.goods.pictures[index].itemPicUrl
							this.outlayImg[0].itemPicKey = sysConfig + this.goods.pictures[index].itemPicUrl
						}
        		
        	}
      })
     
    },
    
    handleCategoryChange(value) {
				this.province = value[0]
				this.city     = value[1]
				this.district = value[2]
    },
    handleCancel: function() {
      this.dialogFormVisible  =true
			this.dialogStatus = 'info'
    },
    handlePublish: function() {
    	this.dialogFormVisible  =true
			this.dialogStatus = 'create'
		},
		createShipData(){
       	vegExamine({id:this.$route.query.id,status:1}).then(response =>{
				this.dialogFormVisible  =false
				this.$router.push({ path: '/goods/food'})
			})
    },
    createRefundData(){
    	vegExamine({id:this.$route.query.id,status:-1}).then(response =>{
				this.dialogFormVisible  =false
				this.$router.push({ path: '/goods/food'})
    	})
    },
//  handleCancel: function() {
//    this.$router.push({ path: '/goods/food' })
//  },
//  handlePublish: function() {
//			const finalFoods = {
//				id:this.goods.id,
//				vegName:this.goods.vegName,
//				shopId: this.goods.shopId,
//				originalPrice: this.goods.originalPrice,
//				actPrice:this.goods.actPrice,
//				deductionCount:this.goods.deductionCount,
//				deductionPrice:this.goods.deductionPrice,
//				inventory:this.goods.inventory,
//				province:this.province,
//				city:this.city ,
//				district:this.district,
//				pictures:this.outlayImg.concat(this.briefImg),
//				vegDesc:this.goods.vegDesc,
//				display:this.goods.display
//			}
//			this.$refs['goods'].validate((valid)=>{
//				if(valid){
//					publishGoods(finalFoods).then(response => {
//		        this.$notify({
//		          title: '成功',
//		          message: '创建成功',
//		          type: 'success',
//		          duration: 2000
//		        })
//		        this.$router.push({ path: '/goods/food' })
//		      }).catch(response => {
//		        MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
//		          confirmButtonText: '确定',
//		          type: 'error'
//		        })
//		      })
//				}
//			})
//    
//  },
    uploadPicUrl: function(response) {
//    this.outlayImg[0].itemPicUrl = this.storageBaseUrl + response.data.key
      this.outlayImg[0].itemPicUrl = response.data.key
      this.outlayImg[0].itemPicKey = this.sysConfig+response.data.key
    },
    uploadOverrun: function() {
      this.$message({
        type: 'error',
        message: '上传文件个数超出限制!最多上传3张图片!'
      })
    },
    handleGalleryUrl(response, file, fileList) {
      if (response.code === 1) {
					this.briefImg.push({
						url:this.sysConfig+response.data.key,
						itemPicUrl:response.data.key,
						itemPicKey:this.sysConfig+response.data.key,
						picType:2
					})
					console.log(this.briefImg);
      }
    },
    handleRemove: function(file, fileList) {
    	var arry = this.briefImg;
				for(var i = 0; i < this.briefImg.length; i++) {
					// 这里存在两种情况
					// 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
					//    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
					// 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
					var url
					if(file.response === undefined) {
						url = file.url
					} else {
						url = file.response.data.url
					}
					//console.log(url) ; 
					//console.log(this.briefImg[i].itemPicUrl) ; 
					if(this.briefImg[i].itemPicKey === url) {
						this.briefImg.splice(i, 1)
					}
				}
				console.log(this.briefImg);
			},
    specChanged: function(label) {
      if (label === false) {
        this.specifications = [{ specification: '规格', value: '标准', picUrl: '' }]
        this.products = [{ id: 0, specifications: ['标准'], price: 0.00, collagePrice: 0.00,scareBuyingPrice: 0.00,bargainPrice: 0.00, number: 0, url: '' }]
      } else {
        this.specifications = []
        this.products = []
      }
    },
    handleSpecificationDelete(row) {
      const index = this.specifications.indexOf(row)
      this.specifications.splice(index, 1)
      this.specToProduct()
    },
  }
}
</script>