<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 150px;" placeholder="请输入活动名称" v-model="listQuery.actName">
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
    	  <el-button class="filter-item" type="primary" @click="handleOnCreate" icon="el-icon-edit">添加活动</el-button>
    	  <!--<el-button class="filter-item" type="primary" @click="handleUnderCreate" icon="el-icon-edit">添加线下活动</el-button>-->
    </div>
    
    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" min-width="100" label="活动名称" prop="actName">
      </el-table-column>

      <el-table-column align="center" label="活动类型" prop="actType">
      	<template slot-scope="scope">
           <el-tag size="mini" >{{scope.row.actType==1 ? '促销活动' : '线下活动'}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="活动状态" prop="status">
      	<template slot-scope="scope"> 
           <el-tag :type="scope.row.status==0 ? 'info' : scope.row.status==1?'success':'primary' ">{{scope.row.status==0 ? '未开始' : scope.row.status==1?'进行中':'已结束'}}</el-tag>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="所属商家" prop="shopTitle">
      </el-table-column>
      
      <el-table-column align="center" label="活动时间段">
      	<template slot-scope="scope">
      		  {{scope.row.startDate }}-{{scope.row.endDate }}
      	</template>
      </el-table-column>            

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini"  @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!--创建活动-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="140px" style='width: 80%; margin-left:50px;'>
        <el-form-item label="请选择活动类型" prop="actType">
		        <el-select  placeholder="请选择活动类型" v-model="dataForm.actType" @change="getchoicetype" :disabled="isEditshow">
		        	<el-option :value="item.id" v-for="item in newsType" :label="item.name" :key="item.id">
	        		</el-option>
		      	</el-select>
        </el-form-item>
        <el-form-item label="活动名称" prop="actName">
          <el-input v-model="dataForm.actName" placeholder="活动名称"></el-input>
        </el-form-item>
         <el-form-item label="活动时间范围" prop="bindTime">
				    <!--<el-date-picker
				      v-model="dataForm.bindTime"
				      type="datetimerange"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期"
				      :default-time="['12:00:00']">
				    </el-date-picker>-->
				    <el-date-picker
				      v-model="dataForm.bindTime"
				      value-format="yyyy-MM-dd hh:mm:ss"
				      type="datetimerange"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期">
				    </el-date-picker>
        </el-form-item>
        <el-form-item label="活动图片" prop="actPicture">
          	<!--<el-upload class="avatar-uploader"  v-model="dataForm.actPicture" :action='uploadPath' list-type='picture-card' :show-file-list="false" accept=".jpg,.jpeg,.png" :on-success="uploadLicensePicUrl" :before-upload="beforeAvatarUpload">			      		
			      		<img v-if="outlaylicenseImg" :src="sysConfig+outlaylicenseImg" class="avatar" style="width: 148px;height:148px">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
         		</el-upload>-->
         		<div class="imgBox" id="uploadHeader1" @click="getupload1">
							<img v-if = 'picImg' class="bigImage1" :src="sysConfig+picImg" alt="+">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							<!--<div class="bigImagebg" v-if="speedProgress!=0 && speedProgress!=100">{{speedProgress==100?'speedProgress':'完成'}}%</div>-->
						</div>
         		
         		<!--<div v- v-if="outlaylicenseImg" class="container activity-model">
         			<img :src="sysConfig+outlaylicenseImg">
         			<p class="div1"  v-drag>{{dataForm.actName}}</p>
         			<p class="div1"  v-drag>{{dataForm.actName}}</p>
         		</div>-->
        </el-form-item>
        <el-form-item label="选择商家" >
          	<el-select  v-model="dataForm.shopId" @change="itemsChange" placeholder="选择商家">
							<!--<el-option v-for="item in shopList" :key="item.shopId" :label="item.title" :value="item.shopId">-->
							<el-option v-for="item in shopList" :key="item.shopId" :label="item.name" :value="item.shopId">
							</el-option>
						</el-select>
        </el-form-item>
        <el-form-item label="关联商品">
          <el-select multiple v-model="dataForm.itemIds" placeholder="关联商品">
						<el-option v-for="item in commoditylist" :key="item.id" :label="item.title" :value="item.id">
						</el-option>
					</el-select>
        </el-form-item>
        <div v-show="isUnderLineshow">
        		 <el-form-item label="联系电话" prop="actPhone">
		          <el-input v-model="dataForm.actPhone"></el-input>
		        </el-form-item>
		        <el-form-item label="活动地址" prop="actAddress">
		          <el-input v-model="dataForm.actAddress"></el-input>
		        </el-form-item>
        </div>
        <el-form-item label="活动详情" prop="actDetail">
          <el-input type="textarea" v-model="dataForm.actDetail"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData(dataForm.id)">确定</el-button>
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
	.imgBox{
		width: 148px;
		height: 148px;
		border: 1px dashed rgba(0,0,0,.2);
		border-radius: 5px;
	}
	.imgBox img{
		width: 148px;
		height: 148px;
		border: 1px dashed rgba(0,0,0,.1);
		text-align: center;
		line-height: 148px;
		font-size: 40px;
		color: rgba(0,0,0,.1);
		display: block;
	}
	.bigImagebg{
		position: absolute;
		top: 0;
		width: 148px;
		height: 148px;
		background-color: rgba(0,0,0,.5);
		color: #FFFFFF;
		text-align: center;
		line-height: 148px;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 148px;
		height: 148px;
		line-height: 148px;
		text-align: center;
	}
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
  .activity-model{
  	width: 375px;
  	/*height: 150px;*/
  	border: 1px solid #000000;
  	position: relative;
  }
  .activity-model img{
  	width: 100%;
  }
  
  .container {
  /*width: 100%;*/
  /*height: 500px;*/
  position: relative;
  border: 1px solid black;
  overflow: hidden;
}
.div1 {
  /*height: 50px;*/
  width: 200px;
  border: 1px solid red;
  position: absolute;
  left: 0;
  top: 0;
}
</style>

<script>
//listActivity
import { listActivity, shoplistItem, listItem, addActivity, detailcateType, deleteActivity } from '@/api/contents'	
//import { listGoods, deleteGoods } from '@/api/goods'
import { userAuthList } from '@/api/shop'
import { createStorage, uploadPath ,pictureAIP} from '@/api/storage'
import { qiniu_config } from '@/api/qiniuUpload'
import BackToTop from '@/components/BackToTop'
import { parseTime } from '@/utils/index'
import { Message, MessageBox } from 'element-ui'
const statusMap = {
	1: '全部',
	2: '茶叶',
	3: '住房'
}
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
      picImg:'',
      speedProgress:0,
      isShowImg:false,
      uploadPath,
      statusMap,
      advstatusMap,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        actName: undefined,
        actType: undefined,
        endTime: undefined,
        startTime: undefined,
        status:undefined
      },
      descDetail: '',
      dialogFormVisible: false,
      dialogStatus:'',
      textMap: {
		        update: '编辑',
		        create: '创建'
	      },
	    newsType:[
	    	{
	    		name:"促销活动",
	    		id:1
	    	},
	    	{
	    		name:"线下活动",
	    		id:2
	    	}
	    ],
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
	      	actType: [{ required: true, message: '请选择活动类型', trigger: 'blur' }],
	      	actName: [{ required: true, message: '活动名称不能为空', trigger: 'blur' }],
	      	bindTime: [{ required: true, message: '活动时间范围不能为空', trigger: 'blur' }],
	      	//actPicture: [{ required: true, message: '活动图片不能为空', trigger: 'blur' }],
	      },
	      dataForm:{
	      	
	      },
	      dataShop:{
	      	pageNum:1,
	      	pageSize:50000,
	      	category:3,
	      },
	      bindTime:"",
