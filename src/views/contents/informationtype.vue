<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 150px;" placeholder="请输入资讯类型名称" v-model="listQuery.cateName">
      </el-input>
       <el-select style="width: 150px" class="filter-item" placeholder="请选择资讯种类" v-model="listQuery.cateType" >
        <el-option v-for="item in statusMap" :key="item.type" :label="item.name" :value="item.type">
		    </el-option>
      </el-select>
      <!--<el-select style="width: 150px" class="filter-item" placeholder="请选择资讯状态" v-model="listQuery.cateName" >
        <el-option v-for="(key, value) in advstatusMap" :key="key" :label="key" :value="value">
        </el-option>
      </el-select> -->
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

    </div>
    <div class="filter-container">
    	  <el-button class="filter-item" type="primary" @click="handleOnCreate" icon="el-icon-edit">添加资讯类型</el-button>
    </div>
    
    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
     	      
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="资讯种类" prop="cateType">
      	<template slot-scope="scope" >
           <el-tag :type="scope.row.cateType==1 ? 'success' : scope.row.cateType==2?'error':scope.row.cateType==3?'danger':scope.row.cateType==4?'warning':scope.row.cateType==5?'blue':'info' ">{{scope.row.cateType==1 ? '禅茶素材' : scope.row.cateType==2?'素食餐厅':scope.row.cateType==3?'精品民宿':scope.row.cateType==4?'投资收藏': scope.row.cateType==5 ? '活动商品':'精准扶贫'}}</el-tag>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="资讯类型" prop="cateName">
      </el-table-column>
     
      <el-table-column align="center" label="资讯状态" prop="isDisplay">
      	<template slot-scope="scope">
           <el-button @click="displayItemGoods(scope.row)" size="mini"><span>{{scope.row.isDisplay==1 ? '上架' : scope.row.isDisplay==0?'下架':'其他'}}</span></el-button>
        </template>
      </el-table-column>          

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button type="primary" size="mini" @click="handleRecovery(scope.row)">恢复</el-button>
          <el-button type="primary" size="mini" @click="handleDisable(scope.row)">禁用</el-button>-->
          <el-button type="danger" size="mini"  @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="140px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="资讯种类" prop="cateType">
          <el-select style="width: 150px" class="filter-item" placeholder="请选择资讯种类" v-model="dataForm.cateType" >
		        <el-option v-for="item in statusMap" :key="item.type" :label="item.name" :value="item.type">
		        </el-option>
		      </el-select>
        </el-form-item>
        <el-form-item label="资讯类型名称" prop="cateName">
          <el-input v-model="dataForm.cateName"></el-input>
        </el-form-item>
        
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    
    <!-- 分页 -->
    <!--<div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>-->

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
import { typeListInformation, typeAddInformation, typeDeleteInformation, typeDisplayInformation, listcateType } from '@/api/contents'		
//import { listGoods, deleteGoods } from '@/api/goods'
import BackToTop from '@/components/BackToTop'
import { parseTime } from '@/utils/index'
import { Message, MessageBox } from 'element-ui'
const advstatusMap = {
	1: '全部',
	2: '进行中',
	3: '已结束',
	4: '未开始'
}

export default {
  name: 'GoodsList',
  components: { BackToTop },
  data() {
    return {
      list: [],
      total: 0,
      statusMap:[],
      advstatusMap,
      listLoading: true,
      listQuery: {
      	cateName:'',
      	cateType:'',
      	endTime:'',
      	isDisplay:'',
      	startTime:''
//     	pageNum:1,
 //     	pageSize:10
//      page: 1,
//      limit: 20,
//      goodsSn: undefined,
//      name: undefined,
//      sort: 'add_time',
//      order: 'desc'
      },
      descDetail: '',
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
        	
        },
        dialogFormVisible:false,
        dialogStatus:'',
        textMap: {
		        update: '编辑',
		        create: '创建'
	      },
	      rules: {
	        cateName: [{ required: true, message: '资讯名称不能为空', trigger: 'blur' }],
	        cateType: [{ required: true, message: '资讯类型不能为空', trigger: 'blur' }]
	      },
     		displayData:{
	      	ids:'',
					isDisplay:''
	      },
    }
  },
  created() {
    this.getList()
    this.init()
  },
  methods: {
  	init: function(){
  		listcateType().then(response => {
        this.statusMap = response.data.data
      })
  	},
  	getIndex($index) {
        return $index + 1
  	},
    getList() {
      this.listLoading = true
      typeListInformation(this.listQuery).then(response => {
        this.list = response.data.data
        console.log(this.list)
//      this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
//      this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
//		上架
		displayItemGoods(row){
			  this.displayData.ids = row.id;
				console.log(row);
				console.log(row.isDisplay);
	     	if(row.isDisplay == 0){
	     		this.displayData.isDisplay = 1;
	     	}
	     	if(row.isDisplay== 1){
	     		this.displayData.isDisplay = 0;
	     	}
//	     	if(row.display == null){
//	     		this.displayData.isDisplay = 1;
//	     		console.log("进去没3"+this.displayData.isDisplay);
//	     	}
		    typeDisplayInformation(this.displayData).then(response => {
		  		this.getList()
		      this.$notify({
		        title: '成功',
		        message: '成功',
		        type: 'success',
		        duration: 2000
		      })
        
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
    handleOnCreate() {
      this.dialogFormVisible=true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
//    this.$router.push({ path: '/advertisement/online', query: { id: row.id }})
      this.$router.push({ path: '/contents/online'})
    },
    createData(){
    	this.$refs['dataForm'].validate((valid)=>{
    		if(valid){
    			const dataList = {
		    		cateName:this.dataForm.cateName,
		    		cateType:this.dataForm.cateType
		    	}
		    	
		    	typeAddInformation(dataList).then(response => {
		        this.getList();
		        this.list.unshift(response.data);
		        this.dialogFormVisible = false
		        this.$notify({
		          title: '成功',
		          message: '创建成功',
		          type: 'success',
		          duration: 2000
		        })
		      }).catch(() => {
		           MessageBox.alert('同资讯种类最多上传三个', '提示', {
				        confirmButtonText: '确定',
				        type: 'error'
				      })
//				      return Promise.reject('error')         
		      })
    		}
    	})
    	
    },
    updateData(){
    	
    },
    
	  handleDelete(row) {
	  	this.$confirm('确定要删除此项吗？','提示',{
				  confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
			}).then(()=>{
				var data = {
					ids:row.id
				}
				typeDeleteInformation(data).then(response => {
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
  }
}
</script>