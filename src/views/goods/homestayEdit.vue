<template>
  <div class="app-container calendar-list-container">

  <!--<el-card class="box-card">-->
    
    <!--:rules="rules"-->
    <el-form :rules="rules" ref="goods" :model="goods" label-width="150px">
    	<el-card class="box-card">
    		<h3>房间基本信息</h3>
    		<el-form-item label="" prop="id">
          <el-input type="hidden" v-model="goods.id"></el-input>
        </el-form-item>	
    		<el-form-item label="房间名称" prop="roomName">
          <el-input v-model="goods.roomName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="房间类型" prop="roomType">
          <el-input v-model="goods.roomType" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="所属商户">
          <el-select v-model="goods.shopId" :disabled="true">
            <el-option v-for="item in getShops" :key="item.value" :label="item.title" :value="item.shopId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间数量" prop="roomNum">
          <el-input v-model="goods.roomNum" :disabled="true">
            <template slot="append">间</template>
          </el-input>
        </el-form-item>
        <!--<el-form-item label="状态">
          <el-select v-model="goods.display" :disabled="true">
            <el-option
				      v-for="item in displaydata"
				      :key="item.id"
				      :label="item.displayStr"
				      :value="item.id">
				    </el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="房间价格" prop="roomPrice">
          <el-input v-model="goods.roomPrice" placeholder="0.00" :disabled="true">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="活动价格" prop="roomActPrice" >
          <el-input v-model="goods.roomActPrice" placeholder="0.00" :disabled="true">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <!--<el-form-item label="积分抵现" >
          <el-input v-model="goods.deductionCount" placeholder="0.00" style="width: 10%;">
          </el-input>抵
          <el-input  v-model="goods.deductionPrice" placeholder="0.00" style="width: 10%;">                    
          </el-input>元
        </el-form-item>-->
        <el-form-item label="积分数量" prop="deductionCount">
					<el-input type='number' :disabled="true" v-model="goods.deductionCount" placeholder="0.00" style="width: 50%;">
					<template slot="append">积分</template>
					</el-input>
				</el-form-item>
				<el-form-item label="抵现金额" prop="deductionPrice">
					<el-input type='number' :disabled="true" v-model="goods.deductionPrice" placeholder="0.00" style="width: 50%;">
					 <template slot="append">元</template>
					</el-input>
				</el-form-item>
    	</el-card>
      <el-card class="box-card">
	        	<h3>房间详情</h3>
	        	<el-form-item label="可住人数" prop="liveNum">
		          <el-input v-model="goods.liveNum" :disabled="true">
		            <template slot="append">人</template>
		          </el-input>
		        </el-form-item>
		        <el-form-item label="房间格局" prop="roomLayout">
		          <el-input v-model="goods.roomLayout" :disabled="true"></el-input>
		        </el-form-item>
		        <el-form-item label="房间大小" prop="area">
		          <el-input v-model="goods.area" :disabled="true"></el-input>
		        </el-form-item>
		        <el-form-item label="配备设施" prop="facilities">
		          <el-input type="textarea" v-model="goods.facilities" :disabled="true"></el-input>
		        </el-form-item>
		        <el-form-item label="入住须知" prop="notice">
		          <el-input type="textarea" v-model="goods.notice" :disabled="true"></el-input>
		        </el-form-item>
		        <el-form-item label="其它需求" prop="requirement">
		          <el-input type="textarea" v-model="goods.requirement" :disabled="true"></el-input>
		        </el-form-item>
      </el-card>
      <el-card class="box-card">  
      	 <h3><span style="color: #FF0000; font-size: 16px;">*</span>房间图片展示</h3>
        <!--<el-form-item label="商户地址">
        	<el-cascader
        :options="cateAreaList"
        change-on-select
        v-model="selectedOptions"
        expand-trigger="hover"
        @change="handleCategoryChange" >
   			 </el-cascader>
        </el-form-item>-->
        
        <el-form-item label="外置图">
          <el-upload class="avatar-uploader" :action='uploadPath' list-type='picture-card' :show-file-list="false" accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPicUrl">
			      <img :disabled="true" v-if="outlayImg[0].itemPicUrl" :src="outlayImg[0].itemPicKey" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="简介图">
          <el-upload :disabled="true" :action='uploadPath' :limit='5' multiple accept=".jpg,.jpeg,.png,.gif" :file-list="briefImg"  list-type="picture-card" :on-exceed="uploadOverrun" :on-success="handleGalleryUrl" :on-remove="handleRemove">
             <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-card>
      <el-card>
      	<el-form-item label="房间描述">
          <!--<editor :init="editorInit" v-model="goods.roomDesc" ></editor>-->
          <div v-html="goods.roomDesc" style="width: 80%;"></div>
        </el-form-item>
        <div style="color:red;margin-left: 150px;">最多上传三张图片，单张图片大小不能超过3M，尺寸要求750px*750px</div>
      </el-card>
        
    </el-form>
  <!--</el-card>-->
  

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
.distance{
	margin-right: 50px;
}
</style>

