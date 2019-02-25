<template>
	<!--<div>
		1.今日订单量、以往订单数据表（可进行种类、时间上的筛选）

		2.今日新增用户量、用户量数据表
		
		3.DAU、MAU
		
		4.用户地域分布信息、各地区购买商品种类信息、各地区消费信息、商户地域分布
		
		6.今日平台销量、以往销量数据表
		
		7.今日平台营业额、以往营业额数据表
	</div>-->
	<div class="border-style">
		<el-row>
		  <el-col :span="24">
		  		<el-card class="box-card">
		  			<h4>统计区域商户数据量</h4>
		  			<el-cascader
				        :options="cateAreaList"
				        change-on-select
				        v-model="selectedOptions"
				        expand-trigger="hover"
				        @change="handleCategoryChange" >
		   			</el-cascader>
		   			<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFiltershop">查找</el-button>
		   			<div style="margin-top: 24px;"></div>
		  			<el-table size="small" :data="listArea" v-loading="arealistLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row> 
				      <el-table-column align="center" min-width="100" label="区域" prop="vegName">
				      	<template slot-scope="scope">
				          {{scope.row.province }}-{{scope.row.city }}-{{scope.row.district }}
				        </template>
				      </el-table-column>
				
				      <el-table-column align="center" label="商户数量" prop="count">
				      </el-table-column>
				    </el-table>
				    <!-- 分页 -->
				    <div class="pagination-container">
				      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="countAreaBusyUserCountData.pageNum"
				        :page-sizes="[10,20,30,50]" :page-size="countAreaBusyUserCountData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				      </el-pagination>
				    </div>
		  		</el-card>
		  </el-col>
		  <el-col :span="24">
		  	<div class="bg-purple-light">
		  		<el-card class="box-card">
		  			<h4>统计区域用户数据量</h4>
		  			<el-cascader
				        :options="cateAreaList"
				        change-on-select
				        v-model="selectedOptionsuser"
				        expand-trigger="hover"
				        @change="handleCategoryChange" >
		   			</el-cascader>
		   			<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilteruser">查找</el-button>
		   			<div style="margin-top: 24px;"></div>
		  			<el-table size="small" :data="listAreaUser" v-loading="userarealistLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row> 
				      <el-table-column align="center" min-width="100" label="区域" prop="vegName">
				      	<template slot-scope="scope">
				          {{scope.row.province }}-{{scope.row.city }}-{{scope.row.district }}
				        </template>
				      </el-table-column>
				
				      <el-table-column align="center" label="商户数量" prop="count">
				      </el-table-column>
				    </el-table>
				    <!-- 分页 -->
				    <div class="pagination-container">
				      <el-pagination background @size-change="userhandleSizeChange" @current-change="userhandleCurrentChange" :current-page="countAreaUserCountData.pageNum"
				        :page-sizes="[10,20,30,50]" :page-size="countAreaUserCountData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totals">
				      </el-pagination>
				    </div>
		  		</el-card>
		  	</div>
		  </el-col>
		</el-row>
  		<el-row>
		  <!--<el-col :span="12">
		  	<div class="bg-purple">
		  		<el-card class="box-card">
		  			<h4>统计月活跃用户量</h4>
		  		</el-card>
		  	</div>
		  </el-col>
		  <el-col :span="12">
		  	<div class="bg-purple-light">
		  		<el-card class="box-card">
		  			<h4>统计日活跃用户量</h4>
		  		</el-card>
		  	</div>
		  </el-col>-->
		</el-row>
		
		<!--<el-row>
		  <el-col :span="12">
		  	<div class="bg-purple">
		  		<el-card class="box-card">
		  			<h4>统计今日用户量</h4>
		  		</el-card>
		  	</div>
		  </el-col>
		  <el-col :span="12">
		  	<div class="bg-purple-light">
		  		<el-card class="box-card">
		  			<h4>统计用户数量</h4>
		  		</el-card>
		  	</div>
		  </el-col>
		</el-row>-->
	</div>
  	
</template>

