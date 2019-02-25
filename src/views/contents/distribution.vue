<template>
	<!--<div class="app-container calendar-list-container">
		<el-card class="box-card">
			<h3>分销管理信息</h3>
			<el-form ref="list" label-width="180px" style='display: inline-block;'>
				<el-form-item v-for='(v,index) in list' :key='index'>
					<span>{{v.details}}</span>
					<el-input v-model='v.value' type="number" step="0.01">
						<template slot="append">比例</template>
					</el-input>
				</el-form-item>

			</el-form>
		</el-card>
		<div class="op-container">
			<el-button @click="handlePublish" type="primary">确定</el-button>
		</div>
	</div>-->
	<div class="tab-container">
	    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
	      <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key="item.key" :name="item.key">
	           <el-form ref="list" class="form-container">
			      <div class="createPost-main-container">
			      	<el-row >
			      		<el-col :span="10">
					        <el-row v-for='(v,index) in list' :key='index' v-if="v.key.indexOf(item.key.substring(0,item.key.indexOf('_')))>-1&&v.key.indexOf(item.key.substring(item.key.indexOf('_')+1))>-1">
					          <el-col :span="20">
				                  <el-form-item label-width="40%" :label="v.details+'：'" class="postInfo-container-item">
				                  	<el-input v-model='v.value' type="number" step="0.01">
										<template slot="append">比例</template>
									</el-input>
				                  </el-form-item>
					          </el-col>
					        </el-row>
				        </el-col>
				        <el-col :span="14">
			        		<h4 style="margin-top: 0px;">关于分销比例中名词解释：</h4>
			        		<div class="WarningInfo">
			        			<p>用户：表示用户在购买某类商品后所产生的积分</p>
			        			<p>店员-提成：表示店员推荐注册的用户消费后所产生的积分</p>
								<p>店员-推销：表示店员推销用户购买某个商品所产生的积分</p>
								<p>商家-盈利：表示商家销售出自己的产品所产生的收益</p>
								<p>商家-提成：表示商家、商家下店员推荐注册的用户消费后所产生的收益</p>
								<p>商家-推销：表示商家、商家下店员推销用户购买某个商品所产生的收益</p>
								<p>合伙人-盈利：表示合伙人推荐注册的商家销售出自己的产品所产生的收益</p>
								<p>合伙人-推销：表示合伙人推荐注册的商家、商家下的店员推销用户购买某个商品所产生的收益</p>
					        </div>
				        </el-col>
			        </el-row>
			        <el-row>
			        	<el-col :span="10" style="text-align: center;">
							<el-button @click="handlePublish" type="primary">确定</el-button>
					    </el-col>
			        </el-row>
			      </div>
			    </el-form>
	      </el-tab-pane>
	    </el-tabs>
	  </div>
</template>

<style rel="stylesheet/scss" lang="scss" scoped>
.WarningInfo{
	color: #f56c6c;
	font-size: 12px;
    margin-left: 2em;
}
</style>

<script>
	import { updateIntergral,readDistribution } from '@/api/spell'
	import Editor from '@tinymce/tinymce-vue'
	import { MessageBox } from 'element-ui'

	export default {
		name: 'distribution',
		data() {
			return {
				activeName: 'USER',
				tabMapOptions: [
				        { label: '用户', key: 'USER'},
				        { label: '店员(提成)', key: 'CLERK_INCOME_DRAW' },
				        { label: '店员(推销)', key: 'CLERK_PROMOTE' },
				        { label: '商家(盈利)', key: 'SHOP_PROFIT'},
				        { label: '商家(提成)', key: 'SHOP_INCOME_DRAW'},
				        { label: '商家(推销)', key: 'SHOP_PROMOTE'},
				        { label: '合伙人(盈利)', key: 'PARTNER_PROFIT' },
				        { label: '合伙人(推销)', key: 'PARTNER_PROMOTE' }
				      ],
				list: {},
				dataForm: {
					key: '',
					value: ''
				},
				keyCode: [],
				valueCode: []
			}
		},
		created() {
			this.getList()
		},
		methods: {
			getList() {
				readDistribution().then(response => {
					this.list = response.data.data
				})
			},
			handlePublish: function() {
				updateIntergral(this.list).then(response => {
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