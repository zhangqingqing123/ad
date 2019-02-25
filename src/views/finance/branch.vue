<template>
  <div class="app-container calendar-list-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
    	<el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入分销单号" v-model="listQuery.drawNo">
      </el-input>
	    <el-date-picker
	            v-model="listQuery.startTime"
	            type="date"
	            :picker-options="pickerBeginDateBefore"
	            format="yyyy-MM-dd"
	            value-format="yyyy-MM-dd HH:mm:ss"
	            placeholder="开始时间" class="filter-item">
	    </el-date-picker>至
	    <el-date-picker
	            v-model="listQuery.endTime"
	            type="date"
	            format="yyyy-MM-dd"
	            value-format="yyyy-MM-dd HH:mm:ss"
	            :picker-options="pickerBeginDateAfter"
	            placeholder="结束时间" class="filter-item">
	    </el-date-picker>
			
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <!--<el-button class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload" :loading="downloadLoading">导出</el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" min-width="100" label="分销单号" prop="relatedObjectId">
      </el-table-column>
			
			<el-table-column align="center" label="商户名称" prop="shopTitle">
      </el-table-column>
      
       <el-table-column align="center" label="绑定用户" prop="username">
      </el-table-column>
      
      <el-table-column align="center" label="分销时间" prop="createdAt">
      </el-table-column>
              
      <el-table-column align="center" label="分销金额" prop="value">
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

<style >
</style>

<script>

import { shopDistributionRecordList} from '@/api/shopdraw'
import { parseTime } from '@/utils/index'

export default {
  name: 'Shopdraw',
  data() {	
    return {
			list: null,
      total: null,
      listLoading: true,
      listQuery: {
					pageNum: 1,
					pageSize: 10,

					changeType:undefined,
					startTime:undefined,
					endTime:undefined,
					
				},
      isShow:true, 
      examineDetail: {
        shopdraw: {},
        user: {}
      },
      shipForm: {
        status:undefined,
        id:undefined,
        userId:undefined
      },
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
      shopDistributionRecordList(this.listQuery).then(response => {
        this.list = response.data.data.items
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
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
//	handleDownload() {
//    this.downloadLoading = true
//    import('@/vendor/Export2Excel').then(excel => {
//      const tHeader = ['提现单号', '申请时间', '申请商户', '手机号', '提现方式', '提现状态', '申请提现金额', '账户余额']
//      const filterVal = ['drawNo', 'createTime', 'drawName', 'phone', 'drawWay', 'status', 'drawPrice', 'balance']
//      excel.export_json_to_excel2(tHeader, this.list, filterVal, '提现审核信息')
//      this.downloadLoading = false
//    })
//  }
  }
}
</script>
