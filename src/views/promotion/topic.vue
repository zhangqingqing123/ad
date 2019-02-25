<template>
	<div class="app-container calendar-list-container">
		<!-- 查询和其他操作 -->
		<div class="filter-1-container">
			<!--<span>所属商品：</span>
			<el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入商品名称" v-model="listQuery.goodsName">
			</el-input>
			<span>所属商家：</span>
			<el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入商家名称" v-model="listQuery.shopName">
			</el-input>-->
			<!--<el-select v-model="value8" filterable placeholder="请选择">
		    <el-option
		      v-for="item in options"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		  </el-select>-->
			<!--<span>店铺归属地：</span>
		  <el-select v-model="provinces" placeholder="请选择">
		    <el-option-group
		      v-for="group in options3"
		      :key="group.label"
		      :label="group.label">
		      <el-option
		        v-for="item in group.options"
		        :key="item.value"
		        :label="item.label"
		        :value="item.value">
		      </el-option>
		    </el-option-group>
		  </el-select>-->
			<!--<el-select v-model="citys" placeholder="请选择">
		    <el-option-group
		      v-for="group in options3"
		      :key="group.label"
		      :label="group.label">
		      <el-option
		        v-for="item in group.options"
		        :key="item.value"
		        :label="item.label"
		        :value="item.value">
		      </el-option>
		    </el-option-group>
		  </el-select>-->
			<!--<el-select v-model="areas" placeholder="请选择">
		    <el-option-group
		      v-for="group in options3"
		      :key="group.label"
		      :label="group.label">
		      <el-option
		        v-for="item in group.options"
		        :key="item.value"
		        :label="item.label"
		        :value="item.value">
		      </el-option>
		    </el-option-group>
		  </el-select>-->
		</div>
		<div class="filter-1-container">
			<div class="block">
				<span class="demonstration">下单时间：</span>
				<el-date-picker v-model="listQuery.startDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" align="right" :picker-options="pickerOptions1">
				</el-date-picker>
			</div>
			-
			<div class="block">
				<el-date-picker v-model="listQuery.endDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" align="right" :picker-options="pickerOptions1">
				</el-date-picker>
			</div>
			<!--订单号码 模糊查找-->
			<div style="margin-bottom: 20px;margin-top: 20px;" class="filter-container block">
				<span class="demonstration">订单编号：</span>
				<el-autocomplete v-model="listQuery.identifier" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
			</div>
			<!--<div class="block">
				<span class="demonstration">送达时间：</span>
				<el-date-picker v-model="listQuery.receiveStartTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" align="right" :picker-options="pickerOptions1">
				</el-date-picker>
			</div>
			-
			<div class="block">
				<el-date-picker v-model="listQuery.receiveEndTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" align="right" :picker-options="pickerOptions1">
				</el-date-picker>
			</div>-->
			<div class="filter-container block">
				<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
				<el-button class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload" :loading="downloadLoading">导出</el-button>
		</div>
		</div>
		
		<div>
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="全部" name=""></el-tab-pane>
				<!--<el-tab-pane label="待付款" name="1"></el-tab-pane>-->
				<el-tab-pane label="已支付" name="2"></el-tab-pane>
				<!--<el-tab-pane label="已发货" name="3"></el-tab-pane>-->
				<el-tab-pane label="已完成" name="4"></el-tab-pane>
			</el-tabs>
		</div>

		<!-- 查询结果 -->
		<el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>


			<el-table-column type="expand">
				<template slot-scope="props">
					<el-form label-position="left" class="table-expand" v-for='(vegList,index) in props.row.goodsList' :key="index" style='border-bottom: 1px solid #CCCCCC;'>
						<el-form-item label="名称">
							<span>{{vegList.vegItem.vegName}}</span>
						</el-form-item>
						<el-form-item label="价格">
							<span>￥{{vegList.price}}</span>
						</el-form-item>
						<el-form-item label="实付款">
							<span>￥{{vegList.sum}}</span>
						</el-form-item>
						<el-form-item label="购买数量">
							<span>{{vegList.num}}件</span>
						</el-form-item>
						<el-form-item label="图片">
							<img v-if="w.itemPicUrl" style="height: 80px;margin-right: 10px;" v-for="w in vegList.vegItem.pictures" :src="sysConfig.storageBaseUrl+w.itemPicUrl" />
							<img v-else src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547812402233&di=3d9f42d0a476c91807eed4518d06163c&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fbdaca9a07e1a8947c00c2f826ebf848750927aa24963-cATwbg_fw658" style="width:80px;height:80px;">
						</el-form-item>
						<!--<el-form-item label="商品介绍">
							<span>{{ props.row.goodsList[0].item.orderComment.content }}</span>
						</el-form-item>
						<el-form-item label="数量">
							<span>{{ props.row.sum }}</span>
						</el-form-item>
						
						<el-form-item label="商品规格">
							<span>{{ props.row.goodsList[0].itemSku.specName }}</span>
						</el-form-item>-->
					</el-form>
				</template>
			</el-table-column>
			
			<el-table-column align="center" label="订单号" prop="identifier" sortable>
			</el-table-column>

			<el-table-column align="center" label="商品信息" prop="sum">
				<!--<template slot-scope="scope">
					<el-button type="primary" size="small">查看</el-button>
				</template>-->
			</el-table-column>

			<el-table-column align="center" label="所属商户" prop="shopName">
			</el-table-column>

			<el-table-column align="center" label="下单人" prop="userName">
			</el-table-column>

			<el-table-column align="center" label="下单人电话" prop="userPhone">
			</el-table-column>

			<el-table-column align="center" label="下单时间" prop="createdAt">
			</el-table-column>

			<el-table-column align="center" label="收货地址" prop="address">
			</el-table-column>

			<el-table-column align="center" label="收货时间" prop="receiveTime">
			</el-table-column>

			<el-table-column align="center" label="订单状态" prop="orderType">
				<template slot-scope="scope">
					<el-tag :type="scope.row.isNew ? 'success' : 'error' " v-show="scope.row.status==2">已支付</el-tag>
					<el-tag :type="scope.row.isNew ? 'success' : 'error' " v-show="scope.row.status==4">已完成</el-tag>
				</template>
			</el-table-column>

			<el-table-column align="center" label="总金额" prop="originalSum">
			</el-table-column>
			<!--以下没有数据-->
			<el-table-column align="center" label="实付金额" prop="sum">
			</el-table-column>

			<el-table-column align="center" label="使用积分数" prop="couponIntegral">
			</el-table-column>

			<el-table-column align="center" label="分销金额绑定商户" prop="shopName">
			</el-table-column>

			<el-table-column align="center" label="商家提成" prop="referrerBusiness">
			</el-table-column>
			
			<el-table-column align="center" label="商家盈利" prop="businessCount">
			</el-table-column>
			
			<el-table-column align="center" label="商家推销" prop="referrerItemBusiness">
			</el-table-column>
			
			<el-table-column align="center" label="合伙人推销" prop="referrerPartnerCount">
			</el-table-column>
			
			<el-table-column align="center" label="商家合伙人盈利" prop="businessPartnerCount">
			</el-table-column>
			
			<el-table-column align="center" label="店员提成" prop="referrerClerkCount">
			</el-table-column>
			
			<el-table-column align="center" label="店员推销" prop="referrerItemClerk">
			</el-table-column>

			<el-table-column align="center" label="平台盈利" prop="platformCount">
			</el-table-column>

		</el-table>

		<!-- 分页 -->
		<div class="pagination-container">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>

	</div>
