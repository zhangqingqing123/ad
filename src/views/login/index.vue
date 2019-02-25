<template>
	<div class="login-container">
		<el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
			<div class="title-container">
				<h3 class="title">管理员登录</h3>
			</div>
			<el-form-item prop="phone">
				<span class="svg-container svg-container_login">
          <svg-icon icon-class="people" />
        </span>
				<el-input name="phone" type="text" v-model="loginForm.phone" autoComplete="on" placeholder="账户名" />
			</el-form-item>

			<el-form-item prop="password">
				<span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
				<el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码" />
				<span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
			</el-form-item>

			<el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>

			<div class="tips">
			</div>
		</el-form>

	</div>
</template>

<script>
	import { Message, MessageBox } from 'element-ui'
	export default {
		name: 'login',
		data() {
			const validatePhone = (rule, value, callback) => {
				var reg =  /^[0-9a-zA-Z_]{5,20}$/
				if(!value ) {
					callback(new Error('账户名不能为空'))
				} else {
					if(!reg.test(value)){
						callback(new Error('账户名由5-20位的数字、字母或者下划线组成'))
					} else {
					callback()						
					}
				}
			}
			const validatePassword = (rule, value, callback) => {

				var passwordValue = /^.{6,12}$/
				if(!value) {
					callback(new Error('管理员密码不能为空'))
				} else if(!passwordValue.test(value)){
					callback(new Error('管理员密码长度应大于6小于12位'))
				}else{
					callback()
				}
			}
			return {
				loginForm: {
					//      username: undefined,
					phone: "",
					password: ""
				},
				loginRules: {
					phone: [{
						required: true,
						trigger: 'blur',
//						message: 'fvdgfdg',
						validator: validatePhone
					}],
					password: [{
						required: true,
						trigger: 'blur',
//						message: '密码不能为空',
						validator: validatePassword
					}]
				},
				passwordType: 'password',
				loading: false
			}
		},
		methods: {
			showPwd() {
				if(this.passwordType === 'password') {
					this.passwordType = ''
				} else {
					this.passwordType = 'password'
				}
			},
			handleLogin() {
				this.$refs.loginForm.validate(valid => {
					if(valid && !this.loading) {
						this.loading = true
						this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
							this.loading = false
							this.getSysConfig();
							this.$router.push({
								path: '/'
							})
						}).catch((response) => {
							this.loading = false
							console.log(response.data.code)
							if(response.data.code == -1){
								MessageBox.alert('该账户名不存在，请重新输入！！', '错误', {
					        		confirmButtonText: '确定',
					        		type: 'error'
					      		})
							}else if(response.data.code ===403 ){
						      MessageBox.alert('您没有访问权限，请联系管理员', '警告', {
						        confirmButtonText: '确定',
						        type: 'error'
						      })
							}
							
						})
					} else {
						return false
					}
				})
			},
			getSysConfig() {
				this.$store.dispatch('GetSysConfig', this.loginForm).then(() => {}).catch(() => {})
			}
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss">
	$bg:#2d3a4b;
	$light_gray:#eee;
	/* reset element-ui css */
	
	.login-container {
		.el-input {
			display: inline-block;
			height: 47px;
			width: 85%;
			input {
				background: transparent;
				border: 0px;
				-webkit-appearance: none;
				border-radius: 0px;
				padding: 12px 5px 12px 15px;
				color: $light_gray;
				height: 47px;
				&:-webkit-autofill {
					box-shadow: 0 0 0px 1000px $bg inset !important;
					-webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
					-webkit-text-fill-color: #fff !important;
				}
			}
		}
		.el-form-item {
			border: 1px solid rgba(255, 255, 255, 0.1);
			background: rgba(0, 0, 0, 0.1);
			border-radius: 5px;
			color: #454545;
		}
	}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
	$bg:#2d3a4b;
	$dark_gray:#889aa4;
	$light_gray:#eee;
	.login-container {
		height: 100%;
		width: 100%;
		margin: 0;
		padding: 0;
		background: #27252c url(http://milkbox.xingkong168.com/milkbox/upload/0410/img/login-bg.jpg) no-repeat;
		background-size: cover;
		position: fixed;
		height: 100%;
		width: 100%;
		background-color: $bg;
		.login-form {
			position: absolute;
			left: 0;
			right: 0;
			width: 520px;
			padding: 35px 35px 15px 35px;
			margin: 120px auto;
		}
		.tips {
			font-size: 14px;
			color: #fff;
			margin-bottom: 10px;
			span {
				&:first-of-type {
					margin-right: 16px;
				}
			}
		}
		.svg-container {
			padding: 6px 5px 6px 15px;
			color: $dark_gray;
			vertical-align: middle;
			width: 30px;
			display: inline-block;
			&_login {
				font-size: 20px;
			}
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
	}
</style>