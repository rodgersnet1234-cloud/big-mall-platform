<template>
  <div>
    <div class="list">
      <el-table
        :data="tableData"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        style="width: 100%"
        @sort-change="onChangeSort"
      >
        <el-table-column
          type="index"
          label="序号"
          align="left"
        />
        <el-table-column
          prop="shopName"
          label="商家名称"
          align="left"
          width="160"
        >
          <template #default="scope">
            <span class="table-cell-text">{{ scope.row.shopName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="settledAmount"
          label="可用店铺余额（元）"
          align="center"
          sortable
        >
          <template #default="scope">
            <span v-if="scope.row.settledAmount === null"> {{ '-' }}</span>
            <span v-else>￥ {{ price(scope.row.settledAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalSettledAmount"
          label="已结算金额（元）"
          align="center"
        >
          <template #default="scope">
            <span>￥ {{ price(scope.row.totalSettledAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="unsettledAmount"
          label="待结算金额（元）"
          align="center"
        >
          <template #default="scope">
            <span>￥ {{ price(scope.row.unsettledAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="freezeAmount"
          label="冻结金额（元）"
          align="center"
        >
          <template #default="scope">
            <span>￥ {{ price(scope.row.freezeAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              type="primary"
              link
              @click="onHandleDetail(scope.row.shopId)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页条 -->
    <Pagination
      v-model:page="params.pageNum"
      v-model:limit="params.pageSize"
      style="text-align: right"
      :total="total"
      @pagination="pagination"
    />
  </div>
</template>

<script setup>
import Pagination from '@/components/Pagination/index.vue'
import { pageShopWallet } from '@/api/merchant-balance'
import Big from 'big.js'

const price = (value) => {
  if (value) {
    return new Big(value).div(100).toFixed(2)
  }
  return 0
}
// 获取列表数据
let tempSearchForm = null // 保存上次点击查询的请求条件
const params = ref({
  pageNum: 1,
  pageSize: 10
})
const total = ref(0)
const tableData = ref([{
  balance: 111
}])
let sortType = 0 // 0无 1 正序 2倒序
const onGetData = (dataFrom = {}, newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...dataFrom, ...params.value, sortType }
  } else {
    tempSearchForm = { ...tempSearchForm, ...params.value, sortType }
  }
  pageShopWallet(tempSearchForm).then(res => {
    tableData.value = res.list
    total.value = res.total || 0
  })
}

const pagination = (page) => {
  params.value.pageNum = page.pageNum
  params.value.pageSize = page.pageSize
  onGetData()
}
// 跳转到详情页
const router = useRouter()
const onHandleDetail = (shopId) => {
  router.push({
    path: '/shop-billing',
    query: { ...tempSearchForm, shopId }
  })
}

// 排序
const onChangeSort = (data) => {
  // 排序类型 0无 1 正序 2倒序
  switch (data.order) {
    case 'descending': sortType = 2
      break
    case 'ascending': sortType = 1
      break
    default: sortType = 0
      break
  }
  onGetData()
}
defineExpose({ onGetData })
</script>
