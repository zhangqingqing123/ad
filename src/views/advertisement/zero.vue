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

      <el-table-column align="center" min-width="100" label="商品名称" prop="goods.name">
      </el-table-column>
      
      <el-table-column align="center" min-width="100" label="价格" prop="product.scareBuyingPrice">
      </el-table-column>
      
      <el-table-column align="center" min-width="100" label="库存" prop="inventory">
      </el-table-column>
      
      <el-table-column align="center" min-width="100" label="规格" prop="specifications">
      	<template slot-scope="scope">
	      <!--<img  :src="scope.row.goods.picUrl" alt="" style="width: 50px;height: 50px">-->
	      <span v-for="v in scope.row.product.specifications">{{v}}</span>
	    </template>
      </el-table-column>
      
      <el-table-column align="center" min-width="100" label="图片" prop="specificationId">
      	<template slot-scope="scope">
	      <img  :src="scope.row.goods.picUrl" alt="" style="width: 50px;height: 50px">
	    </template>
      </el-table-column>
      
      <!--<el-table-column align="center" min-width="100" label="拼团价格" prop="spellCount">
      </el-table-column>-->
      
      <el-table-column align="center" min-width="100" label="开始时间" prop="startTime">
      </el-table-column>
      
      <el-table-column align="center" min-width="100" label="结束时间" prop="endTime">
      </el-table-column>

  	  <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="danger" size="mini"  @click="handleDelete(scope.row)">删除</el-button>
          <!--<el-button type="danger" size="mini"  @click="handleDetail(scope.row.id)">详情</el-button>-->
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
import { listZero, addzero, deleteZero ,detailZero , updateZero} from '@/api/zero'

	
export default {
	name:'advertisementAdd',
	data(){
		return{
			list:null,
			total:null,
			listLoading: true,
			dialogTableVisible: false,
			gridData:'',
	        listQuery: {
		        page: 1,
		        limit: 20,
		        goodsId:undefined,
		        goodsName:undefined,
		        sort: 'create_time',
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
		//获取列表；
		getList() {
	      this.listLoading = true
	      listZero(this.listQuery).then(response => {
	      	console.log(response);
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
	    //零元购--添加；
		handleCreate(){
			this.$router.push({ path: '/advertisement/zeroAdd'})
		},
		handleSizeChange(){
			this.listQuery.limit = val
      		this.getList()
		},
		handleCurrentChange(val) {
      		this.listQuery.page = val
      		this.getList()
        },
        //删除
        handleDelete(row){
	    	deleteZero(row).then(response => {
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
        //查看详情；
        handleDetail(id){
        	var _this = this;
	        this.listLoading = true;
	        this.dialogTableVisible = true;
	        this.gridData = [];
	      detailZero({id:id}).then(response => {
	      	console.log(response.data.data)
	        _this.gridData = (response.data.data);
	        _this.listLoading = false
	      }).catch(() => {
	        _this.list = []
	        _this.total = 0
	        _this.listLoading = false
	      })
        }
	}
}
		
</script>

<style>
</style>