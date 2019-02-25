<template>
  <div class="app-container calendar-list-container">
  	
  	<!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入商品名称" v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
     
      <el-table-column align="center" label="商品编号" prop="goodsSn">
      </el-table-column>

      <el-table-column align="center" min-width="100" label="商品名称" prop="name">
      </el-table-column>

      <el-table-column align="center" property="iconUrl" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" width="40"/>
        </template>
      </el-table-column>

      <el-table-column align="center" label="专柜价格" prop="counterPrice">
      </el-table-column>

      <el-table-column align="center" label="当前价格" prop="retailPrice">
      </el-table-column>
	   
      <el-table-column align="center" label="是否新品" prop="isNew">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isNew ? 'success' : 'error' ">{{scope.row.isNew ? '新品' : '非新品'}}</el-tag>
        </template>
      </el-table-column> 

      <el-table-column align="center" label="是否热品" prop="isHot">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isHot ? 'success' : 'error' ">{{scope.row.isHot ? '热品' : '非热品'}}</el-tag>
        </template>
      </el-table-column> 

      <el-table-column align="center" label="是否在售" prop="isOnSale">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isOnSale ? 'success' : 'error' ">{{scope.row.isOnSale ? '在售' : '未售'}}</el-tag>
        </template>
      </el-table-column>             
  	 
  	  <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="danger" size="mini"  @click="handleSet(scope.row)">设置</el-button>
        </template>
      </el-table-column>
      
    </el-table>
    
    <!-- 添加或修改对话框 -->
   <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" style='width: 400px; margin-left:50px;'>
        <el-form-item label="活动类型" prop="minimumPrice">
          <el-input v-model="dataForm.minimumPrice" disabled ></el-input>
        </el-form-item>
        <el-form-item label="活动名称" prop="singleMinPrice">
          <el-input v-model="dataForm.singleMinPrice"></el-input>
        </el-form-item>
         <el-form-item label="活动时间段" class="filter-item" style="margin-left: 10px;">
		        <el-date-picker
			            v-model="dataForm.startTime"
			            type="date"
			            :picker-options="pickerBeginDateBefore"
			            format="yyyy-MM-dd"
			            value-format="yyyy-MM-dd HH:mm:ss"
			            placeholder="开始时间" >
			    </el-date-picker>至
			    <el-date-picker
			            v-model="dataForm.endTime"
			            type="date"
			            format="yyyy-MM-dd"
			            value-format="yyyy-MM-dd HH:mm:ss"
			            :picker-options="pickerBeginDateAfter"
			            placeholder="结束时间">
			    </el-date-picker>
        </el-form-item> 
				<el-form-item label="所属商户">
          <el-select v-model="dataForm.singleMinPrice">
            <!--<el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value">-->
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="singleMinPrice">
          <el-input v-model="dataForm.singleMinPrice"></el-input>
        </el-form-item>
        <el-form-item label="活动地点" prop="singleMinPrice">
          <el-input v-model="dataForm.singleMinPrice"></el-input>
        </el-form-item>      
        <el-form-item label="活动图片">
          <el-upload :action='uploadPath' :limit='5' multiple accept=".jpg,.jpeg,.png,.gif" list-type="picture-card" :on-exceed="uploadOverrun" :on-success="handleGalleryUrl" :on-remove="handleRemove">
             <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item> 
        <el-form-item label="活动详细">
          <editor :init="editorInit" v-model="dataForm.desc"></editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <!--<el-button v-else type="primary" @click="updateData">确定</el-button>-->
      </div>
    </el-dialog>
    
    <!-- 分页 -->
    <div class="pagination-container" style="margin-top: 60px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibilityHeight="100" ></back-to-top>
    </el-tooltip>

  </div>
</template>

<style scoped="">
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
  .el-date-editor.el-input{
  	width:140px;
  }
  .el-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 50%;
}
#specifications{
	width: 200px;
	color: #606266;
	height: 36px;
	border-radius: 4px;
    border: 1px solid #dcdfe6;
    margin-left: 40px;
}
</style>

