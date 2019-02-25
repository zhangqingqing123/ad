<template>
	<div class="app-container calendar-list-container">

		<el-card class="box-card">
			<h3>商品信息</h3>
			<el-form :rules="rules" ref="goods" :model="goods" label-width="150px">
				<el-form-item label="商品名称" prop="title">
					<el-input v-model="goods.title" style='width:60%' placeholder='请输入商品名称'></el-input>
				</el-form-item>
				<el-form-item label="禅茶素材种类" prop="cateType">
					<template>
						<!--<el-select v-model="goods.cateType" @change="itemsChange" placeholder="商品种类">
							<el-option v-for="item in goods.categoryListSpecies" :key="item.type" :label="item.name" :value="item.type">
							</el-option>
						</el-select>-->
						<span>禅茶素材</span>
					</template>
				</el-form-item>

				<el-form-item label="禅茶素材类型" prop="cateId">
					<template>
						<el-select v-model="goods.cateId" @change="categoryChange" placeholder="禅茶素材类型">
							<el-option v-for="item in categoryList" :key="item.id" :label="item.cateName" :value="item.id">
							</el-option>
						</el-select>
					</template>
				</el-form-item>

				<!--<el-form-item label="商品类目" v-show="isCategoryShow" prop="subCateId">-->
				<el-form-item label="禅茶素材分类"  prop="subCateId">
					<template>
						<el-select v-model="goods.subCateId" placeholder="禅茶素材分类" @change="typeyChange">
							<el-option v-for="item in typeList" :key="item.type" :label="item.subCateName" :value="item.id">
							</el-option>
						</el-select>
						<!--<span>禅茶素材分类</span>-->
					</template>
				</el-form-item>
				<!--所属商家-->
				
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
				
				<!--<el-form-item label="所属商家" prop="shopId">
					<template>
						<el-select v-model="goods.shopId" placeholder="所属商家">
							<el-option v-for="item in goods.roleList" :key="item.shopId" :label="item.name" :value="item.shopId">
							</el-option>
						</el-select>
					</template>
				</el-form-item>-->

				<el-form-item label="商品图片">
					<!--<p></p>-->
					<div class="imgBox" id="uploadHeader1" @click="getupload1">
						<img class="bigImage1" v-if="pictures[0].itemPicUrl" :src="sysConfig+pictures[0].itemPicUrl" alt="+">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						<!--<div class="bigImagebg" v-if="speedProgress!=0 && speedProgress!=100">{{speedProgress==100?'speedProgress':'完成'}}%</div>-->
						
					</div>
					<!--<el-button id="uploadHeader1" type="primary" @click="getupload1">选择图片</el-button>-->
					<!--<el-upload id="uploadHeader1" class="avatar-uploader" :action='uploadPath' list-type='picture-card' :show-file-list="false" accept=".jpg,.jpeg,.png" :on-success="uploadPicUrl" :before-upload="beforeAvatarUpload">
						<img v-if="pictures[0].itemPicUrl" :src="sysConfig+pictures[0].itemPicUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>-->
					<!--<div id="uploadHeader1" class="">选择图片</div>-->
				</el-form-item>

				<el-form-item label="宣传画廊">
					<!--<el-upload :action='uploadPath' :limit='3' multiple accept=".jpg,.jpeg,.png" list-type="picture-card" :on-exceed="uploadOverrun" :on-success="handleGalleryUrl" :on-remove="handleRemove" :before-upload="beforeAvatarUpload">
						<i class="el-icon-plus"></i>
					</el-upload>-->
					<div style="display: flex;">
						<div class="imgBox" @click="getRemoveupload(index,item)" v-for="(item,index) in pictures" v-if="item.picType != 1">
							<img class="bigImage1" :src="sysConfig+item.itemPicUrl">
							<!--<div class="bigImagebg" v-if="speedProgress!=0 && speedProgress!=100">{{speedProgress==100?'speedProgress':'完成'}}%</div>-->
						</div>
						<div class="imgBox" id="uploadHeader2" @click="getupload2" >
							<i class="el-icon-plus"></i>
						</div>
					</div>
					
				</el-form-item>
				<el-form-item label="商品详细介绍">
					<editor :init="editorInit" v-model="description"></editor>
				</el-form-item>
				<!--<div style="color:red;margin-left: 150px;">外置图最多上传1张，尺寸140*140;详情图最多上传3张，尺寸160*160;图片大小1M以内</div>-->
			</el-form>
		</el-card>

		<el-card class="box-card">
			<h3>商品规格</h3>
			<el-row type="flex" align="middle" :gutter="20" style="padding:20px 0;">
				<el-col :span="10">
					<el-radio-group v-model="multipleSpec" @change="specChanged">
						<el-radio-button disabled :label="false">默认标准规格</el-radio-button>
						<el-radio-button :label="true">多规格支持</el-radio-button>
					</el-radio-group>
				</el-col>
				<el-col :span="10" v-if="multipleSpec">
					<el-button :plain="true" @click="handleSpecificationShow" type="primary">添加</el-button>
				</el-col>
			</el-row>
			<!--规格列表-->
			<el-table :data="skus">
				<el-table-column property="specName" label="规格"></el-table-column>
				<el-table-column property="originalPrice" label="商品价格"></el-table-column>
				<el-table-column property="actPrice" label="活动价格"></el-table-column>
				<el-table-column property="logisticsPrice" label="运费"></el-table-column>
				<el-table-column property="inventory" label="库存"></el-table-column>
				
				<el-table-column property="inventory" label="积分抵现">
					<template slot-scope="scope">
						<el-tag type="primary">
							{{scope.row.deductionCount}}抵扣{{scope.row.deductionPrice}}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width" v-if="multipleSpec">
					<template slot-scope="scope">
						<el-button type="danger" size="mini" @click="handleSpecificationDelete(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--规格值设定-->
			<el-dialog title="设置规格" :visible.sync="specVisiable">
				<el-form :rules="rulespop" ref="myskus" :model="myskus" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
					<el-form-item label="规格" prop="specName">
						<el-input v-model="myskus.specName"></el-input>
					</el-form-item>
					
					<el-form-item label="商品价格" prop="originalPrice">
					<el-input v-model="myskus.originalPrice" placeholder="0.00">
						<template slot="append">元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="活动价格">
					<el-input v-model="myskus.actPrice" placeholder="0.00">
						<template slot="append">元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="商品运费" prop="logisticsPrice">
					<el-input v-model="myskus.logisticsPrice" placeholder="0.00">
						<template slot="append">元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="商品库存" prop="inventory">
					<el-input v-model="myskus.inventory" placeholder="0" style="width: 100%;">
					</el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input v-model="myskus.orderIndex" placeholder="1"  type="number" style="width: 100%;">
					</el-input>
				</el-form-item>
				<el-form-item label="积分数量" prop="deductionCount">
					<el-input type='number' v-model="myskus.deductionCount" placeholder="0.00" >
					<template slot="append">积分</template>
					</el-input>
				</el-form-item>
				<el-form-item label="抵现金额" prop="deductionPrice">
					<el-input type='number' v-model="myskus.deductionPrice" placeholder="0.00" >
					 <template slot="append">元</template>
					</el-input>
				</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="specVisiable = false">取消</el-button>
					<el-button type="primary" @click="handleSpecificationAdd">确定</el-button>
				</div>
			</el-dialog>
		</el-card>

		<!--<el-card class="box-card">
			<h3>商品库存</h3>
			<el-table :data="products">
				<el-table-column property="value" label="货品规格">
					<template slot-scope="scope">
						<el-tag :key="tag" v-for="tag in scope.row.specifications">
							{{tag}}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column property="number" width="100" label="货品数量">
				</el-table-column>
				<el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" @click="handleProductShow(scope.row)">设置</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-dialog title="设置货品" :visible.sync="productVisiable">
				<el-form ref="productForm" :model="productForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
					<el-form-item label="货品规格列" prop="specifications">
						<el-tag :key="tag" v-for="tag in productForm.specifications">
							{{tag}}
						</el-tag>
					</el-form-item>
					<el-form-item label="货品数量" prop="number">
						<el-input v-model="productForm.number"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="productVisiable = false">取消</el-button>
					<el-button type="primary" @click="handleProductEdit">确定</el-button>
				</div>
			</el-dialog>
		</el-card>-->

		<!--<el-card class="box-card">
			<h3>商品参数</h3>
			<el-button :plain="true" @click="handleAttributeShow" type="primary">添加</el-button>
			<el-table :data="attributes">
				<el-table-column property="attribute" label="商品参数名称">
				</el-table-column>
				<el-table-column property="value" label="商品参数值">
				</el-table-column>
				<el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button type="danger" size="mini" @click="handleAttributeDelete(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-dialog title="设置商品参数" :visible.sync="attributeVisiable">
				<el-form ref="attributeForm" :model="attributeForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
					<el-form-item label="商品参数名称" prop="attribute">
						<el-input v-model="attributeForm.attribute"></el-input>
					</el-form-item>
					<el-form-item label="商品参数值" prop="value">
						<el-input v-model="attributeForm.value"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="attributeVisiable = false">取消</el-button>
					<el-button type="primary" @click="handleAttributeAdd">确定</el-button>
				</div>
			</el-dialog>
		</el-card>-->

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
	
	.el-tag+.el-tag {
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
	
	.distance {
		margin-right: 50px;
	}
</style>

<script>
	import $ from 'jquery'
//	import '../../assets/img-select-min.js'
	import { addListGoods, addItemGoods, detailItemGoods, getItems, gitCategory, getTypes, listArea , getRole } from '@/api/goods'
	import { userAuthList } from '@/api/shop'
	import { createStorage, uploadPath } from '@/api/storage'
	import { qiniu_config } from '@/api/qiniuUpload'
	import Editor from '@tinymce/tinymce-vue'
	import { Message, MessageBox } from 'element-ui'
	

	export default {
		name: 'GoodsCreate',
		components: {
			Editor
		},
		data() {
			return {
				sysConfig:'',
				cateAreaList: [], //地址列表；
				
				//传给后台的数据===>>
				description: "", //商品描述，富文本内容， 可图文
				pictures: [
					{
						itemPicUrl:'',
						imgUrl:'',
						orderIndex:1,
						picType:1
					}
				],
				
				
				myskus:{
					actPrice: "", //活动价
					deductionCount: 0, //抵扣积分
					deductionPrice: 0, //抵扣价格
					id: "", //商品属性ID
					inventory: "", //库存
					isDefault: 1, //是否是商品的默认规格:0否1是
					logisticsPrice: "", //运费
					orderIndex: 1, //排序字段
					originalPrice: "", //原价
					specName: "", //商品规格
					specificationName:'',
					specificationValue:'',
//					selectedOptions: [],
				},
				skus: [],
				galleryKey:[],//画廊key;

				uploadPath,
				newKeywordVisible: false,
				newKeyword: '',
				keywords: [],
				categoryList: [],
				categoryList: [],
				typeList: [],
				
				
				categoryListMerchantsData: '', //所属商家
				brandList: [],
				goods: {
					picUrl: '',
					gallery: [],
					title:'',
					categoryListSpecies: '',
					shopId: '', //商户ID
					target:'',
					roleList:[],//所属商家
					id: "", //商品ID
					province: "", //省
					city: "", //市
					district: "", //区
					cateId: "", //商品类型
					cateType: 1, //商品类别
					subCateId: '', //商品类目
				},
				specVisiable: false,
				specForm: {
					specification: '',
					value: '',
					picUrl: ''
				},
				multipleSpec: true,
				specifications: [{
					specification: '规格',
					value: '标准',
					picUrl: ''
				}],
				productVisiable: false,
				productForm: {
					id: 0,
					specifications: [],
					price: 0.00,
					collagePrice: 0.00,
					scareBuyingPrice: 0.00,
					bargainPrice: 0.00,
					number: 0,
					url: ''
				},
				products: [{
					id: 0,
					specifications: ['标准'],
					price: 0.00,
					collagePrice: 0.00,
					scareBuyingPrice: 0.00,
					bargainPrice: 0.00,
					number: 0,
					url: ''
				}],
				attributeVisiable: false,
				attributeForm: {
					attribute: '',
					value: ''
				},
				attributes: [],
				rules: {
					goodsSn: [{
						required: true,
						message: '商品编号不能为空',
						trigger: 'blur'
					}],
					title: [{
						required: true,
						message: '商品名称不能为空',
						trigger: 'blur'
					}],
					cateType: [{
						required: true,
						message: '商品种类不能为空',
						trigger: 'blur'
					}],
					cateId: [{
						required: true,
						message: '商品类型不能为空',
						trigger: 'blur'
					}],
					subCateId: [{
						required: true,
						message: '商品类目不能为空',
						trigger: 'blur'
					}],
					target: [{
						required: true,
						message: '请选择商家',
						trigger: 'blur'
					}]
				},
				rulespop:{
					specName:[{
						required: true,
						message: '规格不能为空',
						trigger: 'blur'
					}],
					originalPrice:[{
						required: true,
						message: '商品价格不能为空',
						trigger: 'blur'
					}],
					inventory:[{
						required: true,
						message: '商品库存不能为空',
						trigger: 'blur'
					}],
//					deductionCount:[{
//						required: true,
//						message: '积分数量不能为空',
//						trigger: 'blur'
//					}],
//					deductionPrice:[{
//						required: true,
//						message: '抵现金额不能为空',
//						trigger: 'blur'
//					}]
				},
				editorInit: {
					language: 'zh_CN',
					plugins: ['advlist anchor autolink autoresize autosave emoticons fullscreen hr image imagetools importcss insertdatetime legacyoutput link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace tabfocus table template textcolor textpattern visualblocks visualchars wordcount'],
					toolbar: ['bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript ', 'hr bullist numlist link image charmap preview anchor pagebreak fullscreen media table emoticons forecolor backcolor'],
					images_upload_handler: function(blobInfo, success, failure) {
						const formData = new FormData()
						formData.append('file', blobInfo.blob())
						createStorage(formData).then(res => {
							success(res.data.data.url);
						}).catch(() => {
							failure('上传失败，请重新上传')
						})
					}
				},
				provinces: '',
				cities: '',
				areas: '',
				dataForm: {
					provinceId: undefined,
					cityId: undefined,
					areaId: undefined,
					cateType: 1,
					cateId: undefined
				},
				//查询商品类型的入参
				dataFormType: {
					cateId: undefined
				},
				isCategoryShow:true,
				getRoleData:{
					pageNum: 1,
					pageSize: 50000,
					nickname: undefined,
					createStartTime: undefined,
					createEndTime: undefined,
					category:3,
					name:undefined
				},
				wzimg:"",
				speedProgress:0,
				finalGoods:{
					cateId: "", //商品类型
					cateType: "", //商品类别
//							city: this.goods.city, //市
					description: "", //商品描述，富文本内容， 可图文
//							district: this.goods.district, //区
					id: "", //商品ID
					pictures: "",
//							province: this.goods.province, //省
					shopId: "", //商户ID
					skus: "",
					subCateId: "", //商品类目
					title: "", //标题
					goods: "", //商品
					specifications: "", //规格
					products: "", // 产品
					attributes: "" //属性
				}
			}
		},
		created() {
			this.init(),
			this.gitCategory();
//			this.getItems();
//			this.getRole();
			this.getuserAuthList();
			this.sysConfig = this.$store.getters.sysConfig.storageBaseUrl;
			
		},
		methods: {
			init: function() {
				detailItemGoods().then(response => {
					
				})
				listArea().then(response => {
					this.cateAreaList = response.data.data;
				})
			},
			//得到商品种类列表
			getItems() {
				getItems().then(response => {
					var itemsList = response.data.data;
					this.goods.categoryListSpecies = itemsList;

				})
			},
			//得到商品类型
			gitCategory() {
				gitCategory(this.goods).then(response => {
					this.categoryList = response.data.data;
					if(this.categoryList == ""){
						this.$message({
				            type: 'warning',
				            message: '请先设置商品类型!'
				          });
					}
				})

			},
			//得到商品类目
			getTypes() {
				getTypes(this.goods).then(response => {
					this.typeList = response.data.data;
					if(this.typeList == ""){
						this.$message({
				            type: 'warning',
				            message: '请先设置商品类目!'
				          });
					}
				})
			},
			//得到所属商家ID
			getuserAuthList(){
//				var datas = {
//					category:3
//				}
//				getRole().then(response => {
//					this.goods.roleList = response.data.data;
//				})
				
				userAuthList(this.getRoleData).then(response => {
					this.goods.roleList = response.data.data.items
				}).catch(() => {
				})
			},
			handleCategoryChange(value) {
				this.goods.categoryId = value[value.length - 1];
			},
			handleCancel: function() {
				this.$router.push({
					path: '/goods/list'
				})
			},
			//获取商品种类Id
//			itemsChange(val) {
////				this.dataForm.cateType = val;
//				this.goods.cateType = val;
////				if(val == 6 || val == 4){
////					this.isCategoryShow = false
////				}else{
////					this.isCategoryShow = true
////				}
////				this.cateType = val ;
//				
//				this.goods.cateId = '';
//				this.goods.subCateId = '';
//			},
			//获取商品类型Id
			categoryChange(val) {
				this.goods.subCateId = '' ;
				this.goods.cateId = val ;
				this.getTypes();
			},
			//获取类目列表
			typeyChange(val){
				this.goods.subCateId = val ; 
			},
			//获取省市区列表
			handleCategoryChange(value) {
				this.goods.province = value[0]
				this.goods.city = value[1]
				this.goods.district = value[2]
				
			},
//			选择商品图片
			getupload1:function(event){
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
									  	_this.pictures[0].itemPicUrl = res.key;
										_this.pictures[0].imgUrl =  res.key;
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
						if(_this.pictures.length > 3){
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
								  	_this.pictures.push({
										itemPicUrl:res.key,
										imgUrl:res.key,
										orderIndex:1,
										picType:2
									})
									var obj = _this.pictures;
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
									_this.pictures = obj ;
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
			        	for(var i = 0; i < this.pictures.length; i++){
							if(item.picType == 2){
								var url
								if(item.itemPicUrl == undefined){
									url = item.itemPicUrl
								} else {
									url = item.itemPicUrl
								}
								if(this.pictures[i].itemPicUrl === url){
									this.pictures.splice(index, 1)
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
			//点击添加按钮；
			handlePublish: function() {
				var _this = this;
				if(_this.skus.length<1){
					_this.$message({
						type: 'error',
						message: '请设置商品规格！！'
					})
					return false;					
				}
									
				this.$refs['goods'].validate((valid)=>{
					if(valid){
						var galleryKeyArry = this.galleryKey;
						var specArry = this.specifications;
						var specHtml = '';
						var galleryKeyHtml = '';
						for(var i = 0; i < specArry.length; i++) {
							specHtml += specArry[i].specification + '-' + specArry[i].value + ",";
						}
						for(var i = 0; i < galleryKeyArry.length; i++) {
							galleryKeyHtml += galleryKeyArry[i] + ",";
						}
						_this.finalGoods.cateId         = this.goods.cateId; //商品类型
						_this.finalGoods.cateType       = 1;//商品类别
						_this.finalGoods.description    = this.description; //商品描述，富文本内容， 可图文
						_this.finalGoods.id			    = this.id; //商品ID
						_this.finalGoods.pictures	    = this.pictures; 
						_this.finalGoods.shopId		    = this.goods.shopId; //商户ID
						_this.finalGoods.skus		    = this.skus; 
						_this.finalGoods.subCateId	    = this.goods.subCateId; //商品类目
						_this.finalGoods.title		    = this.goods.title, //标题
						_this.finalGoods.goods		    = this.goods, //商品
						_this.finalGoods.specifications = this.specifications, //规格
						_this.finalGoods.products		= this.products, // 产品
						_this.finalGoods.attributes		= this.attributes, //属性
					
//						const finalGoods = {
//							cateId: this.goods.cateId, //商品类型
//							cateType: 1, //商品类别
////							city: this.goods.city, //市
//							description: this.description, //商品描述，富文本内容， 可图文
////							district: this.goods.district, //区
//							id: this.id, //商品ID
//							pictures: this.pictures,
////							province: this.goods.province, //省
//							shopId: this.goods.shopId, //商户ID
//							skus: this.skus,
//							subCateId: this.goods.subCateId, //商品类目
//							title: this.goods.title, //标题
//							goods: this.goods, //商品
//							specifications: this.specifications, //规格
//							products: this.products, // 产品
//							attributes: this.attributes //属性
//						}
						addListGoods(_this.finalGoods).then(response => {
							this.$notify({
								title: '成功',
								message: '创建成功',
								type: 'success',
								duration: 2000
							})
							this.$router.push({
								path: '/goods/list'
							})
						}).catch(response => {
							MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
								confirmButtonText: '确定',
								type: 'error'
							})
						})
					}
				})
				
			},
			handleClose(tag) {
				this.keywords.splice(this.keywords.indexOf(tag), 1)
				this.goods.keywords = this.keywords.toString()
			},
			showInput() {
				this.newKeywordVisible = true
				this.$nextTick(_ => {
					this.$refs.newKeywordInput.$refs.input.focus()
				})
			},
			handleInputConfirm() {
				const newKeyword = this.newKeyword
				if(newKeyword) {
					this.keywords.push(newKeyword)
					this.goods.keywords = this.keywords.toString()
				}
				this.newKeywordVisible = false
				this.newKeyword = ''
			},
		    beforeAvatarUpload(file) {
//		    	console.log(file)
		        const isLt1M = file.size / 1024 / 1024 < 1;
		        if (!isLt1M) {
		          this.$message.error('图片上传大小不能超过 1MB!');
		        }
		        return  isLt1M;
		     },
			//商品图片==图片；
			uploadPicUrl: function(response) {
//				console.log(response)
				this.goods.picUrl = response.data.url ;
				this.pictures[0].itemPicUrl = response.data.key;
				this.pictures[0].imgUrl = response.data.url;
			},
			uploadOverrun: function() {
				this.$message({
					type: 'error',
					message: '上传文件个数超出限制!最多上传3张图片!'
				})
			},
			//画廊图片；
			handleGalleryUrl(response, file, fileList) {
				if (response.code === 1) {
					this.pictures.push({
						itemPicUrl:response.data.key,
						imgUrl:response.data.url,
						orderIndex:1,
						picType:2
					})
     			}

			},
			handleRemove: function(file, fileList) {
				for(var i = 0; i < this.goods.gallery.length; i++) {
					// 这里存在两种情况
					// 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
					//    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
					// 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
					var url
					if(file.response === undefined) {
						url = file.url
					} else {
						url = file.response.data.url
					}

					if(this.goods.gallery[i] === url) {}
						this.goods.gallery.splice(i, 1)
					
				}
			},
			specChanged: function(label) {
				if(label === false) {
					this.specifications = [{
						specification: '规格',
						value: '标准',
						picUrl: ''
					}]
					this.products = [{
						id: 0,
						specifications: ['标准'],
						price: 0.00,
						collagePrice: 0.00,
						scareBuyingPrice: 0.00,
						bargainPrice: 0.00,
						number: 0,
						url: ''
					}]
				} else {
					this.specifications = []
					this.products = []
				}
			},
			uploadSpecPicUrl: function(response) {
				this.specForm.picUrl = response.data.url
			},
			handleSpecificationShow() {
				this.myskus = {
					actPrice: "", //活动价
					deductionCount: 0, //抵扣积分
					deductionPrice: 0, //抵扣价格
					id: "", //商品属性ID
					inventory: "", //库存
					isDefault: 1, //是否是商品的默认规格:0否1是
					logisticsPrice: "", //运费
					orderIndex: 1, //排序字段
					originalPrice: "", //原价
					specName: "", //商品规格
					specificationName:'',
					specificationValue:'',
				}
				this.specVisiable = true
				this.$nextTick(() => {
			        this.$refs['myskus'].clearValidate()
		        })
			},
			handleSpecificationAdd() {
				this.$refs['myskus'].validate((valid)=>{
					if(valid){
						this.skus.unshift(this.myskus);
						this.specVisiable = false
//						console.log(this.skus);
						this.specToProduct()						
					}
				})

			},
			handleSpecificationDelete(row) {
				const index = this.skus.indexOf(row)
				this.skus.splice(index, 1)
				this.specToProduct()
			},
			specToProduct() {
				if(this.specifications.length === 0) {
					return
				}
				// 根据specifications创建临时规格列表
				var specValues = []
				var spec = this.specifications[0].specification
				var values = []
				values.push(0)

				for(var i = 1; i < this.specifications.length; i++) {
					const aspec = this.specifications[i].specification

					if(aspec === spec) {
						values.push(i)
					} else {
						specValues.push(values)
						spec = aspec
						values = []
						values.push(i)
					}
				}
				specValues.push(values)

				// 根据临时规格列表生产货品规格
				// 算法基于 https://blog.csdn.net/tyhj_sf/article/details/53893125
				var productsIndex = 0
				var products = []
				var combination = []
				var n = specValues.length
				for(var s = 0; s < n; s++) {
					combination[s] = 0
				}
				var index = 0
				var isContinue = false
				do {
					var specifications = []
					for(var x = 0; x < n; x++) {
						var z = specValues[x][combination[x]]
						specifications.push(this.specifications[z].value)
					}
					products[productsIndex] = {
						id: productsIndex,
						specifications: specifications,
						price: 0.00,
						collagePrice: 0.00,
						scareBuyingPrice: 0.00,
						bargainPrice: 0.00,
						number: 0,
						url: ''
					}
					productsIndex++

					index++
					combination[n - 1] = index
					for(var j = n - 1; j >= 0; j--) {
						if(combination[j] >= specValues[j].length) {
							combination[j] = 0
							index = 0
							if(j - 1 >= 0) {
								combination[j - 1] = combination[j - 1] + 1
							}
						}
					}
					isContinue = false
					for(var p = 0; p < n; p++) {
						if(combination[p] !== 0) {
							isContinue = true
						}
					}
				} while (isContinue)

				this.products = products
			},
			handleProductShow(row) {
				this.productForm = Object.assign({}, row)
				this.productVisiable = true
			},
			uploadProductUrl: function(response) {
				this.productForm.url = response.data.url
			},
			handleProductEdit() {
				for(var i = 0; i < this.products.length; i++) {
					const v = this.products[i]
					if(v.id === this.productForm.id) {
						this.products.splice(i, 1, this.productForm)
						break
					}
				}
				this.productVisiable = false
			},
			handleAttributeShow() {
				this.attributeForm = {}
				this.attributeVisiable = true
			},
			handleAttributeAdd() {
				this.attributes.unshift(this.attributeForm)
				this.attributeVisiable = false
			},
			handleAttributeDelete(row) {
				const index = this.attributes.indexOf(row)
				this.attributes.splice(index, 1)
			},
			//省
			provinceChange() {

			},
			//市
			cityChange() {

			},
			//区
			areaChange() {

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