<template>
  <div class="app-container calendar-list-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入兑换卡编号" v-model="listQuery.identifier">
      </el-input>-->
			<el-select style="width: 200px" class="filter-item" placeholder="请选择兑换状态" v-model="listQuery.status" >
        <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value">
        </el-option>
      </el-select>
      <el-date-picker
		            v-model="listQuery.createdAtStart"
		            type="date"		           
		            format="yyyy-MM-dd"
		            value-format="yyyy-MM-dd 00:00:00"
		            placeholder="开始时间" class="filter-item">
		    </el-date-picker>至
		    <el-date-picker
		            v-model="listQuery.createdAtEnd"
		            type="date"
		            format="yyyy-MM-dd"
		            value-format="yyyy-MM-dd 23:59:59"		            
		            placeholder="结束时间" class="filter-item">
		    </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
    </div>
    
    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      
      <el-table-column align="center" label="兑换卡编号" prop="identifier">
      </el-table-column>

      <el-table-column align="center" min-width="100" label="兑换码" prop="code">
      </el-table-column>

      <el-table-column align="center" label="生成时间" prop="createdAt">
      </el-table-column>

      <el-table-column align="center" label="使用时间" prop="usedAt">
      </el-table-column>
      
      <el-table-column align="center" label="有效时间（天）" prop="valid">
      </el-table-column>
      
      <el-table-column align="center" label="使用用户" prop="nickname">
      </el-table-column>
      
      <el-table-column align="center" label="使用用户电话" prop="phone">
      </el-table-column>
      
      <el-table-column align="center" label="兑换卡积分" prop="score">
      </el-table-column>
       
       <el-table-column align="center" label="兑换卡金额" prop="money">
      </el-table-column>
			
			<el-table-column align="center" label="兑换状态" prop="status">
				<template slot-scope="scope">
      		<span v-if='scope.row.status==0 ?"未使用":scope.row.status==1 ?"已使用":scope.row.status==2 ?"已失效":"已删除"'>{{scope.row.status==0 ?"未使用":scope.row.status==1 ?"已使用":scope.row.status==2 ?"已失效":"已删除"}}</span>
      	</template>
      </el-table-column>
      
      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="danger" size="mini"  @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 添加对话框 -->
   <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" style='width: 560px; margin-left:50px;'>
              
        <el-form-item label="有效时间(天)"  >
          <el-input v-model="dataForm.valid"><template slot="append">天</template></el-input>
        </el-form-item>
        <el-form-item label="兑换卡积分" prop="score">
          <el-input v-model="dataForm.score"></el-input>
        </el-form-item>
        <el-form-item label="兑换卡金额" prop="money">
          <el-input v-model="dataForm.money"></el-input>
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
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
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
  .el-input{
  	width: 200px;
  }
</style>

<script>
import { listcard ,addCard,deleCard} from '@/api/contents'
import BackToTop from '@/components/BackToTop'
import { parseTime } from '@/utils/index'
import { Message, MessageBox } from 'element-ui'
const statusMap = {
	0: '未使用',
	1: '已使用',
	2: '已失效',
	3: '已删除'
}

export default {
  name: 'GoodsList',
  components: { BackToTop },
  data() {
    return {
      list: [],
      total: 0,
      statusMap,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        createdAtEnd: undefined,
        createdAtStart: undefined,
        status:""
      },
      descDialogVisible: false,
      dataForm:{
      	money:'',
      	score:'',
      	valid:''       	
        },
      dialogFormVisible:false,
      dialogStatus: '',
      textMap: {
        create: '创建',
        update: '编辑'
      },
      rules: {
        money: [{ required: true, message: '兑换卡金额不能为空', trigger: 'blur' }],
        score: [{ required: true, message: '兑换积分不能为空', trigger: 'blur' }],
        valid: [{ required: true, message: '有效时间(天)不能为空', trigger: 'blur' }]    
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listcard(this.listQuery).then(response => {
        this.list = response.data.data.items
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    resetForm(){
    	this.dataForm={
    		money:'',
      	score:'',
      	valid:'' 
    	}
    },
    handleCreate() {
    	this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData(){
    	
    },
    createData(){
    	this.$refs['dataForm'].validate((valid)=>{
    		if(valid){
    			const dataCard = {
		    		money: this.dataForm.money,
		    		score:this.dataForm.score,
		    		valid:this.dataForm.valid,
		    	}
		    	addCard(dataCard).then(response => {
		        this.getList()
		        this.dialogFormVisible = false
		        this.$notify({
		          title: '成功',
		          message: '创建成功',
		          type: 'success',
		          duration: 2000
		        })
		      })
    		}
    	})
    	
    },
   
    handleDelete(row) {
    	this.$confirm('确定要删除此项吗？','提示',{
				  confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
			}).then(()=>{
				deleCard(row).then(response => {
	        this.$notify({
	          title: '成功',
	          message: '删除成功',
	          type: 'success',
	          duration: 2000
	        })
	        const index = this.list.indexOf(row)
	        this.list.splice(index, 1)
	      })
			}).catch(()=>{
      	this.$message({
	        type: 'info',
	        message: '已取消删除'
	      })         
      })
      
    }
  }
}
</script>