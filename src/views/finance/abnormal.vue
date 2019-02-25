<template>
  <div class="app-container calendar-list-container">
    <!-- 查询和其他操作 -->
    <!--积分走向-->
    <div class="filter-container">
    	<el-select style="width: 200px" class="filter-item" placeholder="积分走向" v-model="listQuery.sourceType">
				<el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value">
				</el-option>
			</el-select>
			<!--积分类型-->
			<el-select style="width: 200px" class="filter-item" placeholder="积分类型" v-model="listQuery.changeType">
				<el-option v-for="(key, value) in statusType" :key="key" :label="key" :value="value">
				</el-option>
			</el-select>
    	<el-input clearable class="filter-item" style="width: 200px;" placeholder="关联人" v-model="listQuery.nickname">
      </el-input>
        <!--订单号码 模糊查找-->
			<div style="margin-bottom: 20px;margin-top: 20px;" class="filter-container block">
				<span class="demonstration" style="color: #CCCCCC;">订单编号：</span>
				<el-autocomplete v-model="listQuery.identifier" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
			</div>
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
      <!--<el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>-->
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <!--<el-button class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload" :loading="downloadLoading">导出</el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" min-width="100" label="时间" prop="createAt">
      </el-table-column>
      
      <el-table-column align="center" min-width="100" label="积分" prop="score">
      	<template slot-scope="scope">
      		<span class="">{{scope.row.changeType==1?'+'+scope.row.score:'-'+scope.row.score}}</span>
      	</template>
      </el-table-column>
			
			<el-table-column align="center" label="积分走向" prop="source">
      </el-table-column>
           
      <el-table-column align="center" label="关联人" prop="username">
      </el-table-column>
      
    
      
      <!--<el-table-column align="center" label="关联人剩余积分" prop="e">
      </el-table-column>-->
			
			<!--<el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>-->
      
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    
    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="120px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="处理单号" prop="name">
          <el-input v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="异常单号" prop="vendorPercent">
          <el-input type="number" v-model="dataForm.vendorPercent"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="异常原因" prop="username">
           <el-input    v-model="dataForm.username"></el-input>
        </el-form-item>
        <el-form-item v-else label="金额" prop="account">
           <el-input    v-model="dataForm.account"></el-input>
        </el-form-item>
				<el-form-item label="添加时间" prop="addTime">
          <el-date-picker v-model="dataForm.addTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
          </el-date-picker>
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
	.block {
		display: inline-block;
	}
</style>

<script>

import { listShopdraw, createShopdraw, readShopdraw, updateShopdraw, deleteShopdraw , getReflectList ,getBalanceRecordList,scoreRecordListList} from '@/api/shopdraw'
import { parseTime } from '@/utils/index'
import { searchIdentifiers } from '@/api/ad' //查查订单号码
const statusMap = {
		1: '用户签到',
		2: '用户购买',
		3: '用户兑换',
		4: '用户邀请',
		5: '用户评论',
		6: '用户积分抵扣',
		7: '店员收入提成',
		8: '店员推销'
	}
const statusType = {
		1: '增加',
		2: '扣除'
	}
export default {
  name: 'Shopdraw',
  data() {	
    return {
    	statusMap,
    	statusType,
			list: [],
      total: null,
      listLoading: true,
      dialogFormVisible:false,
      listQuery: {
					pageNum: 1,
					pageSize: 10,

					changeType: undefined,
					endTime: undefined,
					startTime: undefined,
					sourceType:undefined,
					nickname:undefined,
					identifier:undefined
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
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dataForm:{
      	
      },
      rules:{
      	 name: [{ required: true, message: '异常单号不能为空', trigger: 'blur' }]
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
      this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true
      scoreRecordListList(this.listQuery).then(response => {
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
      this.listQuery.pageNum	 = val
      this.getList()
    },
    handleCreate() {
    //	this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row){
			deleteShopdraw(row).then(response => {
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
		//模糊查找 -- 订单号码
			handleSelect(item) {
				console.log(item);
				this.listQuery.identifier = item.value ;

			},
			querySearchAsync(queryString, cb) {
				this.listQuery.identifier = queryString;
				searchIdentifiers(this.listQuery).then(response => {
					var list = response.data.data;
					this.restaurants = list ; 
					if(list == "" || list == []) {
						this.$message({
							type: 'warning',
							message: '没有找到订单!'
						});
					}
					cb(list);
				}).catch(() => {})

			},
		createData(){
			  createShopdraw(this.dataForm).then(response => {
          	 console.log(response);
          	 this.getList();
				    	 	 //this.list.unshift(response.data.data)
				            this.dialogFormVisible = false
				          	 this.$notify({
				              title: '成功',
				              message: '创建成功',
				              type: 'success',
				              duration: 2000
				            }) 
          })
		},
		updateData(){
			this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateShopdraw(this.dataForm).then(() => {
            for (const v of this.list) {
              if (v.id === this.dataForm.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.dataForm)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
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
