<template>
  <div class="app-container calendar-list-container">

  <el-card class="box-card">
    <h3>评论基础信息</h3>
    <el-form  :data="forumDetail"  label-width="150px">
    	<el-form-item label="用户头像" >
	         <template slot-scope="scope">
	         	<img width="60" height="60" src="../../assets/heads.png"/>
	          <!--<img :src="forumDetail.userHeadImage" width="60" height="60" v-if="forumDetail.userHeadImage" style="border-radius: 50%;"/>-->
	        </template>	        
       </el-form-item>
        <el-form-item label="用户昵称" >
         <span>{{forumDetail.userNickName}}</span>
        </el-form-item>
        <el-form-item label="创建时间" >
         <span>{{forumDetail.createdAt}}</span>
        </el-form-item>
        <el-form-item label="发布内容" >
         <span>{{forumDetail.content}}</span>
        </el-form-item>
        <el-form-item label="转发数量" >
         <span>{{forumDetail.forwardNum}}</span>
        </el-form-item>
         <el-form-item label="评论数量" >
          <span>{{forumDetail.commentNum}}</span>
        </el-form-item>
        <el-form-item label="点赞数量" >
        	<span>{{forumDetail.thumbUpNum}}</span>
        </el-form-item>             
    </el-form>
  </el-card>
  
  	<el-card class="box-card">
      <h3>评论图片/视频展示</h3> 
      <el-form :data='forumPic'  v-if='briefImg.length>0' style="display: inline-flex; flex-wrap: wrap; margin-left: 150px; ">
    	<el-form-item   v-for='(item,index) in briefImg' :key="index"  class='distance' >
	          <img :src="item.key" width="100" height="100" v-if="item.key" style="border:1px solid #ebeef5" />     
       </el-form-item>
        
    </el-form>
    <el-form :data='forumPic'  v-if='briefVideo.length>0' style="display: inline-flex; flex-wrap: wrap; margin-left: 150px;">
       <el-form-item  v-for='(items,index) in briefVideo'  :key="index" class='distance'  >
    		 <video  :poster="briefVideo"  width="200" height="100" controls="controls" v-if="items.key" :src="items.key" style="border:1px solid #ebeef5">
    		 </video>  	       
       </el-form-item>
   </el-form>
	     
    </el-card>
  
    <el-card class="box-card">
      <h3>评论内容列表</h3>
	    <el-table :data="forumList" style="width: 100%" max-height="400">
		    <el-table-column prop="userName" label="用户名称" >
		    </el-table-column>
		    <el-table-column  prop="content"   label="评论内容"  >   	
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
import { listForum, listForumDetail,listForumDelete } from '@/api/forum'
import { createStorage, uploadPath ,pictureAIP} from '@/api/storage'
export default {
  name: 'GoodsCreate',
  data() {
    return { 
      uploadPath,
      forumDetail:{},
      forumList:[],
      forumPic:[],
      briefImg:[],
      briefVideo:[],
      storageBaseUrl:localStorage.getItem("ghtstorageBaseUrl"),
      sysConfig:'',
    }
  },
  created() {
    this.init()
    this.sysConfig = this.$store.getters.sysConfig.storageBaseUrl   
  },
  methods: {     
    init: function() {
      const id = this.$route.query.id
      listForumDetail(id).then(response => {
    	 this.forumDetail = response.data.data;
    	 this.forumList = response.data.data.comments ;
    	 console.log(response.data.data.comments);
     	 this.forumPic = response.data.data.pics;
     	 this.briefImg = []
     	 this.briefVideo =[]
     	 for(var index = 0; index < this.forumPic.length; index ++ ){
     	 	console.log(this.sysConfig+'/'+this.forumPic[index].key)

				if(this.forumPic[index].mediaType == 'image/jpeg' ){
					this.briefImg.push({
						key:this.sysConfig+'/'+this.forumPic[index].key,
						mediaType:'image/jpeg'
					})
				
				}else if(this.forumPic[index].mediaType == 'video/mp4'){
					this.briefVideo.push({
						key:this.sysConfig+'/'+this.forumPic[index].key,
						mediaType:'video/mp4'
					})
				}
			}
      })
    },
    handleCancel(){
    	this.$router.push({path:'/contents/forum'})
    }
    
  }
}
</script>