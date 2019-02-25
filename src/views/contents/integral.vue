<template>
	<div class="app-container calendar-list-container">

		<el-card class="box-card">
			<h3>积分管理信息</h3>
			<el-form :rules="rules" ref="list" label-width="180px" style='display: inline-block;'>
				<!--<el-form-item label="一级素食分享获得积分" prop="goodsSn" style="width: 400px;">
          <el-input v-model="goods.goodsSn">
            <template slot="append">元</template>
          </el-input>
          <el-input v-model="goods.goodsSn">
          	<template slot="append">积分</template>
          </el-input>
        </el-form-item>
        <el-form-item label="一级民宿分享获得积分" prop="goodsSn" style="width: 400px;">
          <el-input v-model="goods.goodsSn">
            <template slot="append">元</template>
          </el-input>
          <el-input v-model="goods.goodsSn">
          	<template slot="append">积分</template>
          </el-input>
        </el-form-item>
        <el-form-item label="一级素食分享获得积分" prop="goodsSn" style="width: 400px;">
          <el-input v-model="goods.goodsSn">
            <template slot="append">元</template>
          </el-input>
          <el-input v-model="goods.goodsSn">
          	<template slot="append">积分</template>
          </el-input>
        </el-form-item>
        <el-form-item label="一级民宿分享获得积分" prop="goodsSn" style="width: 400px;">
          <el-input v-model="goods.goodsSn">
            <template slot="append">元</template>
          </el-input>
          <el-input v-model="goods.goodsSn">
          	<template slot="append">积分</template>
          </el-input>
        </el-form-item>
        <el-form-item label="二级素食分享获得积分" prop="goodsSn" style="width: 400px;">
          <el-input v-model="goods.goodsSn">
            <template slot="append">元</template>         	
          </el-input>
          <el-input v-model="goods.goodsSn">
          <template slot="append">积分</template>          	
          </el-input>
        </el-form-item>
        <el-form-item label="二级民宿分享获得积分" prop="goodsSn" style="width: 400px;">
          <el-input v-model="goods.goodsSn">
            <template slot="append">元</template>         	
          </el-input>
          <el-input v-model="goods.goodsSn">
          <template slot="append">积分</template>          	
          </el-input>
        </el-form-item>
        <el-form-item label="二级素食分享获得积分" prop="goodsSn" style="width: 400px;">
          <el-input v-model="goods.goodsSn">
            <template slot="append">元</template>         	
          </el-input>
          <el-input v-model="goods.goodsSn">
          <template slot="append">积分</template>          	
          </el-input>
        </el-form-item>
        <el-form-item label="二级民宿分享获得积分" prop="goodsSn" style="width: 400px;">
          <el-input v-model="goods.goodsSn">
            <template slot="append">元</template>         	
          </el-input>
          <el-input v-model="goods.goodsSn">
          <template slot="append">积分</template>          	
          </el-input>
        </el-form-item>-->
				<el-form-item v-for='(v,index) in list' :key='index'>
					<span>{{v.details}}</span>
					<el-input v-model='v.value' >
						<template slot="append">积分</template>
					</el-input>
				</el-form-item>

			</el-form>
		</el-card>

		<div class="op-container">
			<!--<el-button @click="handleCancel">取消</el-button>-->
			<el-button @click="handlePublish" type="primary">确定</el-button>
		</div>

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
	import { readIntergral, updateIntergral } from '@/api/spell'
	import Editor from '@tinymce/tinymce-vue'
	import { MessageBox } from 'element-ui'

	export default {
		name: 'GoodsList',
		components: {
			Editor
		},
		data() {
			var validateVendorPercent = (rule, value, callback) => {
		      if (!value) {
		        callback(new Error('请输入积分数值'))
		      } else {
		      	var reg = /^\+?[1-9][0-9]*$/
		        if (!reg.test(value)) {
		           callback(new Error('只能输入整数'))
		        }else{
		        	callback()
		        }
		      }
		    }
			return {
				list: {},
				dataForm: {
					key: '',
					value: ''
				},
				keyCode: [],
				valueCode: [],
				rules: {
			        value: [
							{ required: true, message: '积分不能为空', trigger: 'blur' },
							{ validator: validateVendorPercent, trigger: 'blur' }
						]
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
				}
			}
		},
		created() {
			this.getList()
		},
		methods: {
			getList() {
				readIntergral().then(response => {
					this.list = response.data.data
				})
			},
			handlePublish: function() {
				updateIntergral(this.list).then(response => {
					console.log(response)
					this.$notify({
						title: '成功',
						message: '更新成功',
						type: 'success',
						duration: 2000
					})
					this.getList();
				}).catch(response => {
					MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
						confirmButtonText: '确定',
						type: 'error'
					})
				})
			},
			handleCancel() {

			}
		}

	}
</script>