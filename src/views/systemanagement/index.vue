<template>
	<div class="app-container calendar-list-container">
		<div class="filter-container">
			<el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
			<!--<el-button class="filter-item" type="primary" @click="handleShelves">下架</el-button>-->
		</div>
		<!-- 查询结果 -->
		<el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
			<el-table-column align="center" label="序号" width="80">
				<template slot-scope="scope">
					<span v-text="getIndex(scope.$index)"> </span>
				</template>
			</el-table-column>

			<el-table-column align="center" label="用户名" prop="roleName">
			</el-table-column>

			<el-table-column align="center" label="创建时间" prop="createdAt">
			</el-table-column>

			<el-table-column align="center" label="操作">
				<template slot-scope="scope">
					<el-button type="" size="mini" @click="handleChangePower(scope.row)">权限管理</el-button>
					<el-button type="" size="mini" @click="handleChangeUser(scope.row)">用户管理</el-button>
					<el-button type="warning" size="mini" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>

		</el-table>

		<!-- 权限管理=添加角色的对话框 -->
		<el-dialog title="角色操作" :visible.sync="dialogFormVisiblePower ">
			<!--一般选择-->
			<div>
				<template v-for="city in cities">
					<h4>{{city.name}}</h4>
					<!--<el-button type="" size="mini">{{city.name}}</el-button>-->
					<!--<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>-->
					<el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
						<el-checkbox v-for="v in city.permissions" :label="v.id" :key="v.id">{{v.name}}</el-checkbox>
					</el-checkbox-group>
					<div style="margin: 15px 0;"></div>
				</template>

			</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisiblePower = false">取消</el-button>
				<el-button type="primary" @click="createRole">确定</el-button>
			</div>
		</el-dialog>
		<!-- 权限管理=添加用户的对话框 -->
		<el-dialog title="角色操作" :visible.sync="dialogFormVisibleUser ">
			<!--一般选择-->
			<div>
				<template>
					<h4>用户管理</h4>
					<!--<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">用户管理</el-checkbox>-->
					<!--<div style="margin: 15px 0;"></div>-->
					<el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
						<el-checkbox v-for="city in cities" :label="city.userId" :key="city.userId">{{city.account==null?'用户名为空':city.account}}【{{city.username}}】</el-checkbox>
					</el-checkbox-group>
				</template>

			</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisibleUser = false">取消</el-button>
				<el-button type="primary" @click="createUser">确定</el-button>
			</div>
		</el-dialog>

		<!-- 添加或修改对话框 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
				<el-form-item label="角色名：" prop="roleName">
					<el-input v-model="dataForm.roleName"></el-input>
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
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>

		<el-tooltip placement="top" content="返回顶部">
			<back-to-top :visibilityHeight="100"></back-to-top>
		</el-tooltip>

	</div>
</template>

