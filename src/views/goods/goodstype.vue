<template>
  <div class="app-container calendar-list-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入商品类型" v-model="listQuery.cateType">
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
	  <!--<el-table-column align="center" min-width="100px" label="ID" prop="id" sortable>
      </el-table-column>-->
      
      <el-table-column align="center" min-width="100px" label="商品类型" prop="cateType">
      	<template slot-scope="scope">
           <el-tag :type="scope.row.cateType==1 ? 'success' : scope.row.cateType==2?'error':scope.row.cateType==3?'danger':scope.row.cateType==4?'warning':scope.row.cateType==5?'blue':'info' ">{{scope.row.cateType==1 ? '禅茶素材' : scope.row.cateType==2?'素食餐厅':scope.row.cateType==3?'精品民宿':scope.row.cateType==4?'投资收藏': scope.row.cateType==5 ? '活动商品':'精准扶贫'}}</el-tag>
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
        <el-form-item label="禅茶素材种类" prop="cateType">
        	  <template slot-scope="scope">
		          <span >禅茶素材</span>
		        </template>
           <!--<el-select v-model="dataForm.cateType">
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
          </el-select>        -->
        </el-form-item>
        <el-form-item label="禅茶素材类型名称" prop="cateName">
          <el-input v-model="dataForm.cateName"></el-input>
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
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>-->

  </div>
</template>

<script>
import { listCategory ,createCategory,deleteCategory} from '@/api/category'
import { getSpecificationId,addBargain} from '@/api/bargain'
import { Message, MessageBox } from 'element-ui'

export default {
  name: 'Keyword',
  data() {
    return {
      list: undefined,
//    total: undefined,
      listLoading: true,
      listQuery: {
		cateName: undefined,
		cateType:undefined,
	    type: 1
      },
      downloadLoading: false,
      dataForm:{
      	cateName: undefined,
				cateType:1,
				id: undefined
      },
      dialogFormVisible:false,
      dialogStatus: '',
      textMap: {
        create: '创建',
        update: '编辑'
      },
      rules: {
        cateName: [{ required: true, message: '类型名称不能为空', trigger: 'blur' }],
        cateType: [{ required: true, message: '商品类型不能为空', trigger: 'blur' }]   
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
	getIndex($index){
		return  $index + 1
	},
    getList() {
      this.listLoading = true
      listCategory(this.listQuery).then(response => {
        this.list = response.data.data
//      this.total = response.data.data
        this.listLoading = false
      }).catch(() => {
        this.list = []
        //this.total = 0
        this.listLoading = false
      })
    },
    handleFilter() {
      //this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      //this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      //this.listQuery.page = val
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        cateName: undefined,
				cateType:1,
				id: undefined
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
//  	console.log(row)
    	this.$confirm('确定要删除此项吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		       }).then(() => {
		          	deleteCategory({ids:row.id}).then(response => {
						        this.$message({
						            type: 'success',
						            message: '删除成功!'
						        });
						        const index = this.list.indexOf(row)
						        this.list.splice(index, 1)
						        this.getList()
				      })
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          })          
		        })
      
    },
    createData(data){
    	this.$refs['dataForm'].validate((valid) => {
    		if(valid){
    			createCategory(this.dataForm).then(response => {
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
          createCategory(this.dataForm).then(() => {
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
  #specifications{
	width: 100%;
	color: #606266;
	height: 36px;
	border-radius: 4px;
    border: 1px solid #dcdfe6;
}
</style>