<style rel="stylesheet/scss" lang="scss">
 .border-style{
 	margin-top: 24px;
 	margin-left: 20px;
 	margin-right: 20px;
 	.box-card{
 		margin-top: 20px;
 	}
 	.bg-purple{
 		margin-right: 10px;
 	}
 	.bg-purple-light{
 		margin-left: 10px;
 	}
 	
 }
</style>

<script>
import { listArea } from '@/api/goods'
import { countAreaBusyUserCount, countAreaUserCount, countMonthActiveUser } from '@/api/stat'
//import VeHistogram from 'v-charts/lib/histogram' 
import VeLine from 'v-charts/lib/line'
export default {
  components: { VeLine },
  data() {
    return {
      province:"",
      city:"",
	  district:"",
      listArea:[],
      total:0,
      arealistLoading:true,
      listAreaUser:[],
      countAreaBusyUserCountData:{
      	province:undefined,
      	city:undefined,
      	district:undefined,
      	pageSize:10,
      	pageNum:1
      },
      userarealistLoading:true,
      chartDataArea: {},
      chartSettingsArea: {
//		        labelMap: {
//		          'province': '省',
//		          'city':'市',
//		          'district':'区',
//		          'count': '数量'
//		        }
		      },
      chartExtendArea:{},
      listMothUser:[],
      listQuery:{
      	beginDate:undefined,
      	endDate:undefined,
      	timeLevel:[]
      },
      countAreaUserCountData:{
      	province:undefined,
      	city:undefined,
      	district:undefined,
      	pageSize:10,
      	pageNum:1
      },
      totals:0,
      selectedOptions: [],
      selectedOptionsuser:[],
      cateAreaList:[],
    }
  },
  created() {
  	this.init()
	this.getCountAreaBusyUserCount()
	this.getcountAreaUserCount()
//	this.getcountMonthActiveUser()
  },
 methods: {
 	init:function(){
 		listArea().then(response => {
	      	this.cateAreaList = response.data.data
	      })
 	},
 	getCountAreaBusyUserCount() {
 		this.listLoading = true
   		  countAreaBusyUserCount(this.countAreaBusyUserCountData).then(response => {
   		  	this.arealistLoading = false
		    this.listArea = response.data.data.items
			this.total = response.data.data.total
		  }).catch(() => {
	        this.list = []
	        this.total = 0
	        this.arealistLoading = false
	      })
 	},
 	handleSizeChange(val) {
      this.countAreaBusyUserCountData.pageSize = val
      this.getCountAreaBusyUserCount()
    },
    handleCurrentChange(val) {
      this.countAreaBusyUserCountData.pageNum = val
      this.getCountAreaBusyUserCount()
    },
    handleFiltershop() {
      this.countAreaBusyUserCountData.pageNum = 1
      this.countAreaBusyUserCountData = {
      	province:this.province,
      	city:this.city,
      	district:this.district,
      	pageSize:10,
      	pageNum:1
      },
      this.getCountAreaBusyUserCount()
    },
    
    
    
 	getcountAreaUserCount () {
   		  countAreaUserCount(this.countAreaUserCountData).then(response => {
   		  	this.userarealistLoading = false
		    this.listAreaUser = response.data.data.items
		    this.totals = response.data.data.total
		  }).catch(() => {
	        this.list = []
	        this.total = 0
	        this.arealistLoading = false
	      }) 		
 	},
 	userhandleSizeChange(){
 		this.countAreaUserCountData.pageSize = val
        this.getcountAreaUserCount()
 	},
 	userhandleCurrentChange(val){
 		this.countAreaUserCountData.pageNum = val
        this.getcountAreaUserCount()
 	},
 	getcountMonthActiveUser () {
 		countMonthActiveUser(this.listQuery).then( response => {
 			this.listMothUser = response.data.data
 		})
 	},
 	handleCategoryChange(value) {
				this.province = value[0]
				this.city     = value[1]
				this.district = value[2]
    },
    handleFilteruser(){
      this.countAreaUserCountData.pageNum = 1
      this.countAreaUserCountData = {
      	province:this.province,
      	city:this.city,
      	district:this.district,
      	pageSize:10,
      	pageNum:1
      },
      this.getcountAreaUserCount()
    }
 	
 }

}
</script>