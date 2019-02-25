<template>
  <div class="app-container calendar-list-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入商品类型" v-model="listQuery.cateType">
      </el-input>-->
      <!--<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>-->
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
           <el-tag :type="scope.row.cateType==1 ? 'success' : scope.row.cateType==2?'error':scope.row.cateType==3?'danger':scope.row.cateType==4?'warning':scope.row.cateType==5?'blue':'info' ">{{scope.row.type==1 ? '禅茶素材' : scope.row.type==2?'素食餐厅':scope.row.type==3?'精品民宿':scope.row.type==4?'投资收藏': scope.row.type==5 ? '活动商品':'精准扶贫'}}</el-tag>
        </template>
      </el-table-column>
      
      <el-table-column align="center" min-width="100px" label="名称" prop="name">
      </el-table-column>
      
       <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini"  @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>             
        <el-form-item label="商品类型" prop="type">
           <el-select v-model="dataForm.type">
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
          </el-select>        
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="dataForm.name"></el-input>
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
import { listCategory ,createCategory,deleteCategory , hotSearchadd , hotSearchdel , getHotSearchList} from '@/api/category'
import { getSpecificationId,addBargain} from '@/api/bargain'

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
	    type: undefined
      },
      downloadLoading: false,
      dataForm:{
      	name: undefined,
		type:undefined,
		id: undefined
      },
      dialogFormVisible:false,
      dialogStatus: '',
      textMap: {
        create: '创建',
        update: '编辑'
      },
      rules: {
        name: [{ required: true, message: '类型名称不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '商品类型不能为空', trigger: 'blur' }]   
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
      getHotSearchList(this.listQuery).then(response => {
      	console.log(response)
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
      this.listQuery.page = 1
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
				cateType:undefined,
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
    	console.log(row)
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      hotSearchdel(row).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
       //this.getList()
      })
    },
    createData(data){
    	this.$refs['dataForm'].validate((valid) => {
    		if(valid){
    			hotSearchadd(this.dataForm).then(response => {
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
          hotSearchadd(this.dataForm).then(() => {
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