</template>

<style>
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
		width: 120px;
		height: 120px;
		display: block;
	}
	
	.filter-1-container {
		margin-bottom: 20px;
		color: rgba(0, 0, 0, 0.6);
	}
	
	.block {
		display: inline-block;
	}
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
	import { listAd, createAd, updateAd, deleteAd , searchIdentifiers} from '@/api/ad'
	import { uploadPath } from '@/api/storage'

	export default {
		name: 'Ad',
		data() {
			return {
				uploadPath,
				sysConfig:'',
				list: undefined,
				total: undefined,
				listLoading: true,
				listQuery: {
					pageNum: 1,
					pageSize: 20,
					name: undefined,
					content: undefined,
					sort: 'add_time',
					order: 'desc',
					type: 2,
					goodsName: null,
					shopName:null,
					startDate:null,
					endDate:null,
					receiveStartTime:null,
					receiveEndTime:null,
					status:null,
					identifier:null
				},
				dataForm: {
					id: undefined,
					name: undefined,
					content: undefined,
					url: undefined,
					link: undefined,
					position: 1,
					enabled: true
				},
				options: [{
					value: '选项1',
					label: '黄金糕'
				}, {
					value: '选项2',
					label: '双皮奶'
				}, {
					value: '选项3',
					label: '蚵仔煎'
				}, {
					value: '选项4',
					label: '龙须面'
				}, {
					value: '选项5',
					label: '北京烤鸭'
				}],
				value8: '',
				options3: [{
					label: '热门城市',
					options: [{
						value: 'Shanghai',
						label: '上海'
					}, {
						value: 'Beijing',
						label: '北京'
					}]
				}, {
					label: '城市名',
					options: [{
						value: 'Chengdu',
						label: '成都'
					}, {
						value: 'Shenzhen',
						label: '深圳'
					}, {
						value: 'Guangzhou',
						label: '广州'
					}, {
						value: 'Dalian',
						label: '大连'
					}]
				}],
				provinces: '',
				citys: '',
				areas: '',
				pickerOptions1: {
					shortcuts: [{
						text: '今天',
						onClick(picker) {
							picker.$emit('pick', new Date());
						}
					}, {
						text: '昨天',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24);
							picker.$emit('pick', date);
						}
					}, {
						text: '一周前',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', date);
						}
					}]
				},
				value2: '',
				sentStart: '',
				sentEnd: '',
				valueend: '',
				activeName: '',
				downloadLoading: false
			}
		},
		created() {
			this.getList();
			this.sysConfig = this.$store.getters.sysConfig;
		},
		methods: {
			getList() {
				this.listLoading = true
				listAd(this.listQuery).then(response => {
					//console.log(response);
					this.list = response.data.data.items
					this.total = response.data.data.total
					this.listLoading = false
				}).catch(() => {
					this.list = []
					this.total = 0
					this.listLoading = false
				})
			},
			handleFilter() {
				this.listQuery.pageNum = 1
				this.getList()
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
					id: undefined,
					name: undefined,
					content: undefined,
					url: undefined,
					link: undefined,
					position: 1,
					enabled: true
				}
			},
			handleClick(tab, event) {
				this.listQuery.status = tab.name;
				this.getList()
			},
			//模糊查找 -- 订单号码
			handleSelect(item) {
				console.log(item);
				this.listQuery.identifier = item.value ;

			},
			querySearchAsync(queryString, cb) {
				this.listQuery.identifier = queryString;
				searchIdentifiers(this.listQuery).then(response => {
					var list = response.data.data;
					this.restaurants = list ; 
					if(list == "" || list == []) {
						this.$message({
							type: 'warning',
							message: '没有找到订单!'
						});
					}
					cb(list);
				}).catch(() => {})

			},
			handleDownload() {
				this.downloadLoading = true
				import('@/vendor/Export2Excel').then(excel => {
					const tHeader = ['订单号', '所属商家', '下单人', '下单人电话', '下单时间', '收货地址', '收货时间','订单状态','总金额','实付金额','使用积分数','分销金额绑定商户','商户抽成','合伙人抽成']
					const filterVal = ['identifier', 'shopName', 'userName', 'userPhone', 'createdAt', 'address', 'receiveTime','orderType','originalSum','sum','couponIntegral','shopName','referrerBusiness','referrerClerkCount']
					excel.export_json_to_excel2(tHeader, this.list, filterVal, '素食订单信息')
					this.downloadLoading = false
				})
			}
		}
	}
</script>