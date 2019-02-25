<template>
  <div class="app-container calendar-list-container">

  <!--<el-card class="box-card">-->
    
    <!--:rules="rules"-->
    <el-form :rules="rules" ref="goods" :model="goods" label-width="150px">
    	<el-card class="box-card">
    		<h3>房间基本信息</h3>
    		<el-form-item label="房间名称" prop="roomName">
          <el-input v-model="goods.roomName"></el-input>
        </el-form-item>
        <el-form-item label="房间类型" prop="roomType">
          <el-input v-model="goods.roomType"></el-input>
        </el-form-item>
        <el-form-item label="所属商户" prop="shopId">
          <el-select v-model="goods.shopId">
            <el-option v-for="item in getShops" :key="item.value" :label="item.title" :value="item.shopId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间数量" prop="roomNum">
          <el-input v-model="goods.roomNum">
            <template slot="append">间</template>
          </el-input>
        </el-form-item>
        <el-form-item label="状态" >
          <el-select v-model="goods.display">
            <el-option  label="上架" value="1" key></el-option>
            <el-option  label="下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间价格" prop="roomPrice">
          <el-input v-model="goods.roomPrice" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="活动价格" prop="roomActPrice">
          <el-input v-model="goods.roomActPrice" placeholder="0.00">
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
					<el-input type='number'v-model="goods.deductionCount" placeholder="0.00" style="width: 50%;">
					<template slot="append">积分</template>
					</el-input>
				</el-form-item>
				<el-form-item label="抵现金额" prop="deductionPrice">
					<el-input type='number' v-model="goods.deductionPrice" placeholder="0.00" style="width: 50%;">
					 <template slot="append">元</template>
					</el-input>
				</el-form-item>
    	</el-card>
      <el-card class="box-card">
	        	<h3>房间详情</h3>
	        	<el-form-item label="可住人数" prop="liveNum">
		          <el-input v-model="goods.liveNum">
		            <template slot="append">人</template>
		          </el-input>
		        </el-form-item>
		        <el-form-item label="房间格局" prop="roomLayout">
		          <el-input v-model="goods.roomLayout"></el-input>
		        </el-form-item>
		        <el-form-item label="房间大小" prop="area">
		          <el-input v-model="goods.area"></el-input>
		        </el-form-item>
		        <el-form-item label="配备设施" prop="facilities">
		          <el-input type="textarea" v-model="goods.facilities"></el-input>
		        </el-form-item>
		        <el-form-item label="入住须知" prop="notice">
		          <el-input type="textarea" v-model="goods.notice"></el-input>
		        </el-form-item>
		        <el-form-item label="其它需求" prop="requirement">
		          <el-input type="textarea" v-model="goods.requirement"></el-input>
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
			      <img v-if="outlayImg[0].itemPicUrl" :src="outlayImg[0].itemPicKey" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <div style="color:red;margin-left: 150px;">最多上传一张，图片大小1M以内，尺寸140px*140px</div>
        <br>
        <el-form-item label="简介图">
          <el-upload :action='uploadPath' :limit='5' multiple accept=".jpg,.jpeg,.png,.gif" list-type="picture-card" :on-exceed="uploadOverrun" :on-success="handleGalleryUrl" :on-remove="handleRemove">
             <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <div style="color:red;margin-left: 150px;">最多上传三张图片，单张图片大小1M以内，尺寸750px*450px</div>
        <br>
      </el-card>
      <el-card>
      	<el-form-item label="房间描述">
          <!--<editor :init="editorInit" v-model="goods.roomDesc"></editor>-->
          <el-input type="textarea" v-model="goods.roomDesc"></el-input>
       </el-form-item>
      </el-card>
        
    </el-form>
  <!--</el-card>-->
  

    <div class="op-container">
      <el-button @click="handlePublish" type="primary">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>

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
import { roomCreate} from '@/api/homestay'
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
			storageBaseUrl:localStorage.getItem("ghtstorageBaseUrl"),
			sysConfig:'',
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
    },
//  handleCategoryChange(value) {
//				this.province = value[0]
//				this.city     = value[1]
//				this.district = value[2]
//  },
    handleCancel: function() {
      this.$router.push({ path: '/goods/homestay' })
    },
    handlePublish: function() {
			const finalFoods = {
				roomName: this.goods.roomName,
				roomType: this.goods.roomType,
				shopId: this.goods.shopId,
				roomNum: this.goods.roomNum,
				roomPrice: this.goods.roomPrice,
				roomActPrice: this.goods.roomActPrice,
				deductionCount: this.goods.deductionCount,
				deductionPrice: this.goods.deductionPrice,
				liveNum: this.goods.liveNum,
				roomLayout: this.goods.roomLayout,
				area: this.goods.area,
				facilities: this.goods.facilities,
				notice:this.goods.notice,
				requirement: this.goods.requirement,
				pictures:this.outlayImg.concat(this.briefImg),
				roomDesc: this.goods.roomDesc,
				display: this.goods.display
			}
			console.log(finalFoods)
			this.$refs['goods'].validate((valid)=>{
				if(valid){
					roomCreate(finalFoods).then(response => {
		        this.$notify({
		          title: '成功',
		          message: '创建成功',
		          type: 'success',
		          duration: 2000
		        })
		        this.$router.push({ path: '/goods/homestay' })
		      }).catch(response => {
		        MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
		          confirmButtonText: '确定',
		          type: 'error'
		        })
		      })
				}
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
						itemPicUrl:response.data.key,
						imgUrl:response.data.url,
						picType:2
					})
					console.log(this.briefImg);
      }
    },
    handleRemove: function(file, fileList) {
      for (var i = 0; i < this.briefImg.length; i++) {
        // 这里存在两种情况
        // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
        //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
        // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
        var url
        if (file.response === undefined) {
          url = file.url
        } else {
          url = file.response.data.url
        }
        if (this.briefImg[i].imgUrl == url) {}
          this.briefImg.splice(i, 1);
          
        
      }
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