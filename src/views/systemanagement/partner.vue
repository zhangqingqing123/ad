<template>
	<div class="app-container calendar-list-container">
		<div class="filter-container">
			   	<el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入用户名" v-model="listQuery.nickname">
      			</el-input>
      			<el-date-picker
			            v-model="listQuery.registerStartDate"
			            type="date"
			            :picker-options="pickerBeginDateBefore"
			            format="yyyy-MM-dd"
			            value-format="yyyy-MM-dd HH:mm:ss"
			            placeholder="添加开始时间" class="filter-item" id='datestart'>
			    </el-date-picker>至
			    <el-date-picker
			            v-model="listQuery.registerEndDate"
			            type="date"
			            format="yyyy-MM-dd"
			            value-format="yyyy-MM-dd HH:mm:ss"
			            :picker-options="pickerBeginDateAfter"
			            placeholder="添加结束时间" class="filter-item" id='dateend'>
			    </el-date-picker>
      			<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
	    	  <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
	    </div>
	    <!-- 查询结果 -->
	    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
	      <el-table-column align="center" label="序号" width="80">
	        <template slot-scope="scope">
	          <span v-text="getIndex(scope.$index)"> </span>
	        </template>
	      </el-table-column>
	      
	      <el-table-column align="center" label="账户名" prop="account">
	      </el-table-column>
	      
	      <el-table-column align="center" label="姓名" prop="username">
	      </el-table-column>
	      
	      <el-table-column align="center" label="绑定手机号" prop="phone">
	      </el-table-column>
	      
	      <el-table-column align="center" label="角色" prop="role">
	      	<template slot-scope="scope">
	           <el-tag :type="scope.row.role==1 ? 'primary' :scope.row.role==2 ?'success' : scope.row.role==3 ?'info' :scope.row.role==4 ?'warning' :'danger' ">{{scope.row.role==1 ? '消费者' :scope.row.role==2 ?'商家' : scope.row.role==3 ?'管理员' :scope.row.role==4 ?'合伙人' :'店员'}}</el-tag>
	        </template>
	      </el-table-column>
	      	      
	      <el-table-column align="center" label="用户状态" prop="status">
	      	<template slot-scope="scope">
	           <el-tag :type="scope.row.status ? 'success' : 'info' ">{{scope.row.status ? '正常' : '禁用'}}</el-tag>
	        </template>
	        
	      </el-table-column>
	      
	      <!--<el-table-column align="center" label="抽成比例" prop="username">
	      </el-table-column>-->
	      
	      <el-table-column align="center" label="推荐店铺数" prop="shareCount">
	      </el-table-column>
	      
	      <el-table-column align="center" label="二维码" prop="qrcode">
	      	<template slot-scope="scope">
	           <img class="classImgCode" :src="sysConfig+scope.row.qrcode">
	        </template>
	      </el-table-column>
	
	      <el-table-column align="center" label="添加时间" prop="createAt">
	      </el-table-column>
	      
	      <el-table-column align="center" label="操作" >
	      	<template slot-scope="scope">	          
	          <el-button type="success" size="mini" @click="handleOpen(scope.row)" v-if='scope.row.status==false' v-show='isShow'>正常</el-button>
			  <el-button type="danger" size="mini" @click="handleDanger(scope.row)" v-if='scope.row.status==true' v-show='isShowDag'>禁用</el-button>
	          <!--<el-button type="warning" size="mini" @click="handleDelete(scope.row)">删除</el-button>-->	          
	        </template>
	      </el-table-column>
	      
	    </el-table>
	    
	    <!-- 添加或修改对话框 -->
	    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
	      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>	       
	        <el-form-item label="姓名" prop="username">
	          <el-input v-model="dataForm.username"></el-input>
	        </el-form-item>
	        <el-form-item label="手机号码" prop="phone">
	          <el-input v-model="dataForm.phone"></el-input>
	        </el-form-item>
	        <el-form-item label="账户名" prop="account">
	          <el-input v-model="dataForm.account"></el-input>
	        </el-form-item>
	         <el-form-item label="密码" prop="password">
	          <el-input name="password" :type="passwordType" autoComplete="on" placeholder="请输入密码" v-model="dataForm.password"/>	           	
	           <span class="show-pwd" @click="showPwd">
	           <svg-icon icon-class="eye" />
	           </span>
	         </el-form-item>
	        <!--<el-form-item label="抽成比例" prop="password">
	           <el-input type="number" step="0.01"  v-model="dataForm.password">
          	   </el-input>
	        </el-form-item>-->      
	        <el-form-item label="管理地点" >
	        <el-cascader
			        :options="cateAreaList"
			        v-model="selectedOptions"
			        @change="handleShopChange" >
	   			 </el-cascader>
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

