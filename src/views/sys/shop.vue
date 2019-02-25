<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入店铺名称" v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
     <el-table-column align="center" label="店铺ID" width="100px" prop='id'>
     </el-table-column>
			
      <el-table-column align="center" label="店铺名称" prop="name">
      </el-table-column>

      <el-table-column align="center" label="店铺抽成" prop="vendorPercent">
      </el-table-column>
      
      <el-table-column align="center" label="店铺账号" prop="account">
      </el-table-column>
      
      <el-table-column align="center" label="店铺地址" prop="address">
      	<template slot-scope="scope">
          {{scope.row.address }}
        </template>
      </el-table-column>
      			  
      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
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
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="120px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="店铺名称" prop="name">
          <el-input v-model="dataForm.name"></el-input>
        </el-form-item>
        
        <el-form-item label="店铺地址" >
	        <el-select v-model="dataForm.province" placeholder="省" @change="provinceChange">
            <el-option v-for="item in provinces" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="dataForm.city" placeholder="市" @change="cityChange">
            <el-option v-for="item in cities" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="dataForm.county" placeholder="区" @change="countyChange">
            <el-option v-for="item in county" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      	</el-form-item>

        <el-form-item label="店铺抽成" prop="vendorPercent">
          <el-input type="number" step="0.01"  v-model="dataForm.vendorPercent"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="店铺账号" prop="username">
           <el-input    v-model="dataForm.username"></el-input>
        </el-form-item>
        <el-form-item v-else label="店铺账号" prop="account">
           <el-input    v-model="dataForm.account"></el-input>
        </el-form-item>
        <el-form-item  v-if="dialogStatus=='create'" label="店铺密码" prop="password">
          <el-input type="password" auto-complete="off" v-model="dataForm.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
        
      </div>
    </el-dialog>

  </div>
  
</template>

<script>
import { listVendor, createVendor, readVendor, updateVendor, deleteVendor,regionVendor,getByPidVendor} from '@/api/vendor'
import { MessageBox } from 'element-ui'
export default {
	name: 'User',
  data() {
  	var validateVendorPercent = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入店铺抽成比例'))
      } else {
      	var reg = /^(1(\.0{2})|0(\.\d{2})?)$/
        if (!reg.test(value)) {
           callback(new Error('只能输入0.00-1.00之间的数值'))
        }else{
        	callback()
        }
      }
    }
  	const validatePassword = (rule, value, callback) => {	
      if (!value || value.length < 6) {
        callback(new Error('管理员密码长度应大于6'))
      } else {
        callback()
      }
    }
    return {
      list: null,
      total: null,
      listLoading: true,
      province:'',
      city:'',
      county:'',
      provinces:{},
      cities:{},
      county:{},
      listQuery: {
        page: 1,
        limit: 20,
        id:undefined,
        name:'',
        vendorPercent:0,
        account:undefined,
        sort: 'createtime',
        order: 'desc'
      },
      dataForm: {
        name:'',
        vendorPercent:0,
        username:undefined,
        password:undefined,
        pid:undefined
      },
//    shipForm:{
//				pid:undefined
//    },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [{ required: true, message: '店铺名称不能为空', trigger: 'blur' }],
				vendorPercent: [
        	{ required: true, message: '店铺抽成不能为空', trigger: 'blur' },
        	{ validator: validateVendorPercent, trigger: 'blur' }
        ],
        province: [{ required: true, message: '店铺所在省不能为空', trigger: 'blur' }],
        city: [{ required: true, message: '店铺所在市不能为空', trigger: 'blur' }],
        county: [{ required: true, message: '店铺所在区不能为空', trigger: 'blur' }],
        account:[{ required: true, message: '店铺账户不能为空', trigger: 'blur' }],
        username:[{ required: true, message: '店铺账户不能为空', trigger: 'blur' }],
        password:[
        	{ required: true, message: '店铺密码不能为空', trigger: 'blur' },
        	{ validator: validatePassword, trigger: 'blur' }
        ]
      },
      downloadLoading: false,
    }
  },
  created() {
    this.getList()
    this.getProvinces()
  },
  methods: {
    getList() {
      this.listLoading = true
      listVendor(this.listQuery).then(response => {
        this.list = response.data.data.items
       this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
     getProvinces() {
      regionVendor().then(response => {
        this.provinces = response.data.data
        //this.cities = response.data.data
        //this.county = response.data.data
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
    resetForm() {
      this.dataForm = {
        name:'',
        vendorPercent:0,
        username:undefined,
        password:undefined,
       	pid:undefined
      }
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row);
      console.log(Object.assign({}, row));
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreate() {
    	this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
          createVendor(this.dataForm).then(response => {
          	 console.log(response);
          	 this.getList();
				    	 	 //this.list.unshift(response.data.data)
				            this.dialogFormVisible = false
				          	 this.$notify({
				              title: '成功',
				              message: '创建成功',
				              type: 'success',
				              duration: 2000
				            }) 
          })
    	 
//    this.$refs['dataForm'].validate((valid) => {
//      if (valid) {
//        createVendor(this.dataForm).then(response => {
//          this.list.unshift(response.data.data)
//          this.dialogFormVisible = false
//        	 this.$notify({
//            title: '成功',
//            message: '创建成功',
//            type: 'success',
//            duration: 2000
//          })  
//        }).catch(response => {
//	        MessageBox.alert('提示信息：' + response.data.errmsg, '警告', {
//	          confirmButtonText: '确定',
//	          type: 'error'
//	        })
//    		})
//      }
//    })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateVendor(this.dataForm).then(() => {
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
		handleDelete(row){
			deleteVendor(row).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })
			
		},
		provinceChange(val){
      getByPidVendor({pid:val}).then(response => {
        this.cities = response.data.data
      })
		},
		cityChange(val){
      getByPidVendor({ pid: val }).then(response => {
        this.county = response.data.data
      })
   		},
		countyChange(val){

		},
		
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['店铺序号','店铺名称', '店铺抽成']
        const filterVal = ['id','name', 'vendorPercent']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '用户信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
