<template>
	<div class="app-container calendar-list-container">

    <!-- 添加操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入商品编号" v-model="listQuery.goodsId">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入商品名称" v-model="listQuery.goodsName">
      </el-input>
       <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
       <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>  
    </div>
    
     <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>

     
      <el-table-column align="center" label="商品编号" prop="goodsId">
      </el-table-column>

      <el-table-column align="center" min-width="100" label="商品名称" prop="goodsName">
      </el-table-column>
            
      <!--<el-table-column align="center" min-width="100" label="商品规格" prop="specificationId">      	
      </el-table-column>-->

       
      <el-table-column align="center" min-width="100" label="拼团价格" prop="spellCount">
      </el-table-column>
      
      <el-table-column align="center" min-width="100" label="开始时间" prop="startTime">
      </el-table-column>
      
      <el-table-column align="center" min-width="100" label="结束时间" prop="endTime">
      </el-table-column>

  	  <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
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
    
    
  </div>
</template>

<script>
import { listSpell, deleteSpell} from '@/api/spell'

	
export default {
	name:'advertisementAdd',
	data(){
		return{
			list:null,
			total:null,
			listLoading: true,
	        listQuery: {
		        page: 1,
		        limit: 20,
		        goodsId:undefined,
		        goodsName:undefined,
		        sort: 'add_time',
		        order: 'desc'
	        },
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
		getList() {
	      this.listLoading = true
	      listSpell(this.listQuery).then(response => {
	        this.list = response.data.data.items
	        this.total = response.data.data.total
            this.listLoading = false
	      }).catch(() => {
	        this.list = []
	        this.total = 0
	        this.listLoading = false
	      })
	    },
	    handleFilter(){
	    	this.listQuery.page = 1
	    	this.getList()
	    },
		handleCreate(){
			this.$router.push({ path: '/advertisement/spelladd'})
		},
		handleSizeChange(){
			this.listQuery.limit = val
      		this.getList()
		},
		handleCurrentChange(val) {
      		this.listQuery.page = val
      		this.getList()
        },
        handleDelete(row){
	    	deleteSpell(row).then(response => {
		        this.$notify({
		          title: '成功',
		          message: '删除成功',
		          type: 'success',
		          duration: 2000
		        })
		        const index = this.list.indexOf(row)
		        this.list.splice(index, 1)
		     })
        }
	}
}
		
</script>

<style>
</style>