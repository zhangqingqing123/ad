<template>
  <div class="app-container calendar-list-container">

  <!--<el-card class="box-card">-->
    
    <!--:rules="rules"-->
    <el-form :rules="rules" ref="goods" :model="goods" label-width="150px">
    	<el-card class="box-card">
    		<h3>藏品基本信息</h3>
    		<el-form-item label="藏品名称" prop="collectName">
          <el-input v-model="goods.collectName"></el-input>
       </el-form-item>
        <el-form-item label="藏品种类" prop="cateId">
	        	<el-select v-model="goods.cateId" placeholder="请选择">
					    <el-option
					      v-for="item in careTypeList"
					      :key="item.id"
					      :label="item.cateName"
					      :value="item.id">
					    </el-option>
					  </el-select>
        </el-form-item>
        
        
        <!--所属商家 模糊查找-->
				<el-form-item label="所属商家"  prop="target">
					<el-autocomplete popper-class="my-autocomplete" v-model = "goods.target" :fetch-suggestions="querySearchAsync" placeholder="请搜索" @select="handleSelect">
						<template slot-scope="props">
							<div class="name">
								{{ props.item.name }}
							</div>
						</template>
					</el-autocomplete>

				</el-form-item>
         <!--<el-form-item label="所属商户" prop="shopId">
          <el-select v-model="goods.shopId">
            <el-option v-for="item in getShops" :key="item.shopId" :label="item.name" :value="item.shopId">
            </el-option>
          </el-select>
        </el-form-item>-->
        
      </el-card>
      <el-card class="box-card">
      	<h3>藏品信息</h3>
      	<el-form-item label="证书模板" prop="templateValue">
        	<el-select v-model="goods.templateValue" placeholder="请选择">
				    <el-option
				      v-for="item in templateList"
				      :key="item.id"
				      :label="item.tempName"
				      :value="item.id">
				    </el-option>
				  </el-select>
        </el-form-item>
        <el-form-item label="生产时间" prop="produceTime">
        	<el-input  v-model="goods.produceTime"></el-input>
          <!--<el-date-picker
			            v-model="goods.produceTime"
			            type="date"
			            :picker-options="pickerBeginDateBefore"
			            format="yyyy-MM-dd"
			            value-format="yyyy-MM-dd HH:mm:ss"
			            placeholder="选择时间" class="filter-item">
			    </el-date-picker>-->
        </el-form-item>
        <el-form-item label="生产地址" prop="produceAddr">
	          <el-input type="textarea" v-model="goods.produceAddr"></el-input>
	      </el-form-item>
      </el-card>
      
      <el-card class="box-card">
      	<h3>藏品属性</h3>
      	<el-form-item label="藏品规格" prop="specName">
	          <el-input  v-model="goods.specName"></el-input>
	      </el-form-item>
	      <el-form-item label="藏品价格" prop="originalPrice">
          <el-input type="number" v-model="goods.originalPrice">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="活动价格" prop="actPrice">
          <el-input type="number" v-model="goods.actPrice" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <!--<el-form-item label="积分抵现" >
          <el-input type="number" v-model="goods.deductionCount" placeholder="0.00" style="width: 10%;">
          </el-input>抵
          <el-input type="number"  v-model="goods.deductionPrice" placeholder="0.00" style="width: 10%;">                    
          </el-input>元
        </el-form-item>-->
        <el-form-item label="积分数量" prop="deductionCount">
					<el-input type="number" v-model="goods.deductionCount" placeholder="0.00" style="width: 50%;">
					<template slot="append">积分</template>
					</el-input>
				</el-form-item>
				<el-form-item label="抵现金额" prop="deductionPrice">
					<el-input type="number" v-model="goods.deductionPrice" placeholder="0.00" style="width: 50%;">
					 <template slot="append">元</template>
					</el-input>
				</el-form-item>
        <el-form-item label="藏品库存" prop="inventory">
          <el-input type="number" v-model="goods.inventory">
            <template slot="append">件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="藏品运费" prop="logisticsPrice">
          <el-input type="number" v-model="goods.logisticsPrice">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="藏品溯源" prop="resource">
          <el-input v-model="goods.resource">
          </el-input>
        </el-form-item>
      </el-card>
      
      <el-card class="box-card">
      	<h3>藏品展示</h3>
      	<el-form-item label="显示地区">
        	<el-cascader
        :options="cateAreaList"
        v-model="selectedOptions"
        @change="handleCategoryChange" >
   			 </el-cascader>
        </el-form-item>
        <el-form-item label="收藏地址">
	          <el-input type="textarea" v-model="goods.collectAddr"></el-input>
	      </el-form-item>
        <el-form-item label="状态" prop="displayValue">
        	<el-select v-model="goods.displayValue" placeholder="请选择">
				    <el-option
				      v-for="item in display"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
        </el-form-item>
      </el-card>
      
      <el-card class="box-card">  
      	 <h3><span style="color: #FF0000; font-size: 16px;">*</span>藏品图片展示</h3>
        <el-form-item label="外置图">
          <!--<el-upload class="avatar-uploader" :action='uploadPath' list-type='picture-card' :show-file-list="false" accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPicUrl">
			      <img v-if="outlayImg[0].itemPicUrl" :src="outlayImg[0].itemPicKey" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>-->
          <div class="imgBox" id="uploadHeader1" @click="getupload1">
						<img class="bigImage1" v-if="outlayImg[0].itemPicUrl" :src="outlayImg[0].itemPicKey">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						<!--<div class="bigImagebg" v-if="speedProgress!=0 && speedProgress!=100">{{speedProgress==100?'speedProgress':'完成'}}%</div>-->
						
					</div>
        </el-form-item>
         <!--<div style="color:red;margin-left: 150px;">最多上传一张，图片大小1M以内，尺寸300px*300px</div>-->
        <br>
        <el-form-item label="简介图">
          <!--<el-upload :action='uploadPath' :limit='5' multiple accept=".jpg,.jpeg,.png,.gif" list-type="picture-card" :on-exceed="uploadOverrun" :on-success="handleGalleryUrl" :on-remove="handleRemove">
             <i class="el-icon-plus"></i>
          </el-upload>-->
          <div style="display: flex;">
						<div class="imgBox" @click="getRemoveupload(index,item)" v-for="(item,index) in briefImg" v-if="item.picType == 2">
							<img class="bigImage1" :src="sysConfig+item.itemPicUrl">
							<!--<div class="bigImagebg" v-if="speedProgress!=0 && speedProgress!=100">{{speedProgress==100?'speedProgress':'完成'}}%</div>-->
						</div>
						<div class="imgBox" id="uploadHeader2" @click="getupload2" >
							<i class="el-icon-plus"></i>
						</div>
					</div>
        </el-form-item>
        <!--<div style="color:red;margin-left: 150px;">最多上传三张图片，单张图片大小1M以内，尺寸750px*750px</div>-->
        <br>
        <el-form-item label="检验机构证书上传">
          <el-upload :action='uploadPath' :limit='5' multiple accept=".jpg,.jpeg,.png,.gif" list-type="picture-card" :on-exceed="uploadOverrun" :on-success="handleCertificateUrl" :on-remove="handleCertificateRemove">
             <i class="el-icon-plus"></i>
          </el-upload>
          <!--<div style="display: flex;">
						<div class="imgBox" @click="getRemoveupload2(index,item)" v-for="(item,index) in certificateImg" v-if="item.picType == 4">
							<img class="bigImage1" :src="sysConfig+item.itemPicUrl">
							<div class="bigImagebg" v-if="speedProgress!=0 && speedProgress!=100">{{speedProgress==100?'speedProgress':'完成'}}%</div>
						</div>
						<div class="imgBox" id="uploadHeader3" @click="getupload3" >
							<i class="el-icon-plus"></i>
						</div>
					</div>-->
					
        </el-form-item>
        <!--<div style="color:red;margin-left: 150px;">图片大小1M以内，尺寸750px*562px</div>-->
        <br>
      </el-card>
      
      
      <el-card>
      	<el-form-item label="藏品描述">
          <editor :init="editorInit" v-model="goods.collectDesc"></editor>
        </el-form-item>
        <!--<div style="color:red;margin-left: 150px;">最多上传三张图片，单张图片大小不能超过3M，尺寸要求750px*750px</div>-->
      </el-card>
        
    </el-form>
  <!--</el-card>-->
  

    <div class="op-container">
      <el-button @click="handlePublish" type="primary">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>

  </div>
