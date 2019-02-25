<template>
  <div class="app-container calendar-list-container">
  	
  	<!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入商品编号" v-model="listQuery.goodsSn">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入商品名称" v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="选择" >
      	<template slot-scope="scope">
      	 <el-checkbox :label="scope.row.goodsId "  v-model="scope.row.goodsId" @change.native="getCurrentRow(scope.$index,scope.row )">&nbsp;</el-checkbox>
      	</template>
      </el-table-column>
      
      <el-table-column align="center" label="商品编号" prop="goodsSn">
      </el-table-column>

      <el-table-column align="center" min-width="100" label="商品名称" prop="name">
      </el-table-column>

      <el-table-column align="center" property="iconUrl" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" width="40"/>
        </template>
      </el-table-column>

      <el-table-column align="center" label="专柜价格" prop="counterPrice">
      </el-table-column>

      <el-table-column align="center" label="当前价格" prop="retailPrice">
      </el-table-column>
	   
      <el-table-column align="center" label="是否新品" prop="isNew">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isNew ? 'success' : 'error' ">{{scope.row.isNew ? '新品' : '非新品'}}</el-tag>
        </template>
      </el-table-column> 

      <el-table-column align="center" label="是否热品" prop="isHot">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isHot ? 'success' : 'error' ">{{scope.row.isHot ? '热品' : '非热品'}}</el-tag>
        </template>
      </el-table-column> 

      <el-table-column align="center" label="是否在售" prop="isOnSale">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isOnSale ? 'success' : 'error' ">{{scope.row.isOnSale ? '在售' : '未售'}}</el-tag>
        </template>
      </el-table-column> 
      
    </el-table>
    
    <div slot="footer" class="dialog-footer" style="float: right;line-height: 70px;">
        <el-button type="primary" @click="handleaddVenorGoods">确定</el-button>
      </div>

    <!-- 分页 -->
    <div class="pagination-container" style="margin-top: 60px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
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
import {addVendorGoods, deleteVendorGoods,addListGoods } from '@/api/goods'

export default {
  name: 'vendorGoods',
  data() {
    return {
      list:[],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id:undefined,
        goodsSn: undefined,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      descDetail: '',
      descDialogVisible: false,
      dataForm:{
        goodsId:undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      addListGoods(this.listQuery).then(response => {
        this.list = response.data.data.items
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getCurrentRow(index,row){
    	console.log(index)
    	console.log(row)
    	this.templateSelection = row;
    	this.dataForm.goodsId = row.id;
    },
    handleaddVenorGoods(data){
    	var _this = this;
      addVendorGoods(this.dataForm).then(response => {
      	console.log(response);
            _this.list.unshift(response.data);
            _this.dialogFormVisible = false;
            _this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          _this.$router.push({ path: '/vendorgoods/vendorgoods' })
        })
        
     }
  }
}
</script>