//      categoryListSpeciesData:"",
        shopList:[],
        commoditylist:[],
        itemIds:[],
        outlaylicenseImg:"",
        storageBaseUrl:localStorage.getItem("ghtstorageBaseUrl"),
        sysConfig:"",
        id:"",
     		dragAble : false ,
     		isUnderLineshow:false,
     		isEditshow:false,
    }
  },
  created() {
  	this.sysConfig = this.$store.getters.sysConfig.storageBaseUrl
    this.getList()
    this.init()
  },
  methods: {
  	init:function(){
//		shoplistItem().then( response=> {
//			this.shopList = response.data.data;
////			console.log(this.shopList)
//		})
				userAuthList(this.dataShop).then(response => {
					this.shopList = response.data.data.items
				})
  	},
  	getIndex($index) {
        return $index + 1
  	},
    getList() {
      this.listLoading = true
      listActivity(this.listQuery).then(response => {
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
    resetForm() {
    	this.dataForm = {
    		actName:'',
    		actPhone:'',
    		actAddress:'',
    		actPicture:'',
    		actType:'',
    		startDate:'',
    		endDate:'',
    		itemIds:[],
    		shopId:'',
    		actDetail:''
    		
    	}
//  	this.outlaylicenseImg = ""
    	this.picImg = ""
    },
    handleOnCreate() {
    	this.isEditshow = false
    	this.resetForm()
			this.dialogFormVisible = true
			this.dialogStatus = 'create'
			this.dialogFormVisible = true
      this.dialogTextVisible = false
			this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUnderCreate() {
      this.$router.push({ path: '/contents/underline' })
    },
    handleUpdate(row) {
    	this.isEditshow = true
			detailcateType(row.id).then(response => {
				var itemIds = []
				for(var index=0; index<response.data.data.items.length; ++index){
					itemIds.push(response.data.data.items[index].id)
				}
				this.dataForm.actName     = response.data.data.actName
				this.dataForm.actPhone		= response.data.data.actPhone
				this.dataForm.actAddress  = response.data.data.actAddress
//				this.outlaylicenseImg			= response.data.data.actPicture
				this.picImg			= response.data.data.actPicture
				this.dataForm.actType			= response.data.data.actType
				this.dataForm.actDetail			= response.data.data.actDetail
				if(this.dataForm.actType == 2){
					this.isUnderLineshow = true;
				}else{
					this.isUnderLineshow = false;
				}
				this.dataForm.bindTime		= [response.data.data.startDate,response.data.data.endDate]
				this.dataForm.itemIds			= itemIds
				this.dataForm.shopId			= response.data.data.shopId
				this.dataForm.id 					= response.data.data.id
				if(this.dataForm.shopId){
					this.getCommodity()
				}
				
			})
			this.dialogStatus = 'update'
      this.dialogFormVisible = true
      
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
//  上传
		beforeAvatarUpload(file) {
			const isLt1M = file.size / 1024 / 1024 < 1;
				if (!isLt1M) {
			  		this.$message.error('图片上传大小不能超过 1MB!');
			    }
			    return  isLt1M;
		 },
		uploadLicensePicUrl: function(response) {
      this.outlaylicenseImg = response.data.key
    },
    //选择图片
		getupload1:function(event){
				let _this = this
				var _qiniu_config = qiniu_config();
					$(event.srcElement).uploadHeader({
						width: 750,
						height: 562,
						showMode:false,
						cropParams:{allowSelect:false},
						ok:function(dataUrl){
							var arr   = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
							    bstr  = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
							  while(n--){
							      u8arr[n] = bstr.charCodeAt(n);
							  }						  
							var file = new File([u8arr], 'ght_image', {type:mime});
							_qiniu_config.callBack={
	//								  进度
									  next(res){
//									  	_this.speedProgress = res.total.percent
									  },
	//								  失败
									  error(err){
										  alert('上传失败，请重新上传');
									  }, 
	//								  成功
									  complete(res){
										  console.log(res)
									  	_this.picImg = res.key
									  }
							}
							_qiniu_config.uploadFile(file,"",_qiniu_config.callBack)
						}
					}).click();
				},   
    getchoicetype(val){
    	console.log(val)
    	if(val == 2){
    		this.isUnderLineshow = true
    	} else {
    		this.isUnderLineshow = false
    	}
    },
//  获取商家种类id
		itemsChange(val) {
			this.dataForm.shopId = val;
			this.getCommodity()
//			if(val == 6 || val == 4){
//				this.isCategoryShow = false
//			}
//			console.log(val)
//			this.cateType = val ;
//			this.gitCategory();
//				console.log(val);
		},
//		获得商品
		getCommodity(){
			var data = {
				shopId: this.dataForm.shopId,
				pageNum:1,
				pageSize:5000
			}
			listItem(data).then(response => {
					this.commoditylist = response.data.data.items;
			})

		},
//  创建活动
    createData(){
//  	console.log(this.dataForm.bindTime[0])
    	this.$refs['dataForm'].validate((valid) => {
    		if(valid){
    			const itemsids = ""
		    	for(var index=0;index<this.dataForm.itemIds.length; index++){
		    		this.itemIds.push(this.dataForm.itemIds[index])
		    	}
		    	var data = {
		    		actName:this.dataForm.actName,
		    		actPhone:this.dataForm.actPhone,
		    		actAddress:this.dataForm.actAddress,
//		    		actPicture:this.outlaylicenseImg,
		    		actPicture:this.picImg,
		    		actType:this.dataForm.actType,
		    		startDate:this.dataForm.bindTime[0],
		    		endDate:this.dataForm.bindTime[1],
		    		itemIds:this.dataForm.itemIds,
		    		shopId:this.dataForm.shopId,
		    		actDetail:this.dataForm.actDetail
		    	}
		    	
		    	addActivity(data).then(response => {
		        this.getList();
		        this.dialogFormVisible = false
		        this.$notify({
		          title: '成功',
		          message: '创建成功',
		          type: 'success',
		          duration: 2000
		        })
		      })
    		}
    	})
    	
    },
    updateData(row){
      this.$refs['dataForm'].clearValidate()
    	var data = {
    		id:this.dataForm.id,
    		actName:this.dataForm.actName,
    		actPhone:this.dataForm.actPhone,
    		actAddress:this.dataForm.actAddress,
//  		actPicture:this.outlaylicenseImg,
    		actPicture:this.picImg,
    		actType:this.dataForm.actType,
    		startDate:this.dataForm.bindTime[0],
    		endDate:this.dataForm.bindTime[1],
    		itemIds:this.dataForm.itemIds,
    		shopId:this.dataForm.shopId,
    		actDetail:this.dataForm.actDetail
    	}
    	addActivity(data).then(response => {
        this.getList();
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
	handleDelete(row) {
		  this.$confirm('确定要删除此项吗？','提示',{
				  confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
			}).then(()=>{
				var  datas = {
		  				ids:row.id
		      } 
	      deleteActivity(datas).then(response => {
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