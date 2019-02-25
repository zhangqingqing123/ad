<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入房间类型" v-model="listQuery.roomName">
      </el-input> 
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
    	  <!--<el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>-->
        <!--<el-button class="filter-item" type="primary" @click="handleShelves (scope.row)">下架</el-button>-->
    </div>
    
    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
     	
       <!--<el-table-column align="center" label="选择" >
      	<template slot-scope="scope">
      	 <el-checkbox :label="scope.row.goodsId "  v-model="scope.row.goodsId" @change.native="getCurrentRow(scope.$index,scope.row )">&nbsp;</el-checkbox>
      	</template>
      </el-table-column>-->
      
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" min-width="100" label="房间类型" prop="roomType">
      </el-table-column>

      <el-table-column align="center" label="房间名" prop="roomName">
      </el-table-column>
      
      <el-table-column align="center" min-width="100" label="图片" prop="vegName">
				<template slot-scope="scope" class="catenews">
					<img style="width: 40px;height: 40px;"  :src="sysConfig.storageBaseUrl+scope.row.roomPicUrl" alt=""  />
					<p >￥{{scope.row.roomPrice}}</p>
				</template>
			</el-table-column>

      <el-table-column align="center" label="入住次数" prop="saleCount">
      </el-table-column>
      
      <el-table-column align="center" label="所属商家" prop="shopTitle">
      </el-table-column>
      
      <el-table-column align="center" label="详情" prop="roomDesc">
      	<template slot-scope="scope">
          <el-dialog title="详情" :visible.sync="descDialogVisible">
            <div v-html="descDetail"></div>
          </el-dialog>
          <el-button type="" size="mini" @click="showDesc(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="状态" prop="display">
      	<!--<template slot-scope="scope">
           <el-tag :type="scope.row.display==1 ? 'success' : scope.row.display==0?'error':'info' ">{{scope.row.display==1 ? '上架' : scope.row.display==0?'下架':'其他'}}</el-tag>
        </template>-->
        <template slot-scope="scope">
					<el-button size="mini">
						<span @click="changeType(scope.row)">{{scope.row.display==1?"上架":"下架"}}</span>
					</el-button>
				</template>
      </el-table-column>   
      
      <el-table-column align="center" label="发布时间" prop="saleTime">
      </el-table-column>            

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
           <el-button type="primary" size="mini" @click="handleEdit(scope.row)">审核</el-button>
           <!--<el-button type="warning" size="mini" @click="handleDelete(scope.row)">删除</el-button>-->
        	 <!--<el-button type="primary" plain size="mini" @click="handleOnShelf(scope.row)">上架</el-button>
          <el-button type="primary" plain size="mini" @click="handleLowerFrame(scope.row)">下架</el-button>-->
        </template>
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
	
import { listhomestay, displayRoom, deleteRoom, detailRoom} from '@/api/homestay'
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
        goodsSn: undefined,
        roomName: undefined,
//      startTime:undefined,
//      endTime:undefined
      },
      descDetail: '',
      downloadLoading: false,
      descDetail: '',
      descDialogVisible:false,
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
	      rules:{
	      	title: [{ required: true, message: '库存不能为空', trigger: 'blur' }]
	      },
	      dataForm:{
	      	itemIds:'',
					ids:'',
					isDisplay:''
	      },
	      sysConfig:"",
     
    }
  },
  created() {
  	this.sysConfig = this.$store.getters.sysConfig;
    this.getList()
  },
  methods: {
//	init: function(){
//		
//		detailRoom().then(response => {
//    	this.cateAreaList = response.data.data
//    })
//	}
  	getIndex($index) {
        return $index + 1
  	},
    getList() {
      this.listLoading = true
      listhomestay(this.listQuery).then(response => {
        this.list = response.data.data.items
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    showDesc(row){
//  	  console.log(row.id)
			const id = row.id
		  detailRoom(id).then(response => {
		  	this.descDetail = response.data.data.roomDesc
//    	this.cateAreaList = 
      })
    	
    	this.descDialogVisible = true
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
    handleCreate() {
      this.$router.push({ path: '/goods/homestayCreate' })
    },
    handleEdit(row) {
    this.$router.push({ path: '/goods/homestayEdit', query: { id: row.id }})
    },
//  getCurrentRow(index,row){
//  	console.log(index)
//  	console.log(row)
//  	this.templateSelection = row;
//  	this.dataForm.goodsId = row.id;
//  },
//		删除
		handleDelete(row) {
			this.$confirm('确定要删除此项吗？','提示',{
				  confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
			}).then(()=>{
					const detateData = {
						ids:row.id,
						isDisplay:row.isDisplay
					}
					deleteRoom(detateData).then(response => {
		        this.$notify({
		          title: '成功',
		          message: '删除成功',
		          type: 'success',
		          duration: 2000
		        })
		        const index = this.list.indexOf(row)
		        this.list.splice(index, 1)
		//				this.getList()
		      })	
			}).catch(()=>{
      	this.$message({
	        type: 'info',
	        message: '已取消删除'
	      })         
      })
					
		},
//		上架下架
		changeType(row){
			this.dataForm.ids = row.id;
			console.log(row);
			if(row.display==0){
     		this.dataForm.isDisplay = 1;
     	}
     	if(row.display==1){
     		this.dataForm.isDisplay = 0;
     	}
     	
     	displayRoom(this.dataForm).then(response => {
					this.getList()
				});
		},
    updateData(){
    	
    }
  }
}
</script>