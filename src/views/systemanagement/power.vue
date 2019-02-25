<template>
	<div class="app-container calendar-list-container">
		<div class="filter-container">
	    	  <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
	        <!--<el-button class="filter-item" type="primary" @click="handleShelves">下架</el-button>-->
	    </div>
	    <!-- 查询结果 -->
	    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
	      <el-table-column align="center" label="序号" width="80">
	        <template slot-scope="scope">
	          <span v-text="getIndex(scope.$index)"> </span>
	        </template>
	      </el-table-column>
	      
	      <el-table-column align="center" label="权限名称" prop="menuName">
	      </el-table-column>
	      
	      <el-table-column align="center" label="权限概念" prop="permissionName">
	      </el-table-column>
	      
	      <el-table-column align="center" label="权限状态" prop="requiredPermission">
	      	<template slot-scope="scope">
				<!--<el-button type="" size="mini" @click="displayItemGoods(scope.row)"> {{scope.row.isDisplay==0?"已下架":"已上架"}} </el-button>-->
				<el-button size="mini">{{scope.row.requiredPermission==1?"必选":"非必选"}}</el-button>
			</template>
	      </el-table-column>
	
	      <el-table-column align="center" label="创建时间" prop="createdAt">
	      </el-table-column>
	      
	      <el-table-column align="center" label="操作" >
	      	<template slot-scope="scope">
	          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
	          <el-button type="warning" size="mini" @click="handleDelete(scope.row)">删除</el-button>
	        </template>
	      </el-table-column>
	      
	    </el-table>
	    
	    <!-- 添加或修改对话框 -->
	    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
	      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
	        <el-form-item label="自定义编号" prop="id" title="主要供前端展示权限列表分类排序使用">
	          <el-input type="number" v-model="dataForm.id"></el-input>
	        </el-form-item>
	        <el-form-item label="归属菜单" prop="menuCode" title="前端判断并展示菜单使用">
	          <el-input v-model="dataForm.menuCode"></el-input>
	        </el-form-item>
	        <el-form-item label="菜单中文释义" prop="menuName">
	          <el-input v-model="dataForm.menuName"></el-input>
	        </el-form-item>
	        <el-form-item label="权限代码/通配符" prop="permissionCode">
	          <el-input v-model="dataForm.permissionCode"></el-input>
	        </el-form-item>
	        <el-form-item label="本权限中文释义" prop="permissionName">
	          <el-input v-model="dataForm.permissionName"></el-input>
	        </el-form-item>
	        <el-form-item label="是否本菜单必选" prop="requiredPermission">
	          <!--<el-input v-model="dataForm.requiredPermission"></el-input>-->
	          <el-select  class="filter-item" placeholder="是否本菜单必选权限  " v-model="dataForm.requiredPermission" >
		        <el-option v-for="item in requiredPermissions" :key="item.id" :label="item.name" :value="item.id">
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
	
	    <el-tooltip placement="top" content="返回顶部">
	      <back-to-top :visibilityHeight="100" ></back-to-top>
	    </el-tooltip>
	
    </div>
</template>

<script>
import { listPermission, deletePermission, addPermission, editPermission } from '@/api/systemanagement'
import BackToTop from '@/components/BackToTop'
import { parseTime } from '@/utils/index'
import { Message, MessageBox } from 'element-ui'
export default {
  name: 'syslist',
  components: { BackToTop },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize:10,
        menuCode:undefined,
        menuName:undefined
      },
      dataForm:{
      	id: undefined,
		menuCode:undefined,
		menuName:undefined,
		permissionCode:undefined,
		permissionName:undefined,
		requiredPermission:undefined,
      },
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      }, 
      dialogFormVisible: false,
      rules: {
        
      },
      requiredPermissions:[
      	{
      		name:"必选",
      		id:1
      	},
      	{
      		name:"非必须",
      		id:2
      	}
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
  	getIndex($index) {
        return $index + 1
  	},
//	列表
    getList() {
      this.listLoading = true
      listPermission(this.listQuery).then(response => {
        this.list = response.data.data.items
        this.listLoading = false
        this.total =response.data.data.total
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
//  分页
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
//  清空
	resetForm(){
	this.dataForm = {
      	id: undefined,
		menuCode:undefined,
		menuName:undefined,
		permissionCode:undefined,
		permissionName:undefined,
		requiredPermission:undefined,
      }
	},
//  创建
	handleCreate(){
		this.resetForm()
		this.dialogStatus = 'create'
      	this.dialogFormVisible = true
      	
	},
//	编辑
	handleUpdate(row){
		this.dialogStatus = 'update'
     	this.dialogFormVisible = true
     	console.log(row)
     	this.dataForm.id 				 = row.id
		this.dataForm.menuCode 			 = row.menuCode
		this.dataForm.menuName 			 = row.menuName
		this.dataForm.permissionCode 	 = row.permissionCode
		this.dataForm.permissionName 	 = row.permissionName
		this.dataForm.requiredPermission = row.requiredPermission
		
    	
	},
//	删除
	handleDelete(row){
		this.$confirm('确定要删除此项吗？','提示',{
			  confirmButtonText: '确定',
		      cancelButtonText: '取消',
		      type: 'warning'
		}).then(()=>{
			const detateData = {
				ids:row.id
			}	
			deletePermission(detateData).then(response => {
		        this.$notify({
		          title: '成功',
		          message: '删除成功',
		          type: 'success',
		          duration: 2000
		        })
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
    createData(){
    	const data = {
    		id: this.dataForm.id,
    		menuCode:this.dataForm.menuCode,
    		menuName:this.dataForm.menuName,
    		permissionCode:this.dataForm.permissionCode,
    		permissionName:this.dataForm.permissionName,
    		requiredPermission:this.dataForm.requiredPermission,
    	}
//  	addPermission
		addPermission(data).then(response => {
    		this.dialogFormVisible = false
    		this.getList()
	        this.$notify({
	          title: '成功',
	          message: '创建成果成功',
	          type: 'success',
	          duration: 2000
	        })
			
        })
    },
    updateData(){
    	const data = {
    		id: this.dataForm.id,
    		menuCode:this.dataForm.menuCode,
    		menuName:this.dataForm.menuName,
    		permissionCode:this.dataForm.permissionCode,
    		permissionName:this.dataForm.permissionName,
    		requiredPermission:this.dataForm.requiredPermission,
    	}
		editPermission(data).then(response => {
			this.dialogFormVisible = false
			this.getList()
	        this.$notify({
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

<style>
</style>