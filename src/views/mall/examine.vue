<template>
  <div class="app-container calendar-list-container">

  <el-card class="box-card">
    <h3>商品基础信息</h3>
    <el-form :rules="rules" ref="goods" :model="goods" label-width="150px">
        <el-form-item label="商家名称" prop="goodsSn">
          <el-input v-model="goods.goodsSn"></el-input>
        </el-form-item>
        <el-form-item label="商家种类" prop="name">
          <!--<el-input v-model="goods.name"></el-input>-->
          <el-select>
          	<el-option label="茶企" value="shanghai"></el-option>
      			<el-option label="餐饮" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="goodsSn">
          <el-input v-model="goods.goodsSn"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="goodsSn">
          <el-input v-model="goods.goodsSn"></el-input>
        </el-form-item>
        <el-form-item label="商家电话" prop="goodsSn">
          <el-input v-model="goods.goodsSn"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="goodsSn">
          <el-input v-model="goods.goodsSn"></el-input>
        </el-form-item>
                    
        <!--<el-form-item label="商品详细介绍">
          <editor :init="editorInit" v-model="goods.desc"></editor>
        </el-form-item>    -->
      </el-form>
    </el-card>
   
    <el-card class="box-card">
      <h3>抽成比例</h3>
      <hgroup>入驻平台抽成比例</hgroup>
      <hr/>
      <el-form :rules="rules" ref="goods" :model="goods" label-width="150px">
      	  <el-form-item label="平台" prop="interrace">
          	<el-input v-model="goods.interrace"></el-input>
          </el-form-item>
          <el-form-item label="商户" prop="inmerchant">
          	<el-input v-model="goods.inmerchant"></el-input>
          </el-form-item>
          <hgroup>推荐用户分销比例</hgroup>
     			<hr/>
     			<el-form-item label="平台" prop="groomterrace">
          	<el-input v-model="goods.groomterrace"></el-input>
          </el-form-item>
          <el-form-item label="商户" prop="groommerchant">
          	<el-input v-model="goods.groommerchant"></el-input>
          </el-form-item>
      </el-form>
    </el-card>
    
    <el-card class="box-card">
      <h3>商家所有商品</h3>
      <el-table :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>

	      <el-table-column align="center" width="100px" label="商品名字" prop="id">
	      </el-table-column>
	
	      <el-table-column align="center" min-width="100px" label="图片" prop="pid">
	      </el-table-column>
	
	      <el-table-column align="center" min-width="200px" label="价格" prop="name">
	      </el-table-column> 
	      
	      <el-table-column align="center" min-width="200px" label="商品类型" prop="name">
	      </el-table-column> 
				
				<el-table-column align="center" min-width="200px" label="库存" prop="name">
	      </el-table-column>
	      
	      <el-table-column align="center" min-width="200px" label="总销量" prop="name">
	      </el-table-column>
	      
	      <el-table-column align="center" min-width="200px" label="所属商家" prop="name">
	      </el-table-column>
	      
	      <el-table-column align="center" min-width="200px" label="发布时间" prop="name">
	      </el-table-column>
 
      </el-table>
    </el-card>
    
    <el-card class="box-card">
      <h3>店铺所有订单</h3>
      <el-table :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>

	      <el-table-column align="center" width="100px" label="分销用户" prop="id">
	      </el-table-column>
	
	      <el-table-column align="center" min-width="100px" label="绑定时间" prop="pid">
	      </el-table-column>
	
      </el-table>
    </el-card>

    <el-card class="box-card">
      <h3>证件照</h3>
      <el-row>
			  <el-col :span="8">
			  	<el-upload :action='uploadPath' :limit='5' multiple accept=".jpg,.jpeg,.png,.gif" list-type="picture-card" :on-exceed="uploadOverrun" :on-success="handleGalleryUrl" :on-remove="handleRemove">
             <i class="el-icon-plus"></i>
          </el-upload>
          <p>营业执照</p>
			  </el-col>
			  <el-col :span="8">
			  	<el-upload :action='uploadPath' :limit='5' multiple accept=".jpg,.jpeg,.png,.gif" list-type="picture-card" :on-exceed="uploadOverrun" :on-success="handleGalleryUrl" :on-remove="handleRemove">
             <i class="el-icon-plus"></i>
          </el-upload>
          <p>法人身份证（正面）</p>
			  </el-col>
			  <el-col :span="8">
			  	<el-upload :action='uploadPath' :limit='5' multiple accept=".jpg,.jpeg,.png,.gif" list-type="picture-card" :on-exceed="uploadOverrun" :on-success="handleGalleryUrl" :on-remove="handleRemove">
             <i class="el-icon-plus"></i>
          </el-upload>
          <p>法人身份证（反面）</p>
			  </el-col>
			</el-row>
			<br>
			<el-row>
			  <el-col :span="8">
			  	<el-upload :action='uploadPath' :limit='5' multiple accept=".jpg,.jpeg,.png,.gif" list-type="picture-card" :on-exceed="uploadOverrun" :on-success="handleGalleryUrl" :on-remove="handleRemove">
             <i class="el-icon-plus"></i>
          </el-upload>
          <p>食品经营许可证</p>
			  </el-col>
			  <el-col :span="8">
			  	<el-upload :action='uploadPath' :limit='5' multiple accept=".jpg,.jpeg,.png,.gif" list-type="picture-card" :on-exceed="uploadOverrun" :on-success="handleGalleryUrl" :on-remove="handleRemove">
             <i class="el-icon-plus"></i>
          </el-upload>
          <p>食品经营许可证</p>
			  </el-col>
			  <el-col :span="8">
			  	<el-upload :action='uploadPath' :limit='5' multiple accept=".jpg,.jpeg,.png,.gif" list-type="picture-card" :on-exceed="uploadOverrun" :on-success="handleGalleryUrl" :on-remove="handleRemove">
             <i class="el-icon-plus"></i>
          </el-upload>
          <p>食品经营许可证</p>
			  </el-col>
			</el-row>
      
    </el-card>

    <div class="op-container">
      <el-button @click="handleCancel">返回</el-button>
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
</style>

