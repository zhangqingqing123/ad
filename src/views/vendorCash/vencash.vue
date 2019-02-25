<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
    	<el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入提现单号" v-model="listQuery.drawNo">
     </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
       <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">申请提现</el-button>
      <!--<el-button class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload" :loading="downloadLoading">导出</el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" min-width="100" label="提现单号" prop="drawNo">
      </el-table-column>

      <el-table-column align="center" label="提现账户" prop="drawAccount">
      </el-table-column>
      
      <el-table-column align="center" label="账户名称" prop="drawName">
      </el-table-column>
            
      <el-table-column align="center" label="提现方式" prop="drawWay">
      </el-table-column>
      
      <el-table-column align="center" label="手机号" prop="phone">
      </el-table-column>
      
      <el-table-column align="center" label="提现金额" prop="drawPrice">
      </el-table-column>
      
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


    <!-- 添加-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
         <el-form-item label="可提现余额" prop="balance">
          <el-input v-model="balance" disabled></el-input>
        </el-form-item>
        <el-form-item label="提现账户" prop="drawAccount">
          <el-input v-model="dataForm.drawAccount"></el-input>
        </el-form-item>
     		<el-form-item label="账户名称" prop="drawName">
          <el-input v-model="dataForm.drawName"></el-input>
        </el-form-item>
        <el-form-item label="提现方式" prop="drawWay">
          <el-input v-model="dataForm.drawWay"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="dataForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="提现金额" prop="drawPrice">
          <el-input v-model="dataForm.drawPrice"></el-input>
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

<style >
</style>

<script>

import { listShopdraw, createShopdraw, readShopdraw, updateShopdraw, deleteShopdraw} from '@/api/shopdraw'
import { parseTime } from '@/utils/index'

export default {
  name: 'Shopdraw',
  data() {
	 var validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else {
      	var reg=/^[1][3,4,5,7,8][0-9]{9}$/
        if (!reg.test(value)) {
           callback(new Error('请输入正确的手机号码'))
        }else{
        	callback()
        }
      }
    }
    return {
    balance:0,
	  list: null,
      total: null,
      listLoading: true,
      dialogFormVisible:false,
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        //status:[],
        //startTime:undefined,
       // endTime:undefined,
        sort: 'create_time',
        order: 'desc'
      },
      examineDialogVisible: false,
      isShow:true, 
      dialogStatus: '',
      textMap: {
        create: '创建',
        update: '编辑'
      },
      examineDetail: {
        shopdraw: {},
        user: {}
      },
      shipForm: {
        status:undefined,
        id:undefined
//      userId:undefined
      },
      dataForm:{
      	drawAccount:undefined,
      	drawName:undefined,
      	drawPrice:undefined,
      	drawWay:undefined,
      	phone:undefined,
      	balance:0
      },
       rules: {
        drawAccount: [{ required: true, message: '提现账户不能为空', trigger: 'blur' }],
        drawName: [{ required: true, message: '提现名称不能为空', trigger: 'blur' }],
        drawPrice: [{ required: true, message: '提现金额不能为空', trigger: 'blur' }],
        drawWay: [{ required: true, message: '提现方式不能为空', trigger: 'blur' }],    
        phone: [
	        { required: true, message: '手机号码不能为空', trigger: 'blur' },
	        { validator: validatePhone, trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listShopdraw(this.listQuery).then(response => {
      	console.log(response)
        this.list = response.data.data.items;
        this.total = response.data.data.total;
          
        this.balance = response.data.data.wallet.balance==undefined?"0":response.data.data.wallet.balance;;
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
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
    resetForm() {
      this.dataForm = {
        drawAccount:undefined,
      	drawName:undefined,
      	drawPrice:undefined,
      	drawWay:undefined,
      	phone:undefined,
      	balance:0
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
    createData(data){
    	createShopdraw(this.dataForm).then(response =>{
    		console.log(response)
    		this.list.unshift(response.data);
    		this.getList();
        this.dialogFormVisible = false;
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
    	})
    },
    updateData(){
    	
    },
  	handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['提现单号', '申请商户','账户名称',  '手机号', '提现方式', '提现金额']
        const filterVal = ['drawNo', 'drawAccount','drawName', 'phone', 'drawWay',  'drawPrice']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '提现信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
