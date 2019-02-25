<template>
	<div class="app-container calendar-list-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入商家名称" v-model="listQuery.name">
			</el-input>
			<!--<el-select multiple style="width: 200px" class="filter-item" placeholder="请选择商家种类" v-model="listQuery.statusArray" >
        <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value">
        </el-option>
      </el-select> -->
			<!--<el-select multiple style="width: 200px" class="filter-item" placeholder="请选择商家使用状态" v-model="listQuery.statusArray" >
        <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value">
        </el-option>
     </el-select> -->
			<el-date-picker v-model="listQuery.createStartTime" type="date" :picker-options="pickerBeginDateBefore" format="yyyy-MM-dd" value-format="yyyy-MM-dd 00:00:00" placeholder="开始时间" class="filter-item" id='datestart'>
			</el-date-picker>至
			<el-date-picker v-model="listQuery.createEndTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd 23:59:59" :picker-options="pickerBeginDateAfter" placeholder="结束时间" class="filter-item" id='dateend'>
			</el-date-picker>
			<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
			<el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
			<el-button class="filter-item" type="primary" :loading="downloadLoading" icon="el-icon-download" @click="handleDownload">导出</el-button>
		</div>

		<!-- 查询结果 -->
		<el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
			<el-table-column align="center" label="序号" width="80">
				<template slot-scope="scope">
					<span v-text="getIndex(scope.$index)"> </span>
				</template>
			</el-table-column>

			<el-table-column align="center" label="商家名称" prop="name">
			</el-table-column>

			<el-table-column align="center" label="推荐合伙人" prop="partnerName">
			</el-table-column>

			<el-table-column align="center" label="商家类型" prop="category">
				<template slot-scope="scope">
					<el-tag :type="scope.row.category==1 ? 'success' : scope.row.category==2? 'error' : scope.row.category==3? 'danger' : scope.row.category==4? 'warning':'info' ">{{scope.row.category==1? '精品民宿' : scope.row.category== 2? '素食餐厅': scope.row.category== 3? '禅茶素材' : scope.row.category== 4? '投资收藏' : '其它'}}</el-tag>
				</template>
			</el-table-column>

			<el-table-column align="center" label="账户名" prop="account">
			</el-table-column>
			
			<el-table-column align="center" label="联系人姓名" prop="leader">
			</el-table-column>

			<el-table-column align="center" label="手机号码" prop="phone">
			</el-table-column>

			<el-table-column align="center" label="商家电话" prop="tel">
			</el-table-column>

			<el-table-column align="center" label="分享人数" prop="shareNum">
			</el-table-column>

			<el-table-column align="center" label="商家归属地">
				<template slot-scope="scope">
					{{scope.row.province }}-{{scope.row.city }}-{{scope.row.district }}
				</template>
			</el-table-column>

			<el-table-column align="center" label="详细地址" prop="address">
			</el-table-column>

			<el-table-column align="center" label="添加时间" prop="createAt">
			</el-table-column>

			<el-table-column align="center" label="审核状态" prop="shopStatus">
				<template slot-scope="scope">
					<el-tag :type="scope.row.shopStatus==0 ? 'info' : scope.row.shopStatus==1?'success':'error' ">{{scope.row.shopStatus==0 ? '待审核' : scope.row.shopStatus==1?'审核通过':'未审核通过'}}</el-tag>
				</template>
			</el-table-column>

			<el-table-column align="center" label="使用状态" prop="status">
				<template slot-scope="scope">
					<el-tag :type="scope.row.status ? 'success' : 'info' ">{{scope.row.status ? '正常' : '禁用'}}</el-tag>
				</template>
			</el-table-column>

			<el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button type="primary" size="mini" @click="handleUpdate(scope.row.userAuthId)">编辑</el-button>
					<el-button type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<div class="pagination-container">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>

		<!-- 添加或修改对话框 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
				<el-form-item label="商家名称" prop="name">
					<el-input v-model="dataForm.name"></el-input>
				</el-form-item>
				<el-form-item label="手机号码" v-if="dialogStatus=='create'" prop="username">
					<el-input v-model="dataForm.username"></el-input>
				</el-form-item>
				<el-form-item label="账户名" v-if="dialogStatus=='create'" prop="account">
					<el-input v-model="dataForm.account"></el-input>
				</el-form-item>
				<el-form-item label="密码" v-if="dialogStatus=='create'" prop="password">
					<el-input name="password" :type="passwordType" autoComplete="on" placeholder="请输入密码" v-model="dataForm.password" />
					<span class="show-pwd" @click="showPwd">
	           <svg-icon icon-class="eye" />
	           </span>
				</el-form-item>
				<el-form-item label="合伙人" v-if="dialogStatus=='create'">
					<el-select id="specifications" v-model="dataForm.referrerId">
						<el-option :value="v.userId" v-for="v in options" :label="v.username" :key="v.userId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label=" 商家类型" prop="category">
					<el-select v-model="dataForm.category" placeholder="请选择"  @change="getchoicetype">
						<el-option label="精品民宿" :value="1">
						</el-option>
						<el-option label="素食餐厅" :value="2">
						</el-option>
						<el-option label="禅茶素材" :value="3">
						</el-option>
						<el-option label="投资收藏" :value="4">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="联系人姓名" prop="leader">
					<el-input v-model="dataForm.leader"></el-input>
				</el-form-item>
				<el-form-item label="手机号码" prop="phone">
					<el-input v-model="dataForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="商家电话" prop="tel">
					<el-input v-model="dataForm.tel"></el-input>
				</el-form-item>
				<el-form-item label="商家地址" prop="selectedOptions">
					<el-cascader :options="cateAreaList" v-model="dataForm.selectedOptions" @change="handleShopChange">
					</el-cascader>
				</el-form-item>
				<el-form-item label="详细地址" prop="address">
					<el-input v-model="dataForm.address"></el-input><span @click="getbaiduMap" style="color: red;font-size: 10px;margin-left: 226px;cursor: pointer;letter-spacing: 1px;">*去地图选位置</span>
				</el-form-item>
				<el-form-item label="营业执照">
					<span v-show="aaaa"></span>
					<el-upload class="avatar-uploader" :action='uploadPath' list-type='picture-card' :show-file-list="false" accept=".jpg,.jpeg,.png,.gif" :on-success="uploadLicensePicUrl" :before-upload="beforeAvatarUpload">
						<img v-if="outlaylicenseImg[0].key" :src="sysConfig+outlaylicenseImg[0].key" class="avatar" style="width: 148px;height:148px">
						<img v-if="outlaylicenseImg[0].imageUrl" :src="sysConfig+outlaylicenseImg[0].key" class="avatar" style="width: 148px;height:148px">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="法人身份证(正面)">
					<span v-show="bbbb"></span>
					<el-upload class="avatar-uploader" :action='uploadPath' list-type='picture-card' :show-file-list="false" accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPositivePicUrl" :before-upload="beforeAvatarUpload">
						<img v-if="outlaypositiveImg[0].key" :src="sysConfig+outlaypositiveImg[0].key" class="avatar" style="width: 148px;height:148px">
						<img v-if="outlaypositiveImg[0].itemPicUrl" :src="sysConfig+outlaypositiveImg[0].key" class="avatar" style="width: 148px;height:148px">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="法人身份证(反面)">
					<span v-show="cccc"></span>
					<el-upload class="avatar-uploader" :action='uploadPath' list-type='picture-card' :show-file-list="false" accept=".jpg,.jpeg,.png,.gif" :on-success="uploadSidePicUrl" :before-upload="beforeAvatarUpload">
						<img v-if="outlaysideImg[0].key" :src="sysConfig+outlaysideImg[0].key" class="avatar" style="width: 148px;height:148px">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<div v-show="isUnderLineshow">
				<el-form-item label="食品经营许可证">
					<span v-show="dddd"></span>
					<el-upload class="avatar-uploader" :action='uploadPath' list-type='picture-card' :show-file-list="false" accept=".jpg,.jpeg,.png,.gif" :on-success="uploadRunPicUrl" :before-upload="beforeAvatarUpload">
						<img v-if="outlayrunImg[0].key" :src="sysConfig+outlayrunImg[0].key" class="avatar" style="width: 148px;height:148px">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="食品流通许可证">
					<span v-show="eeee"></span>
					<el-upload class="avatar-uploader" :action='uploadPath' list-type='picture-card' :show-file-list="false" accept=".jpg,.jpeg,.png,.gif" :on-success="uploadCirculationPicUrl" :before-upload="beforeAvatarUpload">
						<img v-if="outlaycirculationImg[0].key" :src="sysConfig+outlaycirculationImg[0].key" class="avatar" style="width: 148px;height:148px">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="食品生产许可证">
					<span v-show="ffff"></span>
					<el-upload class="avatar-uploader" :action='uploadPath' list-type='picture-card' :show-file-list="false" accept=".jpg,.jpeg,.png,.gif" :on-success="uploadProdPicUrl" :before-upload="beforeAvatarUpload">
						<img v-if="outlayprodImg[0].key" :src="sysConfig+outlayprodImg[0].key" class="avatar" style="width: 148px;height:148px">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
				<el-button v-else type="primary" @click="updateData">确定</el-button>
			</div>
		</el-dialog>
		<!--加入地图控件对话框-->
		<el-dialog title="标选地图位置" :visible.sync="dialogFormVisibleMap" @close='closeDialog'>
			<myMap 
				v-if="childData"
				ref="childData"
				v-bind:addressmap="addressmap" 
				v-on:createDataMapmsg="getMsg"
			></myMap>
			<div slot="footer" class="dialog-footer">
				<!--<el-button @click="dialogFormVisibleMap = false">取消</el-button>-->
				<el-button v-if="dialogStatusMap=='create'" type="primary" @click="createDataMap">确定</el-button>
				<el-button v-else type="primary" @click="updateDataMap">确定</el-button>
			</div>
		</el-dialog>

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
	
	#specifications {
		width: 100%;
		color: #606266;
		height: 36px;
		border-radius: 4px;
		border: 1px solid #dcdfe6;
	}
	
	.title-container {
		position: relative;
		.title {
			font-size: 26px;
			font-weight: 400;
			color: $light_gray;
			margin: 0px auto 40px auto;
			text-align: center;
			font-weight: bold;
		}
	}
	
	.show-pwd {
		position: absolute;
		right: 10px;
		top: 7px;
		font-size: 16px;
		color: $dark_gray;
		cursor: pointer;
		user-select: none;
	}
