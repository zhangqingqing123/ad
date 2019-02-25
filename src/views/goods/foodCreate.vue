<template>
  <div class="app-container calendar-list-container">

  <el-card class="box-card">
    <h3>素食信息</h3>
    <!--:rules="rules"-->
    <el-form :rules="rules" ref="goods" :model="goods" label-width="150px">
        <el-form-item label="素食名称" prop="vegName">
          <el-input v-model="goods.vegName"></el-input>
        </el-form-item>
        <el-form-item label="所属商户"  prop="shopId">
          <el-select v-model="goods.shopId">
            <el-option v-for="item in getShops" :key="item.value" :label="item.title" :value="item.shopId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="display">
          <el-select v-model="goods.display">
            <el-option
				      v-for="item in displayData"
				      :key="item.id"
				      :label="item.displayStr"
				      :value="item.id">
				    </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="素食价格" prop="originalPrice">
          <el-input type="number" v-model="goods.originalPrice" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="活动价格" prop="actPrice">
          <el-input type="number" v-model="goods.actPrice" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <!--<el-form-item label="积分抵现" prop ="deductionCount">
          <el-input v-model="goods.deductionCount" placeholder="0.00" style="width: 10%;">
          </el-input>抵
          <el-input  v-model="goods.deductionPrice" placeholder="0.00" style="width: 10%;">                    
          </el-input>元
        </el-form-item>-->
        <el-form-item label="积分数量" prop="deductionCount">
					<el-input type='number' v-model="goods.deductionCount" placeholder="0.00" style="width: 50%;">
					<template slot="append">积分</template>
					</el-input>
				</el-form-item>
				<el-form-item label="抵现金额" prop="deductionPrice">
					<el-input type='number' v-model="goods.deductionPrice" placeholder="0.00" style="width: 50%;">
					 <template slot="append">元</template>
					</el-input>
				</el-form-item>
        <el-form-item label="库存" prop="inventory">
          <el-input v-model="goods.inventory"  placeholder="0.00">
            <template slot="append">个数</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商户地址" prop="selectedOptions">
        	<el-cascader
        :options="cateAreaList"
        v-model="goods.selectedOptions"
        @change="handleCategoryChange" >
   			 </el-cascader>
        </el-form-item>
        <el-form-item label="外置图" >
          <el-upload class="avatar-uploader" 
          	:action='uploadPath' 
          	list-type='picture-card' 
          	:show-file-list="false" 
          	accept=".jpg,.jpeg,.png,.gif,.mp4" 
          	:on-success="uploadPicUrl">
			      <img v-if="outlayImg[0].itemPicUrl" :src="outlayImg[0].itemPicKey" class="avatar" style="object-fit:none;">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
         </el-upload>
        </el-form-item>
        <div style="color:red;margin-left: 150px;">最多上传一张，图片大小1M以内，尺寸140px*140px</div>
        <br>
        <el-form-item label="简介图" >
          <el-upload :action='uploadPath' :limit='3' multiple accept=".jpg,.jpeg,.png,.gif" list-type="picture-card" :on-exceed="uploadOverrun" :on-success="handleGalleryUrl" :on-remove="handleRemove">
             <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item> 
        <div style="color:red;margin-left: 150px;">最多上传三张图片，单张图片大小1M以内，尺寸750px*450px</div>
        <br>
        <el-form-item label="素食详细介绍">
          <editor :init="editorInit" v-model="goods.vegDesc"></editor>
        </el-form-item>
        
    </el-form>
  </el-card>
  

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
import { publishGoods , listArea , listShop} from '@/api/goods'
import { createStorage, uploadPath ,pictureAIP} from '@/api/storage'
import Editor from '@tinymce/tinymce-vue'
import { MessageBox } from 'element-ui'

export default {
  name: 'GoodsCreate',
  components: { Editor },
  data() {
    return {      
      uploadPath, //上传地址
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
      displayData:[
      	{
      		id: 1,
          displayStr: '上架'
      	},
      	{
      		id: 0,
          displayStr: '下架'
      	}
      ],
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
    this.init()
    this.sysConfig = this.$store.getters.sysConfig.storageBaseUrl
  },
  methods: {     
    init: function() {
      listShop().then(response => {
        this.getShops = response.data.data
      })
      listArea().then(response => {
      	this.cateAreaList = response.data.data
      })
    },
    handleCategoryChange(value) {
				this.province = value[0]
				this.city     = value[1]
				this.district = value[2]
    },
    handleCancel: function() {
      this.$router.push({ path: '/goods/food' })
    },
    handlePublish: function() {
			const finalFoods = {
				vegName:this.goods.vegName,
				shopId: this.goods.shopId,
				originalPrice: this.goods.originalPrice,
				actPrice:this.goods.actPrice,
				deductionCount:this.goods.deductionCount,
				deductionPrice:this.goods.deductionPrice,
				inventory:this.goods.inventory,
				province:this.province,
				city:this.city ,
				district:this.district,
				pictures:this.outlayImg.concat(this.briefImg),
				vegDesc:this.goods.vegDesc,
				display:this.goods.display
			}
			this.$refs['goods'].validate((valid)=>{
				if(valid){
					publishGoods(finalFoods).then(response => {
		        this.$notify({
		          title: '成功',
		          message: '创建成功',
		          type: 'success',
		          duration: 2000
		        })
		        this.$router.push({ path: '/goods/food' })
		      }).catch(response => {
		        MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
		          confirmButtonText: '确定',
		          type: 'error'
		        })
		      })
				}
			})
      
    },
//  上传成功
    uploadPicUrl: function(response) {
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