<template>
  <div class="app-container calendar-list-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入商品种类" v-model="listQuery.goodsSn">
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

      <el-table-column align="center" min-width="100px" label="商品种类" prop="cateName">
      </el-table-column>
      
       <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini"  @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>             
        <el-form-item label="商品种类" prop="cateName">
          <el-input v-model="dataForm.cateName"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="cateType">
        	<el-select v-model="dataForm.cateType" placeholder="请选择">
				    <el-option
				    	v-if="item.type == 4"
				      v-for="item in cateTypedata"
				      :key="item.type"
				      :label="item.name"
				      :value="item.type">
				    </el-option>
				  </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
//import { listRegion } from '@/api/region'
import { categoryListCollection, categoryAddCollection, cateTypeListCollection,categorydeleteCollection } from '@/api/collection'
import { Message, MessageBox } from 'element-ui'
export default {
  name: 'Keyword',
  data() {
    return {
      list: undefined,
      total: undefined,
      listLoading: true,
      listQuery: {
        type:2
      },
      downloadLoading: false,
      dataForm:{
      	cateName:'',
      	cateType:''
      },
      dialogFormVisible:false,
      dialogStatus: '',
      textMap: {
        create: '创建',
        update: '编辑'
      },
      rules: {
        cateName: [{ required: true, message: '藏品种类不能为空', trigger: 'blur' }],
        cateType: [{ required: true, message: '类别不能为空', trigger: 'blur' }]   
      },
      cateTypedata:[],
      cateTypeId:""
    }
  },
  created() {
  	this.init()
    this.getList()
  },
  methods: {
  	init:function(){
  		cateTypeListCollection().then(response=>{
  			this.cateTypedata = response.data.data
  		})
  	},
  	getIndex($index){
  		return  $index + 1
  	},
    getList() {
      this.listLoading = true
      categoryListCollection(this.listQuery).then(response => {
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
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate(){
    	this.dataForm.cateName = ''
    	this.dataForm.cateType = ''
    	this.dialogStatus = 'create'
    	this.dialogFormVisible = true
    	this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    	
    },
    handleUpdate(row){
    	this.dataForm.cateName = row.cateName
    	this.dataForm.cateType = row.cateType
    	this.cateTypeId = row.id
    	console.log(row.cateName)
    	this.dialogStatus = 'update'
    	this.dialogFormVisible = true
    	this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
//  	this.rules = {
//      cateName: [{ message: ''}],
//      cateType: [{ message: '' }]   
//    }
    },
    handleDelete(row) {
    	this.$confirm('确定要删除此项吗？','提示',{
				  confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
			}).then(()=>{
					const detateData = {
						ids:row.id,
					}
					categorydeleteCollection(detateData).then(response => {
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
    	var data = {
    		cateName:this.dataForm.cateName,
    		cateType:this.dataForm.cateType
    	}
//  	console.log(_this)
			this.$refs['dataForm'].validate((valid)=>{
				if(valid){
					categoryAddCollection(data).then(response => {
			  			_this.getList()
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
    	var _this = this;
    	var data = {
    		cateName:this.dataForm.cateName,
    		cateType:this.dataForm.cateType,
    		id:this.cateTypeId
    	}
    	
		  categoryAddCollection(data).then(response => {
		  			_this.getList()
            _this.dialogFormVisible = false;
            _this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })    	
    }
  }
}
</script>
<style scoped>	

</style>