<script>
import { publishGoods, listCatAndBrand } from '@/api/goods'
import { createStorage, uploadPath } from '@/api/storage'
import Editor from '@tinymce/tinymce-vue'
import { MessageBox } from 'element-ui'

export default {
  name: 'GoodsCreate',
  components: { Editor },
  data() {
    return {
      uploadPath,
      newKeywordVisible: false,
      newKeyword: '',
      keywords: [],
      categoryList: [],
      brandList: [],
      goods: { picUrl: '', gallery: [] },
      specVisiable: false,
      specForm: { specification: '', value: '', picUrl: '' },
      multipleSpec: false,
      specifications: [{ specification: '规格', value: '标准', picUrl: '' }],
      productVisiable: false,
      productForm: { id: 0, specifications: [], price: 0.00, collagePrice: 0.00,scareBuyingPrice: 0.00,bargainPrice: 0.00, number: 0, url: '' },
      products: [{ id: 0, specifications: ['标准'], price: 0.00, collagePrice: 0.00,scareBuyingPrice: 0.00,bargainPrice: 0.00, number: 0, url: '' }],
      attributeVisiable: false,
      attributeForm: { attribute: '', value: '' },
      attributes: [],
      rules: {
        goodsSn: [{ required: true, message: '商品编号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }]
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
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init: function() {
      listCatAndBrand().then(response => {
        this.categoryList = response.data.data.categoryList
        this.brandList = response.data.data.brandList
      })
    },
    handleCategoryChange(value) {
      this.goods.categoryId = value[value.length - 1]
    },
    handleCancel: function() {
      this.$router.push({ path: '/mall/region' })
    },
    handlePublish: function() {
      const finalGoods = {
        goods: this.goods,
        specifications: this.specifications,
        products: this.products,
        attributes: this.attributes
      }
      publishGoods(finalGoods).then(response => {
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
        this.$router.push({ path: '/goods/list' })
      }).catch(response => {
        MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    handleClose(tag) {
      this.keywords.splice(this.keywords.indexOf(tag), 1)
      this.goods.keywords = this.keywords.toString()
    },
    showInput() {
      this.newKeywordVisible = true
      this.$nextTick(_ => {
        this.$refs.newKeywordInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const newKeyword = this.newKeyword
      if (newKeyword) {
        this.keywords.push(newKeyword)
        this.goods.keywords = this.keywords.toString()
      }
      this.newKeywordVisible = false
      this.newKeyword = ''
    },
    uploadPicUrl: function(response) {
      this.goods.picUrl = response.data.url
    },
    uploadOverrun: function() {
      this.$message({
        type: 'error',
        message: '上传文件个数超出限制!最多上传5张图片!'
      })
    },
    handleGalleryUrl(response, file, fileList) {
      if (response.errno === 0) {
        this.goods.gallery.push(response.data.url)
      }
    },
    handleRemove: function(file, fileList) {
      for (var i = 0; i < this.goods.gallery.length; i++) {
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

        if (this.goods.gallery[i] === url) {
          this.goods.gallery.splice(i, 1)
        }
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
    uploadSpecPicUrl: function(response) {
      this.specForm.picUrl = response.data.url
    },
    handleSpecificationShow() {
      this.specForm = {}
      this.specVisiable = true
    },
    handleSpecificationAdd() {
      var index = this.specifications.length - 1
      for (var i = 0; i < this.specifications.length; i++) {
        const v = this.specifications[i]
        if (v.specification === this.specForm.specification) {
          index = i
        }
      }

      this.specifications.splice(index + 1, 0, this.specForm)
      this.specVisiable = false

      this.specToProduct()
    },
    handleSpecificationDelete(row) {
      const index = this.specifications.indexOf(row)
      this.specifications.splice(index, 1)
      this.specToProduct()
    },
    specToProduct() {
      if (this.specifications.length === 0) {
        return
      }
      // 根据specifications创建临时规格列表
      var specValues = []
      var spec = this.specifications[0].specification
      var values = []
      values.push(0)

      for (var i = 1; i < this.specifications.length; i++) {
        const aspec = this.specifications[i].specification

        if (aspec === spec) {
          values.push(i)
        } else {
          specValues.push(values)
          spec = aspec
          values = []
          values.push(i)
        }
      }
      specValues.push(values)

      // 根据临时规格列表生产货品规格
      // 算法基于 https://blog.csdn.net/tyhj_sf/article/details/53893125
      var productsIndex = 0
      var products = []
      var combination = []
      var n = specValues.length
      for (var s = 0; s < n; s++) {
        combination[s] = 0
      }
      var index = 0
      var isContinue = false
      do {
        var specifications = []
        for (var x = 0; x < n; x++) {
          var z = specValues[x][combination[x]]
          specifications.push(this.specifications[z].value)
        }
        products[productsIndex] = { id: productsIndex, specifications: specifications, price: 0.00, collagePrice: 0.00,scareBuyingPrice: 0.00,bargainPrice: 0.00, number: 0, url: '' }
        productsIndex++

        index++
        combination[n - 1] = index
        for (var j = n - 1; j >= 0; j--) {
          if (combination[j] >= specValues[j].length) {
            combination[j] = 0
            index = 0
            if (j - 1 >= 0) {
              combination[j - 1] = combination[j - 1] + 1
            }
          }
        }
        isContinue = false
        for (var p = 0; p < n; p++) {
          if (combination[p] !== 0) {
            isContinue = true
          }
        }
      } while (isContinue)

      this.products = products
    },
    handleProductShow(row) {
      this.productForm = Object.assign({}, row)
      this.productVisiable = true
    },
    uploadProductUrl: function(response) {
      this.productForm.url = response.data.url
    },
    handleProductEdit() {
      for (var i = 0; i < this.products.length; i++) {
        const v = this.products[i]
        if (v.id === this.productForm.id) {
          this.products.splice(i, 1, this.productForm)
          break
        }
      }
      this.productVisiable = false
    },
    handleAttributeShow() {
      this.attributeForm = {}
      this.attributeVisiable = true
    },
    handleAttributeAdd() {
      this.attributes.unshift(this.attributeForm)
      this.attributeVisiable = false
    },
    handleAttributeDelete(row) {
      const index = this.attributes.indexOf(row)
      this.attributes.splice(index, 1)
    }
  }
}
</script>