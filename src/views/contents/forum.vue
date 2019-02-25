<template>
  <div class="app-container calendar-list-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入发布人" v-model="listQuery.userNickName">
      </el-input>
	      <el-date-picker
		            v-model="listQuery.beginDate"
		            type="date"
		            :picker-options="pickerBeginDateBefore"
		            format="yyyy-MM-dd"
		            value-format="yyyy-MM-dd 00:00:00"
		            placeholder="评论开始时间" class="filter-item">
		    </el-date-picker>至
		    <el-date-picker
		            v-model="listQuery.endDate"
		            type="date"
		            format="yyyy-MM-dd"
		            value-format="yyyy-MM-dd 23:59:59"
		            :picker-options="pickerBeginDateAfter"
		            placeholder="评论结束时间" class="filter-item">
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
      
      <el-table-column align="center" min-width="100" label="发布人" prop="userNickName">
      </el-table-column>

      <el-table-column align="center" label="信息" prop="content">
      </el-table-column>

      <el-table-column align="center" label="发布时间" prop="createdAt">
      </el-table-column>
      
      <el-table-column align="center" label="区域地址" >
      	<template slot-scope="scope">
          {{scope.row.provinceName }}{{scope.row.cityName }}{{scope.row.districtName }}
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini"  @click="handleDetail(scope.row)">查看</el-button>
          <!--<el-button type="success" size="mini" style="width:90px;" @click="handleCreate(scope.row)">发布积分奖励</el-button>-->
          <el-button type="danger" size="mini"  @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
		
	<!-- 发布积分奖励 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="140px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="奖励积分数量" prop="question">
          <el-input v-model="dataForm.question"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    
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
import { listForum, listForumDetail,listForumDelete } from '@/api/forum'
import BackToTop from '@/components/BackToTop'
import { parseTime } from '@/utils/index'
import { Message, MessageBox } from 'element-ui'
export default {
  name: 'GoodsList',
  components: { BackToTop },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        beginDate:'',
        endDate:''
      },
      descDetail: '',
      descDialogVisible: false,
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
        },
        dataForm:{
        	ids:undefined
        },
        dialogFormVisible:false,
        dialogStatus:'',
        textMap: {
		        update: '编辑',
		        create: '创建'
	      },
	      rules: {
	        question: [{ required: true, message: '奖励积分数量不能为空', trigger: 'blur' }]
	      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
  	getIndex($index) {
        return $index + 1
  	},
    getList() {
      this.listLoading = true
      listForum(this.listQuery).then(response => {
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
    handleDetail(row){
    	console.log(row)
    	this.$router.push({path:'/contents/forumdetail',query:{id:row.id}})    	
    },
    handleDelete(row) {
    	this.$confirm('确定要删除此项吗？','提示',{
				  confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
			}).then(()=>{
				this.dataForm.ids = row.id;
				listForumDelete(this.dataForm).then(response => {
	        this.$notify({
	          title: '成功',
	          message: '删除成功',
	          type: 'success',
	          duration: 2000
	        })
	        const index = this.list.indexOf(row)
	        this.list.splice(index, 1)
	      })
			}).catch(()=>{
	      	this.$message({
            type: 'info',
            message: '已取消删除'
          })         
	      })
			
		},
    handleCreate(){
    	this.dialogFormVisible = true
    	this.dialogStatus = 'create'
    },
    provinceChange(){
    	
    },
    cityChange(){
    	
    },
    areaChange(){
    	
    },
    createData(){
    	
    },
    updateData(){
    	
    },
    showDesc(desc) {
      this.descDetail = desc
      this.descDialogVisible = true
    }
  }
}
</script>