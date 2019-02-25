<template>
  <div class="app-container calendar-list-container">
  	
  	<!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入商品编号" v-model="listQuery.goodsId">
      </el-input>
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
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="拼团人数" prop="spellCount">
          <el-input v-model="dataForm.spellCount"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="specificationId">
	        <template>
	        	<select name="" id="specifications" v-model="dataForm.specificationId">
	        		<option :value="v.id" v-for="v in options">
	        			<span v-for="w in v.specifications">{{w}}</span>
	        		</option>
	        	</select>
					</template>
        </el-form-item>
        <el-form-item label="拼团时间段" class="filter-item" >
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
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

<style>
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
  #specifications{
		width: 100%;
		color: #606266;
		height: 36px;
		border-radius: 4px;
    border: 1px solid #dcdfe6;
}
</style>

<script>
import {  createSpell} from '@/api/spell'
import { listVendorGoods,detailSpecification} from '@/api/vendorGoods'
import BackToTop from '@/components/BackToTop'

export default {
  name: 'vendorGoods',
  components: { BackToTop },
  data() {
    return {
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
        spellCount: [{ required: true, message: '拼团人数不能为空', trigger: 'blur' }],
        specificationId: [{ required: true, message: '商品规格不能为空', trigger: 'blur' }],
        startTime: [{ required: true, message: '拼团人开始时间不能为空', trigger: 'blur' }],
        endTime: [{ required: true, message: '拼团人结束时间不能为空', trigger: 'blur' }]    
      },
      dataForm:{
        goodsId:'',
        spellCount:'',
        startTime:'',
        endTime:''
      },
      shipForm:{
      	id:undefined
      },
      options:[],
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
	        	}
    		}
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listVendorGoods(this.listQuery).then(response => {
        this.list = response.data.data.items
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    //获取规格ID
    specificationList(){
    	detailSpecification(this.shipForm).then(response => {
    		console.log(response.data.data.products)
    		this.options = response.data.data.products
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
    resetForm(){
    	this.dataForm = {
    		goodsId:'',
        spellCount:'',
        startTime:'',
        endTime:''
    	}
    },
    //点击设置；
    handleSet(row){
    	this.resetForm()
    	this.dataForm.goodsId = row.id
    	this.shipForm.id = row.id
      this.dataForm.startTime = row.startTime
      this.dataForm.endTime = row.endTime
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      }) 
      this.specificationList()
    },
    createData(data){
		  createSpell(this.dataForm).then(response => {
        		console.log(response);
            this.list.unshift(response.data);
            this.dialogFormVisible = false;
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
         this.$router.push({ path: '/advertisement/spell' })
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