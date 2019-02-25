<template>
  <div class="app-container calendar-list-container">

  <el-card class="box-card">
    <h3>商家基础信息</h3>
    <el-form  :data="shopDetail"  label-width="150px">
        <el-form-item label="商家名称" prop="name">
         <span>{{shopDetail.name}}</span>
        </el-form-item>
         <el-form-item label="商家类型" prop="category">
          <template >
           <el-tag :type="shopDetail.category==1 ? 'success' : shopDetail.category==2?'error': shopDetail.category==3?'danger': shopDetail.category==4? 'warning':'info'">{{shopDetail.category==1 ? '精品民宿' : shopDetail.category==2?'素食餐厅':shopDetail.category==3? '禅茶素材' : shopDetail.category==4? '投资收藏' : '其他'}}</el-tag>
         </template>
        </el-form-item>
        <el-form-item label="联系人" prop="leader">
          <span>{{shopDetail.leader}}</span>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <span>{{shopDetail.phone}}</span>
        </el-form-item>
        <el-form-item label="商家电话" prop="tel">
          <span>{{shopDetail.tel}}</span>
        </el-form-item>
        <el-form-item label="商家地址" >
          <span>{{shopDetail.province}}-{{shopDetail.city}}-{{shopDetail.district}}</span>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <span>{{shopDetail.address}}</span>
        </el-form-item>
        <el-form-item label="添加时间" prop="createAt">
          <span>{{shopDetail.createAt}}</span>
        </el-form-item>  
        
    </el-form>
  </el-card>
  
		<el-card class="box-card">
      <h3>证件照片</h3>
			<el-form :data="picList" v-if='picList.length>0' style="display: inline-flex; flex-wrap: wrap; margin-left: 150px;">
	      	<el-form-item v-for='(item,index) in picList' :key="index"  class="distance">
	          <img :src="sysConfig+item.key" width="150" height="150" v-if="item.key" style="border:1px solid #ebeef5"/>     
	           <div class="nameImg">
	          		<span>{{item.cateName}}</span>
	          </div>
	       </el-form-item>	      	
	      </el-form>
	      
					
    </el-card>

    <div class="op-container" >
        <el-button type="success" size="mini" @click="handleShip()" >通过审核</el-button>
        <el-button type="danger" size="mini"  @click="handleRefund()" >审核不通过</el-button>
    </div>
 		
 		<!--审核弹框-->
     <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width='30%' center>
      <el-form :rules="rules" ref="shipForm" :model="shipForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <!--<h3>入驻平台抽成比例</h3>
        <el-form-item label="平台" prop="admissionProportion">
          <el-input type="number" step="0.01"  v-model="shipForm.admissionProportion">
          </el-input>         
        </el-form-item>
        <h3>推荐用户分销比例</h3>
        <el-form-item label="平台" prop="distributionProportion">
          <el-input  type="number" step="0.01"  v-model="shipForm.distributionProportion">
          </el-input>          
        </el-form-item>-->
        <h3>确定要审核通过吗？</h3>
       </el-form>
       <div slot="footer" class="dialog-footer">
	        <el-button @click="dialogFormVisible = false">取消</el-button>
	        <el-button v-if="dialogStatus=='create'" type="primary" @click="createShipData">确定</el-button>
      </div>
      </el-dialog>
      
      <!--未审核弹框-->
     <el-dialog :title="textRefundMap[dialogStatus]" :visible.sync="dialogFormRefundVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="未通过原因" prop="auditDetail">
          <el-input  type="textarea"  :autosize="{ minRows: 2, maxRows:4}"  v-model="dataForm.auditDetail"></el-input>
        </el-form-item>
       </el-form>
       <div slot="footer" class="dialog-footer">
	        <el-button @click="dialogFormRefundVisible = false">取消</el-button>
	        <el-button v-if="dialogStatus=='info'" type="primary" @click="createRefundData">确定</el-button>
      </div>
      </el-dialog>
 				
  </div>
  
</template>

<style>
  .el-card {
    margin-bottom: 10px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .input-new-keyword {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
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
	.avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 120px;
	    height: 120px;
	    line-height: 120px;
	    text-align: center;
	}
	.avatar {
	    width: 100%;
	    height: 100%;
	    display: block;
	}
.distance{
	margin-right: 50px;
}
</style>

<script>
import {userAuthDetail,shopAuditUser} from '@/api/shop'
import { createStorage, uploadPath } from '@/api/storage'


export default {
  name: 'GoodsCreate',
  data() {
  	var validateVendorPercent = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入入驻平台抽成比例'))
      } else {
      	var reg = /^(1(\.0{2})|0(\.\d{2})?)$/
        if (!reg.test(value)) {
           callback(new Error('只能输入0.00-1.00之间的数值'))
        }else{
        	callback()
        }
      }
    }
  	var validateDistribution = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入推荐用户分销比例不能为空'))
      } else {
      	var reg = /^(1(\.0{2})|0(\.\d{2})?)$/
        if (!reg.test(value)) {
           callback(new Error('只能输入0.00-1.00之间的数值'))
        }else{
        	callback()
        }
      }
    }
    return {
      shopDetail:{},
      shopGoodsDetail:[],
      shopOrderDetail:[],
      shopDistributionDetail:[],
      picList:[],
      shopid:undefined,
      uploadPath,
      dataForm:{
      	shopId:undefined,
      	auditPass:false,
      	auditDetail:''
      },
      shipForm:{
      	shopId:undefined,
      	auditPass:true,
      	admissionProportion:'',
      	distributionProportion:''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '提示'
      },
      rules: {
        admissionProportion: [
        					{ required: true, message: '入驻平台抽成比例不能为空', trigger: 'blur' },
        					{ validator: validateVendorPercent, trigger: 'blur' }
        					],
        distributionProportion: [
        					{ required: true, message: '推荐用户分销比例不能为空', trigger: 'blur' },
        					{ validator: validateDistribution, trigger: 'blur' }
        					],
        auditDetail: [
        					{ required: true, message: '审核失败不能为空', trigger: 'blur' }
        					]
      },
      textRefundMap:{
      	info:'填写审核失败原因'
      },
      dialogFormRefundVisible:false,
      sysConfig:''
    }
  },
  created() {
    this.init();
    this.sysConfig = this.$store.getters.sysConfig.storageBaseUrl
  },
  methods: {     
    init: function() {
      const userAuthId = this.$route.query.userAuthId     
      userAuthDetail(userAuthId).then(response => {
       this.shipForm.shopId = response.data.data.shopId
       this.dataForm.shopId = response.data.data.shopId
    	 this.shopDetail = response.data.data
    	 this.picList = response.data.data.userAuthPicVoList
    	 
      })
    },

    handleShip() {
			this.dialogFormVisible  =true
			this.dialogStatus = 'create'
    },
    handleRefund(){
    	this.dialogFormRefundVisible  =true
			this.dialogStatus = 'info'
    },
    createShipData(){
     	shopAuditUser(this.shipForm).then(response =>{
				this.dialogFormVisible  =false
				this.$router.push({ path: '/mall/shop'})
			})
    },
    createRefundData(){
    	shopAuditUser(this.dataForm).then(response =>{
				console.log(response)
				this.dialogFormRefundVisible  =false
				this.$router.push({ path: '/mall/shop'})
    	})
    },
    
    uploadPicUrl: function(response) {
      this.picList.key = response.data.key
    }
  }
}
</script>