</style>
<script>
	import { userAuthList, userAuthDetail, addUserList, editUserList, getAreaList, referrerList , getLatlog } from '@/api/shop'
	import { parseTime } from '@/utils/index'
	import { createStorage, uploadPath, pictureAIP } from '@/api/storage'
	import { Message, MessageBox } from 'element-ui'
	import axios from 'axios'
	import myMap from "./map.vue" //导入组件；
	const statusMap = {
		1: '正常',
		0: '禁用'
	}
	export default {
		name: 'User',
		components:{
			myMap
		},
		data() {
			const validatePassword = (rule, value, callback) => {
				var passwordValue = /^.{6,12}$/
				if(!value) {
					callback(new Error('商家用户密码不能为空'))
				} else if(!passwordValue.test(value)){
					callback(new Error('商家用户密码长度应大于6小于12位'))
				}else{
					callback()
				}
			}
			var validatePhone = (rule, value, callback) => {
				if(!value) {
					callback(new Error('请输入手机号码'))
				} else {
					var reg = /^1\d{10}$/
					if(!reg.test(value)) {
						callback(new Error('请输入正确的手机号码'))
					} else {
						callback()
					}
				}
			}
			const validateAccount = (rule, value, callback) => {
//				var reg =  /^[0-9a-zA-Z_]{5,20}$/
//				if(!value ) {
//					callback(new Error('账户名不能为空'))
//				} else {
//					if(!reg.test(value)){
//						callback(new Error('账户名由5-20位的数字、字母或者下划线组成'))
//					} else {
//					callback()						
//					}
//		
//				}
				var regAccount =  /^[0-9a-zA-Z_]{5,20}$/
				var regPhone   =  /^1\d{10}$/
				if(!value ) {
					callback(new Error('账户名不能为空'))
				} else {
					if(!regAccount.test(value)){
						callback(new Error('账户名由5-20位的数字、字母或者下划线组成'))
					}  else if(regPhone.test(value)===regAccount.test(value)){
			           callback(new Error('账户名与手机号码不能相同'))
			        }else{
					callback()						
					}
				}
			}
			return {
				childData:false,
				addressmap:'',
				aaaa: '',
				bbbb: '',
				cccc: '',
				dddd: '',
				eeee: '',
				ffff: '',
				imageUrl: '',
				isUnderLineshow:false,
				passwordType: 'password',
				list: null,
				total: null,
				listLoading: true,
				cateAreaList: [],
				referrerId: '',
				options: [],
				optionsusername: [],
				selectedOptions: [],
				statusMap,
				uploadPath,
				passwordType: 'password',
				listQuery: {
					pageNum: 1,
					pageSize: 10,
					nickname: undefined,
					createStartTime: undefined,
					createEndTime: undefined
				},
				dataForm: {
					longitude: undefined,
					latitude: undefined,
					address: undefined,
					category: undefined,
					city: '',
					district: '',
					leader: '',
					name: '',
					password: '',
					phone: '',
					province: '',
					referrerId: undefined,
					shopId: '',
					tel: '',
					userAuthPicVoList: [],
					username: '',
					account:'',
					selectedOptions: [],
				},
				shipForm: {
					userId: undefined
				},
				dialogFormVisible: false,
				dialogFormVisibleMap: false,
				dialogStatusMap: false,
				dialogStatus: '',
				textMap: {
					update: '编辑',
					create: '创建'
				},
				rules: {
					name: [{
						required: true,
						message: '商家名称不能为空',
						trigger: 'blur'
					}],
					leader: [{
						required: true,
						message: '联系人不能为空',
						trigger: 'blur'
					}],
					phone: [{
							required: true,
							message: '手机号码不能为空',
							trigger: 'blur'
						},
						{
							validator: validatePhone,
							trigger: 'blur'
						}
					],
					tel: [{
						required: true,
						message: '商家电话不能为空',
						trigger: 'blur'
					}],
					province: [{
						required: true,
						message: '省不能为空',
						trigger: 'blur'
					}],
					city: [{
						required: true,
						message: '市不能为空',
						trigger: 'blur'
					}],
					district: [{
						required: true,
						message: '区不能为空',
						trigger: 'blur'
					}],
					username: [{
							required: true,
							message: '手机号码不能为空',
							trigger: 'blur'
						},
						{
							validator: validatePhone,
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '密码不能为空',
							trigger: 'blur'
						},
						{
							validator: validatePassword,
							trigger: 'blur'
						}
					],
					address: [{
						required: true,
						message: '详细地址不能为空',
						trigger: 'blur'
					}],
					createAt: [{
						required: true,
						message: '添加时间不能为空',
						trigger: 'blur'
					}],
					category: [{
						required: true,
						message: ' 商家类型不能为空',
						trigger: 'blur'
					}],
					account:[
						{ required: true, message: '账户名不能为空', trigger: 'blur' },
						{ validator: validateAccount, trigger: 'blur' }
					],
					selectedOptions: [{
						required: true,
						message: ' 商家地址不能为空！',
						trigger: 'blur'
					}]

				},
				outlaylicenseImg: [{
					itemPicUrl: '',
					key: '',
					category: 3,
					picId: ''
				}],
				outlaypositiveImg: [{
					itemPicUrl: "",
					key: "",
					category: 1,
					picId: ''
				}],
				outlaysideImg: [{
					itemPicUrl: "",
					key: "",
					category: 2,
					picId: ''
				}],
				outlayrunImg: [{
					itemPicUrl: "",
					key: "",
					category: 4,
					picId: ''
				}],
				outlaycirculationImg: [{
					itemPicUrl: "",
					key: "",
					category: 5,
					picId: ''
				}],
				outlayprodImg: [{
					itemPicUrl: "",
					key: "",
					category: 6,
					picId: ''
				}],
				province: "",
				city: "",
				district: "",
				sysConfig: '',
				storageBaseUrl: localStorage.getItem("ghtstorageBaseUrl"),
				dialogTextVisible: false,
				downloadLoading: false,
				currentTimestamp: new Date(parseTime(new Date(), '{y}-{m}-{d}')).getTime(),
				pickerBeginDateBefore: {
					disabledDate: (time) => {
						let beginDateVal = this.listQuery.registerEndDate;
						if(beginDateVal) {
							return time.getTime() > new Date(beginDateVal).getTime() || time.getTime() > this.currentTimestamp;
						} else {
							return time.getTime() > this.currentTimestamp;
						}
					}
				},
				pickerBeginDateAfter: {
					disabledDate: (time) => {
						let beginDateVal = this.listQuery.registerStartDate;
						if(beginDateVal) {
							return time.getTime() < new Date(beginDateVal).getTime() || time.getTime() > this.currentTimestamp;
						} else {
							return time.getTime() > this.currentTimestamp;
						}
					}
				}
			}
		},
		created() {
			this.getList()
			this.getProvinces()
			this.sysConfig = this.$store.getters.sysConfig.storageBaseUrl
			//console.log(this.$route.query)
			
//			if(this.$route.query.lat){
//				this.dialogFormVisible = true ; 
//				this.dialogStatus = this.$route.query.dialogStatus
//			}
		},
		methods: {
			getIndex($index) {
				return $index + 1
			},
			showPwd() {
				if(this.passwordType === 'password') {
					this.passwordType = ''
				} else {
					this.passwordType = 'password'
				}
			},
			getchoicetype(val){
		    	console.log(val)
		    	if(val == 2){
		    		this.isUnderLineshow = true
		    	} else {
		    		this.isUnderLineshow = false
		    	}
		    },
			getList() {
				this.listLoading = true
				userAuthList(this.listQuery).then(response => {
					this.list = response.data.data.items
					this.total = response.data.data.total
					this.listLoading = false
				}).catch(() => {
					this.list = []
					this.total = 0
					this.listLoading = false
				})
			},
			getProvinces() {
				getAreaList().then(response => {
					this.cateAreaList = response.data.data
				})
			},
			getreferrerList() {
				referrerList(this.shipForm).then(response => {
					this.options = response.data.data
					this.optionsusername = response.data.data.username
				})
			},
			handleShopChange(value) {
				this.province = value[0];
				this.city = value[1];
				this.district = value[2];
			},
			beforeAvatarUpload(file) {
				const isLt1M = file.size / 1024 / 1024 < 1;
				if(!isLt1M) {
					this.$message.error('图片上传大小不能超过 1MB!');
				}
				return isLt1M;
			},
			uploadLicensePicUrl: function(response) {
				this.outlaylicenseImg[0].itemPicUrl = response.data.key
				this.outlaylicenseImg[0].key = response.data.key
				this.aaaa = response.data.key
			},
			uploadPositivePicUrl: function(response) {
				this.outlaypositiveImg[0].itemPicUrl = response.data.key
				this.outlaypositiveImg[0].key = response.data.key
				this.bbbb = response.data.key
			},
			uploadSidePicUrl: function(response) {
				this.outlaysideImg[0].itemPicUrl = response.data.key
				this.outlaysideImg[0].key = response.data.key
				this.cccc = response.data.key
			},
			uploadRunPicUrl: function(response) {
				this.outlayrunImg[0].itemPicUrl = response.data.key
				this.outlayrunImg[0].key = response.data.key
				this.dddd = response.data.key
			},
			uploadCirculationPicUrl: function(response) {
				this.outlaycirculationImg[0].itemPicUrl = response.data.key
				this.outlaycirculationImg[0].key = response.data.key
				this.eeee = response.data.key
			},
			uploadProdPicUrl: function(response) {
				this.outlayprodImg[0].itemPicUrl = response.data.key
				this.outlayprodImg[0].key = response.data.key
				this.ffff = response.data.key
			},

			handleFilter() {
				this.listQuery.pageNum = 1
				this.getList();
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
					address: undefined,
					category: undefined,
					city: '',
					district: '',
					leader: '',
					name: '',
					password: '',
					phone: '',
					province: '',
					referrerId: undefined,
					shopId: '',
					tel: '',
					userAuthPicVoList: [],
					username: '',
					account:'',
				}
			},
			handleCreate() {
				this.dataForm.selectedOptions = [];
				this.outlaylicenseImg = [{
					itemPicUrl: '',
					key: '',
					category: 3,
					picId: ''
				}];
				this.outlaypositiveImg = [{
					itemPicUrl: "",
					key: "",
					category: 1,
					picId: ''
				}];
				this.outlaysideImg = [{
					itemPicUrl: "",
					key: "",
					category: 2,
					picId: ''
				}];
				this.outlayrunImg = [{
					itemPicUrl: "",
					key: "",
					category: 4,
					picId: ''
				}];
				this.outlaycirculationImg = [{
					itemPicUrl: "",
					key: "",
					category: 5,
					picId: ''
				}];
				this.outlayprodImg = [{
					itemPicUrl: "",
					key: "",
					category: 6,
					picId: ''
				}];
				this.resetForm()
				this.dataForm.selectedOptions = [];

				this.resetForm()
				this.dialogStatus = 'create'
				this.dialogFormVisible = true
				this.dialogTextVisible = false
				this.$nextTick(() => {
					this.$refs['dataForm'].clearValidate()
				})
				this.getreferrerList()

			},
//			编辑
			handleUpdate(row) {
				userAuthDetail(row).then(response => {
					this.dataForm.address  = response.data.data.address
					this.dataForm.category = response.data.data.category
					this.dataForm.leader   = response.data.data.leader
					this.dataForm.name     = response.data.data.name
					this.dataForm.phone    = response.data.data.phone
					this.dataForm.tel      = response.data.data.tel
					this.dataForm.shopId   = response.data.data.shopId
					this.dataForm.longitude= response.data.data.longitude
					this.dataForm.latitude = response.data.data.latitude
					this.dataForm.selectedOptions = [response.data.data.provinceId, response.data.data.cityId, response.data.data.districtId]
					this.province 		   = response.data.data.provinceId
					this.city              = response.data.data.cityId
					this.district          = response.data.data.districtId
					var pathUrl 		   = response.data.data.userAuthPicVoList;
					for(var index = 0; index < pathUrl.length; index++) {
						if(pathUrl[index].category == 1) {

							this.outlaypositiveImg[0].itemPicUrl = pathUrl[index].key;
							this.outlaypositiveImg[0].key = pathUrl[index].key;
							this.outlaypositiveImg[0].picId = pathUrl[index].picId;
							if(this.dataForm.category == 1){
								this.isUnderLineshow = false;
							}

						} else if(pathUrl[index].category == 2) {

							this.outlaysideImg[0].itemPicUrl = pathUrl[index].key
							this.outlaysideImg[0].key = pathUrl[index].key
							this.outlaysideImg[0].picId = pathUrl[index].picId;
							if(this.dataForm.category == 2){
								this.isUnderLineshow = true;
							}

						} else if(pathUrl[index].category == 3) {

							this.outlaylicenseImg[0].itemPicUrl = pathUrl[index].key
							this.outlaylicenseImg[0].key = pathUrl[index].key
							this.outlaylicenseImg[0].picId = pathUrl[index].picId;
							if(this.dataForm.category == 3){
								this.isUnderLineshow = false;
							}
							
						} else if(pathUrl[index].category == 4) {

							this.outlayrunImg[0].itemPicUrl = pathUrl[index].key
							this.outlayrunImg[0].key = pathUrl[index].key
							this.outlayrunImg[0].picId = pathUrl[index].picId;
							if(this.dataForm.category == 4){
								this.isUnderLineshow = false;
							}

						} else if(pathUrl[index].category == 5) {

							this.outlaycirculationImg[0].itemPicUrl = pathUrl[index].key
							this.outlaycirculationImg[0].key = pathUrl[index].key
							this.outlaycirculationImg[0].picId = pathUrl[index].picId;
							if(this.dataForm.category == 5){
								this.isUnderLineshow = false;
							}
							
						} else if(pathUrl[index].category == 6) {

							this.outlayprodImg[0].itemPicUrl = pathUrl[index].key
							this.outlayprodImg[0].key = pathUrl[index].key
							this.outlayprodImg[0].picId = pathUrl[index].picId;
							if(this.dataForm.category == 6){
								this.isUnderLineshow = false;
							}
						}
					}
				})
				this.dialogStatus = 'update'
				this.dialogFormVisible = true
				this.getreferrerList()
			},
			handleDetail(row) {
				this.$router.push({
					path: '/mall/shopdetail',
					query: {
						userAuthId: row.userAuthId
					}
				})
			},
			addSubmit(longitude, latitude) {
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						var finalQuery = {
							longitude: longitude,
							latitude: latitude,
							address: this.dataForm.address,
							category: this.dataForm.category,
							leader: this.dataForm.leader,
							name: this.dataForm.name,
							password: this.dataForm.password,
							phone: this.dataForm.phone,
							referrerId: this.dataForm.referrerId,
							shopId: this.dataForm.shopId,
							tel: this.dataForm.tel,
							username: this.dataForm.username,
							province: this.province,
							city: this.city,
							district: this.district,
							userAuthPicVoList: '',
							account: this.dataForm.account,
						}
						var arr = [];
						var arry = this.outlaylicenseImg.concat(this.outlaypositiveImg).concat(this.outlaysideImg).concat(this.outlayrunImg).concat(this.outlaycirculationImg).concat(this.outlayprodImg);
						for(var i = 0; i < arry.length; i++) {
							arr.unshift({
								itemPicUrl: arry[i].itemPicUrl,
								key: arry[i].key,
								category: arry[i].category
							})
						}
						finalQuery.userAuthPicVoList = arr;
						addUserList(finalQuery).then(response => {
							this.getList();
							this.dialogFormVisible = false
							this.$notify({
								title: '成功',
								message: '创建成功',
								type: 'success',
								duration: 2000
							})
						}).catch((response) => {
							MessageBox.alert(response.data.msg, '错误', {
					        	confirmButtonText: '确定',
					        	type: 'error'
					      	})

					     })
					}
				})
			},
			createData() {
				if(this.dataForm.longitude){
					this.addSubmit(this.dataForm.longitude, this.dataForm.latitude);
				}else{
					this.$notify({
						title: '警告',
						message: '地图经纬度不能为空~快去选择添加！',
						type: 'warning',
						duration: 2000
					})
				}
				
			},
			editSubmit(longitude, latitude) {
				var longitudes = ""
				var latitudes  = ""
				if(longitude && latitude){
					longitudes = longitude
					latitudes  = latitude
				} else {
					longitudes = this.dataForm.longitude
					latitudes  = this.dataForm.latitude
				}
				var finalQuery = {
					longitude: longitudes,
					latitude: latitudes,
					address: this.dataForm.address,
					category: this.dataForm.category,
					leader: this.dataForm.leader,
					name: this.dataForm.name,
//					account: this.dataForm.account,  //不存在
					//password: this.dataForm.password,
					phone: this.dataForm.phone,
					referrerId: this.dataForm.referrerId,
					shopId: this.dataForm.shopId,
					tel: this.dataForm.tel,
					//username:this.dataForm.username,   		
					province: this.province,
					city: this.city,
					district: this.district,
					userAuthPicVoList: this.outlaylicenseImg.concat(this.outlaypositiveImg).concat(this.outlaysideImg).concat(this.outlayrunImg).concat(this.outlaycirculationImg).concat(this.outlayprodImg)

				}
				editUserList(finalQuery).then(() => {
					this.dialogFormVisible = false;
					this.getList();
					this.$notify({
						title: '成功',
						message: '更新成功',
						type: 'success',
						duration: 2000
					})
				})

			},
			updateData() {
				if(this.dataForm.longitude){
					this.editSubmit(this.dataForm.longitude, this.dataForm.latitude);
				}else{
					this.$notify({
						title: '警告',
						message: '地图经纬度不能为空~快去选择添加！',
						type: 'warning',
						duration: 2000
					})
				}
			},
			getMsg(res){
				if(res){
					this.dataForm.longitude = res.split(",")[0] ; 
					this.dataForm.latitude = res.split(",")[1] ; 
				}
			},
		getbaiduMap() {
			
			var _this = this ;
			this.dialogFormVisibleMap = true ; 
				var o = ''; //省
				var m = ''; //市
				var n = ''; //区
				var x = this.dataForm.selectedOptions[0];
				var y = this.dataForm.selectedOptions[1];
				var z = this.dataForm.selectedOptions[2];
				var arry = this.cateAreaList;
				for(var i = 0; i < arry.length; i++) {
					if(x == arry[i].value) {
						o = arry[i].label;
						for(var w = 0; w < arry[i].children.length; w++) {
							if(y == arry[i].children[w].value) {
								m = arry[i].children[w].label;
								for(var j = 0; j < arry[i].children[w].children.length; j++) {
									if(z == arry[i].children[w].children[j].value) {
										n = arry[i].children[w].children[j].label;
									}
								}
							}
						}
					}
				}
				var address = o + m + n + this.dataForm.address;
				this.addressmap = address ;
				setTimeout(() => {
	                _this.childData = true
	                console.log(this.$refs.childData)
	            },0)
				//this.$refs.childData.doSth()  // 执行子组件里的doSth函数。
		},
		closeDialog(){
			console.log("关闭")
			this.childData = false ; 
		},
		createDataMap() {
			
			if(!this.dataForm.longitude){
				this.$notify({
						title: '警告',
						message: '请标注地理位置',
						type: 'warning',
						duration: 2000
					})
			}else{
				this.dialogFormVisibleMap = false ; 
				this.childData = false ; 
			}
		},
		updateDataMap() {
			if(!this.dataForm.longitude){
				this.$notify({
						title: '警告',
						message: '请标注地理位置',
						type: 'warning',
						duration: 2000
					})
			}else{
				this.dialogFormVisibleMap = false ; 
				this.childData = false ; 
			}
		},
		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then(excel => {
				const tHeader = ['用户名', '商家名称', '联系人', '手机号码', '商家电话', '分享人', '添加时间', '合伙人', '商家类型', '状态']
				const filterVal = ['username', 'username', 'leader', 'phone', 'tel', 'shareNum', 'createAt', 'referrerId', 'category', 'status']
				excel.export_json_to_excel2(tHeader, this.list, filterVal, '用户信息')
				this.downloadLoading = false
			})
		}
	}
	}
</script>