<script>
import {referrerList,getAreaList} from '@/api/shop'
import { fetchList, readUserDetail, changeStatusUser } from '@/api/user'
import { addPartnerRole} from '@/api/systemanagement'
import BackToTop from '@/components/BackToTop'
import { parseTime } from '@/utils/index'
import { Message, MessageBox } from 'element-ui'
export default {
  name: 'syslist',
  components: { BackToTop },
  data() {
  	const validatePassword = (rule, value, callback) => {	
      var passwordValue = /^.{6,12}$/
		if(!value) {
			callback(new Error('合伙人密码不能为空'))
		} else if(!passwordValue.test(value)){
			callback(new Error('合伙人密码长度应大于6小于12位'))
		}else{
			callback()
		}
    }
  	var validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else {
      	var reg = /^1\d{10}$/
        if (!reg.test(value)) {
           callback(new Error('请输入正确的手机号码'))
        }else{
        	callback()
        }
      }
    }
	const validateAccount = (rule, value, callback) => {
		var regAccount =  /^[0-9a-zA-Z_]{5,20}$/
		var regPhone =  /^1\d{10}$/
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
//	const validateAccount = (rule, value, callback) => {
//		var regAccount =  /^[0-9a-zA-Z_]{5,20}$/
//		if(!value ) {
//			callback(new Error('账户名不能为空'))
//		} else if(!regAccount.test(value)){
//			callback(new Error('账户名由5-20位的数字、字母或者下划线组成'))
//		}else{
//			callback()
//		}
//	}
    return {
      list: [],
      total: 0,
      listLoading: true,
      isShow: true,
	  isShowDag:true,
	  province:"",
	  city:"",
	  district:"",
	  cateAreaList:[],
      referrerId:'',
      options:[],
      optionsusername:[],
      selectedOptions:[],
      passwordType: 'password',
      
     listQuery: {
		pageNum: 1,
		pageSize: 10,
		role:4,
		nickname: undefined,
		registerEndDate: undefined,
		registerStartDate: undefined
	  },
      dataForm:{
      	username:'',
      	account:'',
      	phone:'',
      	password:'',
      	province:'',
      	city:'',
      	district:''
      },
      shipForm:{
      	userId:undefined
      },
      roleQuery: {
			pageNum: 1,
			pageSize: 1000,
			roleName: undefined,
			role: 4
		},
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      }, 
      dialogFormVisible: false,
      rules: {
      	username: [
				{ required: true, message: '用户名不能为空', trigger: 'blur' },
			],
        phone: [
				{ required: true, message: '手机号码不能为空', trigger: 'blur' },
				{ validator: validatePhone, trigger: 'blur' }
			],
		password: [
			        { required: true, message: '密码不能为空', trigger: 'blur' },
			        { validator: validatePassword, trigger: 'blur' }
   				],
   		account:[
					{ required: true, message: '账户名不能为空', trigger: 'blur' },
					{ validator: validateAccount, trigger: 'blur' }
				],
   		province: [{ required: true, message: '省不能为空', trigger: 'blur' }],
        city: [{ required: true, message: '市不能为空', trigger: 'blur' }],
        district: [{ required: true, message: '区不能为空', trigger: 'blur' }]
      },
      currentTimestamp: new Date(parseTime(new Date(),'{y}-{m}-{d}')).getTime(),
      pickerBeginDateBefore:{
            disabledDate: (time) => {
							let beginDateVal = this.listQuery.registerEndDate;
                if (beginDateVal) {
                    return time.getTime() > new Date(beginDateVal).getTime() || time.getTime() > this.currentTimestamp;
                }else{
                  	return time.getTime() > this.currentTimestamp;
                }
            }
        },
        pickerBeginDateAfter:{   
            disabledDate: (time) => {
							let beginDateVal = this.listQuery.registerStartDate;
                if (beginDateVal) {
                    return time.getTime() < new Date(beginDateVal).getTime() || time.getTime() > this.currentTimestamp;
                }else{
                	return time.getTime() > this.currentTimestamp;
                }
            }
        },
        sysConfig:'',
    }
  },
  created() {
  	this.sysConfig = this.$store.getters.sysConfig.storageBaseUrl;
  	console.log(this.sysConfig )
    this.getList()
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
//	列表
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response=>{
    	this.list = response.data.data.items       
        this.total =response.data.data.total
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
    handleShopChange(value){
		this.province = value[0];
		this.city = value[1];
		this.district = value[2];
    },
//  分页
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleFilter(){
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleOpen(row) {
		this.dataForm.status = true
		changeStatusUser(row.userId).then(response => {
			this.getList()
			this.isShowDag = this.isShowDag
			
		})
	},
	handleDanger(row) {
		this.shipForm.status = false
		changeStatusUser(row.userId).then(response => {
			this.getList()
			this.isShow = this.isShow
		})
		
	},

//  清空
	resetForm(){
	this.dataForm = {
      	username:'',
      	account:'',
      	phone:'',
      	password:'',
      	province:'',
      	city:'',
      	district:''
      }
	},
//  创建
	handleCreate(){	
		this.getProvinces()
		this.resetForm()
		this.dialogStatus = 'create'
      	this.dialogFormVisible = true     
      	this.$nextTick(() => {
	        this.$refs['dataForm'].clearValidate()
	      })
	},
    createData(){
    	this.$refs['dataForm'].validate((valid)=>{
    		if(valid){
    			const data = {
		    		username: this.dataForm.username,
		    		account:this.dataForm.account,
		    		phone:this.dataForm.phone,
		    		password:this.dataForm.password,
		    		province:this.province,
					city:this.city ,
					district:this.district
		    	}
				addPartnerRole(data).then(response => {
		    		this.dialogFormVisible = false
		    		this.getList()
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
//			        if(response.data.code == -1){
//			        	MessageBox.alert('该账户名已存在，请重新输入！！', '警告', {
//					        confirmButtonText: '确定',
//					        type: 'error'
//					      })
//					}else if(response.data.code === -2){
//				      	MessageBox.alert('该商家的手机号码已被注册，请重新输入！！', '错误', {
//			        		confirmButtonText: '确定',
//			        		type: 'error'
//			      		})
//					}
			     })
    		}
    	})
    	
    },
    updateData(){
    	
    }
   
  }
}
</script>

<style>
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
		.classImgCode{
			width: 100px;
			height: 100px;
		}
</style>