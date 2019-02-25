<template>
  <div class="app-container calendar-list-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入用户名/手机号码" v-model="listQuery.nickname">
      </el-input>
      <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入手机号码" v-model="listQuery.phone">
      </el-input>-->
      <!--<el-select multiple style="width: 200px" class="filter-item" placeholder="请选择积分来源" v-model="listQuery.changeType" >
        <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value">
        </el-option>
      </el-select>-->
      <el-date-picker
		            v-model="listQuery.registerStartDate"
		            type="date"
		            :picker-options="pickerBeginDateBefore"
		            format="yyyy-MM-dd"
		            value-format="yyyy-MM-dd 00:00:00"
		            placeholder="积分时间" class="filter-item">
		    </el-date-picker>至
		    <el-date-picker
		            v-model="listQuery.registerEndDate"
		            type="date"
		            format="yyyy-MM-dd"
		            value-format="yyyy-MM-dd 23:59:59"
		            :picker-options="pickerBeginDateAfter"
		            placeholder="积分时间" class="filter-item">
		    </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>
    
    <div>
    	 <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			    <el-tab-pane label="全部" name=""></el-tab-pane>
			    <el-tab-pane label="获得" name="1"></el-tab-pane>
			    <el-tab-pane label="使用" name="2"></el-tab-pane>
			 </el-tabs>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      
      <el-table-column align="center" label="用户名" prop="username">
      </el-table-column>
      
       <el-table-column align="center" label="手机号码" prop="phone">
      </el-table-column>
      

      <el-table-column align="center" min-width="100"  label="获得/使用积分数" prop='score'>
      	<template slot-scope="scope">
      		<span v-if='scope.row.changeType==1?"+":"-"'>{{scope.row.changeType==1?"+":"-"}}{{scope.row.score}}</span>
      	</template>
      </el-table-column>
      
      <el-table-column align="center" label="获得方式" prop="source">
      </el-table-column>

      <el-table-column align="center" label="积分时间" prop="createAt">
      </el-table-column>
      
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibilityHeight="100" ></back-to-top>
    </el-tooltip>

  </div>
</template>

<style>
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
  .gallery {
    width: 80px;
    margin-right: 10px;
  }
</style>

<script>
import { scoreRecordIntergral } from '@/api/spell'
import BackToTop from '@/components/BackToTop'
import { parseTime } from '@/utils/index'

//const statusMap = {
//	1: '获得积分',
//	2: '使用积分'
//}

export default {
  name: 'GoodsList',
  components: { BackToTop },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
     // statusMap,
      activeName: '',
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        createAt:'',
        username:'',
        phone:''
      },
      currentTimestamp: new Date(parseTime(new Date(),'{y}-{m}-{d}')).getTime(),
      pickerBeginDateBefore:{
            disabledDate: (time) => {
							let beginDateVal = this.listQuery.endTime;
                if (beginDateVal) {
                    return time.getTime() > new Date(beginDateVal).getTime() || time.getTime() > this.currentTimestamp;
                }else{
                  	return time.getTime() > this.currentTimestamp;
                }
            }
        },
        pickerBeginDateAfter:{   
            disabledDate: (time) => {
							let beginDateVal = this.listQuery.startTime;
                if (beginDateVal) {
                    return time.getTime() < new Date(beginDateVal).getTime() || time.getTime() > this.currentTimestamp;
                }else{
                	return time.getTime() > this.currentTimestamp;
                }
            }
        },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      scoreRecordIntergral(this.listQuery).then(response => {
        this.list = response.data.data.items
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
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
    handleClick(tab, event) {
        console.log(tab, event);
        this.listQuery.changeType = tab.name;
				this.getList()
    }
    
  }
}
</script>