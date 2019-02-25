<template>
  <div class="app-container calendar-list-container">

  <el-card class="box-card">
    <h3>用户基础信息</h3>
    <el-form  :data="shopDetail"  label-width="150px">
    		<!--<el-form-item label="用户头像" >
         <span>{{shopDetail.headImage}}</span>
        </el-form-item>-->
        <el-form-item label="用户名" >
         <span>{{shopDetail.username}}</span>
        </el-form-item>
         <el-form-item label="手机号码" >
          <span>{{shopDetail.phone}}</span>
        </el-form-item>
        <el-form-item label="用户类型" >
           <el-tag :type="shopDetail.role==1 ? 'success' :shopDetail.role==2 ? 'success' :shopDetail.role==3 ? 'success' :shopDetail.role==4 ? 'success' :'info' ">{{shopDetail.role==1 ? '消费者' : shopDetail.role==2 ? '商家' :shopDetail.role==3 ? '管理员' :shopDetail.role==4 ? '合伙人' : '店员'}}</el-tag>
        </el-form-item>
         <el-form-item label="账户余额">
          <span>{{shopDetail.balance}}</span>
        </el-form-item>
        <el-form-item label="积分数">
          <span>{{shopDetail.score}}</span>
        </el-form-item>      
        <el-form-item label="总消费金额">
          <span>{{shopDetail.sumPayBalance}}</span>
        </el-form-item>
        <el-form-item label="总消费积分数">
          <span>{{shopDetail.sumPayScore}}</span>
        </el-form-item>
        <el-form-item label="待结算金额">
          <span>{{shopDetail.unsettledFunds}}</span>
        </el-form-item>
        <el-form-item label="平台赠送金额">
          <span>{{shopDetail.giveMoney}}</span>
        </el-form-item>
        <el-form-item label="归属地址" >
          <span>{{shopDetail.belonging}}</span>
        </el-form-item>
        <el-form-item label="添加时间">
          <span>{{shopDetail.createAt}}</span>
        </el-form-item>
        <el-form-item label="使用状态">
           <template slot-scope="scope">
           		<el-tag :type="shopDetail.status ? 'success' :'info' ">{{shopDetail.status ? '正常' : '禁用'}}</el-tag>
        	</template>
        </el-form-item>
        
    </el-form>
  </el-card>
  
  <el-card class="box-card">
      <h3>订单信息</h3>     
      <el-form :data="shopDetail"  label-width="150px">
      		<el-form-item label="商品订单" >
     			 <span>{{shopDetail.teaOrderNum}}</span>
     		</el-form-item>
      		<el-form-item label="素食订单" >
     			 <span>{{shopDetail.vegRestOrderNum}}</span>
     		</el-form-item>
			<el-form-item label="民宿订单" >
     			 <span>{{shopDetail.roomOrderNum}}</span>
     		</el-form-item>
     		<el-form-item label="投资收藏转让订单" >
     			 <span>{{shopDetail.collectOrderNum}}</span>
     		</el-form-item>
      </el-form>     
   </el-card>
    
   <el-card class="box-card">
      <h3>分享用户</h3>
      <h6>一级分享</h6>
       <el-table size="small" :data="firstDistributionUsersDetail"  border fit highlight-current-row>
	     	
	      <el-table-column align="center" label="用户名" prop="username">
	      </el-table-column>
	
	      <el-table-column align="center" label="分享时间" prop="shareDate">
	      </el-table-column>	         

    	</el-table>
    	<h6>二级分享</h6>
       <el-table size="small"  :data="secondDistributionUsersDetail"   border fit highlight-current-row>
	     	
	      <el-table-column align="center" label="用户名" prop="username">
	      </el-table-column>
	
	      <el-table-column align="center" label="分享时间" prop="shareDate">
	      </el-table-column>	         

    	</el-table>
    </el-card>
    

    <div class="op-container">
      <el-button @click="handleCancel">返回</el-button>
    </div>

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
import {  readUserDetail} from '@/api/user'

export default {
  name: 'GoodsCreate',
  data() {
    return { 
      shopDetail:{},
      firstDistributionUsersDetail:[],
      secondDistributionUsersDetail:[]
    }
  },
  created() {
    this.init()   
  },
  methods: {     
    init: function() {
      const userId = this.$route.query.userId
      readUserDetail(userId).then(response => {
      	 this.shopDetail = response.data.data
      	 this.firstDistributionUsersDetail = response.data.data.firstDistributionUsers
      	 this.secondDistributionUsersDetail = response.data.data.secondDistributionUsersDetail
      })
    },
    handleCancel(){
    	this.$router.push({path:'/user/user'})
    }
    
  }
}
</script>