</template>

<style>
	.imgBox{
		width: 148px;
		height: 148px;
		border: 1px dashed rgba(0,0,0,.2);
		border-radius: 5px;
		position: relative;
		margin-right: 8px;
	}
	.imgBox i{
		text-align: center;
		line-height: 148px;
		display: block;
		font-size: 40px;
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
import { listArea , listShop } from '@/api/goods'
import { templateCollect, collectionCreate,categoryListCollection} from '@/api/collection'
import { roomCreate} from '@/api/homestay'
import { qiniu_config } from '@/api/qiniuUpload'
import { userAuthList } from '@/api/shop'
import { createStorage, uploadPath ,pictureAIP} from '@/api/storage'
import Editor from '@tinymce/tinymce-vue'
import { Message,MessageBox } from 'element-ui'

export default {
  name: 'GoodsCreate',
  components: { Editor },
  data() {
    return {      
      uploadPath,
      cateAreaList:[],
      selectedOptions: [],
      getShops:[],
      goods: {
      	deductionCount:0,
      	deductionPrice:0,
      	target:'',
      },
      outlayImg: [{
      	itemPicUrl:"",
      	itemPicKey:"",
      	picType:1
      }],
      briefImg:[],
      certificateImg:[],
      detailsImg:[],
      display:[
      	{
      		value: '1',
          label: '上架'
      	},
      	{
      		value: '0',
          label: '下架'
      	}
      ],
      careTypeList:[],
      careTypedata: {
        type:2
      },
      displayValue:'',
      templateData:{
      	id:undefined,
      	tempName:undefined,
      	tempUrl:undefined
      },
      templateList:[],
      templateValue:'',
      pickerBeginDateBefore:{
//          disabledDate: (time) => {
//								console.log(time)
//          }
        },
      editorInit: {
        language: 'zh_CN',
        plugins: ['advlist anchor autolink autoresize autosave emoticons fullscreen hr image imagetools importcss insertdatetime legacyoutput link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace tabfocus table template textcolor textpattern visualblocks visualchars wordcount'],
        toolbar: ['bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript ', 'hr bullist numlist link image charmap preview anchor pagebreak fullscreen media table emoticons forecolor backcolor'],
        images_upload_handler: function(blobInfo, success, failure) {
          const formData = new FormData()
          formData.append('file', blobInfo.blob())
          createStorage(formData).then(res => {
            success(res.data.data.url)
          }).catch(() => {
            failure('上传失败，请重新上传')
          })
        }
      },
			province:"",
			city:"",
			district:"",
			sysConfig:'',
			storageBaseUrl:localStorage.getItem("ghtstorageBaseUrl"),
			rules: {
				collectName: [{
						required: true,
						message: '藏品名称不能为空',
						trigger: 'blur'
				}],
				cateId: [{
					  required: true,
						message: '藏品种类不能为空',
						trigger: 'blur'
				}],
				templateValue:[{
					  required: true,
						message: '证书模板不能为空',
						trigger: 'blur'
				}],
				produceAddr:[{
					  required: true,
						message: '生产地址不能为空',
						trigger: 'blur'
				}],
				specName:[{
					  required: true,
						message: '藏品规格不能为空',
						trigger: 'blur'
				}],
				originalPrice:[{
					  required: true,
						message: '藏品价格不能为空',
						trigger: 'blur'
				}],
				inventory:[{
					  required: true,
						message: '藏品库存不能为空',
						trigger: 'blur'
				}],
				resource:[{
					  required: true,
						message: '藏品溯源不能为空',
						trigger: 'blur'
				}],
				collectAddr:[{
					  required: true,
						message: '收藏地址不能为空',
						trigger: 'blur'
				}],
				displayValue:[{
					 required: true,
						message: '状态不能为空',
						trigger: 'blur'
				}],
//				deductionCount:[{
//						required: true,
//						message: '积分数量不能为空',
//						trigger: 'blur'
//				}],
//				deductionPrice:[{
//					required: true,
//					message: '抵现金额不能为空',
//					trigger: 'blur'
//				}],
				target:[{
					  required: true,
						message: '所属商户不能为空',
						trigger: 'blur'
				}],
			},
			getRoleData:{
					pageNum: 1,
					pageSize: 50000,
					nickname: undefined,
					createStartTime: undefined,
					createEndTime: undefined,
					category:4,
					name:undefined
			},
			finalFoods:{
				shopId: "",
				collectName: "",
				cateId:"",
				certTempId:"",
				produceTime:"",
				produceAddr: "",
				specName: "",
				originalPrice: "",
				actPrice: "",
				deductionCount: "",
				deductionPrice: "",
				inventory: "",
				logisticsPrice: "",
				resource: "",
				province: "",
				city: "",
				district: "",
				collectAddr: "",
				display: "",			
				collectDesc: "",
				pictures:"",
			},
    }
  },
  created() {
  	this.sysConfig = this.$store.getters.sysConfig.storageBaseUrl;
    this.init()
  },
  methods: {     
    init: function() {
      userAuthList(this.getRoleData).then(response => {
        this.getShops = response.data.data.items
      })
   
      listArea().then(response => {
      	this.cateAreaList = response.data.data
      })
      templateCollect(this.templateData).then(response => {
      	this.templateList = response.data.data
      })
      categoryListCollection(this.careTypedata).then(response => {
      	this.careTypeList = response.data.data
      })
    },
    handleCategoryChange(value) {
				this.province = value[0]
				this.city     = value[1]
				this.district = value[2]
    },
//  返回
    handleCancel: function() {
      this.$router.push({ path: '/goods/collection' })
    },
//  外置图上传
    getupload1:function(){
    	let _this = this
			var _qiniu_config = qiniu_config();
				$(event.srcElement).uploadHeader({
					width: 300,
					height: 300,
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
								  	_this.speedProgress = res.total.percent
								  },
//								  失败
								  error(err){
									  alert('上传失败，请重新上传');
								  }, 
//								  成功
								  complete(res){
									console.log(res)
											_this.outlayImg[0].itemPicUrl = res.key
      								_this.outlayImg[0].itemPicKey = _this.sysConfig+res.key
								  }
						}
						_qiniu_config.uploadFile(file,"",_qiniu_config.callBack)
					}
				}).click();
    },
    getupload2:function(event){			 
					let _this = this
					var _qiniu_config = qiniu_config();
					$(event.srcElement).uploadHeader({
						width: 750,
						height: 750,
						showMode:false,
						cropParams:{allowSelect:false},
						ok:function(dataUrl){
							if(_this.briefImg.length > 2){
								_this.$alert('<strong>详情图最多上传3张！</strong>', '提示', {
					          dangerouslyUseHTMLString: true
					        });
								return
							}
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
											_this.briefImg.push({
												itemPicUrl:res.key,
												imgUrl:this.sysConfig + res.key,
												picType:2
											})
											var obj = _this.briefImg;
											for(var i = 0; i < obj.length; i++) {
												for(var j = obj.length - 1; j > 0; j--) {
													if(obj[i].itemPicUrl == obj[j].itemPicUrl && i != j) {
														obj.splice(j, 1);
														_this.$alert('<strong>请勿上传重复图片，请重新上传！</strong>', '提示', {
										          dangerouslyUseHTMLString: true
										        });
													}
												}
											}
											_this.briefImg = obj ; 										
									  }
							}
							_qiniu_config.uploadFile(file,"",_qiniu_config.callBack)
						}
					}).click();
			},
			getupload3:function(event){				
					let _this = this
					var _qiniu_config = qiniu_config();
					$(event.srcElement).uploadHeader({
						width: 750,
						height: 562,
						showMode:false,
						cropParams:{allowSelect:false},
						ok:function(dataUrl){
							if(_this.outlayImg.length > 2){
								_this.$alert('<strong>详情图最多上传3张！</strong>', '提示', {
					          dangerouslyUseHTMLString: true
					        });
								return
							}
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
											_this.certificateImg.push({
												itemPicUrl:res.key,
												imgUrl:this.sysConfig + res.key,
												picType:4
											})
										
									  }
							}
							_qiniu_config.uploadFile(file,"",_qiniu_config.callBack)
						}
					}).click();
			},
