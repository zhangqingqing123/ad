<template>
	<div class="app-container calendar-list-container">

    <!-- 添加操作 -->
    <div class="filter-container">
       <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入产品编号" v-model="listQuery.name">
      </el-input>
       <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
       <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
       
    </div>
    <!--砍价列表-->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="商品编号" prop="goodsId">
      </el-table-column>

      <el-table-column align="center" min-width="100" label="商品名称" prop="name">
      </el-table-column>
      
      <el-table-column align="center" min-width="100" label="图片" prop="picUrl">
      	 <template slot-scope="scope">
	      <img  :src="scope.row.picUrl" alt="" style="width: 50px;height: 50px">
	    </template>
      </el-table-column>
      
      <el-table-column align="center" min-width="100" label="砍价价格" prop="price">
      </el-table-column>
      
      <el-table-column align="center" min-width="100" label="开始时间" prop="startTime">
      </el-table-column>
      
      <el-table-column align="center" min-width="100" label="结束时间" prop="endTime">
      </el-table-column>

  	  <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="danger" size="mini"  @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
     </el-table-column>
     
    </el-table>
    
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    
    
  </div>
</template>

<script>
import { listBargain, addBargain, deleteBargain, orderListBargain} from '@/api/bargain'
//import { parseTime } from '@/utils/index'	
export default {
	data(){
		return{
			list:null,
			total:null,
			listLoading: true,
	        listQuery: {
		        page: 1,
		        limit: 20,
		        endTime:undefined,
		        startTime:undefined,
		        goodsId:undefined,
		        goodsSn:undefined,
		        isExpire:undefined,
		        sort: 'add_time',
		        order: 'desc'
	        },
			dialogStatus:'',
			textMap: {
        		update: '编辑',
        		create: '创建'
      	   },
//    	    currentTimestamp: new Date(parseTime(new Date(),'{y}-{m}-{d}')).getTime(),
//		     pickerBeginDateBefore:{
//		            disabledDate: (time) => {
//									let beginDateVal = this.listQuery.endTime;
//		                if (beginDateVal) {
//		                    return time.getTime() > new Date(beginDateVal).getTime() || time.getTime() > this.currentTimestamp;
//		                }else{
//		                  	return time.getTime() > this.currentTimestamp;
//		                }
//		            }
//		        },
//		    pickerBeginDateAfter:{   
//		            disabledDate: (time) => {
//									let beginDateVal = this.listQuery.startTime;
//		                if (beginDateVal) {
//		                    return time.getTime() < new Date(beginDateVal).getTime() || time.getTime() > this.currentTimestamp;
//		                }else{
//		                	return time.getTime() > this.currentTimestamp;
//		                }
//		            }
//		        }
				pickerBeginDateBefore:{
	            disabledDate: (time) => {
	                let beginDateVal = this.listQuery.endTime;
	                if (beginDateVal) {
	                    return time.getTime() > beginDateVal;
	                }
	            }
	        },
	        pickerBeginDateAfter:{
	            disabledDate: (time) => {
	                let beginDateVal = this.listQuery.startTime;
	                if (beginDateVal) {
	                    return time.getTime() < beginDateVal;
	                }
	            }
	        },
		}
	},
	created(){
		this.getList()
	},
	methods:{
		//获取列表
		getList() {
	        this.listLoading = true
	      listBargain(this.listQuery).then(response => {
	      	console.log(response)
	        this.list = response.data.data.items
	        this.total = response.data.data.total
         	this.listLoading = false
	      }).catch(() => {
	        this.list = []
	        this.total = 0
	        this.listLoading = false
	      })
	    },
	    //添加
		handleCreate(){
			this.$router.push({ path: '/advertisement/bargainadd',query:{bargain:"bargain"}})	
		},
		//删除；
		handleDelete(res){
			var _this = this;
			deleteBargain({id:res}).then(response => {
				console.log(response);
				 _this.$notify({
	              title: '成功',
	              message: '删除成功',
	              type: 'success',
	              duration: 2000
	          })
			this.getList()
	      })
		},
		handleFilter(){
			this.listQuery.page = 1
			this.getList()
		},
		handleUpdate(row){
			
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

<style>
</style>