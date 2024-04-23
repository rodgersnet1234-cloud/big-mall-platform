<template>
  <div class="components-distribution-achievement-income app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            :label="'分销员昵称' + '：'"
            prop="nickName"
          >
            <el-input
              v-model="searchForm.nickName"
              placeholder="分销员昵称"
              maxlength="11"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="'分销员手机号' + '：'"
            prop="userMobile"
          >
            <el-input
              v-model="searchForm.userMobile"
              placeholder="分销员手机号"
              maxlength="11"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="'订单号' + '：'"
            prop="orderId"
          >
            <el-input
              v-model="searchForm.orderId"
              placeholder="订单号"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="'佣金状态' + '：'"
            prop="state"
          >
            <el-select
              v-model="searchForm.state"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="filter-item"
              @click="getPageData(true)"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button
              class="filter-item"
              @click="onResetSearch(searchFormRef)"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 列表相关区域 -->
    <div class="main-content">
      <div class="table-con">
        <el-table
          v-loading="pageLoading"
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%;"
          @sort-change="onSortChange"
        >
          <!-- 分销员昵称 -->
          <el-table-column
            label="分销员昵称"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.distributionUser.nickName || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 分销员手机号 -->
          <el-table-column
            label="分销员手机号"
            align="center"
            min-width="120"
          >
            <template #default="{row}">
              <span>{{ row.distributionUser.userMobile || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 订单号（关联订购流水号） -->
          <el-table-column
            label="订单号"
            prop="orderId"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.orderId || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 佣金 -->
          <el-table-column
            label="佣金"
            prop="incomeAmount"
            align="center"
            sortable="custom"
          >
            <template #default="{row}">
              <span>{{ conversionActual(row.incomeAmount) }}</span>
            </template>
          </el-table-column>
          <!-- 创建时间 -->
          <el-table-column
            label="创建时间"
            prop="createTime"
            align="center"
            sortable="custom"
            min-width="150"
          >
            <template #default="{row}">
              <span>{{ row.createTime || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 更新时间 -->
          <el-table-column
            label="更新时间"
            prop="updateTime"
            align="center"
            sortable="custom"
            min-width="150"
          >
            <template #default="{row}">
              <span>{{ row.updateTime || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 奖励类型(1一代奖励、2二代奖励 3邀请奖励 等 ) -->
          <el-table-column
            label="奖励类型"
            prop="incomeType"
            align="center"
          >
            <template #default="{row}">
              <span v-if="row.incomeType === 1">{{ '直推奖励' }}</span>
              <span v-if="row.incomeType === 2">{{ '间推奖励' }}</span>
              <span v-if="row.incomeType === 3">{{ '邀请奖励' }}</span>
            </template>
          </el-table-column>
          <!-- 订单状态 -->
          <el-table-column
            label="订单状态"
            prop="orderStatus"
            align="center"
          >
            <template #default="{row}">
              <span v-if="row.orderStatus === 1">{{ $t("pay.obligation") }}</span>
              <span v-else-if="row.orderStatus === 2">{{ $t("order.order.toBeShipped") }}</span>
              <span v-else-if="row.orderStatus === 3">{{ $t("order.order.pendingReceipt") }}</span>
              <span v-else-if="row.orderStatus === 5">{{ $t("order.order.successfulTransaction") }}</span>
              <span v-else-if="row.orderStatus === 6">{{ $t("order.order.transactionFailed") }}</span>
              <span v-else-if="row.orderStatus === 7">{{ $t("order.order.waitGroup") }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <!-- 佣金状态(0:待支付、1:待结算、2:已结算、-1:订单失效) -->
          <el-table-column
            label="佣金状态"
            prop="state"
            align="center"
          >
            <template #default="{row}">
              <span v-if="row.state === 0">{{ '待付款' }}</span>
              <span v-if="row.state === 1">{{ '待结算' }}</span>
              <span v-if="row.state === 2">{{ '已结算' }}</span>
              <span v-if="row.state === -1">{{ '失效' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页条 -->
    <pagination
      v-show="pageData.total > 0"
      v-model:page="searchForm.pageNum"
      v-model:limit="searchForm.pageSize"
      :total="pageData.total"
      @pagination="getPageData"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/distribution/user/distribution-user-income.js'
import Big from 'big.js'

// filters
const conversionActual = (val) => {
  // 精度运算-除法
  if (val == null) {
    return ''
  }
  return new Big(val).div(100).toFixed(2).valueOf()
}

let tempSearchForm = null // 保存上次点击查询的请求条件

const pageLoading = ref(true)
const pageData = ref({
  dataList: [],
  total: 0,
  pages: 0
})
const options = [
  {
    value: 1,
    label: '待结算'
  },
  {
    value: 2,
    label: '已结算'
  },
  {
    value: -1,
    label: '失效'
  }
]
// 查询参数
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  // 手机号
  userMobile: null,
  // 订单号
  orderId: null,
  // 佣金状态
  state: null,
  // 0无 1佣金 2创建时间 3更新时间
  sortParam: 2,
  // 0无 1 正序 2倒序
  sortType: 2
})

const searchFormRef = ref(null)
const onResetSearch = (formEl) => {
  formEl.resetFields()
}

onMounted(() => {
  getPageData()
})

const getPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...searchForm }
  } else {
    tempSearchForm.pageSize = searchForm.pageSize
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.sortParam = searchForm.sortParam
    tempSearchForm.sortType = searchForm.sortType
  }
  pageLoading.value = true
  api.effectPage(tempSearchForm).then(data => {
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const onSortChange = (data) => {
  // 排序字段 0无 1佣金 2创建时间 3更新时间
  switch (data.prop) {
    case 'incomeAmount': searchForm.sortParam = 1
      break
    case 'createTime': searchForm.sortParam = 2
      break
    case 'updateTime': searchForm.sortParam = 3
      break
    default: searchForm.sortParam = 0
      break
  }
  // 排序类型 0无 1 正序 2倒序
  switch (data.order) {
    case 'descending': searchForm.sortType = 2
      break
    case 'ascending': searchForm.sortType = 1
      break
    default: searchForm.sortType = 0
      break
  }
  getPageData()
}
</script>