//			删除上传
			getRemoveupload:function(index,item){				
					this.$confirm('确定删除该图片吗?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning',
			          center: true
			        }).then(() => {
			        	for(var i = 0; i < this.briefImg.length; i++){
									if(item.picType == 2){
										var url
										if(item.itemPicUrl == undefined){
											url = item.itemPicUrl
										} else {
											url = item.itemPicUrl
										}
										if(this.briefImg[i].itemPicUrl === url){
											this.briefImg.splice(index, 1)
										}
									}	
								}
			          this.$message({
			            type: 'success',
			            message: '删除成功!'
			          });
			        }).catch(() => {
			          this.$message({
			            type: 'info',
			            message: '已取消删除'
			          });
	        	})				
			},
		//			删除上传2
			getRemoveupload2:function(index,item){
					this.$confirm('确定删除该图片吗?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning',
			          center: true
			        }).then(() => {
			        	for(var i = 0; i < this.certificateImg.length; i++){
									if(item.picType == 4){
										var url
										if(item.itemPicUrl == undefined){
											url = item.itemPicUrl
										} else {
											url = item.itemPicUrl
										}
										if(this.certificateImg[i].itemPicUrl === url){
											this.certificateImg.splice(index, 1)
										}
									}
									
								}
			          this.$message({
			            type: 'success',
			            message: '删除成功!'
			          });
			        }).catch(() => {
			          this.$message({
			            type: 'info',
			            message: '已取消删除'
			          });
	        	})
			},
    handlePublish: function() {
    	var _this = this;
//			const finalFoods = {
//				shopId: this.goods.shopId,
//				collectName: this.goods.collectName,
//				cateId:this.goods.cateId,
//				certTempId:this.goods.templateValue,
//				produceTime:this.goods.produceTime,
//				produceAddr: this.goods.produceAddr,
//				specName: this.goods.specName,
//				originalPrice: this.goods.originalPrice,
//				actPrice: this.goods.actPrice,
//				deductionCount: this.goods.deductionCount,
//				deductionPrice: this.goods.deductionPrice,
//				inventory: this.goods.inventory,
//				logisticsPrice: this.goods.logisticsPrice,
//				resource: this.goods.resource,
//				province:this.province,
//				city:this.city,
//				district:this.district,
//				collectAddr: this.goods.collectAddr,
//				display: this.goods.displayValue,			
//				collectDesc: this.goods.collectDesc,
//				pictures:this.certificateImg.concat(this.outlayImg.concat(this.briefImg))			
//			}
			_this.finalFoods.shopId 		 			= _this.goods.shopId;
			_this.finalFoods.collectName 			= _this.goods.collectName;
			_this.finalFoods.cateId      			= _this.goods.cateId;
			_this.finalFoods.certTempId  			= _this.goods.templateValue;
			_this.finalFoods.produceTime 			= _this.goods.produceTime;
			_this.finalFoods.produceAddr			= _this.goods.produceAddr;
			_this.finalFoods.specName 				= _this.goods.specName;
			_this.finalFoods.originalPrice 		= _this.goods.originalPrice;
			_this.finalFoods.actPrice 				= _this.goods.actPrice;
			_this.finalFoods.deductionCount 	= _this.goods.deductionCount;
			_this.finalFoods.deductionPrice 	= _this.goods.deductionPrice;
			_this.finalFoods.inventory 				= _this.goods.inventory;
			_this.finalFoods.logisticsPrice 	= _this.goods.logisticsPrice;
			_this.finalFoods.resource 				= _this.goods.resource;
			_this.finalFoods.province 				= _this.province;
			_this.finalFoods.city 						= _this.city;
			_this.finalFoods.district 				= _this.district;
			_this.finalFoods.collectAddr 			= _this.goods.collectAddr;
			_this.finalFoods.display 					= _this.goods.displayValue;
			_this.finalFoods.collectDesc 			= _this.goods.collectDesc;
			_this.finalFoods.pictures 				= _this.certificateImg.concat(this.outlayImg.concat(this.briefImg));
//			certificateImg
			//console.log(_this.finalFoods.pictures)
			this.$refs['goods'].validate((valid)=>{
				if(valid){
					collectionCreate(_this.finalFoods).then(response => {
		        this.$notify({
		          title: '成功',
		          message: '创建成功',
		          type: 'success',
		          duration: 2000
		        })
		        this.$router.push({ path: '/goods/collection' })
		      }).catch(response => {
		        MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
		          confirmButtonText: '确定',
		          type: 'error'
		        })
		      })
				}
			})
      
    },
    uploadPicUrl: function(response) {
      this.outlayImg[0].itemPicUrl = response.data.key
      this.outlayImg[0].itemPicKey = this.sysConfig+response.data.key
    },
    uploadOverrun: function() {
      this.$message({
        type: 'error',
        message: '上传文件个数超出限制!最多上传5张图片!'
      })
    },
