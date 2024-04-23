<template>
  <div class="app-container">
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
          <el-form-item>
            <el-button
              type="primary"
              @click="getPageData(true)"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button
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
        >
          <!-- 分销员昵称 -->
          <el-table-column
            label="分销员昵称"
            align="center"
            min-width="120"
          >
            <template #default="{row}">
              <span>{{ row.distributionUserVO.nickName }}</span>
            </template>
          </el-table-column>
          <!-- 分销员手机号 -->
          <el-table-column
            label="分销员手机号"
            align="center"
            min-width="120"
          >
            <template #default="{row}">
              <span>{{ row.distributionUserVO.userMobile }}</span>
            </template>
          </el-table-column>
          <!-- 待结算金额变更数额 -->
          <el-table-column
            label="待结算金额变更数额"
            prop="unsettledAmount"
            align="center"
            min-width="150"
          >
            <template #default="{row}">
              <span>{{ conversionActual(row.unsettledAmount) }}</span>
            </template>
          </el-table-column>
          <!-- 可提现金额变更数额 -->
          <el-table-column
            label="可提现金额变更数额"
            prop="settledAmount"
            align="center"
            min-width="150"
          >
            <template #default="{row}">
              <span>{{ conversionActual(row.settledAmount) }}</span>
            </template>
          </el-table-column>
          <!-- 失效金额变更数额 -->
          <el-table-column
            label="失效金额变更数额"
            prop="invalidAmount"
            align="center"
            min-width="150"
          >
            <template #default="{row}">
              <span>{{ conversionActual(row.invalidAmount) }}</span>
            </template>
          </el-table-column>
          <!-- 积累收益变更数额 -->
          <el-table-column
            label="积累收益变更数额"
            prop="accumulateAmount"
            align="center"
            min-width="150"
          >
            <template #default="{row}">
              <span>{{ conversionActual(row.accumulateAmount) }}</span>
            </template>
          </el-table-column>
          <!-- 备注 -->
          <el-table-column
            label="备注"
            prop="remarks"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.remarks }}</span>
            </template>
          </el-table-column>
          <!-- 创建时间 -->
          <el-table-column
            label="创建时间"
            prop="createTime"
            align="center"
            min-width="180"
          >
            <template #default="{row}">
              <span>{{ row.createTime }}</span>
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
import * as api from '@/api/distribution/user/distribution-user-wallet.js'
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

// 查询的参数
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  userMobile: null,
  nickName: null
})
const searchFormRef = ref(null)
const onResetSearch = (formEl) => {
  formEl.resetFields()
}
// 返回参数
const pageLoading = ref(true)
const pageData = ref({
  dataList: [],
  total: 0,
  pages: 0
})

onMounted(() => {
  getPageData()
})

const getPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...searchForm }
  } else {
    tempSearchForm.pageSize = searchForm.pageSize
    tempSearchForm.pageNum = searchForm.pageNum
  }
  pageLoading.value = true
  api.page(tempSearchForm).then(data => {
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
</script>