<script>
import {  createSpell} from '@/api/spell'
import { listVendorGoods} from '@/api/vendorGoods'
import { getSpecificationId,addBargain} from '@/api/bargain'
import BackToTop from '@/components/BackToTop'
import Editor from '@tinymce/tinymce-vue'
import { createStorage, uploadPath } from '@/api/storage'


export default {
  name: 'vendorGoods',
  components: { BackToTop },
  data() {
    return {
      uploadPath,
	  options: [],
      list:[],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id:undefined,
        goodsSn: undefined,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      descDialogVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '创建',
        update: '编辑'
      },
      rules: {
        minimumPrice: [{ required: true, message: '规定本次活动最低的价格不能为空', trigger: 'blur' }],
        singleMinPrice: [{ required: true, message: '规定每次砍价最少砍多少不能为空', trigger: 'blur' }],
        singleMaxPrice: [{ required: true, message: '规定每次砍价最多砍多少不能为空', trigger: 'blur' }],
        specificationId: [{ required: true, message: '请选择产品的规格', trigger: 'blur' }],
        startTime: [{ required: true, message: '拼团人开始时间不能为空', trigger: 'blur' }],
        endTime: [{ required: true, message: '拼团人结束时间不能为空', trigger: 'blur' }]    
      },
      dataForm:{
        goodsId:'',
        goodsSn:'',
        price:'',
        minimumPrice:'',//最低能砍到多少价格：添加时用户填写
        singleMaxPrice:'',//每次砍价最多砍多少：添加时用户填写
        singleMinPrice:'',//每次砍价最少能砍多少：添加时用户填写
        specificationId:'',  
        startTime:'', //活动开始时间，添加时用户填写
        endTime:''//活动结束时间，添加时用户填写
      },
      pickerBeginDateBefore:{
	            disabledDate: (time) => {
	                let beginDateVal = this.listQuery.endTime;
	                if (beginDateVal) {
	                    return time.getTime() > beginDateVal;
	                }
	            }
	        },
	        pickerBeginDateAfter:{
	            disabledDate: (time) => {
	                let beginDateVal = this.listQuery.startTime;
	                if (beginDateVal) {
	                    return time.getTime() < beginDateVal;
	                }
	            }
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
    }
  },
  created() {
    this.getList()
    var id = this.$route.query;
    console.log(id);
  },
  methods: {
    getList() {
      this.listLoading = true
      listVendorGoods(this.listQuery).then(response => {
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
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
    resetForm(){
    	this.dataForm = {
    	goodsId:'',
        specificationId:'',
        //spellCount:'',
        //inventory:'',
        startTime:'',
        endTime:''
    	}
    },
    //获取规格id；
    getgetSpecificationId(){
		  getSpecificationId({id:this.dataForm.goodsId}).then(response => {
          	this.options = response.data.data.products;
          })
    },
    handleSet(row){
    	console.log(row);
    	this.resetForm()
    	this.dataForm.goodsId = row.id; //产品id；
    	this.dataForm.goodsSn = row.goodsSn;  //产品编号；
    	this.dataForm.price = row.bargainPrice  //砍价价格；
    	
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.getgetSpecificationId();
//      this.$nextTick(() => {
//        this.$refs['dataForm'].clearValidate()
//      }) 
    },
    createData(data){
    	var _this = this;
		  addBargain(this.dataForm).then(response => {
        	console.log(response);
            //this.list.unshift(response.data);
            _this.dialogFormVisible = false;
            _this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
         _this.$router.push({ path: '/advertisement/bargain' })
          })
    },
    updateData(){},
    handleaddVenorGoods(data){
    	var _this = this;
      addVendorGoods(this.dataForm).then(response => {
      	console.log(response);
            _this.list.unshift(response.data);
            _this.dialogFormVisible = false;
            _this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          _this.$router.push({ path: '/vendorgoods/vendorgoods' })
        })
        
     }
  }
}
</script>