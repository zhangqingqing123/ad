<template>
	<div class="app-container calendar-list-container">

    <!-- 添加操作 -->
    <div class="filter-container">
       <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入产品编号" v-model="listQuery.name">
      </el-input>
       <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
       <!--<el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>-->
       
    </div>
    
     
    <!--优惠券列表-->
  	<el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      
      <el-table-column align="center" label="用户名字" prop="username">
      </el-table-column>

      <el-table-column align="center" min-width="100" label="商品介绍" prop="content">
      </el-table-column>
      
       <el-table-column align="center" min-width="100" label="生效时间" prop="startday">
      </el-table-column>
      
      <el-table-column align="center" min-width="100" label="过期时间" prop="endday">
      </el-table-column>
      
      <el-table-column align="center" min-width="100" label="过期时间" prop="endday">
      </el-table-column>
      
       <el-table-column align="center" label="是否使用" prop="isNew">
        <template slot-scope="scope">
          <span>{{scope.row.status==0 ? '未使用' : '已使用'}}</span>
        </template>
      </el-table-column> 
      
      <el-table-column align="center" label="发放状态" prop="isNew">
        <template slot-scope="scope">
          <span>{{scope.row.vtype==0 ? '自动发放' : '手动发放'}}</span>
        </template>
      </el-table-column> 
      
      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.id,scope.row.status)">更新</el-button>
          <el-button type="danger" size="mini"  @click="handleRead(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    
     <!-- 添加或修改对话框 -->
   	<el-dialog title="优惠券详情" :visible.sync="dialogTableVisible">
	 <div><h4 class="title">创建时间:</h4><span class="content">{{gridData.createtime}}</span></div>
	 <div><h4 class="title">生效时间:</h4><span class="content">{{gridData.startday}}</span></div>
	 <div><h4 class="title">失效时间:</h4><span class="content">{{gridData.endday}}</span></div>
	 <div><h4 class="title">使用情况:</h4><span class="content">{{gridData.status==0?"未使用":"已使用"}}</span></div>
	 <div><h4 class="title">发放状态:</h4><span class="content">{{gridData.vtype==0?"自动发放":"手动发放"}}</span> </div>
	 <div><h4 class="title">商品介绍:</h4><span class="content">{{gridData.content}}</span></div>
	 
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
import {listCoupons,detailCoupons,updateCoupons } from '@/api/coupons'
	
export default {
	data(){
		return{
			list:null,
			couponsList:null,
			total:null,
			listLoading: true,
			dialogTableVisible: false,
			gridData: [],
	        listQuery: {
		        page: 1,
		        limit: 20,
		        startTime: undefined,
		        endTime: undefined,
		        couponsName:undefined,
		        type:undefined,
		        sort: 'createtime',
		        order: 'desc'
	        },
			dialogStatus:'',
			textMap: {
        		update: '编辑',
        		create: '创建'
      		},
        	dialogFormVisible : false,
      		dataForm:{
      			id:undefined,
      			status:undefined
      		}
		}
	},
	created(){
		this.getList()
	},
	methods:{
		//获取列表
		getList() {
			var _this = this;
	        this.listLoading = true
	      listCoupons(this.listQuery).then(response => {
	      	console.log(response)
	        _this.list = response.data.data.items
	        _this.total = response.data.data.total
	        _this.listLoading = false
	      }).catch(() => {
	        _this.list = []
	        _this.total = 0
	        _this.listLoading = false
	      })
	    },
		handleCreate(data){
			this.$router.push({ path: '/shopgoods/shopadd'})
//			addCoupons(this.dataForm).then(response =>{
//				console.log(response)
//			})
		},
		//修改状态；
		handleUpdate(id,status){
			var _this = this;
	        this.dataForm.id = id;
	        if(status==0){
	        	this.listLoading = true;
	        	this.dataForm.status = 1;
	        	updateCoupons(this.dataForm).then(response => {
		      	console.log(response)
		      	_this.getList();
		      }).catch(() => {
		        _this.list = []
		        _this.total = 0
		        _this.listLoading = false
		      })
	        }
	        if(status==1){
	        	this.$notify({
	              title: '提示',
	              message: '该优惠券状态不能更改！',
	              type: 'success',
	              duration: 2000
	            })
	        	return;
	        }
		},
		//详情；
		handleRead(id){
			var _this = this;
	        this.listLoading = true;
	        this.dialogTableVisible = true;
	        this.gridData = [];
	      detailCoupons({id:id}).then(response => {
	      	console.log(response.data.data)
	        _this.gridData = (response.data.data);
	        _this.listLoading = false
	      }).catch(() => {
	        _this.list = []
	        _this.total = 0
	        _this.listLoading = false
	      })
			//this.$router.push({ path: '/advertisement/couponsRead',query:{id:id}})
		},
		createData(){
			this.$refs['dataForm'].validate((valid) => {
	        if (valid) {
	          createSpell(this.dataForm).then(response => {
	          	console.log(response)
//	            this.list.unshift(response.data.data)
//	            this.dialogFormVisible = false
//	            this.$notify({
//	              title: '成功',
//	              message: '创建成功',
//	              type: 'success',
//	              duration: 2000
//	            })
	          })
	        }
	      })
    	},
    
    	updateData(){
			
		},
		handleFilter(){
			
		},
		handleSizeChange(){
			this.listQuery.limit = val
      		this.getList()
		},
		handleCurrentChange(val) {
      		this.listQuery.page = val
      		this.getList()
    },

	}
}
	
		
</script>

<style scoped>
	.title{
		display: inline-block;
		margin-right: 30px;
	}
	.el-dialog__body {
    padding: 10px 20px;
    color: #606266;
    /* line-height: 24px; */
    font-size: 14px;
}
</style>