<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入商家名称" v-model="listQuery.name">
      </el-input>
      <!--<el-select multiple style="width: 200px" class="filter-item" placeholder="请选择商家种类" v-model="listQuery.statusArray" >
        <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value">
        </el-option>
      </el-select> -->
      <!--<el-select multiple style="width: 200px" class="filter-item" placeholder="请选择商家使用状态" v-model="listQuery.statusArray" >
        <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value">
        </el-option>
      </el-select> -->
       <el-date-picker
	            v-model="listQuery.createStartTime"
	            type="date"
	            :picker-options="pickerBeginDateBefore"
	            format="yyyy-MM-dd"
	            value-format="yyyy-MM-dd 00:00:00"
	            placeholder="开始时间" class="filter-item">
	    </el-date-picker>至
	    <el-date-picker
	            v-model="listQuery.createEndTime"
	            type="date"
	            format="yyyy-MM-dd"
	            value-format="yyyy-MM-dd 23:59:59"
	            :picker-options="pickerBeginDateAfter"
	            placeholder="结束时间" class="filter-item">
	    </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="商家名称" prop="name">
      </el-table-column>
      
      <!--<el-table-column align="center" label="用户名" prop="username">
      	 <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)">445 </span>
        </template>
      </el-table-column>-->

      <el-table-column align="center" label="商家类型" prop="category">
       	<template slot-scope="scope">
					<el-tag :type="scope.row.category==1 ? 'success' : scope.row.category==2? 'error' : scope.row.category==3? 'danger' : scope.row.category==4? 'warning':'info' ">{{scope.row.category==1? '精品民宿' : scope.row.category== 2? '素食餐厅': scope.row.category== 3? '禅茶素材' : scope.row.category== 4? '投资收藏' : '其它'}}</el-tag>
				</template>
      </el-table-column>
			<el-table-column align="center" label="账户名" prop="account">
      </el-table-column>
      
       <el-table-column align="center" label="联系人" prop="leader">
      </el-table-column>

      <el-table-column align="center" label="手机号码" prop="phone">
      </el-table-column>

       <el-table-column align="center" label="商家电话" prop="tel">
      </el-table-column>
      
      <el-table-column align="center" label="分享人数" prop="shareNum">
      </el-table-column>
      
      <el-table-column align="center" label="商家归属地">
      	<template slot-scope="scope">
          {{scope.row.province }}-{{scope.row.city }}-{{scope.row.district }}
        </template>
      </el-table-column>

       <el-table-column align="center" label="详细地址" prop="address">
      </el-table-column>
      
      <el-table-column align="center" label="申请时间" prop="createAt">
      </el-table-column>
      
      <el-table-column align="center" label="申请状态" prop="status">
        <template slot-scope="scope">
           <el-tag>未审核</el-tag>
        </template>
      </el-table-column>     

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row )">审核</el-button>          
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


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
	.avatar-uploader-icon{
		font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
	}
  #specifications{
		width: 100%;
		color: #606266;
		height: 36px;
		border-radius: 4px;
    border: 1px solid #dcdfe6;
	}
</style>
<script>
import { userAuthList, userAuthDetail,addUserList,editUserList,getAreaList,referrerList} from '@/api/shop'
import { parseTime } from '@/utils/index'

const statusMap = {
	1: '正常',
	0: '禁用'
}
export default {
  name: 'User',
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      statusMap,
      listQuery: {
    		pageNum:1,
    		pageSize:10,
  		  status:0,
    		nickname:undefined,
    		createStartTime:undefined,
    		createEndTime:undefined
      },
      shipForm:{
      	status:undefined,
      	userId:undefined
      },
      downloadLoading: false,
      currentTimestamp: new Date(parseTime(new Date(),'{y}-{m}-{d}')).getTime(),
      pickerBeginDateBefore:{
            disabledDate: (time) => {
							let beginDateVal = this.listQuery.registerEndDate;
                if (beginDateVal) {
                    return time.getTime() > new Date(beginDateVal).getTime() || time.getTime() > this.currentTimestamp;
                }else{
                  	return time.getTime() > this.currentTimestamp;
                }
            }
        },
        pickerBeginDateAfter:{   
            disabledDate: (time) => {
							let beginDateVal = this.listQuery.registerStartDate;
                if (beginDateVal) {
                    return time.getTime() < new Date(beginDateVal).getTime() || time.getTime() > this.currentTimestamp;
                }else{
                	return time.getTime() > this.currentTimestamp;
                }
            }
        }
    }
  },
  created() {
    this.getList()
  },
  methods: {
  	getIndex($index){
			return  $index + 1
		},
    getList() {
      this.listLoading = true
      userAuthList(this.listQuery).then(response => {
        this.list = response.data.data.items
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleShopChange(value){
			this.dataForm.province = value[0];
			this.dataForm.city = value[1];
			this.dataForm.district = value[2];
    },

    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleDetail(row){   	
			this.$router.push({ path: '/mall/applydetail', query: { userAuthId: row.userAuthId}})
   }
  }
}
</script>
