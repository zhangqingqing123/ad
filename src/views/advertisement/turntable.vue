<template>
	<div class="app-container calendar-list-container">

    <!-- 添加操作 -->
    <div class="filter-container">
    	<el-button class="filter-item" type="primary" v-if='list.length < 7' @click="handleCreate" icon="el-icon-edit" >添加</el-button>
       <el-button class="filter-item" type="danger"  @click="handleOpen(1)" v-if = 'isOpen'>关闭活动</el-button>
       <el-button class="filter-item" type="success"  @click="handleOpen(0)" v-else >开启活动</el-button>
    </div>
    
     <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" min-width="100" label="奖品名称" prop="name">
      </el-table-column>
      
      <el-table-column align="center" min-width="100" label="奖品数量" prop="num">
      </el-table-column>
      
  	  <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini"  @click="handledit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
  	
    </el-table>
    
    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item v-if="dialogStatus=='update'" label="奖品名称" prop="name">
          <el-input v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='update'" label="奖品数量" prop="num">
          <el-input v-model="dataForm.num"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'"  label="抽奖次数" prop="count">
          <el-input v-model="shipForm.count"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    
    <!--添加弹框-->
    <el-dialog :title="textMapList[dialogStatusList]" :visible.sync="dialogFormVisibleAdd">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item  label="奖品名称" prop="name">
          <el-input v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="奖品数量" prop="num">
          <el-input v-model="dataForm.num"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取消</el-button>
        <el-button v-if="dialogStatusList=='createList'" type="primary" @click="createDataList">确定</el-button>
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
import { listTurntable, createTurntable,deleteTurntable,readTurntable,updateTurntable,openTurntable,checkstateTurntable} from '@/api/turntable'

export default {
	name:'turntable',
	data(){
		return{
			list:[],
			total:null,
			listLoading: true,
			dialogFormVisible:false,
			dialogFormVisibleAdd:false,		
	        listQuery: {
		        page: 1,
		        limit: 20,
		        sort: 'add_time',
		        order: 'desc'
	        },
	        dialogStatus:'',
	        textMap:{
	        	update:'编辑',
	        	create:'创建'
	        },
	        dialogStatusList:'',
	        textMapList:{
	        	createList:'创建'
	        },
	        rules: {
        		name: [{ required: true, message: '奖品名称不能为空', trigger: 'blur' }],
        		num: [{ required: true, message: '奖品数量不能为空', trigger: 'blur' }]      
      		},
      		dataForm:{
      			id: undefined,
  				name: undefined,
  				num: undefined
      		},
      		shipForm:{
      			id: undefined,
  				isOpen:true,
  			    count:undefined
      		},
      		isOpen:''
		}
	},
	created(){
		this.getList()
		this.getStatus()
	},
	methods:{
		getList() {
	      this.listLoading = true
	      listTurntable(this.listQuery).then(response => {
	        this.list = response.data.data.items
	        this.total = response.data.data.total
            this.listLoading = false
            
	      }).catch(() => {
	        this.list = []
	        this.total = 0
	        this.listLoading = false
	      }) 
	    },
	    getStatus(){
	      checkstateTurntable().then(response => {
	      	this.isOpen = response.data.data.isOpen	
	      })
        },
		handleSizeChange(){
			this.listQuery.limit = val
      		this.getList()
		},
		handleCurrentChange(val) {
      		this.listQuery.page = val
      		this.getList()
        },
        resetForm(){
        	this.shipForm ={
        		id: undefined,
  				isOpen:true,
  			    count:undefined
        	}
        },
        handledit(row){
	    	this.dataForm = Object.assign({}, row)
		    this.dialogStatus = 'update'
		    this.dialogFormVisible = true
		    this.$nextTick(() => {
		        this.$refs['dataForm'].clearValidate()
		    })
        },
        createData(){
        	openTurntable(this.shipForm).then(response => {
        		this.dialogFormVisible = false
        		this.getStatus()
	        }) 	
        },
        createDataStatus(){
        	openTurntable(this.shipForm).then(response => {
			      this.getStatus();
	        })
        },
        handleCreate(){
        	this.resetForm()
        	this.dialogStatusList = 'createList'
		    this.dialogFormVisibleAdd = true
		    this.$nextTick(() => {
		        this.$refs['dataForm'].clearValidate()
		      })
        },
        createDataList(){
        	this.$refs['dataForm'].validate((valid) => {
	        if (valid) {
	        	createTurntable(this.dataForm).then(response => {
	        		this.list.unshift(response.data);
	        		this.getList();
		            this.dialogFormVisibleAdd = false;
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
	          updateTurntable(this.dataForm).then(() => {
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
        },
        handleOpen(status){
		   if(status == 1){
		   		this.dialogFormVisible = false
		   		this.shipForm.isOpen = false
		   		this.createDataStatus()
		       	this.$alert('活动已关闭', '提示', {
	          	  confirmButtonText: '确定',
	          	  type: 'warning'
		        })	
		   }else{
			   	this.dialogStatus = 'create'
			    this.dialogFormVisible = true
		   }
        	
       }
	}
}
		
</script>

<style>
</style>