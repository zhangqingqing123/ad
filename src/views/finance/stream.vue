<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">

      <el-select  style="width: 200px" class="filter-item" placeholder="账户金额流动原因" v-model="listQuery.changeType">
        <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value">
        </el-option>
      </el-select> 
      <!--<el-select  style="width: 200px" class="filter-item" placeholder="请选择资金走向缘由" v-model="listQuery.changeReason">
        <el-option v-for="(key, value) in reasonStatusMap" :key="key" :label="key" :value="value">
        </el-option>
      </el-select>-->
     <el-date-picker
	            v-model="listQuery.startTime"
	            type="date"
	            :picker-options="pickerBeginDateBefore"
	            format="yyyy-MM-dd"
	            value-format="yyyy-MM-dd 00:00:00"
	            placeholder="开始时间" class="filter-item">
	    </el-date-picker>至
	    <el-date-picker
	            v-model="listQuery.endTime"
	            type="date"
	            format="yyyy-MM-dd"
	            value-format="yyyy-MM-dd 23:59:59"
	            :picker-options="pickerBeginDateAfter"
	            placeholder="结束时间" class="filter-item">
	    </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload" :loading="downloadLoading">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
			
			 <el-table-column align="center" label="用户名" prop="username">
      </el-table-column>
      
      <el-table-column align="center" min-width="100" label="流水时间" prop="createdAt">
      </el-table-column>

      <el-table-column align="center" label="资金" prop="value">
      </el-table-column>
      
      <el-table-column align="center" label="资金走向" prop="changeType">
      	 <template slot-scope="scope">
           <el-tag :type="scope.row.changeType == 0 ? '支出' : '收入' ">{{scope.row.changeType == 0 ? '支出' : '收入'}}</el-tag>
        </template>
      </el-table-column> 
      
      <el-table-column align="center" label="资金走向缘由" prop="direction">
      	 <!--<template slot-scope="scope">
           <el-tag :type="scope.row.changeReason == 0 ? '商家提现' : scope.row.changeReason == 1 ?'用户支付':'用户退款' ">{{scope.row.changeReason == 0 ? '商家提现' : scope.row.changeReason == 1 ?'用户支付':'用户退款'}}</el-tag>
        </template>-->
      </el-table-column>
      
     <el-table-column align="center" label="平台总盈利资金" prop="money">
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

<style>

</style>

<script>
import { listShopdraw, createShopdraw, readShopdraw, updateShopdraw, deleteShopdraw , getReflectList , getBalanceRecordList , balancePlatformRecordList} from '@/api/shopdraw'
import { listRecord } from '@/api/balancedRecord'
import { parseTime } from '@/utils/index'

const statusMap = {
  0: '支出',
  1: '收入'
  }
const reasonStatusMap = {
  0: '商家提现',
  1: '商品购买',
  2: '用户提现'
}

export default {
  name: 'BalancedRecord',
  data() {
    return {
      list: undefined,
      total: undefined,
      listLoading: true,
      listQuery: {
					pageNum: 1,
					pageSize: 10,
					changeType:undefined,
					endTime:undefined,
					startTime:undefined,

					accountName: undefined,
					accountNumber: undefined,
					endMakeTime: undefined,
					endTime: undefined,
					id: undefined,
					money: undefined,
					reflectType: undefined,
					startMakeTime: undefined,
					startTime: undefined,
					state: undefined,
					userId: undefined
				},
      statusMap,
      reasonStatusMap,
      downloadLoading: false,
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
        }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      balancePlatformRecordList(this.listQuery).then(response => {
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

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['流水时间', '金额', '资金走向','资金缘由', '用户ID', '抽成比例']
        const filterVal = ['addTime', 'value', 'changeType','changeReason', 'userId', 'ratio']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '流水信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