<script>
import { listArea , listShop} from '@/api/goods'
import { roomCreate, detailRoom,roomExamine} from '@/api/homestay'
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
      briefImg:[],
      detailsImg:[],
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
      display:'',
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
//			province:"",
//			city:"",
//			district:"",
			sysConfig:'',
			storageBaseUrl:localStorage.getItem("ghtstorageBaseUrl"),
			textMap: {
        create: '提示',
        info:'提示'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      shipForm:{
				status:1
      },
      dataForm:{
      	status:-1
      },
			rules: {
				roomName: [{
						required: true,
						message: '房间名称不能为空',
						trigger: 'blur'
				}],
				roomType: [{
					  required: true,
						message: '房间类型不能为空',
						trigger: 'blur'
				}],
				shopId:[{
					  required: true,
						message: '所属商户不能为空',
						trigger: 'blur'
				}],
				roomNum:[{
					  required: true,
						message: '房间数量不能为空',
						trigger: 'blur'
				}],
				display:[{
					  required: true,
						message: '状态不能为空',
						trigger: 'blur'
				}],
				roomPrice:[{
					  required: true,
						message: '房间价格不能为空',
						trigger: 'blur'
				}],
				liveNum:[{
					  required: true,
						message: '可住人数不能为空',
						trigger: 'blur'
				}],
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
			}
    }
  },
  created() {
    this.init()
    this.sysConfig = this.$store.getters.sysConfig.storageBaseUrl
    
  },
  methods: {     
    init: function() {
      listShop().then(response => {
        this.getShops = response.data.data
      })
//    listArea().then(response => {
//    	this.cateAreaList = response.data.data
//    })
      const id = this.$route.query.id
  		detailRoom(id).then(response => {
//			console.log(response)
        	this.goods = response.data.data
        	this.galleryFileList = []
        	this.briefImg = []
        	var province = 
        	this.selectedOptions = [response.data.data.province, response.data.data.city, response.data.data.district]
					var sysConfig = this.$store.getters.sysConfig.storageBaseUrl
					console.log(this.sysConfig)
        	for(var index = 0; index < this.goods.pictures.length; index ++ ){
//      		if()
						if(this.goods.pictures[index].picType == 2){
//							this.galleryFileList.push({
//	        			url:this.storageBaseUrl+'/'+this.goods.pictures[index].itemPicUrl
//	        		})
							this.briefImg.push({
								url:sysConfig+this.goods.pictures[index].itemPicUrl,
								itemPicUrl:this.goods.pictures[index].itemPicUrl,
								itemPicKey:sysConfig+this.goods.pictures[index].itemPicUrl,
								picType:2
							})
						} else if(this.goods.pictures[index].picType == 1){
							this.outlayImg[0].itemPicUrl = this.goods.pictures[index].itemPicUrl
							this.outlayImg[0].itemPicKey = sysConfig+this.goods.pictures[index].itemPicUrl
						}
        		
        	}
      })
    },
//  handleCategoryChange(value) {
//				this.province = value[0]
//				this.city     = value[1]
//				this.district = value[2]
//  },
    handleCancel: function() {
      this.dialogFormVisible  =true
			this.dialogStatus = 'info'
    },
    handlePublish: function() {
    	this.dialogFormVisible  =true
			this.dialogStatus = 'create'
//			const finalFoods = {
//				id:this.goods.id,
//				roomName: this.goods.roomName,
//				roomType: this.goods.roomType,
//				shopId: this.goods.shopId,
//				roomNum: this.goods.roomNum,
//				roomPrice: this.goods.roomPrice,
//				roomActPrice: this.goods.roomActPrice,
//				deductionCount: this.goods.deductionCount,
//				deductionPrice: this.goods.deductionPrice,
//				liveNum: this.goods.liveNum,
//				roomLayout: this.goods.roomLayout,
//				area: this.goods.area,
//				facilities: this.goods.facilities,
//				notice:this.goods.notice,
//				requirement: this.goods.requirement,
//				pictures:this.outlayImg.concat(this.briefImg),
//				roomDesc: this.goods.roomDesc,
//				display: this.goods.display
//			}
//			this.$refs['goods'].validate((valid)=>{
//				if(valid){
//					roomCreate(finalFoods).then(response => {
//		        this.$notify({
//		          title: '成功',
//		          message: '创建成功',
//		          type: 'success',
//		          duration: 2000
//		        })
//		        this.$router.push({ path: '/goods/homestay' })
//		      }).catch(response => {
//		        MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
//		          confirmButtonText: '确定',
//		          type: 'error'
//		        })
//		      })
//				}
//			})
      
    },
    createShipData(){
     	roomExamine({id:this.$route.query.id,status:1}).then(response =>{
				this.dialogFormVisible  =false
				this.$router.push({ path: '/goods/homestay'})
			})
    },
    createRefundData(){
    	roomExamine({id:this.$route.query.id,status:-1}).then(response =>{
				this.dialogFormVisible  =false
				this.$router.push({ path: '/goods/homestay'})
    	})
    },
    uploadPicUrl: function(response) {
      this.outlayImg[0].itemPicUrl = response.data.key
      this.outlayImg[0].itemPicKey = this.sysConfig+response.data.key
    },
    uploadOverrun: function() {
      this.$message({
        type: 'error',
        message: '上传文件个数超出限制!最多上传5张图片!'
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