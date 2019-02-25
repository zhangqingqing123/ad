<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入账户" v-model="listQuery.username">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ID" prop="id" sortable>
      </el-table-column>

      <el-table-column align="center" label="账户" prop="username">
      </el-table-column>

      <el-table-column align="center" label="头像" prop="avatar">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" :onerror="defaultHead" width="40" v-if="scope.row.avatar"/>
        </template>
      </el-table-column>        

      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="primary" size="mini" @click="handleUpdatePwd(scope.row)">密码</el-button>
          <el-button type="primary" size="mini" @click="handleRole(scope.row)">角色</el-button>
          <el-button type="danger" size="mini"  @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item v-if="dialogStatus=='create' || dialogStatus=='update'" label="账户" prop="username">
          <el-input v-model="dataForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" v-if="dialogStatus=='updatePwd' || dialogStatus=='create'" prop="password">
          <el-input type="password" v-model="dataForm.password"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" v-if="dialogStatus=='updatePwd' || dialogStatus=='create'" prop="checkPassword">
          <el-input type="password" v-model="dataForm.checkPassword" auto-complete="off"></el-input>
        </el-form-item>                
        <el-form-item label="头像" v-if="dialogStatus=='create' || dialogStatus=='update'" prop="avatar">
          <el-upload class="avatar-uploader" :action="uploadPath" list-type="picture-card" :show-file-list="false" accept=".jpg,.jpeg,.png,.gif" :on-success="uploadAvatar">
			      <img v-if="dataForm.avatar" :src="dataForm.avatar" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="角色" v-if="dialogStatus == 'setRole'" >
        	<el-checkbox-group v-model="roleForm.roleIds">
		        <el-checkbox v-for="role in listRole" :label="role.roleId" :key="role.roleId">
		          <span>{{role.roleName}}</span>
		        </el-checkbox>
		      </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else-if="dialogStatus=='setRole'" type="primary" @click="setRole">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>
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
	    width: 120px;
	    height: 120px;
	    display: block;
	}
</style>

<script>
import { getAllRole, getRoleByUserId, updateUserRole } from '@/api/role'
import { listAdmin, createAdmin, updateAdmin, deleteAdmin, findUserName } from '@/api/admin'
import { uploadPath } from '@/api/storage'

export default {
  name: 'Admin',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.dataForm.checkPassword !== '') {
          this.$refs.dataForm.validateField('checkPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.dataForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    
    var uniqueUserName = (rule, value, callback) => {
      if (value) {
				let param = {username:value}
				if(this.dialogStatus=='update'){
					param.oldUserName = this.oldUserName;
				}
				findUserName(param).then(response => {
	       if(response.data.data){
	       	callback(new Error('此账号名已存在！'))
	       }else{
	       	callback()
	       }
	      }).catch(() => {
	      })
      } else {
        callback()
      }
    }
    return {
      uploadPath,
      list: null,
      total: null,
      listLoading: true,
      oldUserName:undefined,
      listQuery: {
        page: 1,
        limit: 20,
        username: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        username: undefined,
        password: undefined,
        checkPassword: undefined,
        avatar: undefined
      },
      listRole:[],
      roleForm:{
      	userId:undefined,
      	roleIds:[]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        updatePwd:'修改密码',
        create: '创建',
        setRole: '设置角色'
      },
      rules: {
        username: [{ required: true, message: '账户不能为空', trigger: 'blur' },{validator:uniqueUserName,trigger: 'blur'}],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      downloadLoading: false,
      defaultHead: 'this.src="' + require('../../assets/heads.png') + '"'
    }
  },
  created() {
    this.getList()
  },
  methods: {
  	getIndex($index) {
        //表格序号
        return $index + 1
  	},
    getList() {
      this.listLoading = true
      listAdmin(this.listQuery).then(response => {
        this.list = response.data.data.items
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    getRole(){
    	if(!this.listRole[0]){
    		this.listLoading = true
    		getAllRole().then(response => {
					this.listRole = response.data.data
					this.getRoleByUser()
	        this.listLoading = false
	      }).catch(() => {
	        this.listLoading = false
	      })
    	}else{
    		this.getRoleByUser();
    	}
    },
    getRoleByUser(){
    	if(this.roleForm.userId){
    		this.listLoading = true
    		getRoleByUserId({userId:this.roleForm.userId}).then(response => {
					this.roleForm.roleIds=[]
					response.data.data.forEach((item,index)=>{
					    this.roleForm.roleIds.push(item.id);
					})
	        this.listLoading = false
	        this.dialogFormVisible = true
	        this.$nextTick(() => {
		        this.$refs['dataForm'].clearValidate()
		      })
	      }).catch(() => {
	        this.listLoading = false
	      })
    	}
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
    resetForm() {
      this.dataForm = {
        id: undefined,
        username: undefined,
        password: undefined,
        checkPassword: undefined,
        avatar: undefined
      }
    },
    uploadAvatar: function(response) {
      this.dataForm.avatar = response.data.url
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.getRole()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createAdmin(this.dataForm).then(response => {
          	if(!response.data.data.avatar){
          		response.data.data.avatar=require('../../assets/heads.png')
          	}
            this.list.unshift(response.data.data)
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
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.oldUserName=row.username;
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateAdmin(this.dataForm).then(() => {
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
    
    handleUpdatePwd(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'updatePwd'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    
    handleDelete(row) {
    	this.$confirm('确定删除此用户?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
        		deleteAdmin(row).then(response => {
			        this.$notify({
			          title: '成功',
			          message: '删除成功',
			          type: 'success',
			          duration: 2000
			        })
			        const index = this.list.indexOf(row)
			        this.list.splice(index, 1)
			      })
        })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '账号', '头像']
        const filterVal = ['id', 'username', 'avatar']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '信息')
        this.downloadLoading = false
      })
    },
    handleRole(row){
    	this.roleForm.userId = Object.assign({}, row).id
    	this.dialogStatus = 'setRole'
    	this.getRole()
    },
    setRole(){
    	updateUserRole(this.roleForm).then((response) => {
            this.dialogFormVisible = false
            if(response.data.errno==0){
            	this.$notify({
	              title: '成功',
	              message: '更新成功',
	              type: 'success',
	              duration: 2000
	            })
            }else{
            	this.$notify({
	              title: '失败',
	              message: '更新失败',
	              type: 'error',
	              duration: 2000
	            })
            }
            
          })
    	
    }
  }
}
</script>