//  简介图
    handleGalleryUrl(response, file, fileList) {
      if (response.code === 1) {
					this.briefImg.push({
						itemPicUrl:response.data.key,
						imgUrl:this.sysConfig + response.data.key,
						picType:2
					})
					console.log(this.briefImg);
      }
    },
    handleRemove: function(file, fileList) {
      for (var i = 0; i < this.briefImg.length; i++) {
        // 这里存在两种情况
        // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
        //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
        // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
        var url
        if (file.response === undefined) {
          url = file.url
        } else {
          url = file.response.data.url
        }
        if (this.briefImg[i].imgUrl == url) {}
          this.briefImg.splice(i, 1);
          
        
      }
    },
//  证书上传
    handleCertificateUrl(response, file, fileList){
    	if (response.code === 1) {
					this.certificateImg.push({
						itemPicUrl:response.data.key,
						imgUrl:this.sysConfig + response.data.key,
						picType:4
					})
					console.log(this.certificateImg);
      }
    },
    handleCertificateRemove: function(file, fileList) {
      for (var i = 0; i < this.certificateImg.length; i++) {
        // 这里存在两种情况
        // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
        //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
        // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
        var url
        if (file.response === undefined) {
          url = file.url
        } else {
          url = file.response.data.url
        }
        if (this.certificateImg[i].itemPicKey == url) {}
          this.certificateImg.splice(i, 1);
        
      }
    },
    specChanged: function(label) {
      if (label === false) {
        this.specifications = [{ specification: '规格', value: '标准', picUrl: '' }]
        this.products = [{ id: 0, specifications: ['标准'], price: 0.00, collagePrice: 0.00,scareBuyingPrice: 0.00,bargainPrice: 0.00, number: 0, url: '' }]
      } else {
        this.specifications = []
        this.products = []
      }
    },
    handleSpecificationDelete(row) {
      const index = this.specifications.indexOf(row)
      this.specifications.splice(index, 1)
      this.specToProduct()
    },
    //模糊查找 -- 店铺
			handleSelect(item){
				//console.log(item) ; 
				this.goods.target = item.name ;
				this.$nextTick(() => {
					this.$refs['goods'].clearValidate()
				})
				this.goods.shopId = item.shopId ;
				
			},
			querySearchAsync(queryString, cb){
				this.getRoleData.name = queryString ; 
				userAuthList(this.getRoleData).then(response => {
					var list = response.data.data.items ;
					cb(list);
					if(list == "" || list == []){
						this.$message({
			            type: 'warning',
			            message: '没有找到该商家!'
			          });
					}
				}).catch(() => {})
				
			}
  }
}
</script>