<script>
	import { listRole, deleteRole, addRole, getRolePermisson02, getRolePermisson01, permissionAdd, fetchList, permissionUserAdd, getpermissionUser } from '@/api/systemanagement'
	import BackToTop from '@/components/BackToTop'
	import { parseTime } from '@/utils/index'
	import { Message, MessageBox } from 'element-ui'
	const cityOptions = ['上海', '北京', '广州', '深圳'];
	export default {
		name: 'syslist',
		components: {
			BackToTop
		},
		data() {
			return {
				list: [],
				permissionUser: '', //权限用户；
				total: 0,
				listLoading: true,
				power: undefined,
				listQuery: {
					pageNum: 1,
					pageSize: 200,
					roleName: undefined,
					role: 3
				},
				dialogStatus: '',
				textMap: {
					update: '编辑',
					create: '创建'
				},
				dialogFormVisible: false,
				dialogFormVisiblePower: false,
				dialogFormVisibleUser: false,
				rules: {

				},
				dataForm: {
					id: undefined,
					roleName: undefined,
				},
				roleForm: {
					id: undefined,
					roleId: undefined,
					pageNum: 1,
					pageSize: 20,
					menuCode: undefined,
					menuName: undefined
				},
				rolePermissionData: {
					permissionIds: undefined,
					roleId: undefined,
					userIds: undefined
				},
				checkAll: false,
				checkedCities: [],
				cities: cityOptions,
				isIndeterminate: true,
				
			}
		},
		created() {
			this.getList();

		},
		methods: {
			getIndex($index) {
				return $index + 1
			},
			//	列表
			getList() {
				this.listLoading = true
				listRole(this.listQuery).then(response => {
					this.list = response.data.data.items
					this.listLoading = false
				}).catch(() => {
					this.list = []
					this.total = 0
					this.listLoading = false
				})
			},
			//  查询角色菜单权限(角色已经拥有的权限)；
			getRolePermisson01() { //已经拥有的权限
				this.roleForm.pageSize = 1000;
				getRolePermisson01(this.roleForm).then(response => {
					this.checkedCities = [];
					var oldArr = response.data.data;
					for(var i = 0; i < oldArr.length; i++) {
						this.checkedCities.push(oldArr[i].id);
					}
				}).catch(() => {
					this.list = []
					this.total = 0
				})
			},
			getRolePermisson02() { //已经所有的权限
				getRolePermisson02(this.roleForm).then(response => {
					function getByMenuCode(objs,code){
						for(var i = 0; i < objs.length; i++) {
							if(objs[i].code==code){
								return objs[i];
							}
						}
					}
					var arry = response.data.data.items,permissions = [];
					arry.forEach((item,index)=>{
						var menuCode = item.menuCode
						var permission = getByMenuCode(permissions,menuCode);
						if(permission){
							permission.permissions.push({id:item.id,code:item.permissionCode,name:item.permissionName,requiredPermission:item.requiredPermission})
						}else{
							permissions.push({code:menuCode,name:item.menuName,permissions:[{id:item.id,code:item.permissionCode,name:item.permissionName,requiredPermission:item.requiredPermission}]})
						}
					})
					//console.log(permissions);
					this.cities = permissions;
				}).catch(() => {
					this.list = []
					this.total = 0
				})
			},
			//查询角色用户； //所有
			getpermissionUser() {
				getpermissionUser(this.roleForm).then(response => {
					this.permissionUser = (response.data.data.items);
				}).catch(() => {
					this.list = []
					this.total = 0
				})
			},
			//  权限管理
			handleChangePower(row) {
				this.dialogFormVisiblePower = true;
				this.power = true;
				this.getRolePermisson02();
				this.roleForm.roleId = row.id;
				this.getRolePermisson01();
			},
			//  分页
			handleCurrentChange(val) {
				this.listQuery.page = val
				this.getList()
			},
			handleSizeChange(val) {
				this.listQuery.limit = val
				this.getList()
			},
			//  清空
			resetForm() {
				this.dataForm = {
					id: undefined,
					roleName: undefined,
				}
			},
			//  创建
			handleCreate() {
				//		this.$router.push({ path: '/systemanagement/addsystemanagement' })
				this.resetForm()
				this.dialogStatus = 'create'
				this.dialogFormVisible = true
			},
			//	编辑
			handleUpdate(row) {
				this.dataForm = row.roleName

			},
			//	删除
			handleDelete(row) {
				this.$confirm('确定要删除此项吗？','提示',{
				  confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
				}).then(()=>{
					const detateData = {
						ids: row.id
					}
					deleteRole(detateData).then(response => {
						this.$notify({
							title: '成功',
							message: '删除成功',
							type: 'success',
							duration: 2000
						})
						const index = this.list.indexOf(row)
						this.list.splice(index, 1)
						this.getList()
					})
				}).catch(()=>{
			      	this.$message({
			            type: 'info',
			            message: '已取消删除'
			        })         
		      })
				
			},
			createData() {
				const data = {
					roleName: this.dataForm.roleName
				}
				addRole(data).then(response => {
					this.dialogFormVisible = false
					this.getList()
					this.$notify({
						title: '成功',
						message: '创建成功',
						type: 'success',
						duration: 2000
					})

				})
			},
			updateData(row) {
				const data = {
					id: row.id,
					roleName: this.dataForm.roleName
				}
				addRole(data).then(response => {
					this.dialogFormVisible = false
					this.getList()
					this.$notify({
						title: '成功',
						message: '编辑成功',
						type: 'success',
						duration: 2000
					})

				})
			},
			//一般选择
			handleCheckAllChange(val) {
				this.checkedCities = val ? this.cities : [];
				this.isIndeterminate = false;
			},
			handleCheckedCitiesChange(value) {
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.cities.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
				//console.log(this.checkedCities)
			},
			//创建提交按钮；
			createRole() {
				this.rolePermissionData.roleId = this.roleForm.roleId; //a.join(“-”);
				this.rolePermissionData.permissionIds = this.checkedCities.join(',');;
				permissionAdd(this.rolePermissionData).then(response => {
					this.getList();
					window.location.reload();
					this.dialogFormVisiblePower = false;
					this.$notify({
						title: '成功',
						message: '创建成功',
						type: 'success',
						duration: 2000
					})
				}).catch(() => {
					this.list = []
					this.total = 0
				})
			},
			//用户管理
			handleChangeUser(row) {
				this.checkedCities = [];
				this.dialogFormVisibleUser = true;
				this.roleForm.roleId = row.id;
				this.getpermissionUser(); //获取平台的所有角色用户 ；
				fetchList(this.listQuery).then(response => {
					this.cities = (response.data.data.items);
					var allArr = response.data.data.items; //所有角色；
					var oldArr = this.permissionUser; //已经拥有的角色用户；

					for(var i = 0; i < oldArr.length; i++) {
						this.checkedCities.push(oldArr[i].userId);
					}
				}).catch(() => {
					this.list = []
					this.total = 0
				})

			},
			createUser() {
				this.rolePermissionData.roleId = this.roleForm.roleId; //a.join(“-”);
				this.rolePermissionData.userIds = this.checkedCities.join(',');;
				permissionUserAdd(this.rolePermissionData).then(response => {
					this.getList();
					window.location.reload();
					this.dialogFormVisibleUser = false;
					this.$notify({
						title: '成功',
						message: '创建成功',
						type: 'success',
						duration: 2000
					})
				}).catch(() => {
					this.list = []
					this.total = 0
				})
			}
		}
	}
</script>

<style>

</style>